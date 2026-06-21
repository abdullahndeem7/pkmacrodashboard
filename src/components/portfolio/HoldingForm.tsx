"use client";

import { useActionState, useEffect, useRef } from "react";
import { upsertHolding } from "@/app/portfolio/actions";

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

export default function HoldingForm() {
  const [state, action, pending] = useActionState(upsertHolding, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && "success" in state) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="grid grid-cols-2" style={{ gap: 12 }}>
        <div>
          <label htmlFor="h-ticker" style={labelStyle}>Ticker</label>
          <input id="h-ticker" name="ticker" type="text" required placeholder="e.g. ENGRO" style={inputStyle} />
        </div>
        <div>
          <label htmlFor="h-company" style={labelStyle}>Company Name</label>
          <input id="h-company" name="company_name" type="text" required style={inputStyle} />
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ gap: 12 }}>
        <div>
          <label htmlFor="h-shares" style={labelStyle}>Shares</label>
          <input id="h-shares" name="shares" type="number" step="any" required min="0.000001" style={inputStyle} />
        </div>
        <div>
          <label htmlFor="h-cost" style={labelStyle}>Avg Cost (PKR)</label>
          <input id="h-cost" name="avg_cost" type="number" step="any" required min="0.000001" style={inputStyle} />
        </div>
      </div>

      <div>
        <label htmlFor="h-sector" style={labelStyle}>Sector (optional)</label>
        <input id="h-sector" name="sector" type="text" placeholder="e.g. BANKS" style={inputStyle} />
      </div>

      <div>
        <label htmlFor="h-notes" style={labelStyle}>Notes (optional)</label>
        <input id="h-notes" name="notes" type="text" style={inputStyle} />
      </div>

      {state && "error" in state && (
        <p style={{ fontSize: 13, color: "var(--accent-red)", margin: 0 }}>{state.error}</p>
      )}
      {state && "success" in state && (
        <p style={{ fontSize: 13, color: "var(--accent-green)", margin: 0 }}>Holding saved.</p>
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
        {pending ? "Saving…" : "Save holding"}
      </button>
    </form>
  );
}
