// Maps a card id to its hero image. Reprint cards (Power Keepers Eeveelutions)
// reuse the original Delta Species artwork because the printed art is identical.
//
// To add a new card image: drop `<pokemon>.<ext>` into `public/cards/` and add
// the basename + extension to AVAILABLE_IMAGES below.

import type { GoldStarCard } from "./goldstar-data";

type Ext = "jpg" | "png" | "webp";

export const AVAILABLE_IMAGES: Record<string, Ext> = {
  alakazam: "jpg",
  celebi: "jpg",
  charizard: "jpg",
  entei: "jpg",
  espeon: "jpg",
  flareon: "jpg",
  groudon: "jpg",
  gyarados: "png",
  jolteon: "jpg",
  kyogre: "jpg",
  latias: "jpg",
  latios: "jpg",
  metagross: "jpg",
  mew: "jpg",
  mewtwo: "png",
  mudkip: "jpg",
  pikachu: "png",
  raikou: "jpg",
  rayquaza: "jpg",
  regice: "jpg",
  regirock: "jpg",
  registeel: "jpg",
  suicune: "jpg",
  torchic: "jpg",
  treecko: "jpg",
  umbreon: "jpg",
  vaporeon: "jpg",
};

/**
 * Returns the public path for a card's hero image, or null if no image is
 * available yet. Reprints fall back to the base Pokémon's image since the
 * printed artwork is the same.
 */
export function cardImagePath(card: Pick<GoldStarCard, "id" | "name">): string | null {
  const slug = card.name.toLowerCase();
  const ext = AVAILABLE_IMAGES[slug];
  return ext ? `/cards/${slug}.${ext}` : null;
}

export function hasImage(card: Pick<GoldStarCard, "id" | "name">) {
  return cardImagePath(card) != null;
}

/** Approximate card aspect ratio (Pokémon TCG card = 63 × 88mm). */
export const CARD_ASPECT = "63 / 88";
