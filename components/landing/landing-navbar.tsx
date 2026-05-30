import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/70 px-5 py-3 shadow-[0_20px_60px_rgba(59,30,90,0.08)] backdrop-blur">
      <Link href="/" className="text-lg font-bold tracking-tight text-[#3B1E5A]">
        BorahaeHQ ✦ ARIRANG Era Hub
      </Link>

      <div className="flex items-center gap-5 text-sm font-medium text-[#3B1E5A] md:gap-8">
        <a
          href="#features"
          className="hidden transition hover:text-[#A970FF] sm:inline"
        >
          Features
        </a>

        <a
          href="#how-it-works"
          className="hidden transition hover:text-[#A970FF] sm:inline"
        >
          How it works
        </a>

        <Button href="/login" variant="ghost" className="px-0 py-0">
          Sign in
        </Button>

        <Button href="/signup" className="min-w-28 px-5 py-2.5">
          Get Started
        </Button>
      </div>
    </nav>
  );
}