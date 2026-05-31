"use client";

import type {
  ChangeEvent,
  InputHTMLAttributes,
} from "react";
import { useState } from "react";

type DateInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  value?: string;
  defaultValue?: string;
  onChange?: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  placeholder?: string;
};

function formatVisibleDate(dateValue: string) {
  if (!dateValue) {
    return "";
  }

  const [year, month, day] =
    dateValue.split("-");

  if (!year || !month || !day) {
    return dateValue;
  }

  return `${day}/${month}/${year}`;
}

export function DateInput({
  value,
  defaultValue = "",
  onChange,
  placeholder = "Select a date",
  className = "",
  ...inputProps
}: DateInputProps) {
  const [internalValue, setInternalValue] =
    useState(defaultValue);

  const currentValue =
    value ?? internalValue;

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    if (value === undefined) {
      setInternalValue(event.target.value);
    }

    onChange?.(event);
  }

  return (
    <div
      className={`relative min-w-0 ${className}`}
    >
      <input
        {...inputProps}
        type="date"
        value={currentValue}
        onChange={handleChange}
        className="peer absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
      />

      <div className="pointer-events-none flex min-h-14 w-full items-center justify-between rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-left transition peer-focus:border-[#E11D48] peer-focus:ring-4 peer-focus:ring-[#E11D48]/20">
        <span
          className={`text-sm font-semibold ${
            currentValue
              ? "text-[#111111]"
              : "text-[#777777]"
          }`}
        >
          {currentValue
            ? formatVisibleDate(currentValue)
            : placeholder}
        </span>

        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0 text-[#E11D48]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M7 3v4M17 3v4M4 9h16" />
          <rect
            x="4"
            y="5"
            width="16"
            height="15"
            rx="2"
          />
        </svg>
      </div>
    </div>
  );
}