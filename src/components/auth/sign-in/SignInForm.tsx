"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/src/lib/supabase/client";

type SignInFormProps = {
  onSuccess?: (message: string) => void;
};

export function SignInForm({ onSuccess }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const iin = data.user.user_metadata?.iin;

    if (iin) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email,
        iin,
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
    }

    const message = "Signed in successfully.";
    onSuccess?.(message);
    setSuccessMessage(message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm text-main-text">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg border border-break-line px-3 py-2 outline-none focus:border-interactive-color"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-main-text">
        Password
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-lg border border-break-line px-3 py-2 outline-none focus:border-interactive-color"
        />
      </label>

      {error ? <p className="text-sm text-error-text">{error}</p> : null}
      {successMessage ? <p className="text-sm text-success-text">{successMessage}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-interactive-color px-4 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
