import type { MetricWithHistory, MetricCategory } from "@/lib/types/metrics";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import Sparkline from "./Sparkline";

const CATEGORY_ACCENT: Record<MetricCategory, string> = {
  monetary: "var(--cat-monetary)",
  fx: "var(--cat-fx)",
  markets: "var(--cat-markets)",
  external: "var(--cat-external)",
  growth: "var(--cat-growth)",
};

function formatValue(value: number, decimals: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MetricCard({
  metric,
  index = 0,
}: {
  metric: MetricWithHistory;
  index?: number;
}) {
  const {
    label,
    unit,
    decimals,
    latest,
    changeAbs,
    changePct,
    higher_is_better,
    source,
    history,
    category,
  } = metric;

  const hasMovement = changeAbs !== null && Math.abs(changeAbs) > 1e-9;
  const isUp = hasMovement && changeAbs! > 0;
  const isDown = hasMovement && changeAbs! < 0;

  let trendColor = "var(--text-secondary)";
  if (higher_is_better !== null && hasMovement) {
    const isGood = higher_is_better ? isUp : isDown;
    trendColor = isGood ? "var(--accent-green)" : "var(--accent-red)";
  }

  const accentBarColor = CATEGORY_ACCENT[category];
  const animDelay = `${(index % 8) * 40}ms`;

  return (
    <div
      className="animate-card-in metric-card"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-hairline)",
        borderRadius: 8,
        display: "flex",
        overflow: "hidden",
        animationDelay: animDelay,
      }}
    >
      {/* Left category accent bar */}
      <div
        style={{
          width: 3,
          flexShrink: 0,
          background: accentBarColor,
          opacity: 0.8,
        }}
      />

      {/* Card body */}
      <div
        style={{
          flex: 1,
          padding: "10px 12px 9px",
          display: "flex",
          flexDirection: "column",
          gap: 5,
          minWidth: 0,
        }}
      >
        {/* Label + source badge */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          <p
            style={{
              fontSize: 10.5,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "var(--text-tertiary)",
              lineHeight: 1.3,
              fontWeight: 500,
            }}
          >
            {label}
          </p>
          {source && (
            <span
              style={{
                fontSize: 9.5,
                padding: "1px 5px",
                borderRadius: 4,
                background: "var(--bg-surface-raised)",
                color: "var(--text-tertiary)",
                border: "1px solid var(--border-hairline)",
                flexShrink: 0,
                letterSpacing: "0.02em",
              }}
            >
              {source}
            </span>
          )}
        </div>

        {/* Main value */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
          <span
            className="font-mono-tabular"
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.025em",
              lineHeight: 1,
            }}
          >
            {latest ? formatValue(latest.value, decimals) : "—"}
          </span>
          <span
            style={{
              fontSize: 11.5,
              color: "var(--text-tertiary)",
              fontWeight: 400,
            }}
          >
            {unit}
          </span>
        </div>

        {/* Trend row + sparkline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {hasMovement ? (
              isUp ? (
                <TrendingUp size={11} style={{ color: trendColor, flexShrink: 0 }} />
              ) : (
                <TrendingDown size={11} style={{ color: trendColor, flexShrink: 0 }} />
              )
            ) : (
              <Minus size={11} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
            )}
            <span
              className="font-mono-tabular"
              style={{
                fontSize: 11,
                color: hasMovement ? trendColor : "var(--text-tertiary)",
              }}
            >
              {changeAbs !== null
                ? `${changeAbs > 0 ? "+" : ""}${formatValue(changeAbs, decimals)}`
                : "no prior data"}
              {changePct !== null && Math.abs(changePct) > 0.01
                ? ` (${changePct > 0 ? "+" : ""}${changePct.toFixed(1)}%)`
                : ""}
            </span>
          </div>
          {history.length > 1 && (
            <Sparkline
              data={history.map((h) => h.value)}
              color={
                trendColor === "var(--text-secondary)"
                  ? "var(--text-tertiary)"
                  : trendColor
              }
            />
          )}
        </div>

        {/* Date */}
        {latest && (
          <p
            style={{
              fontSize: 10,
              color: "var(--text-tertiary)",
              marginTop: 1,
            }}
          >
            {formatDate(latest.observed_on)}
            {latest.note ? ` · ${latest.note}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}
