import { getMetricsWithHistory } from "@/lib/data/metrics";
import {
  getPortfolioSummary,
  getSectorAllocations,
  getRecentTrades,
  buildMacroChartData,
} from "@/lib/data/portfolio";
import AIAssistantCard from "@/components/dashboard/AIAssistantCard";
import KPIRow from "@/components/dashboard/KPIRow";
import MacroChart from "@/components/dashboard/MacroChart";
import SectorAllocation from "@/components/dashboard/SectorAllocation";
import RecentActivity from "@/components/dashboard/RecentActivity";
import type { MetricObservation } from "@/lib/types/metrics";

export default async function Home() {
  const [metrics, portfolioSummary, sectorAllocations, recentTrades] =
    await Promise.all([
      getMetricsWithHistory(),
      getPortfolioSummary(),
      getSectorAllocations(),
      getRecentTrades(5),
    ]);

  const chartData = buildMacroChartData(metrics);

  // Collect recent observations (latest per metric, sorted by date desc, capped at 8)
  const recentObservations: MetricObservation[] = metrics
    .filter((m) => m.latest !== null)
    .map((m) => m.latest!)
    .sort((a, b) => b.observed_on.localeCompare(a.observed_on))
    .slice(0, 8);

  return (
    <div
      style={{
        padding: "20px 20px 40px",
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Top row: AI card + KPI section */}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16, alignItems: "start" }}>
        <AIAssistantCard />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <KPIRow macroMetrics={metrics} portfolioSummary={portfolioSummary} />
        </div>
      </div>

      {/* Macro trend chart */}
      <MacroChart data={chartData} />

      {/* Bottom row: sector allocation + recent activity */}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16, alignItems: "start" }}>
        <SectorAllocation allocations={sectorAllocations} />
        <RecentActivity
          trades={recentTrades}
          observations={recentObservations}
          metrics={metrics}
        />
      </div>
    </div>
  );
}
