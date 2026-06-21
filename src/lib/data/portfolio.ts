import { createClient } from "@/lib/supabase/server";
import type { Holding, HoldingPrice, HoldingWithPrice, PortfolioSummary, SectorAllocation, Trade, MacroChartPoint } from "@/lib/types/portfolio";
import type { MetricWithHistory } from "@/lib/types/metrics";

const SECTOR_COLORS: Record<string, string> = {
  BROKERAGE: "#5b8cf5",
  BANKS: "#a78bfa",
  TECH: "#d97757",
  ENERGY: "#34d399",
  CEMENT: "#fbbf24",
  CHEMICALS: "#f97316",
};

function sectorColor(sector: string | null): string {
  if (!sector) return "#6b7280";
  return SECTOR_COLORS[sector.toUpperCase()] ?? "#6b7280";
}

export async function getHoldingsWithPrices(): Promise<HoldingWithPrice[]> {
  const supabase = await createClient();

  const [{ data: holdingsRaw }, { data: pricesRaw }] = await Promise.all([
    supabase.from("holdings").select("*"),
    supabase.from("holding_prices").select("*").order("observed_on", { ascending: false }),
  ]);

  const holdings = (holdingsRaw ?? []) as Holding[];
  const prices = (pricesRaw ?? []) as HoldingPrice[];

  const pricesByTicker = new Map<string, HoldingPrice[]>();
  for (const p of prices) {
    const list = pricesByTicker.get(p.ticker) ?? [];
    list.push(p);
    pricesByTicker.set(p.ticker, list);
  }

  const result: HoldingWithPrice[] = holdings.map((h) => {
    const tickerPrices = pricesByTicker.get(h.ticker) ?? [];
    const current_price = tickerPrices[0]?.price ?? null;
    const prev_price = tickerPrices[1]?.price ?? null;

    const market_value = current_price !== null ? h.shares * current_price : null;
    const cost_basis = h.shares * h.avg_cost;
    const unrealized_pnl = market_value !== null ? market_value - cost_basis : null;
    const unrealized_pnl_pct =
      unrealized_pnl !== null && cost_basis !== 0
        ? (unrealized_pnl / cost_basis) * 100
        : null;
    const day_pnl =
      current_price !== null && prev_price !== null
        ? h.shares * (current_price - prev_price)
        : null;

    return { ...h, current_price, prev_price, market_value, unrealized_pnl, unrealized_pnl_pct, day_pnl };
  });

  return result.sort((a, b) => {
    if (a.market_value === null && b.market_value === null) return 0;
    if (a.market_value === null) return 1;
    if (b.market_value === null) return -1;
    return b.market_value - a.market_value;
  });
}

export async function getPortfolioSummary(): Promise<PortfolioSummary | null> {
  const holdings = await getHoldingsWithPrices();
  if (holdings.length === 0) return null;

  let total_value = 0;
  let total_cost_basis = 0;
  let day_pnl_sum = 0;
  let has_day_pnl = false;

  for (const h of holdings) {
    total_cost_basis += h.shares * h.avg_cost;
    if (h.market_value !== null) total_value += h.market_value;
    if (h.day_pnl !== null) {
      day_pnl_sum += h.day_pnl;
      has_day_pnl = true;
    }
  }

  const total_unrealized_pnl = total_value - total_cost_basis;
  const total_unrealized_pnl_pct =
    total_cost_basis !== 0 ? (total_unrealized_pnl / total_cost_basis) * 100 : 0;

  return {
    total_value,
    total_cost_basis,
    total_unrealized_pnl,
    total_unrealized_pnl_pct,
    day_pnl: has_day_pnl ? day_pnl_sum : null,
    holdings_count: holdings.length,
  };
}

export async function getSectorAllocations(): Promise<SectorAllocation[]> {
  const holdings = await getHoldingsWithPrices();

  const sectorValues = new Map<string, number>();
  for (const h of holdings) {
    if (h.market_value === null) continue;
    const key = h.sector ?? "Uncategorized";
    sectorValues.set(key, (sectorValues.get(key) ?? 0) + h.market_value);
  }

  const total = Array.from(sectorValues.values()).reduce((s, v) => s + v, 0);

  return Array.from(sectorValues.entries())
    .map(([sector, value]) => ({
      sector,
      value,
      pct: total > 0 ? (value / total) * 100 : 0,
      color: sectorColor(sector),
    }))
    .sort((a, b) => b.value - a.value);
}

export async function getRecentTrades(limit = 10): Promise<Trade[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("trades")
    .select("*")
    .order("traded_on", { ascending: false })
    .limit(limit);
  return (data ?? []) as Trade[];
}

export function buildMacroChartData(metrics: MetricWithHistory[]): MacroChartPoint[] {
  const policyRate = metrics.find((m) => m.id === "sbp_policy_rate");
  const cpi = metrics.find((m) => m.id === "cpi_inflation");

  const dateMap = new Map<string, MacroChartPoint>();

  for (const obs of policyRate?.history ?? []) {
    const pt = dateMap.get(obs.observed_on) ?? { date: obs.observed_on };
    pt.policy_rate = obs.value;
    dateMap.set(obs.observed_on, pt);
  }

  for (const obs of cpi?.history ?? []) {
    const pt = dateMap.get(obs.observed_on) ?? { date: obs.observed_on };
    pt.cpi = obs.value;
    dateMap.set(obs.observed_on, pt);
  }

  return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}
