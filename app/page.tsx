import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { signOut } from "@/app/actions";
import { SCHOOL } from "@/lib/config";
import type { Borrowing } from "@/lib/types";
import { MOCK_BORROWINGS } from "@/lib/mock";
import StatsStrip from "@/components/stats-strip";
import BorrowingsTable from "@/components/borrowings-table";
import BorrowingToast from "@/components/borrowing-toast";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ borrowed?: string }> }) {
  const { borrowed } = await searchParams;
  // Preview mode shows mock rows; configured mode queries Supabase.
  let rows: Borrowing[] = MOCK_BORROWINGS;
  let email = "preview mode";

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    email = userData.user?.email ?? email;

    const { data } = await supabase
      .from("borrowings")
      .select("*")
      .order("date_borrowed", { ascending: false });
    rows = data ?? [];
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {borrowed === "1" && <BorrowingToast />}
      <header className="glass-strong mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900">{SCHOOL.name}</h1>
          <p className="text-sm text-slate-600">{SCHOOL.office}</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-500">{email}</span>
          <Link
            href="/print"
            className="rounded-xl border border-white/60 bg-white/50 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-white/80"
          >
            Print slip
          </Link>
          <form action={signOut}>
            <button className="rounded-xl border border-white/60 bg-white/50 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-white/80">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <StatsStrip rows={rows} />

      <div className="my-6 flex justify-end">
        <Link
          href="/borrowings/new"
          className="rounded-xl bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
        >
          + Add borrowing
        </Link>
      </div>

      <BorrowingsTable rows={rows} />
    </main>
  );
}
