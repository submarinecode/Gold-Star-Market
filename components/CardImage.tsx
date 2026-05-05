import Image from "next/image";
import type { GoldStarCard } from "@/lib/goldstar-data";
import { cardImagePath } from "@/lib/images";
import { shinyColorHex } from "@/lib/format";

type Variant = "thumb" | "tile" | "hero";

const SIZES: Record<Variant, string> = {
  thumb: "(min-width: 640px) 64px, 56px",
  tile: "(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw",
  hero: "(min-width: 1024px) 420px, (min-width: 640px) 55vw, 90vw",
};

/**
 * Card art is sourced from a mixed-quality set of images — some are tightly
 * cropped to the card (fills the frame) while others include whitespace.
 * To keep the grid visually uniform, every tile uses a fixed-aspect frame
 * with a soft dark backdrop and `object-contain`, so the *full* card is
 * always shown, centered, at a consistent visual size.
 */
export function CardImage({
  card,
  variant = "tile",
  className = "",
  priority,
}: {
  card: GoldStarCard;
  variant?: Variant;
  className?: string;
  priority?: boolean;
}) {
  const src = cardImagePath(card);
  const ratio = "aspect-[63/88]";
  const fit = variant === "thumb" ? "object-cover" : "object-contain";
  const inset = variant === "thumb" ? "" : "p-2";

  if (!src) {
    return (
      <div
        className={`relative overflow-hidden rounded-md border border-white/10 bg-bg ${ratio} ${className}`}
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 30% 25%, ${shinyColorHex(
              card.shinyColor,
            )}, transparent 65%)`,
          }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <span className="select-none text-3xl text-gold/60">★</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 px-2 py-1 text-center text-[9px] uppercase tracking-[0.18em] text-ink-muted">
          coming soon
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-md border border-white/10 bg-gradient-to-b from-white/[0.04] to-black/40 ${ratio} ${className}`}
    >
      <div className={`absolute inset-0 ${inset}`}>
        <Image
          src={src}
          alt={`${card.name} ★`}
          fill
          sizes={SIZES[variant]}
          className={fit}
          priority={priority}
        />
      </div>
    </div>
  );
}
