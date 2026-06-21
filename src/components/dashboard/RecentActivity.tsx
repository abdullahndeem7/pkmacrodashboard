import { ArrowUpCircle, ArrowDownCircle, Activity } from "lucide-react";
import type { Trade } from "@/lib/types/portfolio";
import type { MetricObservation, MetricWithHistory } from "@/lib/types/metrics";

interface RecentActivityProps {
  trades: Trade[];
  observations: MetricObservation[];
  metrics: MetricWithHistory[];
}

type ActivityItem =
  | { kind: "trade"; date: string; trade: Trade }
  | { kind: "obs"; date: string; obs: MetricObservation; label: string; unit: string };

export default function RecentActivity({ trades, observations, metrics }: RecentActivityProps) {
  const metricsMap = new Map(metrics.map((m) => [m.id, m]));

  const items: ActivityItem[] = [
    ...trades.map((t): ActivityItem => ({ kind: "trade", date: t.traded_on, trade: t })),
    ...observations.map((o): ActivityItem => ({
      kind: "obs",
      date: o.observed_on,
      obs: o,
      label: metricsMap.get(o.metric_id)?.label ?? o.metric_id,
      unit: metricsMap.get(o.metric_id)?.unit ?? "",
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-hairline)",
        borderRadius: 10,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <span
        style={{
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "var(--text-tertiary)",
        }}
      >
        Recent Activity
      </span>

      {items.length === 0 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-tertiary)",
            fontSize: 13,
            padding: "12px 0",
          }}
        >
          No recent activity.
        </div>
      ) : (
        <div>
          {items.map((item, i) => {
            const isLast = i === items.length - 1;

            if (item.kind === "trade") {
              const { trade } = item;
              const isBuy = trade.side === "buy";
              return (
                <div
                  key={trade.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 0",
                    borderBottom: isLast ? "none" : "1px solid var(--border-hairline)",
                  }}
                >
                  {isBuy ? (
                    <ArrowUpCircle size={16} color="var(--accent-green)" style={{ flexShrink: 0 }} />
                  ) : (
                    <ArrowDownCircle size={16} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                      {trade.ticker} {trade.side.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)", marginLeft: 8 }}>
                      {trade.shares.toLocaleString()} @ PKR {trade.price.toLocaleString()}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--text-tertiary)",
                      flexShrink: 0,
                    }}
                  >
                    {trade.traded_on}
                  </span>
                </div>
              );
            }

            const { obs, label, unit } = item;
            return (
              <div
                key={obs.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 0",
                  borderBottom: isLast ? "none" : "1px solid var(--border-hairline)",
                }}
              >
                <Activity size={16} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", marginLeft: 8 }}>
                    {obs.value} {unit}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--text-tertiary)",
                    flexShrink: 0,
                  }}
                >
                  {obs.observed_on}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
