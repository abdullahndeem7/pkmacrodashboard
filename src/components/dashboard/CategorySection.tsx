import type { MetricWithHistory, MetricCategory } from "@/lib/types/metrics";
import MetricCard from "./MetricCard";

const CATEGORY_LABELS: Record<MetricCategory, string> = {
  monetary: "Monetary Policy",
  fx: "Foreign Exchange",
  markets: "Markets",
  external: "External Account",
  growth: "Growth",
};

export default function CategorySection({
  category,
  metrics,
  startIndex = 0,
}: {
  category: MetricCategory;
  metrics: MetricWithHistory[];
  startIndex?: number;
}) {
  if (metrics.length === 0) return null;

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <h2
        style={{
          fontSize: 10.5,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.09em",
          color: "var(--text-tertiary)",
          padding: "0 1px",
        }}
      >
        {CATEGORY_LABELS[category]}
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 8,
        }}
      >
        {metrics.map((metric, i) => (
          <MetricCard key={metric.id} metric={metric} index={startIndex + i} />
        ))}
      </div>
    </section>
  );
}
