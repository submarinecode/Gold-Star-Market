import { GOLD_STAR_HISTORY, SETS } from "@/lib/goldstar-data";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata = {
  title: "History of Gold Stars",
  description:
    "The story of Pokémon Gold Star cards — from EX Team Rocket Returns in 2004 to POP Series 5 in 2007.",
};

const TIMELINE = [
  {
    year: "2003",
    title: "The EX Era begins",
    body:
      "Wizards of the Coast loses the Pokémon TCG license. The Pokémon Company International takes the reins and launches the EX block, with smaller English print runs than the Wizards era.",
  },
  {
    year: "2004",
    title: "EX Team Rocket Returns introduces Gold Stars",
    body:
      "Mudkip ★, Torchic ★, and Treecko ★ debut — the first Gold Stars ever printed in English. Pull rates of roughly 1 per 72 packs make them instantly the rarest cards of the era.",
  },
  {
    year: "2005",
    title: "EX Deoxys lands the crown jewel",
    body:
      "Rayquaza ★ — shiny black, frame-breaking artwork — becomes the chase card of the era and remains arguably the most visually striking Gold Star ever printed. Latias ★ and Latios ★ join the lineup.",
  },
  {
    year: "2005",
    title: "Legendary Beasts in Unseen Forces",
    body:
      "Entei ★, Raikou ★, and Suicune ★ get the Gold Star treatment, completing one of the most beloved trios in the EX era.",
  },
  {
    year: "2005",
    title: "EX Delta Species — the Eeveelutions arrive",
    body:
      "Flareon ★, Jolteon ★, Vaporeon ★, plus the Weather Trio (Groudon ★ and Kyogre ★) and Metagross ★. The largest single-set Gold Star count.",
  },
  {
    year: "2006",
    title: "EX Legend Maker, Holon Phantoms, Crystal Guardians, Dragon Frontiers",
    body:
      "The Regis, an iconic shiny red Gyarados ★, the franchise mascot Pikachu ★, and finally Charizard ★ in shiny black — one of the most desired cards in the entire hobby.",
  },
  {
    year: "2007",
    title: "EX Power Keepers reprints the Eeveelutions",
    body:
      "Flareon ★, Jolteon ★, and Vaporeon ★ get a Power Keepers reprint. Demand stays heavily on the Delta Species originals.",
  },
  {
    year: "2007",
    title: "POP Series 5 — the rarest of the rare",
    body:
      "Espeon ★ and Umbreon ★ are distributed exclusively through Pokémon Organized Play leagues, never available in retail packs. Umbreon ★ in PSA 10 has broken $100,000 at auction. The Gold Star era ends here.",
  },
  {
    year: "2017 — present",
    title: "Modern market",
    body:
      "Gold Stars become institutional grail cards as the Pokémon collecting boom accelerates. PSA 10 prices for the headline cards routinely 5–10× across cycles, with condition sensitivity making high grades disproportionately valuable.",
  },
];

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-12">
      <SectionHeader
        eyebrow="History"
        title="The history of Gold Stars"
        description={GOLD_STAR_HISTORY}
      />

      <div className="relative mt-8 border-l border-gold/30 pl-6">
        {TIMELINE.map((t, i) => (
          <div key={i} className="relative mb-10 last:mb-0">
            <div
              aria-hidden
              className="absolute -left-[30px] top-2.5 h-1.5 w-1.5 rounded-full bg-gold/80 shadow-[0_0_10px_rgba(201,168,76,0.5)]"
            />
            <div className="text-[10px] uppercase tracking-[0.28em] text-gold/80">
              {t.year}
            </div>
            <h3 className="mt-2 text-2xl font-medium tracking-tight text-ink">
              {t.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">{t.body}</p>
          </div>
        ))}
      </div>

      <div className="hairline my-16" />

      <h3 className="mb-4 text-2xl font-medium tracking-tight text-ink">
        Set-by-set
      </h3>
      <div className="space-y-3">
        {SETS.map((s) => (
          <div
            key={s.id}
            className="panel flex flex-wrap items-baseline justify-between gap-2 px-5 py-4"
          >
            <div className="text-base font-medium tracking-tight text-ink">
              {s.name}
            </div>
            <div className="num text-xs text-ink-muted">
              {s.year} · {s.cards.map((c) => c.name).join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
