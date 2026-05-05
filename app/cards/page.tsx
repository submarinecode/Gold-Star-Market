import { SETS } from "@/lib/goldstar-data";
import { SectionHeader } from "@/components/SectionHeader";
import { CardBrowser } from "@/components/CardBrowser";

export const metadata = {
  title: "Card Index",
  description:
    "Every Pokémon Gold Star card, organized by set. Quick links to PriceCharting, TCGPlayer, eBay, and PSA pop reports.",
};

export default function CardsIndex() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-12">
      <SectionHeader
        eyebrow="Card Index"
        title="All Pokémon Gold Stars"
        description="Browse every printing across all 10 EX-era sets. Click any card for live eBay listings, PriceCharting prices, and PSA pop links."
      />

      <CardBrowser sets={SETS} estimates={{}} />
    </div>
  );
}
