// Shared status derivation (Dev 1 owns). Pure function — no I/O.
import type { Borrowing } from "./types";
import { OVERDUE_DAYS } from "./config";

export type Status = "out" | "overdue" | "returned";

const MS_PER_DAY = 86_400_000;

export function deriveStatus(b: Borrowing, today: Date = new Date()): Status {
  if (b.date_returned) return "returned";
  const borrowed = new Date(b.date_borrowed + "T00:00:00");
  const days = Math.floor((today.getTime() - borrowed.getTime()) / MS_PER_DAY);
  return days > OVERDUE_DAYS ? "overdue" : "out";
}

// --- assert-based self-test: `npm run test:status` ---
function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error("status self-test failed: " + msg);
}

export function assertStatusSelfTest(): void {
  const base: Borrowing = {
    id: "x", borrower_name: "a", item: "b", date_borrowed: "2025-01-01",
    date_returned: null, recorded_by: null, created_at: "", updated_at: "",
  };
  const on = (d: string) => new Date(d + "T00:00:00");

  assert(deriveStatus({ ...base, date_returned: "2025-01-02" }, on("2025-03-01")) === "returned", "returned wins");
  assert(deriveStatus(base, on("2025-01-10")) === "out", "9 days out");
  assert(deriveStatus(base, on("2025-01-15")) === "out", "exactly 14 days is still out");
  assert(deriveStatus(base, on("2025-01-16")) === "overdue", "15 days is overdue");
}

// Run the self-test when executed directly (via tsx).
if (process.argv[1]?.endsWith("status.ts")) {
  assertStatusSelfTest();
  console.log("status self-test passed");
}
