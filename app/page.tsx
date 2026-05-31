/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { PublicFooter } from "@/components/app/public-footer";
import { Analytics } from "@vercel/analytics/next";

const featureCards = [
  {
    eyebrow: "01",
    title: "ARMY Calendar",
    description:
      "Track anniversaries, birthdays, comeback reminders, fan events, streaming moments, and important dates.",
    href: "/calendar",
  },
  {
    eyebrow: "02",
    title: "Fan Projects",
    description:
      "Discover approved charity drives, birthday cafés, watch parties, streaming projects, and community moments.",
    href: "/projects",
  },
  {
    eyebrow: "03",
    title: "Memory Vault",
    description:
      "Save your BTS journey, concert memories, favorite moments, letters, and personal reflections privately.",
    href: "/vault",
  },
  {
    eyebrow: "04",
    title: "Personal Dashboard",
    description:
      "See your saved memories, real upcoming events, approved projects, profile details, and personal stats.",
    href: "/dashboard",
  },
];

const howItWorksCards = [
  {
    number: "01",
    title: "Create Your Profile",
    description:
      "Save your ARMY name, country, ARMY since year, favorite album, favorite song, bias, and favorite era.",
  },
  {
    number: "02",
    title: "Organize Your Hub",
    description:
      "Track important dates, explore fan projects, submit events, and keep your personal ARMY life organized.",
  },
  {
    number: "03",
    title: "Build Your Archive",
    description:
      "Save personal memories and reflections inside your private Memory Vault as your journey grows.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] bg-[linear-gradient(135deg,#fff_1px,transparent_1px)]ize:18px_18px]" />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.24),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.10),transparent_28%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
        <header className="rounded-full border border-[#2A2A2A] bg-[#0B0B0B]/95 px-5 py-3 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="font-era text-lg text-white! sm:text-xl">
                BorahaeHQ
              </span>

              <span className="font-era-label hidden bg-[#E11D48] px-3 py-1 text-[9px] text-white! sm:inline-flex">
                ARMY Hub
              </span>
            </Link>

            <nav className="hidden items-center gap-7 md:flex">
              <a
                href="#features"
                className="font-era-label text-[10px] text-white/75 transition hover:text-white"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                className="font-era-label text-[10px] text-white/75 transition hover:text-white"
              >
                How It Works
              </a>

              <Link
                href="/login"
                className="font-era-label text-[10px] text-white/75 transition hover:text-white"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="font-era-label rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
              >
                Get Started
              </Link>
            </nav>

            <Link
              href="/signup"
              className="font-era-label rounded-full bg-[#E11D48] px-4 py-2 text-[10px] text-white! transition hover:bg-[#C5163D] md:hidden"
            >
              Join
            </Link>
          </div>
        </header>

        <section className="relative mt-7 overflow-hidden rounded-4xl border border-[#2A2A2A] bg-[#050505] shadow-[0_26px_100px_rgba(0,0,0,0.55)]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/arirang/arirang-hero-bg.png')",
            }}
          />

          <div className="absolute inset-0 bg-black/55" />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.82)_46%,rgba(0,0,0,0.34)_100%)]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.30),transparent_34%)]" />

          <div className="relative z-10 grid min-h-165ms-end gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_0.78fr] lg:p-12">
            <div className="max-w-3xl">
              <p className="font-era-label inline-flex bg-[#E11D48] px-4 py-2 text-[10px] text-white!">
                ARMY Hub
              </p>

              <h1 className="font-era-display mt-6 text-6xl text-white! sm:text-7xl lg:text-8xl">
                Your ARMY Life,
                <span className="mt-4 block w-fit bg-[#E11D48] px-4 py-3 text-white!">
                  Organized.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl border-l-4 border-[#E11D48] pl-5 text-sm font-semibold leading-7 text-white/80 sm:text-base">
                BorahaeHQ is an unofficial ARMY command center for events, fan
                projects, personal memories, profile details, and your evolving
                BTS journey.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="font-era-label inline-flex rounded-full bg-[#E11D48] px-6 py-3.5 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
                >
                  Get Started
                </Link>

                <a
                  href="#features"
                  className="font-era-label inline-flex rounded-full border border-white bg-black/45 px-6 py-3.5 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-white hover:text-[#111111]!"
                >
                  Explore Features
                </a>
              </div>
            </div>

            <div className="rounded-4xl border border-white/20 bg-black/55 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-era-label text-[9px] text-[#E11D48]">
                    Today In BorahaeHQ
                  </p>

                  <p className="mt-2 text-sm font-bold text-white/85">
                    Your ARMY dashboard preview
                  </p>
                </div>

                <span className="font-era-label rounded-full bg-[#E11D48] px-3 py-1 text-[8px] text-white!">
                  Dashboard
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-white/15 bg-white p-4 text-[#111111]">
                <p className="font-era text-sm text-[#111111]">
                  Today&apos;s ARMY Tasks
                </p>

                <ul className="mt-3 space-y-2 text-xs font-semibold text-[#4B4B4B]">
                  <li>□ Check calendar</li>
                  <li>□ Save one memory</li>
                  <li>□ Explore fan projects</li>
                </ul>
              </div>

              <div className="mt-3 rounded-2xl border border-white/15 bg-[#E11D48] p-4">
                <p className="font-era-label text-[9px] text-white!">
                  Upcoming
                </p>

                <div className="mt-3 space-y-2 text-xs font-semibold text-white/85">
                  <p>June 13 — BTS Anniversary</p>
                  <p>Dec 4 — Jin Birthday</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div>
            <p className="font-era-label text-[10px] text-[#E11D48]">
              Features
            </p>

            <h2 className="font-era-display mt-4 max-w-4xl text-5xl text-white! sm:text-6xl">
              Everything Your
              <span className="mt-3 block w-fit bg-[#E11D48] px-4 py-2 text-white!">
                ARMY HQ Needs.
              </span>
            </h2>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group rounded-4xl border border-[#2A2A2A] bg-white p-6 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.32)] transition hover:-translate-y-1 hover:border-[#E11D48]"
              >
                <p className="font-era-label text-[10px] text-[#E11D48]">
                  {feature.eyebrow}
                </p>

                <h3 className="font-era mt-5 text-2xl leading-[1.12] text-[#111111]">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-[#4B4B4B]">
                  {feature.description}
                </p>

                <p className="font-era-label mt-6 text-[10px] text-[#E11D48]">
                  Explore →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className="relative overflow-hidden rounded-4xl border border-[#2A2A2A] bg-[#0B0B0B] px-6 py-10 shadow-[0_20px_70px_rgba(0,0,0,0.4)] sm:px-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.24),transparent_34%)]" />

          <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(135deg,#fff_1px,transparent_1px)] bg-size-[18px_18px]" />

          <div className="relative z-10">
            <p className="font-era-label text-[10px] text-[#E11D48]">
              How It Works
            </p>

            <h2 className="font-era-display mt-4 max-w-4xl text-5xl text-white! sm:text-6xl">
              Start Your Hub.
              <span className="mt-3 block w-fit bg-[#E11D48] px-4 py-2 text-white!">
                Stay Organized.
              </span>
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {howItWorksCards.map((item) => (
                <article
                  key={item.number}
                  className="rounded-4xl border border-white/15 bg-black/45 p-6 backdrop-blur-sm"
                >
                  <span className="font-era-label inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E11D48] text-[10px] text-white!">
                    {item.number}
                  </span>

                  <h3 className="font-era mt-5 text-2xl leading-[1.12] text-white!">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-white/70">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-10">
          <PublicFooter />
        </footer>
      </div>
    </main>
  );
}
