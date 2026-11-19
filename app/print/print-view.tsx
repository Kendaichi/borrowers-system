"use client";

import Link from "next/link";
import { SCHOOL } from "@/lib/config";
import { useState } from "react";
import { BLANK_ROWS, COLUMNS } from "./print-slip";
import type { Borrowing } from "@/lib/types";

export default function PrintView({ rows, preview = false }: { rows: Borrowing[]; preview?: boolean }) {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  async function exportExcel() {
    setExporting(true);
    setExportError("");
    try {
      const { downloadSlipExcel } = await import("./export-slip");
      await downloadSlipExcel(rows);
    } catch {
      setExportError("Could not export the Excel file. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/"
          className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          ← Back
        </Link>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportExcel}
            disabled={exporting}
            className="rounded bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-600 disabled:cursor-wait disabled:opacity-60"
          >
            {exporting ? "Exporting…" : "Export to Excel"}
          </button>
          <button
            onClick={() => window.print()}
            className="rounded bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>
      {exportError && <p role="alert" className="no-print mb-4 text-sm text-red-700">{exportError}</p>}
      {!rows.length && <p className="no-print mb-4 text-sm text-slate-600">No borrowings found.</p>}

      <section className="print-slip">
        <header className="mb-6 text-center">
          <h1 className="text-sm font-bold">{SCHOOL.name}</h1>
          <p className="text-xs">{SCHOOL.address}</p>
          <p className="mt-3 text-sm font-bold">{SCHOOL.office}</p>
          <h2 className="mt-4 text-xl font-semibold tracking-wide">{SCHOOL.title}</h2>
        </header>

        <table className="w-full border-collapse text-center text-xs">
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th key={c} className="whitespace-pre-line border border-slate-800 p-2 font-bold">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {[row.borrower_name, row.item, row.date_borrowed, row.date_returned ?? ""].map((value, i) => (
                  <td key={i} className="border border-slate-800 p-2">{value}</td>
                ))}
              </tr>
            ))}
            {Array.from({ length: Math.max(0, BLANK_ROWS - rows.length) }).map((_, i) => (
              <tr key={`borrower-${i}`}>
                {COLUMNS.map((c) => (
                  <td key={c} className="border border-slate-800 p-4" />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
