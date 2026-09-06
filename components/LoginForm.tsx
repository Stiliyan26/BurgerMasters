"use client";

import { useState } from "react";
import { loginAction } from "@/lib/actions";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <form action={onSubmit} className="ticket mx-auto w-full max-w-md rounded-sm p-6">
      <div className="ticket-perforation -mx-6 -mt-6 mb-4 h-3" />
      <p className="font-[family-name:var(--font-ticket)] text-xs tracking-[0.24em] text-smoke">
        STAFF ONLY
      </p>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-3xl">
        Kitchen login
      </h1>
      <input type="hidden" name="next" value={nextPath} />
      <label className="mb-3 block text-sm">
        Username
        <input
          name="username"
          autoComplete="username"
          defaultValue="admin"
          className="mt-1 w-full border border-ink/20 bg-cream px-3 py-2 outline-none focus:border-ember"
        />
      </label>
      <label className="mb-4 block text-sm">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          className="mt-1 w-full border border-ink/20 bg-cream px-3 py-2 outline-none focus:border-ember"
        />
      </label>
      {error ? <p className="mb-3 text-sm text-ember">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ink py-3 font-semibold text-cream disabled:opacity-60"
      >
        {pending ? "Checking…" : "Open the kitchen"}
      </button>
    </form>
  );
}
