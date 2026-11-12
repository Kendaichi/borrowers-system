// Shared contract (Dev 1 owns) — consumed by Dev 2 (UI) and Dev 3 (stats/print).
// One row of the Borrower's Slip. `date_*` are ISO date strings (YYYY-MM-DD).
export type Borrowing = {
  id: string;
  borrower_name: string;
  item: string;
  date_borrowed: string;
  date_returned: string | null; // null = still out
  recorded_by: string | null;
  created_at: string;
  updated_at: string;
};

// Return shape for every server action, so the UI can show field errors
// instead of throwing.
export type ActionResult = { ok: true } | { ok: false; error: string };
