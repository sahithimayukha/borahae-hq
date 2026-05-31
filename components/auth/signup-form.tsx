/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

export function SignupForm() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [isCreating, setIsCreating] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");

      return;
    }

    if (!isStrongPassword(password)) {
      setErrorMessage(
        "Use at least 10 characters with one uppercase letter, one lowercase letter, one number, and one symbol.",
      );

      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("The two password fields do not match.");

      return;
    }

    setIsCreating(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      if (error.code === "user_already_exists") {
        setErrorMessage(
          "An account already exists for this email. Return to sign in or reset your password.",
        );
      } else if (error.code === "weak_password") {
        setErrorMessage(
          "Use at least 10 characters with one uppercase letter, one lowercase letter, one number, and one symbol.",
        );
      } else if (error.message.toLowerCase().includes("rate limit")) {
        setErrorMessage(
          "Too many signup requests were sent recently. Please wait and try again.",
        );
      } else {
        setErrorMessage(error.message);
      }

      setIsCreating(false);

      return;
    }

    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setMessage(
      "Your BorahaeHQ account has been created. Check your inbox and confirm your email before signing in.",
    );

    setIsCreating(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
      <div>
        <label
          htmlFor="signup-email"
          className="font-era-label mb-2 block text-[10px] text-[#111111]"
        >
          Email Address
        </label>

        <input
          id="signup-email"
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
          htmlFor="signup-password"
          className="font-era-label mb-2 block text-[10px] text-[#111111]"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a secure password"
            minLength={10}
            autoComplete="new-password"
            required
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 pr-12 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#666666] transition hover:bg-[#FFF1F3] hover:text-[#E11D48]"
          >
            <EyeIcon isVisible={showPassword} />
          </button>
        </div>

        <p className="mt-2 text-xs font-semibold leading-5 text-[#666666]">
          Use at least 10 characters with uppercase, lowercase, a number, and a
          symbol.
        </p>
      </div>

      <div>
        <label
          htmlFor="signup-confirm-password"
          className="font-era-label mb-2 block text-[10px] text-[#111111]"
        >
          Confirm Password
        </label>

        <div className="relative">
          <input
            id="signup-confirm-password"
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

      {message ? (
        <div className="rounded-2xl border border-[#166534] bg-[#F0FDF4] px-4 py-3 text-sm font-bold leading-6 text-[#166534]">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isCreating}
        style={{
          fontSize: "12px",
          lineHeight: "1",
          fontWeight: 900,
        }}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#E11D48] px-6 py-3.5 text-[12px] font-black uppercase tracking-[0.14em] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCreating ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}
