"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/ai-assistant": "AI Assistant",
  "/macro": "Macro",
  "/markets": "Markets",
  "/settings": "Settings",
  "/portfolio": "Portfolio",
  "/login": "Sign in",
  "/admin": "Admin",
};

function useElapsed() {
  const loadTime = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setElapsed(Math.floor((Date.now() - loadTime.current) / 1000)),
      1000
    );
    return () => clearInterval(t);
  }, []);
  return elapsed < 60
    ? `${elapsed}s ago`
    : elapsed < 3600
    ? `${Math.floor(elapsed / 60)}m ago`
    : "1h+ ago";
}

export default function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";
  const syncedLabel = useElapsed();

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

      {/* Live status + sync timer */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          className="hidden sm:inline"
          style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
        >
          last synced {syncedLabel}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
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
      </div>
    </header>
  );
}
