"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addBorrowing } from "@/app/borrowings/new/actions";

export default function AddBorrowingForm() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [borrowerName, setBorrowerName] = useState("");
  const [item, setItem] = useState("");
  const [customItem, setCustomItem] = useState("");
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
        item: item === "Other" ? customItem.trim() : item,
        date_borrowed: dateBorrowed,
      });
      if (result.ok) {
        router.push("/?borrowed=1");
      } else {
        setMessage(result.error);
      }
    } catch {
      setMessage("Could not confirm the borrowing was saved. Please check your records before trying again.");
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
        <select
          required
          value={item}
          onChange={(e) => {
            const value = e.target.value;
            setItem(value);
            if (value !== "Other") setCustomItem("");
          }}
          className="glass-input mt-1 block border-1 border-gray-400 rounded-lg px-3 py-2 text-slate-800 outline-none"
        >
          <option value="" disabled>
            Select an item
          </option>
          <option value="Projector">Projector</option>
          <option value="Extension Wire">Extension Wire</option>
          <option value="Laptop">Laptop</option>
          <option value="Speaker">Speaker</option>
          <option value="Microphone">Microphone</option>
          <option value="HDMI Cord">HDMI Cord</option>
          <option value="Projector Screen">Projector Screen</option>
          <option value="Other">Other</option>
        </select>
      </label>

      {item === "Other" && (
        <label className="text-sm">
          <span className="font-medium text-slate-600">Specify item</span>
          <input
            required
            value={customItem}
            onChange={(e) => setCustomItem(e.target.value)}
            className="glass-input mt-1 block border-1 border-gray-400 rounded-lg px-3 py-2 text-slate-800 outline-none"
          />
        </label>
      )}
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
      {message && <span role="alert" className="text-sm text-amber-700">{message}</span>}
    </form>
  );
}
