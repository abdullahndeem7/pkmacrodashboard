"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ObservationFormState = { success: true } | { error: string } | undefined;

export async function addObservation(
  _state: ObservationFormState,
  formData: FormData
): Promise<ObservationFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in." };
  }

  const metricId = formData.get("metric_id");
  const observedOn = formData.get("observed_on");
  const valueRaw = formData.get("value");
  const note = formData.get("note");

  if (typeof metricId !== "string" || !metricId) {
    return { error: "Select a metric." };
  }
  if (typeof observedOn !== "string" || !observedOn) {
    return { error: "Pick a date." };
  }

  const value = typeof valueRaw === "string" ? Number(valueRaw) : NaN;
  if (Number.isNaN(value)) {
    return { error: "Enter a numeric value." };
  }

  const { error } = await supabase.from("metric_observations").insert({
    metric_id: metricId,
    observed_on: observedOn,
    value,
    note: typeof note === "string" && note.trim() ? note.trim() : null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
