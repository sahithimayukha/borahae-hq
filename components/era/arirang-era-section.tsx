"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ArirangEraSectionProps = {
  displayName: string;
};

// const arirangCards = ["Events", "Fan Projects", "Memories"];

function getGreeting() {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good Morning";
  }

  if (currentHour >= 12 && currentHour < 17) {
    return "Good Afternoon";
  }

  if (currentHour >= 17 && currentHour < 21) {
    return "Good Evening";
  }

  return "Good Night";
}

export function ArirangEraSection({
  displayName,
}: ArirangEraSectionProps) {
  const [greeting, setGreeting] = useState("Welcome Back");

  useEffect(() => {
    function updateGreeting() {
      setGreeting(getGreeting());
    }

    updateGreeting();

    const intervalId = window.setInterval(updateGreeting, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <section
      className="relative min-h-160 overflow-hidden rounded-4xl border border-[#2A2A2A] bg-[#050505] bg-cover bg-center bg-no-repeat shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
      style={{
        backgroundImage: "url('/arirang/arirang-hero-bg.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/45" />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.72)_52%,rgba(0,0,0,0.18)_100%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.34),transparent_34%)]" />

      <div className="relative z-10 flex min-h-160ms-end p-6 sm:p-8 lg:p-10">
        <div className="max-w-4xl">
          <p className="font-era-label inline-flex bg-[#E11D48] px-4 py-2 text-[10px] text-white!">
            ARIRANG Era
          </p>

          <h1 className="font-era-display mt-5 text-6xl text-white! sm:text-7xl lg:text-8xl">
            BorahaeHQ
            <span className="mt-4 block w-fit bg-[#E11D48] px-4 py-3 text-white!">
              ARMY Hub
            </span>
          </h1>

          <div className="mt-6 max-w-2xl border-l-4 border-[#E11D48] bg-black/50 px-5 py-4 backdrop-blur-sm">
            <p className="font-era text-2xl leading-[1.08] text-white! sm:text-3xl">
              {greeting}, {displayName}
            </p>

            <p className="mt-2 text-sm font-semibold leading-6 text-white/80">
              Your ARMY hub is ready today.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/calendar"
              className="font-era-label inline-flex rounded-full bg-white px-5 py-3 text-[10px] text-[#111111]! transition hover:-translate-y-0.5"
            >
              Calendar
            </Link>

            <Link
              href="/projects"
              className="font-era-label inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
            >
              Projects
            </Link>

            <Link
              href="/vault"
              className="font-era-label inline-flex rounded-full border border-white bg-black/40 px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-black/60"
            >
              Memory
            </Link>
          </div>

          {/* <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            {arirangCards.map((item) => (
              <div
                key={item}
                className="border border-white/20 bg-black/55 p-4 backdrop-blur-sm"
              >
                <p className="font-era-label text-[9px] text-[#E11D48]">
                  BorahaeHQ
                </p>

                <p className="font-era mt-2 text-sm leading-[1.08] !text-white">
                  {item}
                </p>
              </div>
            ))}
          </div> */}

          <p className="mt-6 max-w-2xl text-xs leading-5 text-white/70">
            BorahaeHQ remains an unofficial fan-made platform.
          </p>
        </div>
      </div>
    </section>
  );
}