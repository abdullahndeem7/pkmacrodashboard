"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Holding } from "@/lib/types/portfolio";

export type HoldingFormState = { success: true } | { error: string } | undefined;

async function getAuthedAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isAdmin: false };

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return { supabase, user, isAdmin: !!adminRow };
}

export async function upsertHolding(
  _state: HoldingFormState,
  formData: FormData
): Promise<HoldingFormState> {
  const { supabase, user, isAdmin } = await getAuthedAdmin();
  if (!user) return { error: "You must be signed in." };
  if (!isAdmin) return { error: "Not authorized." };

  const ticker = (formData.get("ticker") as string | null)?.trim().toUpperCase();
  const company_name = (formData.get("company_name") as string | null)?.trim();
  const sharesRaw = formData.get("shares");
  const avgCostRaw = formData.get("avg_cost");
  const sector = (formData.get("sector") as string | null)?.trim() || null;
  const notes = (formData.get("notes") as string | null)?.trim() || null;

  if (!ticker) return { error: "Ticker is required." };
  if (!company_name) return { error: "Company name is required." };

  const shares = Number(sharesRaw);
  const avg_cost = Number(avgCostRaw);

  if (isNaN(shares) || shares <= 0) return { error: "Shares must be greater than 0." };
  if (isNaN(avg_cost) || avg_cost <= 0) return { error: "Avg cost must be greater than 0." };

  const { error } = await supabase.from("holdings").upsert(
    { ticker, company_name, shares, avg_cost, sector, notes, updated_at: new Date().toISOString() },
    { onConflict: "ticker" }
  );

  if (error) return { error: error.message };

  revalidatePath("/portfolio");
  return { success: true };
}

export async function logTrade(
  _state: HoldingFormState,
  formData: FormData
): Promise<HoldingFormState> {
  const { supabase, user, isAdmin } = await getAuthedAdmin();
  if (!user) return { error: "You must be signed in." };
  if (!isAdmin) return { error: "Not authorized." };

  const ticker = (formData.get("ticker") as string | null)?.trim().toUpperCase();
  const side = formData.get("side") as string | null;
  const sharesRaw = formData.get("shares");
  const priceRaw = formData.get("price");
  const traded_on = (formData.get("traded_on") as string | null)?.trim();
  const notes = (formData.get("notes") as string | null)?.trim() || null;

  if (!ticker) return { error: "Ticker is required." };
  if (side !== "buy" && side !== "sell") return { error: "Side must be buy or sell." };
  if (!traded_on) return { error: "Trade date is required." };

  const shares = Number(sharesRaw);
  const price = Number(priceRaw);

  if (isNaN(shares) || shares <= 0) return { error: "Shares must be greater than 0." };
  if (isNaN(price) || price <= 0) return { error: "Price must be greater than 0." };

  const { error: tradeError } = await supabase
    .from("trades")
    .insert({ ticker, side, shares, price, traded_on, notes });

  if (tradeError) return { error: tradeError.message };

  const { data: existingRow } = await supabase
    .from("holdings")
    .select("*")
    .eq("ticker", ticker)
    .maybeSingle();

  const existing = existingRow as Holding | null;

  if (side === "buy") {
    if (existing) {
      const new_shares = existing.shares + shares;
      const new_avg_cost = (existing.shares * existing.avg_cost + shares * price) / new_shares;
      await supabase
        .from("holdings")
        .update({ shares: new_shares, avg_cost: new_avg_cost, updated_at: new Date().toISOString() })
        .eq("ticker", ticker);
    } else {
      await supabase.from("holdings").insert({
        ticker,
        company_name: ticker,
        shares,
        avg_cost: price,
        sector: null,
        notes: null,
      });
    }
  } else {
    if (existing) {
      const new_shares = existing.shares - shares;
      if (new_shares <= 0) {
        await supabase.from("holdings").delete().eq("ticker", ticker);
      } else {
        await supabase
          .from("holdings")
          .update({ shares: new_shares, updated_at: new Date().toISOString() })
          .eq("ticker", ticker);
      }
    }
    // orphaned sell: trade is logged, no holding to update
  }

  revalidatePath("/portfolio");
  return { success: true };
}

export async function updateHoldingPrice(
  _state: HoldingFormState,
  formData: FormData
): Promise<HoldingFormState> {
  const { supabase, user, isAdmin } = await getAuthedAdmin();
  if (!user) return { error: "You must be signed in." };
  if (!isAdmin) return { error: "Not authorized." };

  const ticker = (formData.get("ticker") as string | null)?.trim().toUpperCase();
  const priceRaw = formData.get("price");
  const observed_on = (formData.get("observed_on") as string | null)?.trim();

  if (!ticker) return { error: "Ticker is required." };
  if (!observed_on) return { error: "Date is required." };

  const price = Number(priceRaw);
  if (isNaN(price) || price <= 0) return { error: "Price must be greater than 0." };

  const { error } = await supabase
    .from("holding_prices")
    .upsert({ ticker, price, observed_on }, { onConflict: "ticker,observed_on" });

  if (error) return { error: error.message };

  revalidatePath("/portfolio");
  return { success: true };
}
