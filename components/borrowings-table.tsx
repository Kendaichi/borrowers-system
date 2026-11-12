"use client";

import { useState } from "react";
import { deriveStatus, type Status } from "@/lib/status";
import { markReturned } from "@/app/actions";
import type { Borrowing } from "@/lib/types";

const STATUS_LABEL: Record<Status, string> = {
  out: "Out",
  overdue: "Overdue",
  returned: "Returned",
};

// Named Tailwind colors (guaranteed AA contrast) aligned to the token palette.
const STATUS_BADGE: Record<Status, string> = {
  out: "bg-slate-200/70 text-slate-700",
  overdue: "bg-red-100 text-red-700",
  returned: "bg-emerald-100 text-emerald-700",
};

// Milestone 1: renders the slip columns from the given rows.
// Deferred to Milestone 2: search, Out/Returned/All tabs, overdue highlighting.
export default function BorrowingsTable({ rows }: { rows: Borrowing[] }) {
  const [message, setMessage] = useState<string | null>(null);

  async function handleReturn(id: string) {
    const result = await markReturned(id);
    setMessage(result.ok ? "Marked returned." : result.error);
  }

  return (
    <section>
      {message && <p className="mb-2 text-sm text-amber-700">{message}</p>}
      <div className="glass overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-600">
              <tr className="border-b border-white/50">
                <th className="px-4 py-3 font-semibold">Name (Teacher/Staff)</th>
                <th className="px-4 py-3 font-semibold">Item/Equipment</th>
                <th className="px-4 py-3 font-semibold">Date Borrowed</th>
                <th className="px-4 py-3 font-semibold">Date Returned</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {rows.map((r) => {
                const status = deriveStatus(r);
                return (
                  <tr key={r.id} className="transition-colors hover:bg-white/30">
                    <td className="px-4 py-3 font-medium text-slate-800">{r.borrower_name}</td>
                    <td className="px-4 py-3 text-slate-700">{r.item}</td>
                    <td className="px-4 py-3 text-slate-700">{r.date_borrowed}</td>
                    <td className="px-4 py-3 text-slate-700">{r.date_returned ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[status]}`}
                      >
                        {STATUS_LABEL[status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {status !== "returned" && (
                        <button
                          onClick={() => handleReturn(r.id)}
                          className="rounded-lg border border-white/60 bg-white/50 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-white/80"
                        >
                          Mark returned
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
