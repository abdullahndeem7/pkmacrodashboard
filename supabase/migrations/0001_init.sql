-- PK Macro Dashboard — initial schema
-- Run this in Supabase SQL Editor (Project -> SQL Editor -> New query)

-- Metric definitions: the catalogue of every series we track
create table if not exists metrics (
  id text primary key,              -- e.g. 'sbp_policy_rate'
  label text not null,              -- e.g. 'SBP Policy Rate'
  unit text not null,               -- e.g. '%', 'USD bn', 'PKR', 'Index pts'
  category text not null,           -- 'monetary' | 'fx' | 'markets' | 'external' | 'growth'
  source text,                      -- e.g. 'SBP', 'PSX', 'PBS'
  source_url text,
  decimals smallint not null default 2,
  higher_is_better boolean,         -- null = neutral (no good/bad framing), true/false otherwise
  created_at timestamptz not null default now()
);

-- Time series: one row per metric per observation date
create table if not exists metric_observations (
  id uuid primary key default gen_random_uuid(),
  metric_id text not null references metrics(id) on delete cascade,
  observed_on date not null,        -- the date this value is FOR (not entry date)
  value numeric not null,
  note text,                        -- optional context, e.g. "MPC held rate"
  created_at timestamptz not null default now(),
  unique (metric_id, observed_on)
);

create index if not exists idx_metric_observations_metric_date
  on metric_observations (metric_id, observed_on desc);

-- Simple admin allowlist (we'll use this later for the entry form)
create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table metrics enable row level security;
alter table metric_observations enable row level security;
alter table admin_users enable row level security;

-- Public read access — this is a public dashboard
create policy "Public can read metrics"
  on metrics for select
  using (true);

create policy "Public can read observations"
  on metric_observations for select
  using (true);

-- Only admins can write (checked via admin_users table)
create policy "Admins can insert metrics"
  on metrics for insert
  with check (auth.uid() in (select user_id from admin_users));

create policy "Admins can update metrics"
  on metrics for update
  using (auth.uid() in (select user_id from admin_users));

create policy "Admins can insert observations"
  on metric_observations for insert
  with check (auth.uid() in (select user_id from admin_users));

create policy "Admins can update observations"
  on metric_observations for update
  using (auth.uid() in (select user_id from admin_users));

create policy "Admins can delete observations"
  on metric_observations for delete
  using (auth.uid() in (select user_id from admin_users));

-- No public policy on admin_users — only readable via service role
