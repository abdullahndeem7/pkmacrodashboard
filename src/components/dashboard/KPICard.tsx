interface KPICardProps {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  positive?: boolean | null;
  index?: number;
}

export default function KPICard({ label, value, unit, delta, positive, index = 0 }: KPICardProps) {
  const deltaStyle: React.CSSProperties =
    positive === true
      ? { background: "var(--accent-green-dim)", color: "var(--accent-green)" }
      : positive === false
      ? { background: "var(--accent-red-dim)", color: "var(--accent-red)" }
      : { background: "var(--bg-surface-raised)", color: "var(--text-tertiary)" };

  return (
    <div
      className="animate-card-in"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-hairline)",
        borderRadius: 8,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        animationDelay: index * 60 + "ms",
      }}
    >
      <span
        style={{
          fontSize: 10.5,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "var(--text-tertiary)",
        }}
      >
        {label}
      </span>

      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 24,
            fontWeight: 600,
            color: "var(--text-primary)",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>{unit}</span>
        )}
      </div>

      {delta && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            padding: "2px 8px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 500,
            alignSelf: "flex-start",
            ...deltaStyle,
          }}
        >
          {delta}
        </span>
      )}
    </div>
  );
}
