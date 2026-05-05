# Gold Star Market — Build Prompt

> **Site name**: Gold Star Market
> **Domain options**: `goldstar.market` (preferred) · `goldstarmarket.com` · `goldstarmarket.gg`
> **Logo**: Bold ★ mark + wordmark "Gold Star Market" in serif
> **Tagline**: "The definitive market tracker for Pokémon Gold Star cards"


## Project Overview
Build a single-page React app (or Next.js) called **Gold Star Market** — a dedicated tracker for all 27 Pokémon Gold Star cards (30 printings including Power Keepers reprints). 

Import card data from the accompanying `goldstar-data.js` file, which contains every card's name, set, number, PriceCharting URL, TCGPlayer URL, PSA Pop Report URL, shiny color, and notes.

---

## Theme & Design

**Aesthetic**: Dark luxury. Black background (#0a0a0a), gold accent (#C9A84C), subtle off-white text (#F0EDE6). Feels like a high-end auction house or grading vault — not a Pokémon fan site.

**Logo**: A bold gold star (★) — large, slightly embossed looking, used in the header and favicon. No Pokémon artwork — clean typographic logo.

**Typography**: 
- Display/headings: a serif font (e.g. Playfair Display or DM Serif Display) for the name and section headers — gives gravitas
- Body/data: a clean monospaced or tabular font (e.g. JetBrains Mono or IBM Plex Mono) for prices and numbers — feels like a trading terminal

**Color palette**:
- Background: `#0a0a0a`
- Surface: `#111111`
- Card surface: `#161616`
- Border: `rgba(201, 168, 76, 0.2)` (gold, dim)
- Border hover: `rgba(201, 168, 76, 0.6)` (gold, bright)
- Gold accent: `#C9A84C`
- Gold highlight: `#FFD97D`
- Text primary: `#F0EDE6`
- Text muted: `#888880`

---

## Pages / Sections (single-page with hash routing or tab navigation)

### 1. Home / Dashboard
- Header with gold star logo and site name
- Brief tagline: "The definitive market tracker for Pokémon Gold Star cards"
- Summary stats row: Total cards tracked, sets covered, highest PSA 10 sale (pulled from data), rarest card (Umbreon ★)
- "History of Gold Stars" expandable section — use the `GOLD_STAR_HISTORY` string from the data file, expanded with:
  - Timeline from 2004–2007 with key milestones per set
  - Why they're valuable (low print runs, EX era decline, condition sensitivity)
  - How they differ from modern alt arts
- Quick-links grid: one card per flagship card (Rayquaza, Charizard, Umbreon, Espeon) with gold border treatment

### 2. Card Index (main browsing page)
- Organized by set in chronological order (use the `SETS` array)
- Each set has a collapsible section header with: set name, year, number of Gold Stars in set
- Each card displays as a row (table-like, not a grid of big cards) showing:
  - Card name + ★ symbol
  - Set name + card number
  - Shiny color badge
  - "Flagship" badge if `flagship: true`
  - "Reprint" badge if `reprint: true`  
  - Quick price cells: Ungraded / PSA 9 / PSA 10 (fetched live from PriceCharting API if token provided, otherwise shows "—")
  - Links: [PriceCharting] [TCGPlayer] [PSA Pop] [eBay Sales]
- Clicking any card row opens the Card Detail page/modal

### 3. Card Detail Page
Each card gets a dedicated view (route: `/card/:id`) showing:

**Header section**
- Card name in large serif display font with ★ suffix
- Set name, card number, year
- Shiny color displayed as a color swatch + label
- Flagship / Reprint badges if applicable
- Card notes/lore paragraph

**Price Table**
- Full grade ladder: Ungraded through PSA 10
- Each row: grade | estimated price | source link to PriceCharting
- Data pulled from PriceCharting API (`/api/product?id=...&t=TOKEN`) if API token is configured, else shows static PriceCharting link with "View live prices →"
- Prices displayed in dollars, formatted with commas

**Sales History**
- Embedded link to eBay completed listings (use `ebayCompletedUrl()` from data file) — opens in new tab
- If you integrate eBay's Finding API (free, no auth for basic completed search): display last 5–10 sales as a table: date | grade | price | source
- If no API: show a prominent "View Recent Sales on eBay →" button styled in gold

**PSA Pop Report**
- Link to PSA pop report for this card (use `psaPopUrl` from data file)
- If integrating PSA's unofficial pop data or a scraper: display a mini table showing pop counts by grade (1–10)
- If not integrating: show "View PSA Population Report →" button

**Quick links bar**
- PriceCharting, TCGPlayer, eBay, PSA Pop — all as styled gold buttons

### 4. Population Report Overview
- A full page showing estimated PSA pop data across all Gold Stars
- Sortable table: Card | Set | PSA 10 Pop | PSA 9 Pop | Total Graded | PSA 10 % of total
- Source: PSA Pop Report links per card (see `psaPopUrl` in data)
- Note: PSA does not have a public API — data must be either manually entered, scraped, or linked out

### 5. History Page
- Full editorial page on the history of Gold Stars
- Sections:
  1. The EX Era (2003–2007) — context for why these sets were printed in smaller quantities
  2. Introduction of Gold Stars (Team Rocket Returns, 2004) — the first three starters
  3. Set-by-set breakdown: each set's Gold Stars, what made them notable
  4. The POP Series anomaly — why Umbreon and Espeon are so rare
  5. Legacy — how Gold Stars influenced alt arts, secret rares, and modern chase cards
  6. Market history — how prices evolved from 2017 to present
- Use a vertical timeline component with gold accent lines

---

## API Integration

### PriceCharting (paid, optional)
```js
// Endpoint: GET https://www.pricecharting.com/api/product
// Params: t=YOUR_TOKEN, id=PRODUCT_ID
// Returns: grade prices in pennies (divide by 100)
// No historical data available — current prices only
```
- Add a settings panel where user can enter their PriceCharting API token
- Store token in localStorage
- If token present: fetch live prices on card detail pages
- If not: show PriceCharting link as fallback

### eBay Completed Sales (free)
```js
// eBay Finding API — findCompletedItems
// App ID required (free at developer.ebay.com)
// Filter by keywords: "{card name} gold star pokemon"
// Returns: sold listings with price, date, condition
```
- Register for a free eBay Developer App ID
- Use `findCompletedItems` endpoint
- Display last 10 sales per card on the detail page

### PSA Pop Report (no public API)
- Hard-code known pop data for high-profile cards (Umbreon, Espeon, Rayquaza, Charizard)
- For all others: link out to `psaPopUrl`
- Optionally scrape PSA pop pages server-side (Next.js API route) and cache

---

## Tech Stack (suggested)
- **Next.js 14** (App Router) for routing + server-side data fetching
- **Tailwind CSS** for styling
- **shadcn/ui** components for tables, badges, tooltips
- **Recharts** for any price history sparklines
- **Vercel** for deployment (free tier)

---

## File Structure
```
/app
  /page.tsx              — Home/dashboard
  /cards/page.tsx        — Card index (all sets)
  /cards/[id]/page.tsx   — Card detail
  /history/page.tsx      — History editorial
  /population/page.tsx   — PSA pop overview
/lib
  goldstar-data.js       — All card data (provided)
  pricecharting.ts       — PriceCharting API client
  ebay.ts                — eBay Finding API client
/components
  GoldStarHeader.tsx
  CardRow.tsx
  CardDetail.tsx
  PriceTable.tsx
  SalesHistory.tsx
  PopReport.tsx
  Timeline.tsx
```

---

## Name Ideas
See `NAME_IDEAS` section below for site name options.

---

## Key UX Details
- Gold star (★) favicon
- Dark mode only — no light mode toggle
- Prices update on page load if API token present
- All external links open in new tab
- Mobile-responsive: card index becomes scrollable table on small screens
- "Last updated" timestamp per card price
- Reprint cards visually distinguished (slightly dimmer, with "Reprint of [set]" label)
- Flagship cards get a subtle gold glow border treatment


---

## Name Ideas

### Tier 1 — Clean & Authoritative
- **StarVault** — vault implies rarity, security, value
- **GoldStar.gg** — direct, memorable, gamer-adjacent
- **StarLedger** — ledger = tracking, finance, data
- **ConditionRare** — "condition rare" is actual collector terminology for Gold Stars; smart double meaning
- **TheStarRegistry** — official-sounding, like a grading authority

### Tier 2 — Collector/Hobby Culture
- **PullRate.gg** — references the ~1/72 pack pull rate; sounds technical
- **ShinyVault** — references that Gold Stars are all shiny Pokémon
- **StarGrade** — combines the star motif with grading culture
- **HolonTracker** — Holon is the lore region for EX Delta Species; niche but beloved by the community
- **FrameBreaker** — references the frame-breaking artwork style of Gold Stars

### Tier 3 — Bold / Distinctive
- **★.market** — if you can get the domain, extremely memorable
- **GoldNine** — PSA 9 is the threshold most collectors target; "Gold Nine" has nice ring
- **OnePerBox** — references the ~1 per 2 booster boxes pull rate; instantly understood by collectors
- **SecretRare** — broad but captures the era and the feel
- **ZeroFill** — collector slang for a grade where pop is literally 0; very niche, very cool

### Recommendation
**ConditionRare** or **StarVault** — both are clean, domain-friendly, and communicate the site's purpose without being too literal. `conditionrare.com` would be a strong brand.

---

## Selected Name: Gold Star Market

**goldstar.market** is the target domain — the `.market` TLD is a perfect fit given the price tracking and sales focus, and reads as intentional rather than a fallback. If unavailable, **goldstarmarket.com** is the clean backup.

The wordmark should be: `★ Gold Star Market` — the star glyph before the name, set in a display serif (Playfair Display or similar), with "Market" optionally in a slightly lighter weight than "Gold Star" to create hierarchy.
