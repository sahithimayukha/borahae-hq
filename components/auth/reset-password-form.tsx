"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (newPassword.length < 8) {
      setErrorMessage(
        "Your new password must contain at least 8 characters.",
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("The two password fields do not match.");
      return;
    }

    setIsSaving(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setErrorMessage(
        "The recovery link may have expired. Request a new password-reset link and try again.",
      );

      setIsSaving(false);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");

    setMessage(
      "Your password has been reset. You can now return to sign in.",
    );

    setIsSaving(false);
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
        Secure Recovery
      </p>

      <h1 className="font-era mt-3 text-4xl leading-[1.02] text-[#111111]">
        Choose A New Password
      </h1>

      <p className="mt-4 text-sm leading-6 text-[#4B4B4B]">
        Enter a new password for your BorahaeHQ account.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div>
          <label
            htmlFor="recovery-new-password"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            New Password
          </label>

          <input
            id="recovery-new-password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="Enter a new password"
            minLength={8}
            autoComplete="new-password"
            required
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div>
          <label
            htmlFor="recovery-confirm-password"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Confirm Password
          </label>

          <input
            id="recovery-confirm-password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            placeholder="Enter the password again"
            minLength={8}
            autoComplete="new-password"
            required
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-[#E11D48] bg-[#FFF1F3] px-4 py-3 text-sm font-bold text-[#B91C3B]">
            {errorMessage}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-2xl border border-[#166534] bg-[#F0FDF4] px-4 py-3 text-sm font-bold leading-6 text-[#166534]">
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSaving}
          style={{
        fontSize: "12px",
        lineHeight: "1",
        fontWeight: 900,
      }}
          className="inline-flex w-full items-center justify-center rounded-full bg-[#E11D48] px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.14em] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </section>
  );
}