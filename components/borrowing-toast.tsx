"use client";

import { useEffect, useState } from "react";

export default function BorrowingToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    // Consume the success flag so refreshing does not repeat the notification.
    const url = new URL(window.location.href);
    url.searchParams.delete("borrowed");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      {visible && (
        <div className="fixed top-6 right-6 z-50 flex max-w-[calc(100vw-3rem)] items-center gap-4 rounded-xl bg-emerald-800 px-5 py-4 text-sm text-white shadow-lg">
          <span>Borrowing saved successfully.</span>
          <button type="button" onClick={() => setVisible(false)} aria-label="Dismiss notification" className="rounded px-2 py-1 hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
            Close
          </button>
        </div>
      )}
    </div>
  );
}
