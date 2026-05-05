import { isEbayConfigured } from "@/lib/ebay";

/**
 * Small status strip explaining where the raw / PSA 10 numbers come from.
 * Shows up above the card grid so the "from $X" framing is unambiguous.
 */
export function PriceTickerStatus({
  asOf,
}: {
  asOf?: string;
}) {
  const configured = isEbayConfigured();
  const updated = asOf ? new Date(asOf) : null;
  const updatedLabel = updated
    ? `${updated.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}`
    : null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-white/5 bg-white/[0.02] px-3 py-2 text-[11px] text-ink-muted">
      <span className="flex items-center gap-2">
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            configured ? "bg-emerald-400" : "bg-ink-muted/50"
          }`}
        />
        <span className="uppercase tracking-[0.22em]">
          {configured ? "Live · eBay asks" : "Offline · no eBay token"}
        </span>
      </span>
      <span className="text-ink-muted/40">·</span>
      <span>
        Lowest <span className="text-ink">active</span> asking price right now —
        not sold history.
      </span>
      {updatedLabel ? (
        <>
          <span className="text-ink-muted/40">·</span>
          <span>
            Updated <span className="num text-ink">{updatedLabel}</span>
          </span>
        </>
      ) : null}
    </div>
  );
}
