import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/admin/actions";
import ObservationForm from "@/components/admin/ObservationForm";
import type { Metric } from "@/lib/types/metrics";

interface RecentObservationRow {
  id: string;
  observed_on: string;
  value: number;
  note: string | null;
  metric_id: string;
  metrics: { label: string } | null;
}

const thStyle: React.CSSProperties = {
  padding: "9px 14px",
  fontSize: 11,
  color: "var(--text-tertiary)",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.03em",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 14px",
  color: "var(--text-primary)",
  fontSize: 13,
};

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: metrics } = await supabase
    .from("metrics")
    .select("*")
    .order("label", { ascending: true });

  const { data: recent } = await supabase
    .from("metric_observations")
    .select("id, observed_on, value, note, metric_id, metrics(label)")
    .order("observed_on", { ascending: false })
    .limit(10);

  const recentRows = (recent ?? []) as unknown as RecentObservationRow[];

  return (
    <div
      style={{
        padding: "24px 24px 32px",
        maxWidth: 720,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 17, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Add an observation
          </h1>
          <p style={{ fontSize: 13, marginTop: 5, color: "var(--text-secondary)" }}>
            Writes go through your authenticated session and are enforced by row-level security.
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            style={{
              fontSize: 12,
              color: "var(--text-tertiary)",
              background: "none",
              border: "1px solid var(--border-hairline)",
              borderRadius: 6,
              padding: "6px 10px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Log out
          </button>
        </form>
      </div>

      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-hairline)",
          borderRadius: 10,
          padding: 20,
        }}
      >
        <ObservationForm metrics={(metrics as Metric[]) ?? []} />
      </div>

      <div>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>
          Recent observations
        </h2>
        <div style={{ border: "1px solid var(--border-hairline)", borderRadius: 10, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-surface)", textAlign: "left" }}>
                <th style={thStyle}>Metric</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Value</th>
                <th style={thStyle}>Note</th>
              </tr>
            </thead>
            <tbody>
              {recentRows.map((row) => (
                <tr key={row.id} style={{ borderTop: "1px solid var(--border-hairline)" }}>
                  <td style={tdStyle}>{row.metrics?.label ?? row.metric_id}</td>
                  <td style={{ ...tdStyle, fontFamily: "var(--font-mono)" }}>{row.observed_on}</td>
                  <td style={{ ...tdStyle, fontFamily: "var(--font-mono)" }}>{row.value}</td>
                  <td style={{ ...tdStyle, color: "var(--text-tertiary)" }}>{row.note ?? "—"}</td>
                </tr>
              ))}
              {recentRows.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ ...tdStyle, color: "var(--text-tertiary)", textAlign: "center" }}>
                    No observations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
