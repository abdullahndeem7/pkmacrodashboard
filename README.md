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
3. `supabase/migrations/0003_admin_self_check.sql` — lets a logged-in user
   confirm their own admin status (needed by `/admin`)

### 4. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  proxy.ts                # Refreshes the Supabase session on every request
  app/                    # Next.js App Router pages
    login/                 # Email + password sign-in (Server Action)
    admin/                  # Protected data entry form (layout.tsx gates access)
  components/
    dashboard/              # MetricCard, Sparkline, Header, CategorySection
    auth/                    # LoginForm
    admin/                   # ObservationForm
  lib/
    supabase/              # Browser + server Supabase clients, proxy session helper
    types/metrics.ts        # Metric, MetricObservation, MetricWithHistory
    data/metrics.ts          # getMetricsWithHistory() — joins metrics + history
supabase/
  migrations/              # SQL migrations, run manually in Supabase SQL Editor
```

## Adding new data points

Sign in at `/login` and use the form at `/admin` to add observations. The
form writes through your authenticated Supabase session, so it's subject to
the same row-level security as everything else — only accounts listed in
`admin_users` can insert.

If you ever need to bypass the UI, the raw SQL equivalent is:

```sql
insert into metric_observations (metric_id, observed_on, value, note)
values ('sbp_policy_rate', '2026-07-28', 11.5, 'Held steady — next MPC meeting');
```

## Creating your first admin user

There's no self-serve signup for admin accounts — that's intentional, since
write access to public macro data shouldn't be open registration. Admins are
granted manually:

1. **Create the auth user.** In the Supabase dashboard, go to
   **Authentication -> Users -> Add user**, and create a user with your email
   and a password (or invite by email). Alternatively, temporarily add a
   signup form using `supabase.auth.signUp()` and remove it once you've
   created your account.
2. **Find your `user_id`.** Still in **Authentication -> Users**, click your
   user and copy the UUID shown (or run
   `select id, email from auth.users;` in the SQL Editor).
3. **Grant admin access.** In the SQL Editor, run:

   ```sql
   insert into admin_users (user_id)
   values ('00000000-0000-0000-0000-000000000000'); -- replace with your user_id
   ```

4. Sign in at `/login` with that account. You should land on `/admin` and see
   the data entry form. Any other authenticated user who isn't in
   `admin_users` will see a "Not authorized" message instead — Postgres RLS
   enforces this regardless of what the UI shows.

## Roadmap

- [x] Schema + seed data with real June 2026 figures
- [x] Dashboard UI with category grouping, sparklines, trend coloring
- [x] Admin login + data entry form (replace manual SQL)
- [ ] Scheduled scraper for SBP/PBS/PSX (auto-refresh)
- [ ] AI Research Assistant (document upload + analysis via Claude API)
- [ ] Live news integration
- [ ] Historical detail page per metric (full chart, CSV export)
