export function ShinyColorBadge({ color }: { color: string }) {
  return (
    <span className="pill border-white/10 bg-white/[0.03] text-ink/80">
      {color}
    </span>
  );
}

export function YearBadge({ year }: { year: number }) {
  return (
    <span className="pill num border-white/10 bg-white/[0.03] text-ink-muted">
      {year}
    </span>
  );
}
