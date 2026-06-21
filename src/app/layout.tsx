import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Pak Macro — Pakistan's economy, tracked daily",
  description:
    "Live tracking of Pakistan's policy rate, inflation, FX reserves, KSE-100, and the macro indicators that move them.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plexMono.variable} antialiased`}
      style={{ height: "100%" }}
    >
      <body style={{ height: "100%", background: "var(--bg-base)", color: "var(--text-primary)" }}>
        <div style={{ display: "flex", height: "100dvh", overflow: "hidden" }}>
          {/* Persistent left sidebar — hidden on mobile, shown md+ */}
          <Sidebar />

          {/* Right column: topbar + scrollable content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              minWidth: 0,
            }}
          >
            <Topbar />
            <main
              className="pb-16 md:pb-0"
              style={{ flex: 1, overflowY: "auto" }}
            >
              {children}
            </main>
          </div>
        </div>

        {/* Mobile bottom nav — shown below md */}
        <MobileBottomNav />
      </body>
    </html>
  );
}
