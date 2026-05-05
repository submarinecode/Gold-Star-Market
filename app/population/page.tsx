import Link from "next/link";
import { ALL_CARDS } from "@/lib/goldstar-data";
import { SectionHeader } from "@/components/SectionHeader";
import { GoldStarIcon } from "@/components/GoldStarIcon";

export const metadata = {
  title: "Pop Reports",
  description:
    "PSA pop report links across every Pokémon Gold Star card. Public PSA data has no API — link out to official pop counts.",
};

export default function PopulationPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-12">
      <SectionHeader
        eyebrow="Pop Reports"
        title="PSA pop reports"
        description="PSA does not publish a public population API. We link out to PSA's official pop pages so the numbers you see are always source-of-truth. A future revision will integrate manual pop snapshots for the headline cards."
      />

      <div className="panel overflow-hidden">
        <div className="grid grid-cols-12 gap-3 border-b border-white/5 bg-white/[0.02] px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-ink-muted">
          <div className="col-span-5">Card</div>
          <div className="col-span-3">Set</div>
          <div className="col-span-2 num text-right">Year</div>
          <div className="col-span-2 text-right">Pop report</div>
        </div>
        <ul className="divide-y divide-white/5">
          {ALL_CARDS.map((c) => (
            <li
              key={c.id}
              className="grid grid-cols-12 items-center gap-3 px-5 py-3 text-sm"
            >
              <div className="col-span-5 flex items-center gap-2">
                <GoldStarIcon size="xs" />
                <Link
                  href={`/cards/${c.id}`}
                  className="font-medium tracking-tight text-ink hover:text-gold"
                >
                  {c.name}
                </Link>
              </div>
              <div className="col-span-3 text-ink/85">{c.setName}</div>
              <div className="num col-span-2 text-right text-ink-muted">
                {c.year}
              </div>
              <div className="col-span-2 text-right">
                <a
                  href={c.psaPopUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold hover:text-gold-bright"
                >
                  PSA →
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
