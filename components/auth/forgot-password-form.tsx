"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");

      return;
    }

    setIsSending(true);

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail);

    if (error) {
      setErrorMessage(
        error.message.includes("rate limit")
          ? "Too many reset requests were sent recently. Please wait before requesting another code."
          : error.message,
      );

      setIsSending(false);

      return;
    }

    router.push(`/reset-password?email=${encodeURIComponent(trimmedEmail)}`);
  }

  return (
    <section className="w-full max-w-xl rounded-4xl border border-[#2A2A2A] bg-white p-6 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.42)] sm:p-8">
      <Link
        href="/login"
        className="text-sm font-black text-[#111111] transition hover:text-[#E11D48]"
      >
        ← Back To Sign In
      </Link>

      <p className="font-era-label mt-8 text-[10px] text-[#E11D48]">
        Account Recovery
      </p>

      <h1 className="font-era mt-3 text-4xl leading-[1.02] text-[#111111]">
        Reset Your Password
      </h1>

      <p className="mt-4 text-sm leading-6 text-[#4B4B4B]">
        Enter the email connected to your BorahaeHQ account. We will send a
        secure 6-digit recovery code.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div>
          <label
            htmlFor="recovery-email"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Email Address
          </label>

          <input
            id="recovery-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-[#E11D48] bg-[#FFF1F3] px-4 py-3 text-sm font-bold leading-6 text-[#B91C3B]">
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSending}
          style={{
            fontSize: "12px",
            lineHeight: "1",
            fontWeight: 900,
          }}
          className="inline-flex w-full items-center justify-center rounded-full bg-[#E11D48] px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.14em] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending ? "Sending Code..." : "Send Recovery Code"}
        </button>
      </form>
    </section>
  );
}