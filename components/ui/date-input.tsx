"use client";

import type { ChangeEvent, InputHTMLAttributes, KeyboardEvent } from "react";
import { useRef, useState } from "react";

type DateInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  value?: string;
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

type DateInputElement = HTMLInputElement & {
  showPicker?: () => void;
};

function formatVisibleDate(dateValue: string) {
  if (!dateValue) {
    return "";
  }

  const [year, month, day] = dateValue.split("-");

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
  const inputRef = useRef<DateInputElement | null>(null);

  const [internalValue, setInternalValue] = useState(defaultValue);

  const currentValue = value ?? internalValue;

  function openDatePicker() {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    input.focus();

    try {
      input.showPicker?.();
    } catch {
      /*
        On iPhone Safari, tapping the invisible native
        date input already opens the iOS date picker.
      */
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (value === undefined) {
      setInternalValue(event.target.value);
    }

    onChange?.(event);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDatePicker();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openDatePicker}
      onKeyDown={handleKeyDown}
      className={`relative flex min-h-14 w-full min-w-0 cursor-pointer items-center justify-between rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-left transition focus-within:border-[#E11D48] focus-within:ring-4 focus-within:ring-[#E11D48]/20 ${className}`}
    >
      <input
        {...inputProps}
        ref={inputRef}
        type="date"
        value={currentValue}
        onChange={handleChange}
        aria-label={inputProps["aria-label"] ?? placeholder}
        className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
      />

      <span
        className={`pointer-events-none text-sm font-semibold ${
          currentValue ? "text-[#111111]" : "text-[#777777]"
        }`}
      >
        {currentValue ? formatVisibleDate(currentValue) : placeholder}
      </span>

      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none h-5 w-5 shrink-0 text-[#E11D48]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M7 3v4M17 3v4M4 9h16" />

        <rect x="4" y="5" width="16" height="15" rx="2" />
      </svg>
    </div>
  );
}