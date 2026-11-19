"use client";

import { useState } from "react";
import { addBorrowing } from "@/app/borrowings/new/actions";

// Milestone 1: form fields wired to the (stubbed) addBorrowing action.
// Deferred to Milestone 2: client validation + success/error UX refinements.
export default function AddBorrowingForm() {
  const today = new Date().toISOString().slice(0, 10);
  const [borrowerName, setBorrowerName] = useState("");
  const [item, setItem] = useState("");
  const [dateBorrowed, setDateBorrowed] = useState(today);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await addBorrowing({
        borrower_name: borrowerName,
        item,
        date_borrowed: dateBorrowed,
      });
      setMessage(result.ok ? "Added." : result.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
      className="glass flex flex-wrap items-end gap-3 rounded-2xl p-5"
    >
      <label className="text-sm">
        <span className="font-medium text-slate-600">Name (Teacher/Staff)</span>
        <input
          value={borrowerName}
          onChange={(e) => setBorrowerName(e.target.value)}
          className="glass-input mt-1 block border-1 border-gray-400 rounded-lg px-3 py-2 text-slate-800 outline-none"
        />
      </label>
      <label className="text-sm">
        <span className="font-medium text-slate-600">Item/Equipment</span>
        <input
          value={item}
          onChange={(e) => setItem(e.target.value)}
          className="glass-input mt-1 block border-1 border-gray-400 rounded-lg px-3 py-2 text-slate-800 outline-none"
        />
      </label>
      <label className="text-sm">
        <span className="font-medium text-slate-600">Date Borrowed</span>
        <input
          type="date"
          value={dateBorrowed}
          onChange={(e) => setDateBorrowed(e.target.value)}
          className="glass-input mt-1 block border-1 border-gray-400 rounded-lg px-3 py-2 text-slate-800 outline-none"
        />
      </label>
      <button disabled={isSubmitting} className="rounded-xl bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-110">
        {isSubmitting ? "Adding..." : "Add borrowing"}
      </button>
      {message && <span className="text-sm text-amber-700">{message}</span>}
    </form>
  );
}
