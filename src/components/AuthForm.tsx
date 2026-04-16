"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/client-api";

type Mode = "signin" | "signup";

type AuthResponse = {
  user?: { id: string; email: string } | null;
  session?: boolean;
  message?: string;
};

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const heading = mode === "signin" ? "Welcome back" : "Create your account";
  const cta = mode === "signin" ? "Sign in" : "Create account";
  const altHref = mode === "signin" ? "/signup" : "/signin";
  const altLabel =
    mode === "signin" ? "Need an account? Sign up" : "Already have one? Sign in";
  const endpoint =
    mode === "signin" ? "/api/auth/signin" : "/api/auth/signup";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setInfo(null);
    try {
      const data = await apiFetch<AuthResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (data.user && data.session !== false) {
        router.push("/dashboard");
        router.refresh();
        return;
      }
      setInfo(data.message ?? "Check your email to finish signing up.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="card-surface p-8 md:p-10 max-w-md w-full">
      <p className="eyebrow">Pointer · {mode === "signin" ? "Sign in" : "Sign up"}</p>
      <h1 className="mt-3 font-display text-3xl text-ink">{heading}</h1>
      <p className="mt-2 text-ink-muted text-sm">
        {mode === "signin"
          ? "Pick up where you left off."
          : "Free. No bank logins. No card numbers."}
      </p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.18em] text-ink-muted">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="rounded-md border border-line px-4 py-3 bg-cream/40 focus:bg-paper outline-none focus:border-burgundy transition"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.18em] text-ink-muted">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
            className="rounded-md border border-line px-4 py-3 bg-cream/40 focus:bg-paper outline-none focus:border-burgundy transition"
          />
        </label>

        {error && (
          <p className="text-sm text-burgundy bg-burgundy/5 border border-burgundy/20 rounded-md px-3 py-2">
            {error}
          </p>
        )}
        {info && (
          <p className="text-sm text-ink-soft bg-cream-soft rounded-md px-3 py-2">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn-primary justify-center mt-2 disabled:opacity-60"
        >
          {pending ? "Working…" : cta}
        </button>
      </form>
      <Link
        href={altHref}
        className="mt-5 block text-center text-sm text-ink-muted hover:text-ink"
      >
        {altLabel}
      </Link>
    </div>
  );
}
