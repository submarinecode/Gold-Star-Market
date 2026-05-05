# ★ Gold Star Market

The definitive market tracker for Pokémon Gold Star cards.
Tracks every English Gold Star — all 30 printings across 10 EX-era sets — with
live eBay listings, PriceCharting links, TCGPlayer search, and PSA pop reports.

> **Domain target:** `goldstar.market`

## Stack

- **Next.js 14** (App Router) + React 18
- **TypeScript** (strict)
- **Tailwind CSS** (custom dark-luxury palette — `#0a0a0a` bg, `#C9A84C` gold)
- Serif display via **Playfair Display**, mono data via **JetBrains Mono**
- Free **eBay Browse API** for live listings (Client Credentials OAuth)

## Routes

| Route | What it shows |
| --- | --- |
| `/` | Hero, summary stats, flagship grid, history teaser |
| `/cards` | Full card index, organized by set in chronological order |
| `/cards/[id]` | Card detail — header, eBay live listings, PriceCharting / PSA pop links |
| `/history` | Editorial timeline 2003 → present |
| `/population` | PSA pop overview (links out — PSA has no public API) |
| `/api/ebay?q=...` | JSON proxy to eBay Browse API |

## eBay API setup (free)

The Browse API is free for active-listing search. It needs an OAuth Application
access token (Client Credentials grant), which only requires an App ID + Cert ID
from a free developer account.

1. Sign in / create an account at <https://developer.ebay.com>.
2. Go to **My Account → Application Keys** and click **Create a keyset** for the
   Production environment.
3. Copy the **App ID (Client ID)** and **Cert ID (Client Secret)** for Production.
4. Create `.env.local` in the project root (copy from `.env.example`):

   ```bash
   EBAY_CLIENT_ID=your-app-id
   EBAY_CLIENT_SECRET=your-cert-id
   EBAY_ENV=production
   ```

5. Restart the dev server. Card detail pages now show live eBay listings.

> **What's free vs paid:** The Browse API (active listings) is free at very
> generous rate limits. **Sold/completed listings** require the Marketplace
> Insights API which is gated. Until you have access there, sold history links
> out to eBay's public completed-listings search via `ebayCompletedUrl()`.

## PriceCharting (optional, paid)

If you have a PriceCharting API token, set:

```bash
PRICECHARTING_TOKEN=...
```

The card detail page is wired to display a live grade ladder when this is set
(see `lib/goldstar-data.ts` for grade keys; integration is intentionally a small
extension to keep the free tier zero-cost to run).

## Local development

```bash
npm install
cp .env.example .env.local   # fill in EBAY_CLIENT_ID / EBAY_CLIENT_SECRET
npm run dev
```

Open <http://localhost:3000>.

## Build & deploy

```bash
npm run build
npm start
```

The app is statically prerendered for every card detail page; only the
`/api/ebay` route is dynamic. Ideal for Vercel's free tier.

## Data

All card data lives in `lib/goldstar-data.ts` (typed). The original
`goldstar-data.js` from the build prompt is preserved at the repo root for
reference. Update both if you add or correct cards.

## Card images

Card images live in `public/cards/<pokemon>.jpg` (e.g. `public/cards/charizard.jpg`).
Reprint cards (Power Keepers Eeveelutions) automatically reuse the original
Delta Species image since the printed art is identical.

To add a new image:

1. Drop the JPG into `public/cards/`, named after the lowercase Pokémon name
   (e.g. `pikachu.jpg`, `mewtwo.jpg`, `gyarados.jpg`).
2. Add the basename to the `AVAILABLE_IMAGES` set in `lib/images.ts`.
3. The image will appear automatically on the card row, the flagship grid, the
   detail hero, and any future surfaces.

Cards without images fall back to a tasteful "coming soon" placeholder tinted
in the card's shiny color, so the layout never breaks.

## Project structure

```
app/
  page.tsx                    # Home / dashboard
  cards/page.tsx              # Card index by set
  cards/[id]/page.tsx         # Card detail (eBay, PriceCharting, PSA)
  history/page.tsx            # Editorial timeline
  population/page.tsx         # PSA pop overview
  api/ebay/route.ts           # eBay Browse API proxy
  layout.tsx, globals.css, not-found.tsx
components/
  GoldStarHeader.tsx
  CardRow.tsx
  Badges.tsx
  EbayListings.tsx            # Async server component
  SectionHeader.tsx
lib/
  goldstar-data.ts            # All cards, sets, helpers
  ebay.ts                     # Browse API client + token cache
  format.ts                   # USD, dates, shiny color hex
```

## Notes

- Dark mode only — there is no light theme by design.
- All external links open in a new tab.
- Reprint cards are visually dimmer; flagship cards get a gold glow.
- Reads OAuth tokens server-side only; the client never sees credentials.
