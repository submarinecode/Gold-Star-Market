import Image from "next/image";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

const PX: Record<Size, number> = {
  xs: 14,
  sm: 18,
  md: 24,
  lg: 32,
  xl: 48,
  "2xl": 64,
  "3xl": 96,
};

/**
 * The custom gold-star mark used in the logo and beside card names.
 * Backed by `/public/gold-star.png` so we get crisp art everywhere.
 */
export function GoldStarIcon({
  size = "sm",
  className = "",
  priority,
  alt = "",
}: {
  size?: Size;
  className?: string;
  priority?: boolean;
  alt?: string;
}) {
  const px = PX[size];
  return (
    <Image
      src="/gold-star.png"
      alt={alt}
      width={px}
      height={px}
      priority={priority}
      className={`inline-block select-none align-[-0.18em] ${className}`}
      style={{
        filter:
          "drop-shadow(0 0 6px rgba(232, 200, 117, 0.25)) drop-shadow(0 1px 0 rgba(0,0,0,0.4))",
      }}
    />
  );
}
