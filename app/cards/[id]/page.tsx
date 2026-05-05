import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ALL_CARDS,
  ebayCompletedUrl,
  findCardById,
  findSetForCardId,
} from "@/lib/goldstar-data";
import {
  FlagshipBadge,
  ShinyColorBadge,
  YearBadge,
} from "@/components/Badges";
import { EbayListings } from "@/components/EbayListings";
import { CardImage } from "@/components/CardImage";
import { GoldStarIcon } from "@/components/GoldStarIcon";

export function generateStaticParams() {
  return ALL_CARDS.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const card = findCardById(params.id);
  if (!card) return {};
  return {
    title: `${card.name} ★ — ${card.setName}`,
    description: card.notes,
  };
}

export default function CardDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const card = findCardById(params.id);
  const set = findSetForCardId(params.id);
  if (!card || !set) return notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-10">
      <div className="mb-6 flex items-center justify-between text-xs">
        <Link href="/cards" className="text-ink-muted hover:text-gold">
          ← All cards
        </Link>
        <span className="num text-ink-muted">
          {set.name} · #{card.number}
        </span>
      </div>

      <header
        className={`relative overflow-hidden rounded-2xl border p-6 sm:p-10 ${
          card.flagship
            ? "border-gold/45 shadow-flagship"
            : "border-white/5"
        }`}
        style={{
          background:
            "radial-gradient(800px 300px at 20% 0%, rgba(201,168,76,0.10), transparent 60%), #141414",
        }}
      >
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-12 sm:items-start">
          <div className="sm:col-span-4 lg:col-span-3">
            <div
              className={`relative ${
                card.flagship
                  ? "[filter:drop-shadow(0_0_36px_rgba(232,200,117,0.32))]"
                  : "[filter:drop-shadow(0_0_24px_rgba(0,0,0,0.6))]"
              }`}
            >
              <CardImage card={card} variant="hero" priority />
            </div>
          </div>

          <div className="sm:col-span-8 lg:col-span-9">
            <div className="flex flex-wrap items-center gap-2">
              <YearBadge year={set.year} />
              <ShinyColorBadge color={card.shinyColor} />
              {card.flagship ? <FlagshipBadge /> : null}
            </div>

            <h1 className="mt-5 flex flex-wrap items-center gap-3 text-5xl font-medium tracking-tightest text-ink sm:text-6xl lg:text-7xl">
              <span>{card.name}</span>
              <GoldStarIcon size="xl" />
            </h1>
            <div className="mt-3 text-sm text-ink-muted">
              {set.name} · <span className="num">#{card.number}</span> ·
              Illustrator: {card.artist}
            </div>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink/85">
              {card.notes}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <a
                href={card.priceChartingUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-gold"
              >
                PriceCharting →
              </a>
              <a
                href={card.tcgPlayerUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                TCGPlayer
              </a>
              <a
                href={ebayCompletedUrl(card.name, set.name)}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                eBay sold history
              </a>
              <a
                href={card.psaPopUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                PSA pop report
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<EbayListingsSkeleton />}>
            <EbayListings cardName={card.name} setName={set.name} limit={8} />
          </Suspense>

          <div className="panel mt-6 overflow-hidden">
            <div className="border-b border-white/5 px-6 py-4">
              <div className="eyebrow">PriceCharting</div>
              <h3 className="mt-2 text-xl font-medium tracking-tight text-ink">
                Grade prices
              </h3>
            </div>
            <div className="px-6 py-6 text-sm text-ink-muted">
              <p>
                Live grade pricing requires a PriceCharting API token. While
                you&apos;re testing the free tier of Gold Star Market, click
                through to view the full grade ladder for{" "}
                <span className="text-ink">{card.name}</span>{" "}
                <GoldStarIcon size="xs" />.
              </p>
              <a
                className="btn-gold mt-4"
                href={card.priceChartingUrl}
                target="_blank"
                rel="noreferrer"
              >
                View full price ladder →
              </a>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="panel p-6">
            <div className="eyebrow">PSA Population</div>
            <h3 className="mt-2 text-xl font-medium tracking-tight text-ink">
              Pop report
            </h3>
            <p className="mt-3 text-sm text-ink-muted">
              PSA does not publish a public API. View the latest official pop
              counts on PSA&apos;s site.
            </p>
            <a
              href={card.psaPopUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost mt-4 w-full"
            >
              View PSA pop →
            </a>
          </div>

          <div className="panel p-6">
            <div className="eyebrow">Specs</div>
            <dl className="mt-4 space-y-3 text-sm">
              <Spec label="Set" value={set.name} />
              <Spec label="Year" value={String(set.year)} mono />
              <Spec label="Number" value={card.number} mono />
              <Spec label="Shiny color" value={card.shinyColor} />
              <Spec label="Artist" value={card.artist} />
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Spec({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        {label}
      </dt>
      <dd className={`text-right text-ink/90 ${mono ? "num" : ""}`}>{value}</dd>
    </div>
  );
}

function EbayListingsSkeleton() {
  return (
    <div className="panel p-6">
      <div className="eyebrow">Live · eBay</div>
      <div className="mt-2 text-xl font-medium tracking-tight text-ink">
        Loading active listings…
      </div>
      <div className="mt-4 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-12 animate-pulse rounded-md bg-white/[0.03]"
          />
        ))}
      </div>
    </div>
  );
}
