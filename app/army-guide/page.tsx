import Link from "next/link";
import { armyGuideSections } from "@/lib/army-guide-data";

export default function ArmyGuidePage() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <Link
          href="/dashboard"
                    className="font-era-label inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
        >
          ← Back to Dashboard
        </Link>

        <div className="relative mt-6 overflow-hidden rounded-4xl border border-[#2A2A2A] bg-linear-to-br from-[#151515] via-[#0B0B0B] to-[#050505] px-6 py-8 shadow-2xl sm:px-8 sm:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.24),transparent_38%)]" />

          <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/85 via-black/45 to-transparent" />

          <div className="relative">
            <p className="font-era-label text-[10px] uppercase tracking-[0.28em] text-[#E11D48] sm:text-xs">
              BorahaeHQ Resource Library
            </p>

            <h1 className="font-era-display mt-4 text-4xl uppercase tracking-tight text-white sm:text-5xl">
              ARMY Guide Hub
            </h1>

            <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-[#CFCFCF] sm:text-base">
              A calm, organized corner for BTS resources. Explore member
              introductions, music guides, trusted official links, concert
              preparation notes, and useful ARMY vocabulary without wandering
              through a jungle of tabs.
            </p>

            <div className="font-era-label mt-7 inline-flex rounded-full border border-[#5C1E2D] bg-[#E11D48]/10 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#FF829D]">
              7 beginner-friendly guides
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {armyGuideSections.map((section) => (
            <Link
              key={section.slug}
              href={`/army-guide/${section.slug}`}
              className="group relative overflow-hidden rounded-[1.75rem] border border-[#2A2A2A] bg-linear-to-br from-[#121212] via-[#0B0B0B] to-[#070707] p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[#E11D48]/70 hover:shadow-[0_20px_50px_rgba(225,29,72,0.12)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.12),transparent_42%)] opacity-0 transition duration-300 group-hover:opacity-100" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="font-era flex h-12 w-12 items-center justify-center rounded-2xl border border-[#43202A] bg-[#E11D48]/10 text-lg font-black text-[#FF597B]">
                    {section.symbol}
                  </div>

                  <span className="text-lg text-[#E11D48] transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </div>

                <p className="font-era-label mt-6 text-[10px] uppercase tracking-[0.22em] text-[#E11D48]">
                  {section.eyebrow}
                </p>

                <h2 className="font-era mt-3 text-xl font-black text-white">
                  {section.title}
                </h2>

                <p className="mt-3 text-sm font-medium leading-6 text-[#B8B8B8]">
                  {section.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {section.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="font-era-label rounded-full border border-[#333333] bg-[#111111] px-3 py-1 text-[10px] tracking-wide text-[#D7D7D7]"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-[#3A2026] bg-linear-to-r from-[#16090D] via-[#100A0C] to-[#090909] px-6 py-5 shadow-lg">
          <p className="font-era text-sm font-black text-white">
            A small safety note 💜
          </p>

          <p className="mt-2 text-sm font-medium leading-6 text-[#C8C8C8]">
            For announcements, ticketing, voting periods, and livestream
            details, always confirm the latest information through official BTS,
            BIGHIT MUSIC, and Weverse accounts.
          </p>
        </div>
      </section>
    </main>
  );
}