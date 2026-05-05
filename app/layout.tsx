import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { GoldStarHeader } from "@/components/GoldStarHeader";
import { GoldStarIcon } from "@/components/GoldStarIcon";

export const metadata: Metadata = {
  title: {
    default: "Gold Star Market — Pokémon Gold Star Investment Index",
    template: "%s · Gold Star Market",
  },
  description:
    "The best investment in Pokémon. Institutional-grade market tracking for all 30 Gold Star printings across 10 EX-era sets, with live eBay listings, PriceCharting, and PSA pop links.",
  metadataBase: new URL("https://goldstar.market"),
  icons: {
    icon: [
      { url: "/gold-star.png", type: "image/png" },
    ],
    apple: [{ url: "/gold-star.png" }],
    shortcut: ["/gold-star.png"],
  },
  openGraph: {
    title: "Gold Star Market",
    description: "The best investment in Pokémon.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen font-sans">
        <div className="relative z-10 flex min-h-screen flex-col">
          <GoldStarHeader />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-ink">
              <GoldStarIcon size="sm" />
              Gold Star Market
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              An independent market index for Pokémon Gold Star cards.
              Pricing data is sourced from PriceCharting, TCGPlayer, eBay, and
              PSA. Provided for informational purposes only — not investment
              advice.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-xs sm:grid-cols-3">
            <FooterCol heading="Index">
              <Link href="/cards" className="hover:text-ink">All cards</Link>
              <Link href="/population" className="hover:text-ink">Pop Reports</Link>
              <Link href="/history" className="hover:text-ink">History</Link>
            </FooterCol>
            <FooterCol heading="Data">
              <a
                href="https://www.pricecharting.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink"
              >
                PriceCharting
              </a>
              <a
                href="https://www.tcgplayer.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink"
              >
                TCGPlayer
              </a>
              <a
                href="https://developer.ebay.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink"
              >
                eBay API
              </a>
              <a
                href="https://www.psacard.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink"
              >
                PSA
              </a>
            </FooterCol>
            <FooterCol heading="Disclosure">
              <span className="text-ink-muted">
                Not affiliated with Pokémon,
                <br />
                PSA, or eBay.
              </span>
            </FooterCol>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/5 pt-6 text-[11px] uppercase tracking-[0.18em] text-ink-muted/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Gold Star Market</span>
          <span>EX Era · 2004 — 2007</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 text-ink-muted">
      <div className="text-[10px] uppercase tracking-[0.22em] text-ink/60">
        {heading}
      </div>
      {children}
    </div>
  );
}
