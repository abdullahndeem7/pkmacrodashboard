-- holdings: core position data
CREATE TABLE IF NOT EXISTS holdings (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker       text NOT NULL UNIQUE,
  company_name text NOT NULL,
  shares       numeric NOT NULL,
  avg_cost     numeric NOT NULL,
  sector       text,
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'holdings' AND policyname = 'admin_all_holdings'
  ) THEN
    CREATE POLICY admin_all_holdings ON holdings
      USING (auth.uid() IN (SELECT user_id FROM admin_users))
      WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));
  END IF;
END $$;

-- trades: immutable trade log
CREATE TABLE IF NOT EXISTS trades (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker     text NOT NULL,
  side       text NOT NULL CHECK (side IN ('buy', 'sell')),
  shares     numeric NOT NULL,
  price      numeric NOT NULL,
  traded_on  date NOT NULL,
  notes      text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'trades' AND policyname = 'admin_all_trades'
  ) THEN
    CREATE POLICY admin_all_trades ON trades
      USING (auth.uid() IN (SELECT user_id FROM admin_users))
      WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));
  END IF;
END $$;

-- holding_prices: EOD price observations per ticker
CREATE TABLE IF NOT EXISTS holding_prices (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker      text NOT NULL,
  price       numeric NOT NULL,
  observed_on date NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ticker, observed_on)
);

ALTER TABLE holding_prices ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'holding_prices' AND policyname = 'admin_all_holding_prices'
  ) THEN
    CREATE POLICY admin_all_holding_prices ON holding_prices
      USING (auth.uid() IN (SELECT user_id FROM admin_users))
      WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));
  END IF;
END $$;
