import { searchActiveListings, isEbayConfigured } from "@/lib/ebay";
import { formatUSD, formatRelativeDate } from "@/lib/format";
import { ebayCompletedUrl } from "@/lib/goldstar-data";

export async function EbayListings({
  cardName,
  setName,
  limit = 8,
}: {
  cardName: string;
  setName: string;
  limit?: number;
}) {
  const query = `${cardName} gold star ${setName} pokemon`;

  if (!isEbayConfigured()) {
    return (
      <div className="panel p-6">
        <div className="eyebrow">eBay</div>
        <h3 className="mt-2 text-xl font-medium tracking-tight text-ink">
          Live listings unavailable
        </h3>
        <p className="mt-2 text-sm text-ink-muted">
          The eBay Browse API is free, but a developer App ID is required.
          Add{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-ink">
            EBAY_CLIENT_ID
          </code>{" "}
          and{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-ink">
            EBAY_CLIENT_SECRET
          </code>{" "}
          to <code>.env.local</code> from{" "}
          <a
            href="https://developer.ebay.com/my/keys"
            target="_blank"
            rel="noreferrer"
            className="text-gold underline-offset-4 hover:underline"
          >
            developer.ebay.com
          </a>
          .
        </p>
        <a
          className="btn-gold mt-5"
          href={ebayCompletedUrl(cardName, setName)}
          target="_blank"
          rel="noreferrer"
        >
          View recent sales on eBay →
        </a>
      </div>
    );
  }

  let listings: Awaited<ReturnType<typeof searchActiveListings>> = [];
  let error: string | null = null;
  try {
    listings = await searchActiveListings({
      query,
      limit,
      sort: "endingSoonest",
      categoryIds: ["183454"],
    });
  } catch (err) {
    error = err instanceof Error ? err.message : "eBay request failed";
  }

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div>
          <div className="eyebrow">Live · eBay Browse API</div>
          <h3 className="mt-2 text-xl font-medium tracking-tight text-ink">
            Active listings
          </h3>
        </div>
        <a
          className="btn-ghost"
          href={ebayCompletedUrl(cardName, setName)}
          target="_blank"
          rel="noreferrer"
        >
          Sold history →
        </a>
      </div>

      {error ? (
        <div className="px-6 py-8 text-sm text-ink-muted">
          Couldn&apos;t reach eBay — {error}
        </div>
      ) : listings.length === 0 ? (
        <div className="px-6 py-8 text-sm text-ink-muted">
          No active listings matched <span className="num">{query}</span> right now.
        </div>
      ) : (
        <ul className="divide-y divide-white/5">
          {listings.map((it) => (
            <li key={it.itemId} className="grid grid-cols-12 items-center gap-3 px-6 py-3">
              <a
                href={it.itemUrl}
                target="_blank"
                rel="noreferrer"
                className="col-span-12 flex items-center gap-3 sm:col-span-7"
              >
                {it.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.imageUrl}
                    alt=""
                    className="h-12 w-12 flex-none rounded-md border border-white/10 bg-bg object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 flex-none rounded-md border border-white/10 bg-bg" />
                )}
                <div className="min-w-0">
                  <div className="truncate text-sm text-ink hover:text-gold">
                    {it.title}
                  </div>
                  <div className="mt-0.5 text-xs text-ink-muted">
                    {it.condition ?? "—"}
                    {it.bidCount != null ? ` · ${it.bidCount} bids` : ""}
                    {it.endDate
                      ? ` · ends ${formatRelativeDate(it.endDate) ?? ""}`
                      : ""}
                    {it.seller ? ` · ${it.seller}` : ""}
                  </div>
                </div>
              </a>
              <div className="col-span-6 sm:col-span-3">
                <div className="flex flex-wrap gap-1.5">
                  {it.buyingOptions.map((b) => (
                    <span
                      key={b}
                      className="pill border-white/10 bg-white/[0.03] text-ink-muted"
                    >
                      {b.replace("_", " ").toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-span-6 text-right sm:col-span-2">
                <span className="num text-base text-gold">
                  {formatUSD(it.price)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
