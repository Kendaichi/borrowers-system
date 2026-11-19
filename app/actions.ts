"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ActionResult } from "@/lib/types";

// Sets date_returned to today when marking returned, or null to undo.
// shortcut: today is UTC (toISOString), matching the DB's current_date default;
// if the PH school needs local-day accuracy, compute the date in Asia/Manila.
async function setReturned(id: string, date: string | null): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing borrowing id." };

  if (!isSupabaseConfigured) {
    return {
      ok: false,
      error: "Preview mode: nothing was saved. Configure Supabase and sign in to save.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("borrowings")
    .update({ date_returned: date })
    .eq("id", id);

  if (error) return { ok: false, error: `Could not update borrowing: ${error.message}` };

  revalidatePath("/");
  return { ok: true };
}

export async function markReturned(id: string): Promise<ActionResult> {
  return setReturned(id, new Date().toISOString().slice(0, 10));
}

export async function markUnreturned(id: string): Promise<ActionResult> {
  return setReturned(id, null);
}

// Real now — the auth loop needs it.
export async function signOut(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
