// Shared constants (Dev 1 owns).

// An item still out for MORE than this many days counts as overdue.
// The paper slip has no due date, so overdue is derived from days-outstanding.
// shortcut: fixed threshold, not per-item due dates; upgrade by adding a
// nullable due_date column if the school needs per-loan terms.
export const OVERDUE_DAYS = 14;

// Header text for the app shell and the printable slip, straight from the form.
export const SCHOOL = {
  name: "CITY GOVERNMENT OF BUTUAN",
  address: "Doongan, Butuan City, Agusan del Norte",
  office: "City Information and Communications Technology Department",
  title: "BORROWER'S SLIP",
} as const;
