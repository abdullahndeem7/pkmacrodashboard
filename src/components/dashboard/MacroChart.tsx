"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { MacroChartPoint } from "@/lib/types/portfolio";

export default function MacroChart({ data }: { data: MacroChartPoint[] }) {
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
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: "var(--text-tertiary)",
          }}
        >
          Macro Trend
        </span>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          SBP Policy Rate vs CPI Inflation
        </span>
      </div>

      {data.length < 2 ? (
        <div
          style={{
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-tertiary)",
            fontSize: 13,
          }}
        >
          Not enough data points yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-hairline)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              contentStyle={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-hairline)",
                borderRadius: 6,
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--text-secondary)" }}
              itemStyle={{ color: "var(--text-primary)" }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
            <Line
              type="monotone"
              dataKey="policy_rate"
              name="Policy Rate %"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="cpi"
              name="CPI Inflation %"
              stroke="var(--cat-fx)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
