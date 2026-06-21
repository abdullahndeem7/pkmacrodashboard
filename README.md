# Pak Macro Dashboard

Live tracking of Pakistan's key macroeconomic indicators: SBP policy rate, CPI
inflation, FX reserves, USD/PKR, KSE-100, T-bill yields, GDP growth,
remittances, and trade balance.

## Setup

### 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in (GitHub login works).
2. Click **New Project**, name it `pk-macro-dashboard`, pick a strong DB
   password (save it), and choose the **Singapore** region for lowest latency
   to Pakistan.
3. Wait ~2 minutes for provisioning.
4. Go to **Project Settings -> API** and copy:
   - `Project URL`
   - `anon public` key

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Paste your Project URL and anon key into `.env.local`.

### 3. Run the database migrations

In the Supabase dashboard, go to **SQL Editor -> New query**, then run, in
order:

1. `supabase/migrations/0001_init.sql` — creates the schema (metrics,
   observations, RLS policies)
2. `supabase/migrations/0002_seed.sql` — inserts real current data (June 2026)

### 4. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/                    # Next.js App Router pages
  components/dashboard/   # MetricCard, Sparkline, Header, CategorySection
  lib/
    supabase/              # Browser + server Supabase clients
    types/metrics.ts        # Metric, MetricObservation, MetricWithHistory
    data/metrics.ts          # getMetricsWithHistory() — joins metrics + history
supabase/
  migrations/              # SQL migrations, run manually in Supabase SQL Editor
```

## Adding new data points

Right now, data entry is manual via SQL insert (admin form is the next phase).
To add a new observation:

```sql
insert into metric_observations (metric_id, observed_on, value, note)
values ('sbp_policy_rate', '2026-07-28', 11.5, 'Held steady — next MPC meeting');
```

## Roadmap

- [x] Schema + seed data with real June 2026 figures
- [x] Dashboard UI with category grouping, sparklines, trend coloring
- [ ] Admin login + data entry form (replace manual SQL)
- [ ] Scheduled scraper for SBP/PBS/PSX (auto-refresh)
- [ ] AI Research Assistant (document upload + analysis via Claude API)
- [ ] Live news integration
- [ ] Historical detail page per metric (full chart, CSV export)
