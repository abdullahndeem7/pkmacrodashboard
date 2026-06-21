"use client";

import { useActionState, useEffect, useRef } from "react";
import { logTrade } from "@/app/portfolio/actions";

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

export default function TradeForm() {
  const [state, action, pending] = useActionState(logTrade, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (state && "success" in state) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="grid grid-cols-2" style={{ gap: 12 }}>
        <div>
          <label htmlFor="t-ticker" style={labelStyle}>Ticker</label>
          <input
            id="t-ticker"
            name="ticker"
            type="text"
            required
            placeholder="e.g. ENGRO"
            style={inputStyle}
            onChange={(e) => (e.target.value = e.target.value.toUpperCase())}
          />
        </div>
        <div>
          <label htmlFor="t-side" style={labelStyle}>Side</label>
          <select id="t-side" name="side" required defaultValue="" style={inputStyle}>
            <option value="" disabled>Select</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ gap: 12 }}>
        <div>
          <label htmlFor="t-shares" style={labelStyle}>Shares</label>
          <input id="t-shares" name="shares" type="number" step="any" required min="0.000001" style={inputStyle} />
        </div>
        <div>
          <label htmlFor="t-price" style={labelStyle}>Price (PKR)</label>
          <input id="t-price" name="price" type="number" step="any" required min="0.000001" style={inputStyle} />
        </div>
      </div>

      <div>
        <label htmlFor="t-date" style={labelStyle}>Trade Date</label>
        <input id="t-date" name="traded_on" type="date" required defaultValue={today} style={inputStyle} />
      </div>

      <div>
        <label htmlFor="t-notes" style={labelStyle}>Notes (optional)</label>
        <input id="t-notes" name="notes" type="text" style={inputStyle} />
      </div>

      {state && "error" in state && (
        <p style={{ fontSize: 13, color: "var(--accent-red)", margin: 0 }}>{state.error}</p>
      )}
      {state && "success" in state && (
        <p style={{ fontSize: 13, color: "var(--accent-green)", margin: 0 }}>Trade logged.</p>
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
        {pending ? "Saving…" : "Log trade"}
      </button>
    </form>
  );
}
