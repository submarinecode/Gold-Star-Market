"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import type { GoldStarCard, GoldStarSet } from "@/lib/goldstar-data";
import type { PriceEstimate } from "@/lib/pricing";
import { CardTile } from "@/components/CardTile";

type EnrichedCard = GoldStarCard & {
  setId: string;
  setName: string;
  year: number;
};

export function CardBrowser({
  sets,
  estimates,
  defaultMode = "sets",
}: {
  sets: GoldStarSet[];
  estimates: Record<string, PriceEstimate>;
  /** Initial layout: grouped by set, or one flat grid. */
  defaultMode?: "sets" | "flat";
}) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);

  const allCards: EnrichedCard[] = useMemo(
    () =>
      sets.flatMap((set) =>
        set.cards.map((c) => ({
          ...c,
          setId: set.id,
          setName: set.name,
          year: set.year,
        })),
      ),
    [sets],
  );

  const isSearching = deferred.trim().length > 0;
  const matches = useMemo(() => {
    const q = deferred.trim().toLowerCase();
    if (!q) return allCards;
    return allCards.filter((c) => {
      const haystack = [
        c.name,
        c.setName,
        c.shinyColor,
        c.number,
        c.artist,
        c.notes,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [deferred, allCards]);

  const showFlat = isSearching || defaultMode === "flat";

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, set, color…"
            aria-label="Search Gold Stars"
            className="w-full rounded-md border border-white/10 bg-white/[0.025] px-4 py-2.5 pl-10 text-sm text-ink placeholder:text-ink-muted/70 outline-none transition focus:border-gold/50 focus:bg-white/[0.04] focus:ring-1 focus:ring-gold/30"
          />
          <SearchGlyph />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-muted hover:text-ink"
              aria-label="Clear search"
            >
              ×
            </button>
          ) : null}
        </div>
        <div className="text-xs text-ink-muted">
          {isSearching ? (
            <>
              <span className="num text-ink">{matches.length}</span> match
              {matches.length === 1 ? "" : "es"} for{" "}
              <span className="text-ink">&ldquo;{deferred}&rdquo;</span>
            </>
          ) : (
            <>
              <span className="num text-ink">{allCards.length}</span> printings
              · <span className="num text-ink">{sets.length}</span> sets
            </>
          )}
        </div>
      </div>

      {showFlat ? (
        <FlatGrid cards={matches} estimates={estimates} />
      ) : (
        <div className="space-y-14">
          {sets.map((set) => (
            <SetSection key={set.id} set={set} estimates={estimates} />
          ))}
        </div>
      )}
    </div>
  );
}

function FlatGrid({
  cards,
  estimates,
}: {
  cards: EnrichedCard[];
  estimates: Record<string, PriceEstimate>;
}) {
  if (cards.length === 0) {
    return (
      <div className="panel px-6 py-16 text-center">
        <div className="text-4xl text-gold/60">—</div>
        <div className="mt-3 text-sm text-ink">No matching Gold Stars.</div>
        <div className="mt-1 text-xs text-ink-muted">
          Try a name (&ldquo;Charizard&rdquo;), a set
          (&ldquo;Crystal Guardians&rdquo;), or a color (&ldquo;black&rdquo;).
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
      {cards.map((card) => (
        <CardTile
          key={card.id}
          card={card}
          estimate={estimates[card.id]}
          showSetName
        />
      ))}
    </div>
  );
}

function SetSection({
  set,
  estimates,
}: {
  set: GoldStarSet;
  estimates: Record<string, PriceEstimate>;
}) {
  const count = set.cards.length;
  const colsClass =
    count === 1
      ? "grid-cols-1 sm:grid-cols-1"
      : count === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-2 sm:grid-cols-3";
  return (
    <section id={set.id} className="scroll-mt-24">
      <header className="mb-5 flex items-end justify-between gap-4 border-b border-white/5 pb-3">
        <div>
          <div className="eyebrow">
            {set.id.replace(/^ex-/, "EX · ").replace(/-/g, " ")}
          </div>
          <h3 className="mt-2 text-2xl font-medium tracking-tight text-ink">
            <Link href={`#${set.id}`} className="hover:text-gold">
              {set.name}
            </Link>
          </h3>
        </div>
        <div className="text-right text-xs text-ink-muted">
          <div className="num text-base text-ink">{set.year}</div>
          <div className="mt-0.5 uppercase tracking-[0.18em]">
            {count} card{count === 1 ? "" : "s"}
          </div>
        </div>
      </header>
      <div className={`grid gap-5 ${colsClass}`}>
        {set.cards.map((c) => (
          <CardTile
            key={c.id}
            card={{ ...c, setName: set.name }}
            estimate={estimates[c.id]}
          />
        ))}
      </div>
    </section>
  );
}

function SearchGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.5" y1="15.5" x2="20" y2="20" />
    </svg>
  );
}
