"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PasswordFormProps = {
  userEmail: string | null;
};

export function PasswordForm({
  userEmail,
}: PasswordFormProps) {
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
      setErrorMessage(error.message);
      setIsSaving(false);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");

    setMessage("Your password has been updated successfully.");
    setIsSaving(false);
  }

  return (
    <section className="rounded-4xl border border-[#2A2A2A] bg-white p-6 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-8">
      <p className="font-era-label text-[10px] text-[#E11D48]">
        Account Security
      </p>

      <h2 className="font-era mt-3 text-3xl leading-[1.08] text-[#111111]">
        Change Your Password
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4B4B4B]">
        Update the password connected to your BorahaeHQ account.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div>
          <label
            htmlFor="account-email"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Account Email
          </label>

          <input
            id="account-email"
            type="email"
            value={userEmail ?? ""}
            disabled
            className="w-full cursor-not-allowed rounded-2xl border border-[#D1D5DB] bg-[#F7F7F7] px-4 py-3.5 text-sm font-semibold text-[#777777]"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="new-password"
              className="font-era-label mb-2 block text-[10px] text-[#111111]"
            >
              New Password
            </label>

            <input
              id="new-password"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              placeholder="Enter a new password"
              minLength={8}
              autoComplete="new-password"
              required
              className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="font-era-label mb-2 block text-[10px] text-[#111111]"
            >
              Confirm Password
            </label>

            <input
              id="confirm-password"
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
        </div>

        <p className="text-xs font-semibold leading-5 text-[#777777]">
          Use at least 8 characters. Choose a password that you do not reuse
          elsewhere.
        </p>

        {errorMessage ? (
          <div className="rounded-2xl border border-[#E11D48] bg-[#FFF1F3] px-4 py-3 text-sm font-bold text-[#B91C3B]">
            {errorMessage}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-2xl border border-[#166534] bg-[#F0FDF4] px-4 py-3 text-sm font-bold text-[#166534]">
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSaving}
          style={{
        fontSize: "10px",
        lineHeight: "1",
        fontWeight: 900,
      }}
          className="inline-flex items-center justify-center rounded-full bg-[#E11D48] px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.14em] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Updating..." : "Update Password"}
        </button>
      </form>
    </section>
  );
}