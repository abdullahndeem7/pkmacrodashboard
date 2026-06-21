import type { SectorAllocation } from "@/lib/types/portfolio";

interface SectorAllocationProps {
  allocations: SectorAllocation[];
  title?: string;
}

export default function SectorAllocationCard({
  allocations,
  title = "Sector Allocation",
}: SectorAllocationProps) {
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
        {title}
      </span>

      {allocations.length === 0 ? (
        <div
          style={{
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-tertiary)",
            fontSize: 13,
          }}
        >
          No portfolio data.
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              height: 8,
              borderRadius: 999,
              overflow: "hidden",
              gap: 2,
            }}
          >
            {allocations.map((a) => (
              <div
                key={a.sector}
                style={{
                  flex: a.pct,
                  background: a.color,
                  borderRadius: 999,
                  minWidth: 2,
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {allocations.map((a) => (
              <div
                key={a.sector}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: a.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 13, color: "var(--text-primary)" }}>
                    {a.sector}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--text-primary)",
                    }}
                  >
                    {a.value.toLocaleString("en-PK", { maximumFractionDigits: 0 })}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-tertiary)", minWidth: 36, textAlign: "right" }}>
                    {a.pct.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
