import { getMetricsWithHistory } from "@/lib/data/metrics";
import type { MetricCategory } from "@/lib/types/metrics";
import CategorySection from "@/components/dashboard/CategorySection";

const CATEGORY_ORDER: MetricCategory[] = [
  "monetary",
  "fx",
  "markets",
  "external",
  "growth",
];

export default async function Home() {
  const metrics = await getMetricsWithHistory();
  const hasData = metrics.length > 0;

  return (
    <div
      style={{
        padding: "24px 24px 32px",
        maxWidth: 1080,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {/* Page heading */}
      <div>
        <h1
          style={{
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            lineHeight: 1.3,
          }}
        >
          Pakistan, by the numbers
        </h1>
        <p
          style={{
            fontSize: 13,
            marginTop: 5,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}
        >
          Policy rate, inflation, reserves, and the indicators that move the
          rupee — updated as official data lands.
        </p>
      </div>

      {!hasData && (
        <div
          style={{
            borderRadius: 8,
            padding: "18px 20px",
            fontSize: 13,
            background: "var(--bg-surface)",
            border: "1px solid var(--border-hairline)",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}
        >
          No data yet. Once your Supabase project is connected and seeded,
          metrics will appear here automatically.
        </div>
      )}

      {CATEGORY_ORDER.map((category) => {
        const catMetrics = metrics.filter((m) => m.category === category);
        const startIndex = CATEGORY_ORDER.slice(
          0,
          CATEGORY_ORDER.indexOf(category)
        ).reduce(
          (sum, c) => sum + metrics.filter((m) => m.category === c).length,
          0
        );
        return (
          <CategorySection
            key={category}
            category={category}
            metrics={catMetrics}
            startIndex={startIndex}
          />
        );
      })}

      <footer
        style={{
          fontSize: 11,
          color: "var(--text-tertiary)",
          paddingTop: 8,
          borderTop: "1px solid var(--border-hairline)",
        }}
      >
        Data sourced from SBP, PBS, and PSX. Not investment advice.
      </footer>
    </div>
  );
}
