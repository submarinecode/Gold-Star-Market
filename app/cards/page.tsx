import { ALL_CARDS, SETS } from "@/lib/goldstar-data";
import { getCardEstimates } from "@/lib/pricing";
import { SectionHeader } from "@/components/SectionHeader";
import { CardBrowser } from "@/components/CardBrowser";
import { PriceTickerStatus } from "@/components/PriceTickerStatus";

export const metadata = {
  title: "Card Index",
  description:
    "Every Pokémon Gold Star card, organized by set. Quick links to PriceCharting, TCGPlayer, eBay, and PSA pop reports.",
};

// Re-render the prices server-side at most once per hour even if the page
// is hit constantly; each underlying eBay query has the same TTL.
export const revalidate = 60 * 60;

export default async function CardsIndex() {
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
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-12">
      <SectionHeader
        eyebrow="Card Index"
        title="All Pokémon Gold Stars"
        description="Browse every printing across all 10 EX-era sets. Click any card for live eBay listings, PriceCharting prices, and PSA pop links."
      />

      <div className="mb-6">
        <PriceTickerStatus asOf={newestAsOf} />
      </div>

      <CardBrowser sets={SETS} estimates={estimates} />
    </div>
  );
}
