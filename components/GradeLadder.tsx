import { PSA_GRADES, type GradeLadder } from "@/lib/pricing";
import { isEbayConfigured } from "@/lib/ebay";
import { formatUSD } from "@/lib/format";

/**
 * Vertical price ladder used on the card detail page.
 * One row per grade — Raw + PSA 1 through PSA 10. Each row shows the
 * lowest active asking price found on eBay or "—" if no listing matched.
 */
export function GradeLadderTable({
  ladder,
  cardName,
}: {
  ladder: GradeLadder;
  cardName: string;
}) {
  const rows: Array<{ key: string; label: string; value: number | null; emphasis?: boolean }> = [
    { key: "raw", label: "Raw / Ungraded", value: ladder.raw, emphasis: true },
    ...PSA_GRADES.map((g) => ({
      key: `psa-${g}`,
      label: `PSA ${g}`,
      value: ladder.psa[g],
      emphasis: g === 9 || g === 10,
    })),
  ];

  const hasAny = rows.some((r) => r.value != null);
  const configured = isEbayConfigured();
  const updated = ladder.asOf ? new Date(ladder.asOf) : null;

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div>
          <div className="eyebrow">
            {configured ? "Live · eBay asks" : "Offline · no eBay token"}
          </div>
          <h3 className="mt-2 text-xl font-medium tracking-tight text-ink">
            Grade ladder
          </h3>
        </div>
        <div className="text-right text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          Lowest asking
        </div>
      </div>

      <ul className="divide-y divide-white/5">
        {rows.map((r) => (
          <li
            key={r.key}
            className={`flex items-baseline justify-between gap-4 px-6 py-3 text-sm ${
              r.emphasis ? "bg-white/[0.015]" : ""
            }`}
          >
            <span
              className={`uppercase tracking-[0.18em] ${
                r.emphasis ? "text-ink" : "text-ink-muted"
              }`}
            >
              {r.label}
            </span>
            <span
              className={`num text-base font-medium ${
                r.value != null
                  ? r.emphasis
                    ? "text-gold-bright"
                    : "text-ink"
                  : "text-ink-muted/60"
              }`}
            >
              {r.value != null ? (
                <>
                  <span className="text-ink-muted/70 text-xs">from </span>
                  {formatUSD(r.value, { compact: false })}
                </>
              ) : (
                "—"
              )}
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t border-white/5 px-6 py-3 text-[11px] text-ink-muted">
        {configured ? (
          <>
            Lowest <span className="text-ink">active</span> asking price on
            eBay for {cardName} ★ at each grade — not sold history.
            {updated ? (
              <>
                {" "}
                Updated{" "}
                <span className="num text-ink/80">
                  {updated.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                .
              </>
            ) : null}
          </>
        ) : (
          <>
            Set <code className="rounded bg-white/5 px-1 text-ink">EBAY_CLIENT_ID</code>{" "}
            and{" "}
            <code className="rounded bg-white/5 px-1 text-ink">EBAY_CLIENT_SECRET</code>{" "}
            in <code>.env.local</code> to populate the ladder.
          </>
        )}
        {hasAny ? null : configured ? (
          <span className="ml-1 text-ink-muted/80">
            No matching active listings right now.
          </span>
        ) : null}
      </div>
    </div>
  );
}
