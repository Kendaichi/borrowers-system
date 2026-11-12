"use client";

import { SCHOOL } from "@/lib/config";

// Milestone 1: static printable slip mirroring the paper form.
// Deferred to Milestone 2: fill rows from live data + a ?filter= param.
const BLANK_ROWS = 15;
const COLUMNS = [
  "NAME\nTEACHER/STAFF",
  "ITEM/EQUIPMENT\nBORROWED",
  "DATE\nBORROWED",
  "DATE\nRETURNED",
];

export default function PrintPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <div className="no-print mb-4 flex justify-end">
        <button
          onClick={() => window.print()}
          className="rounded bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
        >
          Print / Save as PDF
        </button>
      </div>

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
            {Array.from({ length: BLANK_ROWS }).map((_, i) => (
              <tr key={i}>
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
