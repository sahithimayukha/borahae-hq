/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CalendarEvent } from "@/types/database";

type NextEventCountdownProps = {
  event: CalendarEvent | null;
};

const millisecondsPerDay = 1000 * 60 * 60 * 24;

function parseDateOnly(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function calculateDaysRemaining(eventDate: string) {
  const today = new Date();

  const todayAtMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const eventAtMidnight = parseDateOnly(eventDate);

  return Math.max(
    0,
    Math.ceil(
      (eventAtMidnight.getTime() - todayAtMidnight.getTime()) /
        millisecondsPerDay,
    ),
  );
}

function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parseDateOnly(date));
}

function getCountdownLabel(daysRemaining: number) {
  if (daysRemaining === 0) {
    return "Today";
  }

  if (daysRemaining === 1) {
    return "Tomorrow";
  }

  return `${daysRemaining} Days Remaining`;
}

export function NextEventCountdown({ event }: NextEventCountdownProps) {
  const initialDaysRemaining = event
    ? calculateDaysRemaining(event.event_date)
    : 0;

  const [daysRemaining, setDaysRemaining] = useState(initialDaysRemaining);

  useEffect(() => {
    if (!event) {
      setDaysRemaining(0);
      return;
    }

    const eventDate = event.event_date;

    function updateCountdown() {
      setDaysRemaining(calculateDaysRemaining(eventDate));
    }

    updateCountdown();

    const intervalId = window.setInterval(updateCountdown, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [event]);

  if (!event) {
    return (
      <section className="relative overflow-hidden rounded-4xl border border-[#2A2A2A] bg-[#0B0B0B] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.42)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.24),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.10),transparent_28%)]" />

        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(135deg,#fff_1px,transparent_1px)] bg-size-[18px_18px]" />

        <div className="relative z-10">
          <p className="font-era-label text-[10px] text-[#E11D48]">
            Next ARMY Event
          </p>

          <h2 className="font-era-display mt-4 max-w-4xl text-5xl text-white! sm:text-6xl">
            Your Calendar Is
            <span className="mt-3 block w-fit bg-[#E11D48] px-4 py-2 text-white!">
              Waiting.
            </span>
          </h2>

          <p className="mt-5 max-w-2xl border-l-4 border-[#E11D48] pl-4 text-sm font-semibold leading-7 text-white/75">
            Add an anniversary, birthday, watch party, streaming reminder, or
            fan event to begin your countdown.
          </p>

          <Link
            href="/calendar"
            className="font-era-label mt-6 inline-flex rounded-full bg-[#E11D48] px-6 py-3.5 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
          >
            Add Calendar Event
          </Link>
        </div>
      </section>
    );
  }

  const nextEvent = event;

  return (
    <section className="relative overflow-hidden rounded-4xl border border-[#2A2A2A] bg-[#0B0B0B] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.42)] sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.30),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.12),transparent_28%)]" />

      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(135deg,#fff_1px,transparent_1px)]ize:18px_18px]" />

      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-era-label text-[10px] text-[#E11D48]">
            Next ARMY Event
          </p>

          <h2 className="font-era-display mt-4 max-w-4xl text-5xl text-white! sm:text-6xl">
            {nextEvent.title}
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="font-era-label inline-flex rounded-full bg-[#E11D48] px-4 py-2 text-[10px] text-white!">
              {nextEvent.category}
            </span>

            <span className="font-era-label inline-flex rounded-full border border-white/20 bg-black/35 px-4 py-2 text-[10px] text-white!">
              {formatEventDate(nextEvent.event_date)}
            </span>

            {nextEvent.location ? (
              <span className="font-era-label inline-flex rounded-full border border-white/20 bg-black/35 px-4 py-2 text-[10px] text-white!">
                {nextEvent.location}
              </span>
            ) : null}

            {nextEvent.is_global ? (
              <span className="font-era-label inline-flex rounded-full border border-white/20 bg-black/35 px-4 py-2 text-[10px] text-white!">
                Global
              </span>
            ) : null}
          </div>

          {nextEvent.description ? (
            <p className="mt-5 max-w-2xl border-l-4 border-[#E11D48] pl-4 text-sm font-semibold leading-7 text-white/75">
              {nextEvent.description}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/calendar"
              className="font-era-label inline-flex rounded-full bg-[#E11D48] px-6 py-3.5 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
            >
              View Calendar
            </Link>

            {nextEvent.event_link ? (
              <a
                href={nextEvent.event_link}
                target="_blank"
                rel="noreferrer"
                className="font-era-label inline-flex rounded-full border border-white/30 bg-[#151515] px-6 py-3.5 text-[10px] text-white! transition hover:bg-[#222222]"
              >
                Open Event Link
              </a>
            ) : null}
          </div>
        </div>

        <div className="flex min-w-55 flex-col items-center justify-center rounded-4xl border border-white/20 bg-white px-6 py-7 text-center text-[#111111] shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
          <p className="font-era-label text-[10px] text-[#E11D48]">
            Countdown
          </p>

          <p className="mt-4 text-6xl font-black leading-none text-[#111111]">
            {daysRemaining}
          </p>

          <p className="font-era mt-3 text-2xl leading-[1.05] text-[#111111]">
            {getCountdownLabel(daysRemaining)}
          </p>
        </div>
      </div>
    </section>
  );
}