-- Seed data — real values as of June 2026
-- Run AFTER 0001_init.sql, in the Supabase SQL Editor

insert into metrics (id, label, unit, category, source, source_url, decimals, higher_is_better) values
  ('sbp_policy_rate',   'SBP Policy Rate',        '%',        'monetary', 'SBP', 'https://www.sbp.org.pk/m_policy/index.asp', 2, null),
  ('cpi_inflation',     'CPI Inflation (YoY)',    '%',        'monetary', 'PBS', 'https://www.pbs.gov.pk', 1, false),
  ('fx_reserves',       'SBP FX Reserves',        'USD bn',   'fx',       'SBP', 'https://www.sbp.org.pk/ecodata/index2.asp', 1, true),
  ('usd_pkr',           'USD/PKR Interbank',      'PKR',      'fx',       'SBP', 'https://www.sbp.org.pk', 2, null),
  ('kse100',            'KSE-100 Index',          'pts',      'markets',  'PSX', 'https://dps.psx.com.pk', 0, true),
  ('tbill_6m',          '6-Month T-Bill Yield',   '%',        'monetary', 'SBP', 'https://www.sbp.org.pk/m_policy/index.asp', 2, null),
  ('gdp_growth',        'GDP Growth (FY, YoY)',   '%',        'growth',   'PBS', 'https://www.pbs.gov.pk', 1, true),
  ('remittances',       'Remittances (Annualized)', 'USD bn', 'external', 'SBP', 'https://www.sbp.org.pk/ecodata/index2.asp', 1, true),
  ('trade_balance',     'Trade Balance (Monthly)', 'USD bn',  'external', 'PBS', 'https://www.pbs.gov.pk', 2, true)
on conflict (id) do update set
  label = excluded.label,
  unit = excluded.unit,
  category = excluded.category,
  source = excluded.source,
  source_url = excluded.source_url,
  decimals = excluded.decimals,
  higher_is_better = excluded.higher_is_better;

-- Observations: real figures gathered June 2026
insert into metric_observations (metric_id, observed_on, value, note) values
  ('sbp_policy_rate', '2026-06-16', 11.5, 'MPC held rate unchanged, 3rd consecutive hold'),
  ('sbp_policy_rate', '2026-04-27', 11.5, '100bps hike, first hike since June 2023'),
  ('sbp_policy_rate', '2026-03-09', 10.5, 'Held unchanged amid Middle East tensions'),

  ('cpi_inflation', '2026-05-31', 11.7, 'Highest since June 2024, above 5-7% target band'),
  ('cpi_inflation', '2026-04-30', 10.9, ''),
  ('cpi_inflation', '2026-03-31', 7.3, 'Breached upper bound of target range'),

  ('fx_reserves', '2026-06-05', 17.2, 'SBP reserves; projected to reach $18bn by end of June'),

  ('usd_pkr', '2026-06-19', 279.40, 'Interbank rate, holding steady'),

  ('kse100', '2026-06-19', 182185.87, 'Intraday high; previous close 181,398.21'),

  ('gdp_growth', '2026-06-16', 3.7, 'FY26 provisional estimate, PBS; vs 3.2% in FY25'),

  ('remittances', '2026-05-31', 30.0, 'Approximate annualized run-rate, 2nd largest FX source after exports')
on conflict (metric_id, observed_on) do update set
  value = excluded.value,
  note = excluded.note;
