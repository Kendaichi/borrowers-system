"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SCHOOL } from "@/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      // Preview mode — no backend to authenticate against yet.
      router.push("/");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <div className="mb-6 text-center">
        <h1 className="text-lg font-bold">{SCHOOL.name}</h1>
        <p className="text-sm text-slate-500">{SCHOOL.office}</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-strong space-y-4 rounded-2xl p-6">
        <h2 className="text-center text-base font-semibold text-slate-800">
          Property Custodian Login
        </h2>

        {!isSupabaseConfigured && (
          <p className="rounded-lg bg-amber-50/80 p-2 text-xs text-amber-700">
            Preview mode: Supabase is not configured. Sign-in is bypassed — set
            credentials in <code>.env.local</code> to enable real auth.
          </p>
        )}

        <label className="block text-sm">
          <span className="font-medium text-slate-600">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={isSupabaseConfigured}
            className="glass-input mt-1 w-full rounded-xl px-3 py-2 text-slate-800 outline-none"
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-600">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={isSupabaseConfigured}
            className="glass-input mt-1 w-full rounded-xl px-3 py-2 text-slate-800 outline-none"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-[color:var(--primary)] py-2 font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
