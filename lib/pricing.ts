// ============================================================
//  Free-tier price estimates from the eBay Browse API.
//
//  We don't have access to eBay's sold/Marketplace Insights API
//  on the free tier, so these are explicitly the **lowest active
//  asking prices** right now — labelled accordingly in the UI.
//
//  For each card we run multiple parallel queries:
//    - raw     : "<name> gold star <set>" (filter out PSA / CGC / BGS / SGC)
//    - psa N   : "<name> gold star <set> psa <N>"  (N = 1..10)
//
//  Results are filtered & sorted client-side, with the cheapest
//  matching listing kept. We rely on Next.js' fetch cache (the
//  underlying eBay calls are tagged with `revalidate`) so each
//  unique query only hits eBay once per cache window.
// ============================================================

import { searchActiveListings, isEbayConfigured } from "@/lib/ebay";
import type { EbayListing } from "@/lib/ebay";
import type { GoldStarCard } from "@/lib/goldstar-data";

export type PriceEstimate = {
  /** Cheapest active "raw / ungraded" asking price, in USD. */
  raw: number | null;
  /** Cheapest active PSA 10 asking price, in USD. */
  psa10: number | null;
  /** ISO timestamp the snapshot was taken. */
  asOf: string;
  /** Whether eBay was reachable + configured. */
  source: "ebay-ask" | "unavailable";
};

export const PSA_GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export type PsaGrade = (typeof PSA_GRADES)[number];

export type GradeLadder = {
  raw: number | null;
  psa: Record<PsaGrade, number | null>;
  asOf: string;
  source: "ebay-ask" | "unavailable";
};

const GRADED_SLAB_PATTERN = /\b(psa|cgc|bgs|sgc|gem mint|graded|slabbed)\b/i;
const PSA10_PATTERN = /\bpsa\s*10\b/i;
const PROXY_PATTERN = /\b(proxy|custom|reprint card|fake|replica|sticker|playmat|coin)\b/i;
const PSA_GRADE_PATTERN = /\bpsa\s*(\d{1,2})(?:\.(\d))?\b/i;

/** Sanity floors per PSA grade (USD) — anything cheaper is almost certainly mis-tagged. */
const GRADE_FLOOR: Record<PsaGrade, number> = {
  1: 25,
  2: 25,
  3: 25,
  4: 30,
  5: 35,
  6: 40,
  7: 50,
  8: 80,
  9: 150,
  10: 350,
};

function lowestPrice(values: Array<number | null | undefined>): number | null {
  let min: number | null = null;
  for (const v of values) {
    if (v == null || !Number.isFinite(v)) continue;
    if (min == null || v < min) min = v;
  }
  return min;
}

function extractPsaGrade(title: string): number | null {
  const m = PSA_GRADE_PATTERN.exec(title);
  if (!m) return null;
  const whole = Number(m[1]);
  const frac = m[2] ? Number(m[2]) / 10 : 0;
  const v = whole + frac;
  return Number.isFinite(v) ? v : null;
}

async function fetchRawAsk(card: GoldStarCardLike): Promise<number | null> {
  try {
    const listings = await searchActiveListings({
      query: `${card.name} gold star ${card.setName}`,
      limit: 25,
      sort: "price",
      categoryIds: ["183454"],
      revalidateSeconds: 60 * 60,
    });
    return pickLowest(listings, {
      requireRaw: true,
      floor: 20,
    });
  } catch {
    return null;
  }
}

async function fetchPsaAsk(
  card: GoldStarCardLike,
  grade: PsaGrade,
): Promise<number | null> {
  try {
    const listings = await searchActiveListings({
      query: `${card.name} gold star ${card.setName} psa ${grade}`,
      limit: 20,
      sort: "price",
      categoryIds: ["183454"],
      revalidateSeconds: 60 * 60 * 4,
    });
    return pickLowest(listings, {
      requirePsaGrade: grade,
      floor: GRADE_FLOOR[grade],
    });
  } catch {
    return null;
  }
}

type PickOpts =
  | { requireRaw: true; floor: number }
  | { requirePsaGrade: PsaGrade; floor: number };

function pickLowest(listings: EbayListing[], opts: PickOpts): number | null {
  const candidates = listings
    .filter((l) => typeof l.price === "number" && (l.price ?? 0) > 0)
    .filter((l) => !PROXY_PATTERN.test(l.title))
    .filter((l) => (l.price ?? 0) >= opts.floor)
    .filter((l) => {
      if ("requireRaw" in opts) {
        return !GRADED_SLAB_PATTERN.test(l.title);
      }
      const g = extractPsaGrade(l.title);
      return g === opts.requirePsaGrade;
    })
    .map((l) => l.price);
  return lowestPrice(candidates);
}

export type GoldStarCardLike = Pick<GoldStarCard, "id" | "name"> & {
  setName: string;
};

export async function getCardEstimate(
  card: GoldStarCardLike,
): Promise<PriceEstimate> {
  if (!isEbayConfigured()) {
    return {
      raw: null,
      psa10: null,
      asOf: new Date().toISOString(),
      source: "unavailable",
    };
  }
  // Re-use the dedicated PSA 10 query (kept separate so the homepage
  // grid can stay on a tight 1h cache without paying for the full ladder).
  const [raw, psa10] = await Promise.all([
    fetchRawAsk(card),
    fetchPsaAsk({ ...card }, 10).then((v) => v),
  ]);
  return {
    raw,
    psa10,
    asOf: new Date().toISOString(),
    source: "ebay-ask",
  };
}

/**
 * Full ladder: raw + PSA 1..10. Used by the card detail page.
 * Each grade fetched in parallel; per-grade fetch is cached for ~4 hours
 * inside Next's fetch cache.
 */
export async function getCardGradeLadder(
  card: GoldStarCardLike,
): Promise<GradeLadder> {
  const empty: Record<PsaGrade, number | null> = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null,
    10: null,
  };
  if (!isEbayConfigured()) {
    return {
      raw: null,
      psa: empty,
      asOf: new Date().toISOString(),
      source: "unavailable",
    };
  }
  const [raw, ...gradePrices] = await Promise.all([
    fetchRawAsk(card),
    ...PSA_GRADES.map((g) => fetchPsaAsk(card, g)),
  ]);
  const psa = { ...empty };
  PSA_GRADES.forEach((g, i) => {
    psa[g] = gradePrices[i];
  });
  return {
    raw,
    psa,
    asOf: new Date().toISOString(),
    source: "ebay-ask",
  };
}

/**
 * Bulk version: resolves estimates for many cards in parallel and returns
 * a `Record<id, estimate>`. Each underlying eBay call is independently
 * cached by Next's fetch cache, so repeated renders are cheap.
 */
export async function getCardEstimates(
  cards: GoldStarCardLike[],
): Promise<Record<string, PriceEstimate>> {
  const entries = await Promise.all(
    cards.map(async (c) => [c.id, await getCardEstimate(c)] as const),
  );
  return Object.fromEntries(entries);
}

// Keep the export for older callers that imported the regex constants.
export { PSA10_PATTERN, GRADED_SLAB_PATTERN };
