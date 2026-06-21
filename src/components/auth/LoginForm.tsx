"use client";

import { useActionState } from "react";
import { login } from "@/app/login/actions";

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

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label htmlFor="email" style={labelStyle}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required style={inputStyle} />
      </div>

      <div>
        <label htmlFor="password" style={labelStyle}>Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          style={inputStyle}
        />
      </div>

      {state?.error && (
        <p style={{ fontSize: 13, color: "var(--accent-red)" }}>{state.error}</p>
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
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
