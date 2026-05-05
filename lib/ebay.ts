// ============================================================
//  eBay Browse API client (free)
// ============================================================
//  Uses OAuth 2.0 Client Credentials grant to obtain an
//  "Application access token" — see:
//  https://developer.ebay.com/api-docs/static/oauth-client-credentials-grant.html
//
//  The Browse API returns currently active listings, which is
//  what's available for free. Sold/completed history requires
//  the Marketplace Insights API (gated approval), so for sold
//  prices we link out to eBay's public completed-listings search
//  via `ebayCompletedUrl()` in goldstar-data.ts.
// ============================================================

const EBAY_ENV = (process.env.EBAY_ENV ?? "production").toLowerCase();

const HOSTS =
  EBAY_ENV === "sandbox"
    ? {
        oauth: "https://api.sandbox.ebay.com/identity/v1/oauth2/token",
        api: "https://api.sandbox.ebay.com",
      }
    : {
        oauth: "https://api.ebay.com/identity/v1/oauth2/token",
        api: "https://api.ebay.com",
      };

const SCOPE = "https://api.ebay.com/oauth/api_scope";

export type EbayListing = {
  itemId: string;
  title: string;
  price: number | null;
  currency: string;
  condition: string | null;
  conditionId: string | null;
  imageUrl: string | null;
  itemUrl: string;
  seller: string | null;
  feedbackPercentage: string | null;
  buyingOptions: string[];
  bidCount?: number;
  endDate?: string | null;
  location: string | null;
};

type CachedToken = { token: string; expiresAt: number };
let cachedToken: CachedToken | null = null;

async function getAppAccessToken(): Promise<string> {
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new EbayConfigError(
      "EBAY_CLIENT_ID and EBAY_CLIENT_SECRET are not set. Create a free app at developer.ebay.com and add the credentials to .env.local.",
    );
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token;
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: SCOPE,
  });

  const res = await fetch(HOSTS.oauth, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new EbayApiError(
      `eBay OAuth failed (${res.status}): ${text || res.statusText}`,
      res.status,
    );
  }

  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return cachedToken.token;
}

export type SearchOptions = {
  query: string;
  limit?: number;
  /** eBay leaf category 183454 = "Trading Card Singles". 2536 includes other Pokémon categories. */
  categoryIds?: string[];
  sort?: "price" | "-price" | "newlyListed" | "endingSoonest" | undefined;
  /** How long Next.js' fetch cache should hold this query, in seconds. Default 5min. */
  revalidateSeconds?: number;
};

export async function searchActiveListings(
  opts: SearchOptions,
): Promise<EbayListing[]> {
  const token = await getAppAccessToken();
  const params = new URLSearchParams();
  params.set("q", opts.query);
  params.set("limit", String(opts.limit ?? 12));
  if (opts.categoryIds?.length) {
    params.set("category_ids", opts.categoryIds.join(","));
  }
  if (opts.sort) params.set("sort", opts.sort);
  params.set(
    "filter",
    [
      "buyingOptions:{FIXED_PRICE|AUCTION|BEST_OFFER}",
      "deliveryCountry:US",
    ].join(","),
  );

  const url = `${HOSTS.api}/buy/browse/v1/item_summary/search?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
      "Content-Type": "application/json",
    },
    next: { revalidate: opts.revalidateSeconds ?? 60 * 5 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new EbayApiError(
      `eBay Browse search failed (${res.status}): ${text || res.statusText}`,
      res.status,
    );
  }

  const json = (await res.json()) as { itemSummaries?: RawItemSummary[] };
  return (json.itemSummaries ?? []).map(toListing);
}

type RawItemSummary = {
  itemId: string;
  title: string;
  price?: { value?: string; currency?: string };
  condition?: string;
  conditionId?: string;
  image?: { imageUrl?: string };
  thumbnailImages?: Array<{ imageUrl?: string }>;
  itemWebUrl: string;
  seller?: { username?: string; feedbackPercentage?: string };
  buyingOptions?: string[];
  bidCount?: number;
  itemEndDate?: string;
  itemLocation?: { country?: string; postalCode?: string };
};

function toListing(it: RawItemSummary): EbayListing {
  const priceVal = it.price?.value ? Number(it.price.value) : null;
  const img =
    it.image?.imageUrl ??
    it.thumbnailImages?.[0]?.imageUrl ??
    null;
  return {
    itemId: it.itemId,
    title: it.title,
    price: Number.isFinite(priceVal) ? priceVal : null,
    currency: it.price?.currency ?? "USD",
    condition: it.condition ?? null,
    conditionId: it.conditionId ?? null,
    imageUrl: img,
    itemUrl: it.itemWebUrl,
    seller: it.seller?.username ?? null,
    feedbackPercentage: it.seller?.feedbackPercentage ?? null,
    buyingOptions: it.buyingOptions ?? [],
    bidCount: it.bidCount,
    endDate: it.itemEndDate ?? null,
    location: it.itemLocation?.country ?? null,
  };
}

export class EbayConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EbayConfigError";
  }
}

export class EbayApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "EbayApiError";
    this.status = status;
  }
}

export function isEbayConfigured() {
  return Boolean(process.env.EBAY_CLIENT_ID && process.env.EBAY_CLIENT_SECRET);
}
