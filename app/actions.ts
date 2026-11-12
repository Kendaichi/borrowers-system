"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ActionResult } from "@/lib/types";

// Milestone 1: typed stubs so the UI can be wired up now. Real persistence
// (insert / update + validation + revalidatePath) lands in Milestone 2 (Dev 1).
// shortcut: stubs only; replace the bodies with Supabase writes in Milestone 2.
const NOT_IMPLEMENTED: ActionResult = {
  ok: false,
  error: "Not implemented yet (Milestone 2).",
};

export async function addBorrowing(_input: {
  borrower_name: string;
  item: string;
  date_borrowed: string;
}): Promise<ActionResult> {
  return NOT_IMPLEMENTED;
}

export async function markReturned(_id: string): Promise<ActionResult> {
  return NOT_IMPLEMENTED;
}

export async function markUnreturned(_id: string): Promise<ActionResult> {
  return NOT_IMPLEMENTED;
}

// Real now — the auth loop needs it.
export async function signOut(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
