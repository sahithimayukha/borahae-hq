import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
};

const baseClasses =
  "inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-sm font-bold transition hover:-translate-y-0.5";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#3B1E5A] !text-white shadow-[0_16px_40px_rgba(59,30,90,0.24)] hover:bg-[#2F1648]",
  secondary:
    "border border-[#C9A7FF] bg-white/75 text-[#3B1E5A] hover:bg-white",
  ghost: "text-[#3B1E5A] hover:text-[#A970FF]",
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}