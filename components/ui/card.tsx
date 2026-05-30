import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[1.75rem] border border-white/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(59,30,90,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}