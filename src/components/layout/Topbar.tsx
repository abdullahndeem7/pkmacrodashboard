"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/ai-assistant": "AI Assistant",
  "/macro": "Macro",
  "/markets": "Markets",
  "/settings": "Settings",
  "/login": "Sign in",
  "/admin": "Admin",
};

export default function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header
      style={{
        height: "var(--topbar-height)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderBottom: "1px solid var(--border-hairline)",
        background: "var(--bg-base)",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Pak Macro</span>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)", userSelect: "none" }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
          {title}
        </span>
      </div>

      {/* Live status */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--accent-green)",
            boxShadow: "0 0 0 2px var(--accent-green-dim)",
          }}
        />
        <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Live</span>
      </div>
    </header>
  );
}
