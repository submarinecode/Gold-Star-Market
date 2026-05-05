// ============================================================
//  Free-tier price estimates from the eBay Browse API.
//
//  We don't have access to eBay's sold/Marketplace Insights API
//  on the free tier, so these are explicitly the **lowest active
//  asking prices** right now — labelled accordingly in the UI.
//
//  For each card we run two queries in parallel:
//    - raw     : "<name> gold star <set>" (filter out PSA / CGC / BGS / SGC)
//    - psa10   : "<name> gold star <set> psa 10"
//
//  Results are filtered & sorted client-side, with the cheapest
//  matching listing kept. We rely on Next.js' fetch cache (the
//  underlying eBay calls are tagged with `revalidate`) so each
//  unique query only hits eBay once per hour per region.
// ============================================================

import { searchActiveListings, isEbayConfigured } from "@/lib/ebay";
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

const GRADED_SLAB_PATTERN = /\b(psa|cgc|bgs|sgc|gem mint|graded|slabbed)\b/i;
const PSA10_PATTERN = /\bpsa\s*10\b/i;
const PROXY_PATTERN = /\b(proxy|custom|reprint card|fake|replica|sticker)\b/i;

function lowestPrice(values: Array<number | null | undefined>): number | null {
  let min: number | null = null;
  for (const v of values) {
    if (v == null || !Number.isFinite(v)) continue;
    if (min == null || v < min) min = v;
  }
  return min;
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
    const candidates = listings
      .filter((l) => typeof l.price === "number" && (l.price ?? 0) > 0)
      .filter((l) => !GRADED_SLAB_PATTERN.test(l.title))
      .filter((l) => !PROXY_PATTERN.test(l.title))
      // sanity: a real raw Gold Star is rarely under $20.
      .filter((l) => (l.price ?? 0) >= 20)
      .map((l) => l.price);
    return lowestPrice(candidates);
  } catch {
    return null;
  }
}

async function fetchPsa10Ask(card: GoldStarCardLike): Promise<number | null> {
  try {
    const listings = await searchActiveListings({
      query: `${card.name} gold star ${card.setName} psa 10`,
      limit: 15,
      sort: "price",
      categoryIds: ["183454"],
      revalidateSeconds: 60 * 60,
    });
    const candidates = listings
      .filter((l) => typeof l.price === "number" && (l.price ?? 0) > 0)
      .filter((l) => PSA10_PATTERN.test(l.title))
      .filter((l) => !PROXY_PATTERN.test(l.title))
      // sanity: a PSA 10 Gold Star almost never sits below $200.
      .filter((l) => (l.price ?? 0) >= 200)
      .map((l) => l.price);
    return lowestPrice(candidates);
  } catch {
    return null;
  }
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
  const [raw, psa10] = await Promise.all([
    fetchRawAsk(card),
    fetchPsa10Ask(card),
  ]);
  return {
    raw,
    psa10,
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
