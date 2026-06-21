"use client";

import { useState } from "react";
import KPICard from "./KPICard";
import type { MetricWithHistory } from "@/lib/types/metrics";
import type { PortfolioSummary } from "@/lib/types/portfolio";

interface KPIRowProps {
  macroMetrics: MetricWithHistory[];
  portfolioSummary: PortfolioSummary | null;
}

const MACRO_IDS = ["sbp_policy_rate", "cpi_inflation", "fx_reserves", "kse100"];

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 14px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: active ? 500 : 400,
        background: active ? "var(--bg-surface-raised)" : "transparent",
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
        border: "none",
        cursor: "pointer",
        transition: "background 0.12s, color 0.12s",
      }}
    >
      {label}
    </button>
  );
}

export default function KPIRow({ macroMetrics, portfolioSummary }: KPIRowProps) {
  const [activeTab, setActiveTab] = useState<"macro" | "portfolio">("macro");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div
        style={{
          display: "flex",
          gap: 0,
          background: "var(--bg-surface)",
          border: "1px solid var(--border-hairline)",
          borderRadius: 8,
          padding: 3,
          width: "fit-content",
          marginBottom: 12,
        }}
      >
        <TabButton label="Macro" active={activeTab === "macro"} onClick={() => setActiveTab("macro")} />
        <TabButton label="Portfolio" active={activeTab === "portfolio"} onClick={() => setActiveTab("portfolio")} />
      </div>

      {activeTab === "macro" && (
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 8 }}>
          {MACRO_IDS.map((id, i) => {
            const metric = macroMetrics.find((m) => m.id === id);
            if (!metric) return null;

            const val = metric.latest?.value;
            const value =
              val !== undefined
                ? val.toLocaleString("en-US", {
                    minimumFractionDigits: metric.decimals,
                    maximumFractionDigits: metric.decimals,
                  })
                : "—";

            let delta: string | undefined;
            if (metric.changeAbs !== null) {
              const sign = metric.changeAbs > 0 ? "+" : "";
              delta = `${sign}${metric.changeAbs.toFixed(metric.decimals)} ${metric.unit}`;
            } else {
              delta = "no prior data";
            }

            let positive: boolean | null = null;
            if (metric.higher_is_better !== null && metric.changeAbs !== null) {
              const isDown = metric.changeAbs < 0;
              positive = metric.higher_is_better ? !isDown : isDown;
            }

            return (
              <KPICard
                key={id}
                label={metric.label}
                value={value}
                unit={metric.unit}
                delta={delta}
                positive={positive}
                index={i}
              />
            );
          })}
        </div>
      )}

      {activeTab === "portfolio" && (
        <>
          {portfolioSummary === null ? (
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-hairline)",
                borderRadius: 8,
                padding: "20px 16px",
                textAlign: "center",
                color: "var(--text-tertiary)",
                fontSize: 13,
              }}
            >
              Portfolio data is private — sign in as admin to view.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 8 }}>
              <KPICard
                label="Portfolio Value"
                value={portfolioSummary.total_value.toLocaleString("en-PK", { maximumFractionDigits: 0 })}
                unit="PKR"
                delta={
                  portfolioSummary.day_pnl !== null
                    ? `${portfolioSummary.day_pnl >= 0 ? "+" : ""}${portfolioSummary.day_pnl.toLocaleString("en-PK", { maximumFractionDigits: 0 })} today`
                    : undefined
                }
                positive={portfolioSummary.day_pnl !== null ? portfolioSummary.day_pnl > 0 : null}
                index={0}
              />
              <KPICard
                label="Day P&L"
                value={
                  portfolioSummary.day_pnl !== null
                    ? portfolioSummary.day_pnl.toLocaleString("en-PK", { maximumFractionDigits: 0 })
                    : "—"
                }
                unit="PKR"
                index={1}
              />
              <KPICard
                label="Total P&L"
                value={portfolioSummary.total_unrealized_pnl.toLocaleString("en-PK", { maximumFractionDigits: 0 })}
                unit="PKR"
                delta={`${portfolioSummary.total_unrealized_pnl_pct.toFixed(1)}%`}
                positive={portfolioSummary.total_unrealized_pnl >= 0}
                index={2}
              />
              <KPICard
                label="Holdings"
                value={String(portfolioSummary.holdings_count)}
                unit="positions"
                index={3}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
