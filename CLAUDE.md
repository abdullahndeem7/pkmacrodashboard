@AGENTS.md

# Pak Macro Dashboard — project memory

## What this is
A public-facing Pakistan macroeconomic dashboard (SBP policy rate, CPI,
FX reserves, USD/PKR, KSE-100, T-bill yields, GDP growth, remittances, trade
balance). Built by Muhammad Abdullah as a portfolio/credibility piece and the
foundation for a larger "Personal Financial Analyst AI" product. Sister
project to FinShield PK (separate repo).

## Stack
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

## Design direction (current, may be mid-upgrade)
Moving from a harsh dark-terminal look toward a "Claude Console" identity:
- Warm dark neutrals (#1A1A1C background, #222226 surface, #2D2D32 border) —
  NOT pure black
- Single accent color #D97757 (warm coral) — used sparingly, doesn't compete
  with red/green trend semantics on metric cards
- Persistent left sidebar nav (Dashboard / AI Assistant / Macro / Markets /
  Settings) + topbar with live/last-updated indicator
- Metric cards: left accent bar colored by category, sparkline, trend arrow
  colored semantically (green/red based on `higher_is_better`, not just up/down)
- User's established UI preference (from other projects): dark background,
  pill/badge tags, accordion rows, clean card-list layouts

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
1. [in progress] Redesign UI to Claude Console-grade polish
2. Admin auth + data entry form (replace manual SQL inserts)
3. AI Research Assistant — PDF upload + Claude API analysis (RAG-lite, no
   vector DB yet — start simple)
4. Live news/web search integration into the AI Assistant
5. Scheduled scraper for SBP/PBS/PSX to auto-refresh metrics
6. Per-metric detail page with full historical chart + CSV export

