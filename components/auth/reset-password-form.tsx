"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ResetPasswordFormProps = {
  initialEmail?: string;
};

function EyeIcon({ isVisible }: { isVisible: boolean }) {
  return isVisible ? (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.1 5.2A11.7 11.7 0 0 1 12 4.8c6.5 0 10 7.2 10 7.2a17.3 17.3 0 0 1-3.1 3.9" />
      <path d="M6.2 6.2C3.5 8 2 12 2 12s3.5 7.2 10 7.2a11.5 11.5 0 0 0 4-.7" />
    </svg>
  );
}

function isStrongPassword(password: string) {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"|<>?,./`~\\]/.test(password);

  return (
    password.length >= 10 &&
    hasLowercase &&
    hasUppercase &&
    hasNumber &&
    hasSymbol
  );
}

export function ResetPasswordForm({
  initialEmail = "",
}: ResetPasswordFormProps) {
  const [email, setEmail] = useState(initialEmail);

  const [recoveryCode, setRecoveryCode] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [isVerifying, setIsVerifying] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const [isPasswordReset, setIsPasswordReset] = useState(false);

  async function handleVerifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    const trimmedEmail = email.trim().toLowerCase();

    const trimmedCode = recoveryCode.trim();

    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");

      return;
    }

    if (!/^\d{6}$/.test(trimmedCode)) {
      setErrorMessage("Enter the 6-digit recovery code from your email.");

      return;
    }

    setIsVerifying(true);

    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      email: trimmedEmail,
      token: trimmedCode,
      type: "recovery",
    });

    if (error) {
      setErrorMessage(
        "The recovery code is incorrect, already used, or expired. Request a new code and try again.",
      );

      setIsVerifying(false);

      return;
    }

    setIsCodeVerified(true);
    setIsVerifying(false);
  }

  async function handleUpdatePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    if (!isStrongPassword(newPassword)) {
      setErrorMessage(
        "Use at least 10 characters with one uppercase letter, one lowercase letter, one number, and one symbol.",
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
      if (error.code === "same_password") {
        setErrorMessage(
          "Your new password must be different from your previous password.",
        );
      } else if (error.code === "weak_password") {
        setErrorMessage(
          "Use at least 10 characters with one uppercase letter, one lowercase letter, one number, and one symbol.",
        );
      } else {
        setErrorMessage(
          "Your password could not be updated. Please try again.",
        );
      }

      setIsSaving(false);

      return;
    }

    await supabase.auth.signOut();

    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordReset(true);
    setIsSaving(false);
  }

  if (isPasswordReset) {
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
          Password Reset Complete
        </h1>

        <div className="mt-6 rounded-2xl border border-[#166534] bg-[#F0FDF4] px-4 py-4 text-sm font-bold leading-6 text-[#166534]">
          Your password has been reset successfully. You can now sign in with
          your new password.
        </div>

        <Link
          href="/login"
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#E11D48] px-6 py-3.5 text-[12px] font-black uppercase tracking-[0.14em] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
        >
          Return To Sign In
        </Link>
      </section>
    );
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
        Reset Your Password
      </h1>

      {!isCodeVerified ? (
        <>
          <p className="mt-4 text-sm leading-6 text-[#4B4B4B]">
            Enter the 6-digit recovery code from your email. The code is valid
            for 60 minutes and can be used only once.
          </p>

          <form onSubmit={handleVerifyCode} className="mt-7 space-y-5">
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

            <div>
              <label
                htmlFor="recovery-code"
                className="font-era-label mb-2 block text-[10px] text-[#111111]"
              >
                6-Digit Recovery Code
              </label>

              <input
                id="recovery-code"
                name="recoveryCode"
                type="text"
                value={recoveryCode}
                onChange={(event) =>
                  setRecoveryCode(
                    event.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
                placeholder="000000"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold tracking-[0.34em] text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
              />
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-[#E11D48] bg-[#FFF1F3] px-4 py-3 text-sm font-bold leading-6 text-[#B91C3B]">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isVerifying}
              style={{
                fontSize: "10px",
                lineHeight: "1",
                fontWeight: 900,
              }}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#E11D48] px-6 py-3.5 text-[12px] font-black uppercase tracking-[0.14em] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isVerifying ? "Verifying..." : "Verify Recovery Code"}
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="mt-4 text-sm leading-6 text-[#4B4B4B]">
            Create a secure new password for your BorahaeHQ account.
          </p>

          <div className="mt-5 rounded-2xl border border-[#166534] bg-[#F0FDF4] px-4 py-3 text-sm font-bold leading-6 text-[#166534]">
            Recovery code verified.
          </div>

          <form onSubmit={handleUpdatePassword} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="recovery-new-password"
                className="font-era-label mb-2 block text-[10px] text-[#111111]"
              >
                New Password
              </label>

              <div className="relative">
                <input
                  id="recovery-new-password"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Create a new password"
                  minLength={10}
                  autoComplete="new-password"
                  required
                  className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 pr-12 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((current) => !current)}
                  aria-label={
                    showNewPassword ? "Hide new password" : "Show new password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#666666] transition hover:bg-[#FFF1F3] hover:text-[#E11D48]"
                >
                  <EyeIcon isVisible={showNewPassword} />
                </button>
              </div>

              <p className="mt-2 text-xs font-semibold leading-5 text-[#666666]">
                Use at least 10 characters with uppercase, lowercase, a number,
                and a symbol.
              </p>
            </div>

            <div>
              <label
                htmlFor="recovery-confirm-password"
                className="font-era-label mb-2 block text-[10px] text-[#111111]"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="recovery-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Enter the password again"
                  minLength={10}
                  autoComplete="new-password"
                  required
                  className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 pr-12 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmed password"
                      : "Show confirmed password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#666666] transition hover:bg-[#FFF1F3] hover:text-[#E11D48]"
                >
                  <EyeIcon isVisible={showConfirmPassword} />
                </button>
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-[#E11D48] bg-[#FFF1F3] px-4 py-3 text-sm font-bold leading-6 text-[#B91C3B]">
                {errorMessage}
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
              className="inline-flex w-full items-center justify-center rounded-full bg-[#E11D48] px-6 py-3.5 text-[12px] font-black uppercase tracking-[0.14em] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Updating..." : "Reset Password"}
            </button>
          </form>
        </>
      )}

      {!isCodeVerified ? (
        <p className="mt-5 text-center text-xs font-semibold leading-5 text-[#666666]">
          Did not receive a code?{" "}
          <Link
            href="/forgot-password"
            className="font-black text-[#E11D48] transition hover:text-[#C5163D]"
          >
            Request a new code
          </Link>
        </p>
      ) : null}
    </section>
  );
}