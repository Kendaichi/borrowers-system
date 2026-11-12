import Link from "next/link";
import AddBorrowingForm from "@/components/add-borrowing-form";
import { SCHOOL } from "@/lib/config";

// Owner: Angelo (angelogalope). Standalone "add borrowing" route so this work
// is independent of the dashboard. Milestone 2: redirect back to / on success.
export default function NewBorrowingPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="glass-strong mb-6 flex items-center justify-between rounded-2xl px-5 py-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Add Borrowing</h1>
          <p className="text-sm text-slate-600">{SCHOOL.office}</p>
        </div>
        <Link
          href="/"
          className="rounded-xl border border-white/60 bg-white/50 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-white/80"
        >
          ← Back
        </Link>
      </header>

      <AddBorrowingForm />
    </main>
  );
}
