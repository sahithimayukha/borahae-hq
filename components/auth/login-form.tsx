"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/auth/password-input";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleLogin} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#111111]"
        >
          Email Address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#111111]"
        >
          Password
        </label>

        <PasswordInput
          id="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        <div className="mt-3 flex justify-end">
          <Link
            href="/forgot-password"
            style={{
              color: "#E11D48",
              fontSize: "12px",
              fontWeight: 900,
              lineHeight: "1.4",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
            className="uppercase tracking-widest transition hover:opacity-75"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-[#E11D48] bg-[#FFF1F3] px-4 py-3 text-sm font-bold text-[#B91C3B]">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        style={{
          fontSize: "12px",
          lineHeight: "1",
          fontWeight: 900,
        }}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#E11D48] px-6 py-3.5 text-sm font-black uppercase tracking-widest text-white! shadow-[0_16px_40px_rgba(225,29,72,0.26)] transition hover:-translate-y-0.5 hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}