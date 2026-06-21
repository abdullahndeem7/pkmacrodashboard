export interface Holding {
  id: string;
  ticker: string;
  company_name: string;
  shares: number;
  avg_cost: number;
  sector: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: string;
  ticker: string;
  side: "buy" | "sell";
  shares: number;
  price: number;
  traded_on: string;
  notes: string | null;
  created_at: string;
}

export interface HoldingPrice {
  id: string;
  ticker: string;
  price: number;
  observed_on: string;
  created_at: string;
}

export interface HoldingWithPrice extends Holding {
  current_price: number | null;
  prev_price: number | null;
  market_value: number | null;
  unrealized_pnl: number | null;
  unrealized_pnl_pct: number | null;
  day_pnl: number | null;
}

export interface PortfolioSummary {
  total_value: number;
  total_cost_basis: number;
  total_unrealized_pnl: number;
  total_unrealized_pnl_pct: number;
  day_pnl: number | null;
  holdings_count: number;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  pct: number;
  color: string;
}

export interface MacroChartPoint {
  date: string;
  policy_rate?: number;
  cpi?: number;
}
