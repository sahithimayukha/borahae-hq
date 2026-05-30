import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[#C9A7FF]/60 bg-white/70 px-4 py-2 text-sm font-semibold text-[#3B1E5A] shadow-sm ${className}`}
    >
      {children}
    </span>
  );
}