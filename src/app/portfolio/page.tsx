import { getHoldingsWithPrices, getSectorAllocations, getRecentTrades } from "@/lib/data/portfolio";
import HoldingsTable from "@/components/portfolio/HoldingsTable";
import TradeHistory from "@/components/portfolio/TradeHistory";
import SectorAllocation from "@/components/dashboard/SectorAllocation";
import HoldingForm from "@/components/portfolio/HoldingForm";
import TradeForm from "@/components/portfolio/TradeForm";
import PriceUpdateForm from "@/components/portfolio/PriceUpdateForm";

const sectionHead: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "var(--text-secondary)",
  marginBottom: 10,
};

const card: React.CSSProperties = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border-hairline)",
  borderRadius: 10,
  padding: 20,
};

export default async function PortfolioPage() {
  const [holdings, sectorAllocations, trades] = await Promise.all([
    getHoldingsWithPrices(),
    getSectorAllocations(),
    getRecentTrades(20),
  ]);

  const tickers = holdings.map((h) => h.ticker);

  return (
    <div
      style={{
        padding: "20px 20px 40px",
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {/* Page heading */}
      <div>
        <h1
          style={{
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          Portfolio
        </h1>
        <p style={{ fontSize: 13, marginTop: 4, color: "var(--text-secondary)" }}>
          Personal PSX holdings — admin only. Data entry is manual until the live price
          feed is wired.
        </p>
      </div>

      {/* Holdings table + sector chart */}
      <div>
        <p style={sectionHead}>Holdings</p>
        <HoldingsTable holdings={holdings} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16 }}>
        <SectorAllocation allocations={sectorAllocations} title="Sector Allocation" />

        {/* Quick stats */}
        <div style={{ ...card, display: "flex", flexDirection: "column", gap: 8 }}>
          <span
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "var(--text-tertiary)",
            }}
          >
            Summary
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              color: "var(--text-secondary)",
              paddingBottom: 6,
              borderBottom: "1px solid var(--border-hairline)",
            }}
          >
            <span>Positions</span>
            <span
              className="font-mono-tabular"
              style={{ color: "var(--text-primary)" }}
            >
              {holdings.length}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              color: "var(--text-secondary)",
              paddingBottom: 6,
              borderBottom: "1px solid var(--border-hairline)",
            }}
          >
            <span>Priced positions</span>
            <span
              className="font-mono-tabular"
              style={{ color: "var(--text-primary)" }}
            >
              {holdings.filter((h) => h.current_price !== null).length}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            <span>Trades logged</span>
            <span
              className="font-mono-tabular"
              style={{ color: "var(--text-primary)" }}
            >
              {trades.length}
            </span>
          </div>
        </div>
      </div>

      {/* Data entry forms */}
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 16 }}>
        <div style={card}>
          <p style={{ ...sectionHead, marginBottom: 14 }}>Add / Update Holding</p>
          <HoldingForm />
        </div>

        <div style={card}>
          <p style={{ ...sectionHead, marginBottom: 14 }}>Log Trade</p>
          <TradeForm />
        </div>

        <div style={card}>
          <p style={{ ...sectionHead, marginBottom: 14 }}>Update Price</p>
          <PriceUpdateForm tickers={tickers} />
        </div>
      </div>

      {/* Trade history */}
      <div>
        <p style={sectionHead}>Trade History</p>
        <TradeHistory trades={trades} />
      </div>
    </div>
  );
}
