"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  BarChart2,
  Settings,
  Shield,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ai-assistant", label: "AI Assistant", icon: MessageSquare },
  { href: "/macro", label: "Macro", icon: TrendingUp },
  { href: "/markets", label: "Markets", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

const ADMIN_NAV_ITEM = { href: "/admin", label: "Admin", icon: Shield };

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col shrink-0"
      style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border-hairline)",
        height: "100%",
      }}
    >
      {/* Brand */}
      <div
        style={{
          height: "var(--topbar-height)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 16px",
          borderBottom: "1px solid var(--border-hairline)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--accent)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.015em",
            color: "var(--text-primary)",
          }}
        >
          Pak Macro
        </span>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: "10px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="sidebar-item"
              data-active={isActive ? "true" : "false"}
            >
              <Icon
                size={14}
                style={{
                  color: isActive ? "var(--accent)" : "var(--text-tertiary)",
                  flexShrink: 0,
                }}
              />
              {label}
            </Link>
          );
        })}

        {/* Admin section */}
        <div
          style={{
            margin: "8px 10px 4px",
            paddingTop: 8,
            borderTop: "1px solid var(--border-hairline)",
          }}
        >
          <Link
            href={ADMIN_NAV_ITEM.href}
            className="sidebar-item"
            data-active={pathname.startsWith(ADMIN_NAV_ITEM.href) ? "true" : "false"}
          >
            <Shield
              size={14}
              style={{
                color: pathname.startsWith(ADMIN_NAV_ITEM.href)
                  ? "var(--accent)"
                  : "var(--text-tertiary)",
                flexShrink: 0,
              }}
            />
            {ADMIN_NAV_ITEM.label}
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--border-hairline)",
          fontSize: 10,
          color: "var(--text-tertiary)",
          letterSpacing: "0.02em",
        }}
      >
        Data: SBP · PBS · PSX
      </div>
    </aside>
  );
}
