import type { HoldingWithPrice } from "@/lib/types/portfolio";

const thStyle: React.CSSProperties = {
  padding: "9px 14px",
  fontSize: 11,
  color: "var(--text-tertiary)",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.03em",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 14px",
  color: "var(--text-primary)",
  fontSize: 13,
};

const monoTd: React.CSSProperties = {
  ...tdStyle,
  fontFamily: "var(--font-mono)",
};

function fmt(n: number | null, decimals = 2) {
  if (n === null) return "—";
  return n.toLocaleString("en-PK", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function HoldingsTable({ holdings }: { holdings: HoldingWithPrice[] }) {
  return (
    <div style={{ border: "1px solid var(--border-hairline)", borderRadius: 10, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--bg-surface)", textAlign: "left" }}>
            <th style={thStyle}>Ticker</th>
            <th style={thStyle}>Company</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Shares</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Avg Cost</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Current Price</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Market Value</th>
            <th style={{ ...thStyle, textAlign: "right" }}>P&L</th>
            <th style={{ ...thStyle, textAlign: "right" }}>P&L %</th>
            <th style={thStyle}>Sector</th>
          </tr>
        </thead>
        <tbody>
          {holdings.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                style={{ ...tdStyle, color: "var(--text-tertiary)", textAlign: "center" }}
              >
                No holdings yet.
              </td>
            </tr>
          ) : (
            holdings.map((h) => {
              const pnlColor =
                h.unrealized_pnl === null
                  ? "var(--text-tertiary)"
                  : h.unrealized_pnl >= 0
                  ? "var(--accent-green)"
                  : "var(--accent-red)";

              return (
                <tr key={h.id} style={{ borderTop: "1px solid var(--border-hairline)" }}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{h.ticker}</td>
                  <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>{h.company_name}</td>
                  <td style={{ ...monoTd, textAlign: "right" }}>{fmt(h.shares, 0)}</td>
                  <td style={{ ...monoTd, textAlign: "right" }}>{fmt(h.avg_cost)}</td>
                  <td style={{ ...monoTd, textAlign: "right" }}>
                    {h.current_price !== null ? fmt(h.current_price) : "—"}
                  </td>
                  <td style={{ ...monoTd, textAlign: "right" }}>
                    {h.market_value !== null ? fmt(h.market_value, 0) : "—"}
                  </td>
                  <td style={{ ...monoTd, textAlign: "right", color: pnlColor }}>
                    {h.unrealized_pnl !== null
                      ? `${h.unrealized_pnl >= 0 ? "+" : ""}${fmt(h.unrealized_pnl, 0)}`
                      : "—"}
                  </td>
                  <td style={{ ...monoTd, textAlign: "right", color: pnlColor }}>
                    {h.unrealized_pnl_pct !== null
                      ? `${h.unrealized_pnl_pct >= 0 ? "+" : ""}${h.unrealized_pnl_pct.toFixed(1)}%`
                      : "—"}
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>
                    {h.sector ?? "—"}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
