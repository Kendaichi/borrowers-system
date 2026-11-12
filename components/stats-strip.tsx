import { deriveStatus } from "@/lib/status";
import type { Borrowing } from "@/lib/types";

// Count tiles. Milestone 1: computed from the passed-in rows (mock data).
// Milestone 2: same component, fed live Supabase rows.
export default function StatsStrip({ rows }: { rows: Borrowing[] }) {
  const counts = rows.reduce(
    (acc, r) => {
      acc.total++;
      acc[deriveStatus(r)]++;
      return acc;
    },
    { total: 0, out: 0, overdue: 0, returned: 0 }
  );

  const tiles: { label: string; value: number; accent: string }[] = [
    { label: "Total", value: counts.total, accent: "text-[color:var(--primary)]" },
    { label: "Out", value: counts.out, accent: "text-[color:var(--secondary)]" },
    { label: "Overdue", value: counts.overdue, accent: "text-[color:var(--danger)]" },
    { label: "Returned", value: counts.returned, accent: "text-[color:var(--success)]" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="glass rounded-2xl p-5">
          <div className={`text-3xl font-extrabold ${t.accent}`}>{t.value}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
            {t.label}
          </div>
        </div>
      ))}
    </div>
  );
}
