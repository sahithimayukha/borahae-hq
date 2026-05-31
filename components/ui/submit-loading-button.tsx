"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitLoadingButtonProps = {
  children: ReactNode;
  pendingText?: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function SubmitLoadingButton({
  children,
  pendingText = "Loading...",
  className = "",
  disabled,
  ...buttonProps
}: SubmitLoadingButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...buttonProps}
      type="submit"
      disabled={pending || disabled}
      aria-disabled={pending || disabled}
      className={`${className} ${
        pending
          ? "cursor-wait opacity-70"
          : ""
      }`}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent" />

          {pendingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}