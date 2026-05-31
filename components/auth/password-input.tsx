"use client";

import type {
  ChangeEvent,
  InputHTMLAttributes,
} from "react";
import { useState } from "react";

type PasswordInputProps = {
  id: string;
  name: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  placeholder: string;
  autoComplete:
    | "current-password"
    | "new-password";
  required?: boolean;
  minLength?: number;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | "id"
  | "name"
  | "value"
  | "onChange"
  | "placeholder"
  | "autoComplete"
  | "type"
>;

function EyeIcon({
  isVisible,
}: {
  isVisible: boolean;
}) {
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

export function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  required = true,
  minLength,
  ...inputProps
}: PasswordInputProps) {
  const [isVisible, setIsVisible] =
    useState(false);

  return (
    <div className="relative">
      <input
        {...inputProps}
        id={id}
        name={name}
        type={isVisible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 pr-12 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
      />

      <button
        type="button"
        onClick={() =>
          setIsVisible((current) => !current)
        }
        aria-label={
          isVisible
            ? "Hide password"
            : "Show password"
        }
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#666666] transition hover:bg-[#FFF1F3] hover:text-[#E11D48]"
      >
        <EyeIcon isVisible={isVisible} />
      </button>
    </div>
  );
}