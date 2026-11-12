import type { Borrowing } from "./types";

// Placeholder rows for Milestone 1 (preview mode). Replaced by real Supabase
// data in Milestone 2. One of them is intentionally old + unreturned so the
// "overdue" status is visible.
const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

export const MOCK_BORROWINGS: Borrowing[] = [
  {
    id: "1", borrower_name: "Maria Santos", item: "LCD Projector",
    date_borrowed: daysAgo(3), date_returned: null,
    recorded_by: null, created_at: "", updated_at: "",
  },
  {
    id: "2", borrower_name: "Jose Rizal", item: "Extension Cord (10m)",
    date_borrowed: daysAgo(20), date_returned: null, // overdue
    recorded_by: null, created_at: "", updated_at: "",
  },
  {
    id: "3", borrower_name: "Ana Dela Cruz", item: "Portable Speaker",
    date_borrowed: daysAgo(12), date_returned: daysAgo(2), // returned
    recorded_by: null, created_at: "", updated_at: "",
  },
];
