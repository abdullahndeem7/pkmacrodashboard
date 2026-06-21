"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateHoldingPrice } from "@/app/portfolio/actions";

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

export default function PriceUpdateForm({ tickers }: { tickers: string[] }) {
  const [state, action, pending] = useActionState(updateHoldingPrice, undefined);
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
        <label htmlFor="p-ticker" style={labelStyle}>Ticker</label>
        <select id="p-ticker" name="ticker" required defaultValue="" style={inputStyle}>
          <option value="" disabled>Select a holding</option>
          {tickers.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2" style={{ gap: 12 }}>
        <div>
          <label htmlFor="p-price" style={labelStyle}>Price (PKR)</label>
          <input id="p-price" name="price" type="number" step="any" required min="0.000001" style={inputStyle} />
        </div>
        <div>
          <label htmlFor="p-date" style={labelStyle}>Date</label>
          <input id="p-date" name="observed_on" type="date" required defaultValue={today} style={inputStyle} />
        </div>
      </div>

      {state && "error" in state && (
        <p style={{ fontSize: 13, color: "var(--accent-red)", margin: 0 }}>{state.error}</p>
      )}
      {state && "success" in state && (
        <p style={{ fontSize: 13, color: "var(--accent-green)", margin: 0 }}>Price updated.</p>
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
        {pending ? "Saving…" : "Update price"}
      </button>
    </form>
  );
}
