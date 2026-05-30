"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const dailyPrompts = [
  "Which BTS song feels like a safe place today?",
  "What ARMY memory would you preserve inside a time capsule?",
  "Which performance made you admire their artistry all over again?",
  "What BTS message has stayed with you recently?",
  "Which era brings back the warmest memories for you?",
  "What was the first BTS song that made you pause and listen closely?",
  "Which small BTS moment made you smile when you needed it most?",
  "What concert memory would you relive for five more minutes?",
  "Which album feels closest to your current chapter of life?",
  "What is one ARMY friendship or community moment you are grateful for?",
  "Which member’s words gave you comfort at the right time?",
  "What is one detail from your BTS journey that you never want to forget?",
  "Which music video world would you visit for one day?",
  "What song would you choose as the soundtrack for today?",
  "Which BTS performance feels timeless to you?",
  "What was your happiest comeback-season memory?",
  "Which fan project or ARMY moment made you feel proud of the community?",
  "What BTS-related moment surprised you with unexpected joy?",
  "Which song do you return to when your mind feels crowded?",
  "What memory would you write as a letter to your future self?",
  "Which album track deserves a little extra appreciation today?",
];

function getPromptForToday() {
  const today = new Date();

  const localMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const dayNumber = Math.floor(localMidnight.getTime() / 86_400_000);

  const promptIndex = Math.abs(dayNumber) % dailyPrompts.length;

  return dailyPrompts[promptIndex];
}

export function DailyMemoryPrompt() {
  const [dailyPrompt, setDailyPrompt] = useState(dailyPrompts[0]);

  useEffect(() => {
    function updateDailyPrompt() {
      setDailyPrompt(getPromptForToday());
    }

    updateDailyPrompt();

    const intervalId = window.setInterval(updateDailyPrompt, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <article className="relative overflow-hidden rounded-4xl border border-[#2A2A2A] bg-[#F7F7F7] p-6 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
      <div className="absolute right-0 top-0 bg-[#E11D48] px-4 py-3">
        <p className="font-era-label text-[9px] text-white!">Daily Prompt</p>
      </div>

      <p className="font-era-label text-[10px] text-[#E11D48]">
        Memory Vault Journal
      </p>

      <h2 className="font-era mt-4 text-2xl leading-[1.08] text-[#111111]">
        Save Today&apos;s Memory
      </h2>

      <p className="mt-5 max-w-xl border-l-4 border-[#E11D48] pl-4 text-sm font-bold leading-7 text-[#4B4B4B]">
        {dailyPrompt}
      </p>

      <p className="mt-4 text-xs font-semibold leading-5 text-[#777777]">
        A new journaling prompt appears each day.
      </p>

      <Link
        href="/vault"
        className="font-era-label mt-6 inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
      >
        Add Memory
      </Link>
    </article>
  );
}