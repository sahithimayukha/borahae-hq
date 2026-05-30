import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 py-20 md:grid-cols-[1.05fr_0.95fr] md:py-28">
      <div>
        <Badge>ARIRANG comeback command center for ARMY</Badge>

        <h1 className="font-display mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-[#3B1E5A] md:text-7xl">
          Your ARIRANG era, beautifully organized.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#7A7185]">
          ARIRANG Era Hub is an unofficial BorahaeHQ experience where ARMY can
track comeback events, fan projects, era tasks, and personal memories
in one bold dashboard.
        </p>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          <Button href="/signup" className="px-7 py-4">
            Get Started
          </Button>

          <Button href="#features" variant="secondary" className="px-7 py-4">
            Explore Features
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-8 rounded-[3rem] bg-[#C9A7FF]/30 blur-3xl" />

        <div className="relative rounded-4xl border border-white/80 bg-white/80 p-6 shadow-[0_30px_90px_rgba(59,30,90,0.16)] backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#7A7185]">
                Today in BorahaeHQ
              </p>
              <h2 className="mt-1 text-2xl font-bold text-[#3B1E5A]">💜</h2>
            </div>

            <span className="rounded-full bg-[#F4EDFF] px-4 py-2 text-xs font-bold text-[#3B1E5A]">
              Dashboard
            </span>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-[#E8E6EF] bg-white p-5">
              <h3 className="font-bold text-[#3B1E5A]">
                Today&apos;s ARMY Tasks
              </h3>

              <ul className="mt-4 space-y-3 text-sm text-[#7A7185]">
                <li>✓ Check calendar</li>
                <li>✓ Save one memory</li>
                <li>✓ Explore fan projects</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-[#E8E6EF] bg-[#F7EFFF] p-5">
              <h3 className="font-bold text-[#3B1E5A]">Upcoming</h3>

              <div className="mt-4 space-y-3 text-sm text-[#7A7185]">
                <p>June 13 — BTS Anniversary</p>
                <p>Dec 4 — Jin Birthday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}