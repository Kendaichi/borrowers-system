import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { MOCK_BORROWINGS } from "@/lib/mock";
import PrintView from "./print-view";

export default async function PrintPage() {
  if (!isSupabaseConfigured) {
    return <PrintView rows={MOCK_BORROWINGS} preview />;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("borrowings")
    .select("id, borrower_name, item, date_borrowed, date_returned, recorded_by, created_at, updated_at")
    // created_at breaks ties so same-day rows keep a stable order across updates.
    .order("date_borrowed", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return <p role="alert" className="p-6 text-red-700">Could not load borrowings. Please try again.</p>;
  }

  return <PrintView rows={data ?? []} />;
}
