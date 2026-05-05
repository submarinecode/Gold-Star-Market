import Link from "next/link";
import {
  ALL_CARDS,
  GOLD_STAR_HISTORY,
  SETS,
  totalSetCount,
  uniquePokemonCount,
} from "@/lib/goldstar-data";
import { getCardEstimates } from "@/lib/pricing";
import { CardBrowser } from "@/components/CardBrowser";
import { GoldStarIcon } from "@/components/GoldStarIcon";
import { PriceTickerStatus } from "@/components/PriceTickerStatus";

export const revalidate = 60 * 60;

export default async function HomePage() {
  const totalPrintings = ALL_CARDS.length;
  const sets = totalSetCount();
  const pokes = uniquePokemonCount();
  const popOnlyCount = ALL_CARDS.filter((c) =>
    c.notes.toLowerCase().includes("organized play"),
  ).length;
  const eraSpan = "2004 — 2007";

  const estimates = await getCardEstimates(
    ALL_CARDS.map((c) => ({
      id: c.id,
      name: c.name,
      setName: c.setName,
    })),
  );

  const newestAsOf = Object.values(estimates).reduce<string | undefined>(
    (acc, e) => (acc && acc > e.asOf ? acc : e.asOf),
    undefined,
  );

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-12 sm:pt-16">
      <Hero pokes={pokes} totalPrintings={totalPrintings} sets={sets} />

      <div className="hairline my-14" />

      <SummaryStats
        stats={[
          { label: "Unique Pokémon", value: String(pokes) },
          { label: "Total printings", value: String(totalPrintings) },
          { label: "Sets covered", value: String(sets) },
          { label: "POP-only", value: String(popOnlyCount) },
          { label: "Era", value: eraSpan },
        ]}
      />

      <section className="mt-20">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="eyebrow">The Vault</div>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Browse the entire index
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
              Every Gold Star printing across all 10 EX-era sets, in
              chronological order. Search by name, set, or shiny color. Click
              any card for live eBay listings, PriceCharting, and PSA pop
              links.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/cards" className="btn-gold">
              Open card index →
            </Link>
            <Link href="/population" className="btn-ghost">
              Pop Reports
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <PriceTickerStatus asOf={newestAsOf} />
        </div>

        <CardBrowser sets={SETS} estimates={estimates} />
      </section>

      <div className="hairline my-16" />

      <section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 panel p-8">
            <div className="eyebrow">Background</div>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              Why Gold Stars
            </h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink/85">
              {GOLD_STAR_HISTORY}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/history" className="btn-gold">
                Read the full history →
              </Link>
              <Link href="/population" className="btn-ghost">
                Pop Reports
              </Link>
            </div>
          </div>
          <div className="panel p-8">
            <div className="eyebrow">Sets</div>
            <h2 className="mt-3 text-xl font-medium tracking-tight text-ink">
              All ten sets
            </h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              {SETS.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between text-ink/85"
                >
                  <Link
                    href={`/cards#${s.id}`}
                    className="truncate transition hover:text-gold"
                  >
                    {s.name}
                  </Link>
                  <span className="num text-xs text-ink-muted">
                    {s.year} · {s.cards.length}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function Hero({
  pokes,
  totalPrintings,
  sets,
}: {
  pokes: number;
  totalPrintings: number;
  sets: number;
}) {
  return (
    <section className="relative">
      <div className="eyebrow">Pokémon · EX Era · 2004 — 2007</div>
      <h1 className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-4xl font-medium leading-[1.05] tracking-tightest text-ink sm:text-6xl lg:text-7xl">
        <span>The best investment in Pokémon</span>
        <GoldStarIcon
          size="3xl"
          priority
          className="h-[0.95em] w-[0.95em]"
        />
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
        An institutional-grade index of every Pokémon Gold Star — all{" "}
        <span className="num text-ink">{pokes}</span> Pokémon,{" "}
        <span className="num text-ink">{totalPrintings}</span> printings, across{" "}
        <span className="num text-ink">{sets}</span> EX-era sets — with live
        eBay listings, PriceCharting, TCGPlayer, and PSA pop data in one
        vault.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/cards" className="btn-gold">
          Browse the index →
        </Link>
        <Link href="/population" className="btn-ghost">
          Pop Reports
        </Link>
        <Link href="/history" className="btn-ghost">
          History
        </Link>
      </div>
    </section>
  );
}

function SummaryStats({
  stats,
}: {
  stats: { label: string; value: string }[];
}) {
  return (
    <section>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/5 bg-white/5 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-card px-5 py-6 transition hover:bg-white/[0.03]"
          >
            <div className="text-[10px] uppercase tracking-[0.28em] text-ink-muted">
              {s.label}
            </div>
            <div className="num mt-2 text-2xl font-medium tracking-tight text-gold-bright sm:text-3xl">
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
