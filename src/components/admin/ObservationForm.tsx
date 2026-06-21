"use client";

import { useActionState, useEffect, useRef } from "react";
import { addObservation } from "@/app/admin/actions";
import type { Metric } from "@/lib/types/metrics";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-surface-raised)",
  border: "1px solid var(--border-hairline)",
  borderRadius: 6,
  padding: "8px 10px",
  fontSize: 13,
  color: "var(--text-primary)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  color: "var(--text-secondary)",
  marginBottom: 5,
};

export default function ObservationForm({ metrics }: { metrics: Metric[] }) {
  const [state, action, pending] = useActionState(addObservation, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (state && "success" in state) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label htmlFor="metric_id" style={labelStyle}>Metric</label>
        <select id="metric_id" name="metric_id" required defaultValue="" style={inputStyle}>
          <option value="" disabled>
            Select a metric
          </option>
          {metrics.map((metric) => (
            <option key={metric.id} value={metric.id}>
              {metric.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="observed_on" style={labelStyle}>Observed on</label>
        <input
          id="observed_on"
          name="observed_on"
          type="date"
          required
          defaultValue={today}
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="value" style={labelStyle}>Value</label>
        <input id="value" name="value" type="number" step="any" required style={inputStyle} />
      </div>

      <div>
        <label htmlFor="note" style={labelStyle}>Note (optional)</label>
        <input id="note" name="note" type="text" style={inputStyle} />
      </div>

      {state && "error" in state && (
        <p style={{ fontSize: 13, color: "var(--accent-red)" }}>{state.error}</p>
      )}
      {state && "success" in state && (
        <p style={{ fontSize: 13, color: "var(--accent-green)" }}>Observation saved.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          background: "var(--accent)",
          color: "#1a1a1c",
          border: "none",
          borderRadius: 6,
          padding: "9px 0",
          fontSize: 13,
          fontWeight: 600,
          cursor: pending ? "default" : "pointer",
          opacity: pending ? 0.7 : 1,
        }}
      >
        {pending ? "Saving…" : "Add observation"}
      </button>
    </form>
  );
}
