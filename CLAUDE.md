@AGENTS.md

# Pak Macro Dashboard — project memory

## What this is
A public-facing Pakistan macroeconomic dashboard (SBP policy rate, CPI,
FX reserves, USD/PKR, KSE-100, T-bill yields, GDP growth, remittances, trade
balance). Built by Muhammad Abdullah as a portfolio/credibility piece and the
foundation for a larger "Personal Financial Analyst AI" product. Sister
project to FinShield PK (separate repo).

## Stacks
- Next.js 16 (App Router), TypeScript, Tailwind v4
- Supabase (Postgres + RLS) for metrics + time-series observations
- Deploys to Vercel
- Recharts + lucide-react already installed; IBM Plex Mono for numerals,
  Inter for UI text (next/font/google, both already wired in layout.tsx)

## Schema (see supabase/migrations/)
- `metrics`: catalogue of series (id, label, unit, category, source, decimals,
  higher_is_better)
- `metric_observations`: time series (metric_id, observed_on, value, note),
  unique on (metric_id, observed_on)
- `admin_users`: allowlist for write access via RLS
- Public read, admin-only write. Categories: monetary | fx | markets |
  external | growth

## Data layer
- `src/lib/data/metrics.ts` — `getMetricsWithHistory()` joins metrics with
  their observation history, computes latest/previous/changeAbs/changePct
- `src/lib/types/metrics.ts` — Metric, MetricObservation, MetricWithHistory
- `src/lib/supabase/{client,server}.ts` — browser + server Supabase clients
  via @supabase/ssr

## Design direction — current target (Monef-inspired redesign, in progress)
User provided a Dribbble reference ("Monef — Corporate Finance Dashboard")
as the explicit visual target. Key patterns to replicate, adapted to this
project's actual content (NOT a literal copy):

- AI Assistant lives as a CARD inside the dashboard grid (top-left), not a
  separate persistent panel — quick-action chips above a free-text input,
  matching Monef's "What can assistant help with?" pattern with chips like
  "Review top vendors" / "Forecast my balance"
- KPI row across the top: 4 cards, each with value + small colored delta pill
  vs. previous period (we already have this via MetricCard, just needs the
  Monef-style pill treatment, not text + arrow)
- One large interactive area/line chart as the visual anchor below the KPI
  row (Monef's "Sales impact" — ours is a macro trend chart, e.g. policy
  rate vs inflation over time, hoverable/scrubbable)
- Smaller side-by-side widgets below the main chart: proportional bar
  breakdowns (Monef's "Expense breakdown" -> our sector/allocation
  breakdown of portfolio; Monef's "Monthly income" -> our portfolio P&L
  over time)
- Visual language: near-black background (not pure black), glassy thin
  1px borders, generous border-radius, subtle elevation via border + slight
  bg lightness shift (NOT shadows/gradients), single accent color used
  sparingly, "last sync: N seconds ago" live timestamp detail
- KPI row must SUPPORT TOGGLING between two datasets: macro indicators
  (SBP rate, CPI, FX reserves, KSE-100) and personal portfolio metrics
  (total value, day P&L, total P&L, cash). Same card component, different
  data source, switched via a segmented control / tab pair above the row.

## Sidebar structure (confirmed)
Left sidebar = page navigation only (Dashboard, Macro, Markets, Portfolio,
AI Assistant page if it grows beyond the card, Settings/Admin). The AI
Assistant is BOTH a quick-access card on the Dashboard AND can have a full
dedicated page for longer conversations later — card links to full page.
Do not make AI chat a persistent second sidebar — user explicitly chose
nav-sidebar + AI-as-grid-card, not nav-sidebar + AI-sidebar.

## Portfolio feature (new, see supabase/migrations/0003_portfolio.sql)
- PRIVATE — admin-only for both READ and WRITE via RLS (different from
  metrics/metric_observations, which are public-read). This is the user's
  real personal PSX portfolio (~PKR 440K capital), not public data.
- Tables: `holdings` (ticker, shares, avg_cost, sector), `trades` (buy/sell
  log), `holding_prices` (manual daily price updates per ticker, same
  pattern as metric_observations — no live feed yet)
- /portfolio route must be wrapped in the same admin-only guard pattern as
  /admin (check session -> check admin_users membership -> render or show
  "not authorized")
- Data entry via forms (Server Actions), same pattern as the existing
  /admin metric entry form — no live PSX price feed integration yet, that's
  a future phase
- Page should show: holdings table with live-computed P&L (shares *
  (current_price - avg_cost)), sector allocation breakdown (bar widget,
  Monef "Expense breakdown" style), portfolio value over time chart if
  enough holding_prices history exists

## Markets page scope (confirmed)
Both KSE-100 (already in metrics table) AND sector indices (banking,
cement, tech, etc.) AND the user's individual holdings tickers. Sector
indices are new `metrics` rows with category='markets' — reuse the
existing metrics/metric_observations tables, don't create a new schema for
this, it's the same shape (a labeled time series).


## Conventions
- Style with inline `style={{ }}` using CSS custom properties from
  globals.css (--bg-surface, --text-secondary, etc.) rather than hardcoded
  hex in components — keeps theming centralized
- Server Components by default; only mark `"use client"` where interactivity
  is required (e.g. Sparkline)
- Real data only — when adding seed/demo values, source them via web search
  and cite in commit message or SQL comment, never fabricate macro figures

## Known constraints
- This sandbox cannot reach fonts.googleapis.com — `npm run build` here
  fails on font fetch only; this is NOT a real bug, Vercel's build servers
  can reach it fine. Don't "fix" by removing next/font.
- `.env.local` is gitignored; `.env.local.example` documents required vars
  (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, later
  ANTHROPIC_API_KEY)

## Roadmap (in order)
1. [done] Admin auth + data entry form for metrics
2. [in progress] Monef-inspired dashboard redesign + Portfolio page (see
   above) — run migration 0003_portfolio.sql first
3. AI Research Assistant — PDF upload + Claude API analysis (RAG-lite, no
   vector DB yet — start simple). Dashboard AI card already has the UI
   shell from step 2; this phase wires it to a real Claude API backend
4. Live news/web search integration into the AI Assistant
5. Scheduled scraper for SBP/PBS/PSX to auto-refresh metrics
6. Per-metric detail page with full historical chart + CSV export
7. Live PSX price feed for holdings (replaces manual holding_prices entry)

