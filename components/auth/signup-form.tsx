"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");
    setIsLoading(true);

    const trimmedDisplayName = displayName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedDisplayName) {
      setErrorMessage("Please enter your display name.");
      setIsLoading(false);
      return;
    }

    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          display_name: trimmedDisplayName,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    setMessage(
      "Account created. Please check your email if confirmation is required, then sign in.",
    );

    setDisplayName("");
    setEmail("");
    setPassword("");
    setIsLoading(false);

    setTimeout(() => {
      router.push("/login");
    }, 1800);
  }

  return (
    <form onSubmit={handleSignup} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="displayName"
          className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#111111]"
        >
          Display name
        </label>

        <input
          id="displayName"
          name="displayName"
          type="text"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Your ARMY name"
          className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#111111]"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
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

        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create a password"
          className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
        />
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-[#E11D48] bg-[#FFF1F3] px-4 py-3 text-sm font-bold text-[#B91C3B]">
          {errorMessage}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-2xl border border-[#E11D48] bg-[#FFF1F3] px-4 py-3 text-sm font-bold text-[#111111]">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#E11D48] px-6 py-3.5 text-sm font-black uppercase tracking-[0.1em] !text-white shadow-[0_16px_40px_rgba(225,29,72,0.26)] transition hover:-translate-y-0.5 hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}