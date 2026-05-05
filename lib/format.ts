export function formatUSD(value: number | null | undefined, opts?: { compact?: boolean }) {
  if (value == null || !Number.isFinite(value)) return "—";
  if (opts?.compact && value >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 1,
      notation: "compact",
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatRelativeDate(iso: string | null | undefined) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const now = Date.now();
  const diff = d.getTime() - now;
  const abs = Math.abs(diff);
  const day = 86_400_000;
  if (abs < day) {
    const hours = Math.round(abs / 3_600_000);
    return diff < 0 ? `${hours}h ago` : `in ${hours}h`;
  }
  const days = Math.round(abs / day);
  return diff < 0 ? `${days}d ago` : `in ${days}d`;
}

const SHINY_HEX: Record<string, string> = {
  purple: "#8a5cb8",
  "golden-orange": "#e2a341",
  "teal-green": "#3fa18a",
  gold: "#d6b350",
  green: "#4f9b5b",
  black: "#1a1a1a",
  brown: "#8a5a3a",
  "yellow-gold": "#e6c75a",
  blue: "#3f6fc4",
  white: "#e8e6dd",
  pink: "#d97aa6",
  "olive-gold": "#9b8a3c",
  silver: "#bdbdbd",
  "blue-white": "#cfdce8",
  sandy: "#c9a87b",
  copper: "#b86b3a",
  red: "#c4453f",
  orange: "#e09040",
  "blue-green": "#3fa18a",
};

export function shinyColorHex(label: string) {
  return SHINY_HEX[label.toLowerCase()] ?? "#888880";
}
