import type { Trade } from "@/lib/types/portfolio";

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

export default function TradeHistory({ trades }: { trades: Trade[] }) {
  return (
    <div style={{ border: "1px solid var(--border-hairline)", borderRadius: 10, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--bg-surface)", textAlign: "left" }}>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Ticker</th>
            <th style={thStyle}>Side</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Shares</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Price</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Total</th>
            <th style={thStyle}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {trades.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{ ...tdStyle, color: "var(--text-tertiary)", textAlign: "center" }}
              >
                No trades logged yet.
              </td>
            </tr>
          ) : (
            trades.map((t) => (
              <tr key={t.id} style={{ borderTop: "1px solid var(--border-hairline)" }}>
                <td style={{ ...monoTd, color: "var(--text-tertiary)" }}>{t.traded_on}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{t.ticker}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: t.side === "buy" ? "var(--accent-green)" : "var(--accent-red)",
                    }}
                  >
                    {t.side.toUpperCase()}
                  </span>
                </td>
                <td style={{ ...monoTd, textAlign: "right" }}>
                  {t.shares.toLocaleString("en-PK")}
                </td>
                <td style={{ ...monoTd, textAlign: "right" }}>
                  {t.price.toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td style={{ ...monoTd, textAlign: "right" }}>
                  {(t.shares * t.price).toLocaleString("en-PK", { maximumFractionDigits: 0 })}
                </td>
                <td style={{ ...tdStyle, color: "var(--text-tertiary)" }}>{t.notes ?? "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
