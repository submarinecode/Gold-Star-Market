import Link from "next/link";
import type { GoldStarCard } from "@/lib/goldstar-data";
import type { PriceEstimate } from "@/lib/pricing";
import { CardImage } from "@/components/CardImage";
import { GoldStarIcon } from "@/components/GoldStarIcon";
import { formatUSD } from "@/lib/format";

export type CardTileCard = GoldStarCard & {
  setName?: string;
};

/**
 * Single card tile used by the homepage grid, cards index, and search results.
 * Renders the card art big, name + number, and a footer "ticker" with the
 * cheapest active eBay raw / PSA 10 asking price (when available).
 */
export function CardTile({
  card,
  estimate,
  showSetName,
}: {
  card: CardTileCard;
  estimate?: PriceEstimate;
  showSetName?: boolean;
}) {
  return (
    <Link
      href={`/cards/${card.id}`}
      className="group flex flex-col rounded-xl border border-white/5 bg-white/[0.015] p-3 transition hover:border-gold/50 hover:bg-white/[0.04]"
    >
      <div className="relative">
        <CardImage card={card} variant="tile" className="w-full" />
      </div>

      <div className="mt-4 min-w-0">
        <div className="flex items-center gap-1.5 truncate text-base font-medium tracking-tight text-ink">
          <span className="truncate">{card.name}</span>
          <GoldStarIcon size="xs" className="flex-none" />
        </div>
        <div className="mt-0.5 truncate text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          {showSetName && card.setName ? (
            <>
              <span className="truncate">{card.setName}</span>
              <span className="px-1.5 text-ink-muted/40">·</span>
            </>
          ) : null}
          <span className="num">#{card.number}</span>
          <span className="px-1.5 text-ink-muted/40">·</span>
          {card.shinyColor}
        </div>
      </div>

      <PriceStripe estimate={estimate} />
    </Link>
  );
}

function PriceStripe({ estimate }: { estimate?: PriceEstimate }) {
  const raw = estimate?.raw ?? null;
  const psa10 = estimate?.psa10 ?? null;
  const hasAny = raw != null || psa10 != null;

  return (
    <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-md border border-white/[0.06] bg-black/30 text-[11px]">
      <PriceCell label="Raw" value={raw} hasAny={hasAny} />
      <PriceCell label="PSA 10" value={psa10} hasAny={hasAny} accent />
    </div>
  );
}

function PriceCell({
  label,
  value,
  hasAny,
  accent,
}: {
  label: string;
  value: number | null;
  hasAny: boolean;
  accent?: boolean;
}) {
  const display = value != null ? formatUSD(value, { compact: true }) : "—";
  const tone = accent ? "text-gold-bright" : "text-ink";

  return (
    <div
      className={`flex items-baseline justify-between gap-2 px-3 py-2 ${
        accent ? "border-l border-white/[0.06]" : ""
      }`}
    >
      <span className="uppercase tracking-[0.2em] text-ink-muted">
        {label}
      </span>
      <span className={`num text-sm font-medium ${tone}`} title={hasAny && value != null ? `Lowest active asking price on eBay (cached up to 1h)` : "No active eBay listing matched"}>
        {value != null ? <span className="text-ink-muted/80">from </span> : null}
        {display}
      </span>
    </div>
  );
}
