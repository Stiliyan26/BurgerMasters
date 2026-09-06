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
    <div id="login">
      <div className="center">
        <form className="login-form" action={onSubmit}>
          <h1 className="title">Login</h1>
          {error ? <p className="err-msg">{error}</p> : null}
          <input type="hidden" name="next" value={nextPath} />
          <div className="form-input-container">
            <label className="label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="input"
              name="username"
              autoComplete="username"
              defaultValue="admin"
              placeholder="Username"
            />
          </div>
          <div className="form-input-container">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
            />
          </div>
          <button className="submit-btn" type="submit" disabled={pending}>
            {pending ? "Checking…" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
