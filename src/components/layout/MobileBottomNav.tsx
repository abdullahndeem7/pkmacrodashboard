"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  BarChart2,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ai-assistant", label: "AI", icon: MessageSquare },
  { href: "/macro", label: "Macro", icon: TrendingUp },
  { href: "/markets", label: "Markets", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-hairline)",
        zIndex: 50,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "9px 0",
              gap: 3,
              textDecoration: "none",
              color: isActive ? "var(--accent)" : "var(--text-tertiary)",
              transition: "color 0.12s ease",
            }}
          >
            <Icon size={17} />
            <span style={{ fontSize: 9.5, letterSpacing: "0.01em" }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
