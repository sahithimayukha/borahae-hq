/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { PageHero } from "@/components/app/page-hero";
import { DeleteMemoryButton } from "@/components/vault/delete-memory-button";
import { EditMemoryForm } from "@/components/vault/edit-memory-form";
import { MemoryForm } from "@/components/vault/memory-form";
import { createClient } from "@/lib/supabase/server";
import type { Memory } from "@/types/database";

type VaultPageProps = {
  searchParams?: Promise<{
    q?: string;
    mood?: string;
  }>;
};

type MemoryCardProps = {
  memory: Memory;
  coverImageUrl: string | null;
  userId: string;
};

type VaultToolsProps = {
  moodOptions: string[];
  searchQuery: string;
  selectedMood: string;
};

type VaultHrefOptions = {
  mood: string;
  searchQuery: string;
};

function formatMemoryDate(date: string | null) {
  if (!date) {
    return "Undated Memory";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function getVaultHref({ mood, searchQuery }: VaultHrefOptions) {
  const params = new URLSearchParams();

  if (mood !== "All") {
    params.set("mood", mood);
  }

  if (searchQuery) {
    params.set("q", searchQuery);
  }

  const queryString = params.toString();

  return queryString ? `/vault?${queryString}` : "/vault";
}

function getMoodOptions(moodRows: Array<{ mood: string | null }>) {
  const uniqueMoods = new Set<string>();

  moodRows.forEach((row) => {
    const trimmedMood = row.mood?.trim();

    if (trimmedMood) {
      uniqueMoods.add(trimmedMood);
    }
  });

  return Array.from(uniqueMoods).sort((firstMood, secondMood) =>
    firstMood.localeCompare(secondMood),
  );
}

function MemoryCard({
  memory,
  coverImageUrl,
  userId,
}: MemoryCardProps) {
  return (
    <article className="overflow-hidden rounded-4xl border border-[#2A2A2A] bg-white text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
      {coverImageUrl ? (
        <div className="relative overflow-hidden bg-[#111111]">
          <img
            src={coverImageUrl}
            alt={`Visual cover for ${memory.title}`}
            className="h-72 w-full object-cover transition duration-500 hover:scale-[1.03]"
          />

          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent px-5 pb-5 pt-16">
            <p className="font-era-label text-[9px] text-white!">
              Private Visual Diary
            </p>
          </div>
        </div>
      ) : (
        <div className="relative min-h-32 overflow-hidden bg-[#0B0B0B] p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.34),transparent_42%)]" />

          <p className="font-era-label relative z-10 text-[9px] text-[#E11D48]">
            Private Journal Entry
          </p>

          <p className="font-era relative z-10 mt-4 text-2xl leading-[1.08] text-white!">
            Memory Vault
          </p>
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-era-label text-[10px] text-[#E11D48]">
              {formatMemoryDate(memory.memory_date)}
            </p>

            <h2 className="font-era mt-3 text-3xl leading-[1.08] text-[#111111]">
              {memory.title}
            </h2>
          </div>

          <span className="font-era-label inline-flex w-fit rounded-full bg-[#111111] px-4 py-2 text-[9px] text-white!">
            Private
          </span>
        </div>

        {memory.mood ? (
          <p className="mt-4 inline-flex rounded-full bg-[#F7F7F7] px-4 py-2 text-sm font-bold text-[#111111]">
            Mood: {memory.mood}
          </p>
        ) : null}

        <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[#4B4B4B]">
          {memory.content}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
  <EditMemoryForm
    memory={memory}
    userId={userId}
    currentCoverImageUrl={coverImageUrl}
  />

  <DeleteMemoryButton
    memoryId={memory.id}
    coverImagePath={memory.cover_image_path}
  />
</div>
      </div>
    </article>
  );
}

function VaultTools({
  moodOptions,
  searchQuery,
  selectedMood,
}: VaultToolsProps) {
  return (
    <section className="rounded-4xl border border-[#2A2A2A] bg-[#0B0B0B] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-era-label text-[10px] text-[#E11D48]">
              Search Visual Diary
            </p>

            <h2 className="font-era mt-3 text-3xl leading-[1.05] text-white!">
              Find A Memory
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
              Search your private visual diary by title or filter entries by
              mood.
            </p>
          </div>

          <form
            action="/vault"
            method="get"
            className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl"
          >
            {selectedMood !== "All" ? (
              <input type="hidden" name="mood" value={selectedMood} />
            ) : null}

            <label htmlFor="memory-search" className="sr-only">
              Search memories by title
            </label>

            <input
              id="memory-search"
              name="q"
              type="search"
              defaultValue={searchQuery}
              placeholder="Search memory title..."
              maxLength={80}
              className="min-w-0 flex-1 rounded-full border border-[#2A2A2A] bg-white px-5 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
            />

            <button
              type="submit"
              className="font-era-label inline-flex items-center justify-center rounded-full bg-[#E11D48] px-6 py-3.5 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
            >
              Search
            </button>

            {searchQuery ? (
              <Link
                href={getVaultHref({
                  mood: selectedMood,
                  searchQuery: "",
                })}
                className="font-era-label inline-flex items-center justify-center rounded-full border border-white/30 bg-[#151515] px-6 py-3.5 text-[10px] text-white! transition hover:bg-[#222222]"
              >
                Clear
              </Link>
            ) : null}
          </form>
        </div>

        <div className="border-t border-white/10 pt-5">
          <p className="font-era-label text-[10px] text-white!">
            Filter By Mood
          </p>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {["All", ...moodOptions].map((mood) => {
              const isActive = selectedMood === mood;

              return (
                <Link
                  key={mood}
                  href={getVaultHref({
                    mood,
                    searchQuery,
                  })}
                  className={`font-era-label shrink-0 rounded-full px-4 py-2 text-[10px] transition ${
                    isActive
                      ? "bg-[#E11D48] text-white!"
                      : "bg-[#151515] text-white! hover:bg-[#222222]"
                  }`}
                >
                  {mood}
                </Link>
              );
            })}
          </div>

          <p className="mt-3 text-xs font-semibold leading-5 text-white/55">
            Mood filters appear automatically from your saved diary entries.
          </p>
        </div>
      </div>
    </section>
  );
}

export default async function VaultPage({
  searchParams,
}: VaultPageProps) {
  const resolvedSearchParams = await searchParams;

  const searchQuery = (resolvedSearchParams?.q ?? "")
    .trim()
    .slice(0, 80);

  const requestedMood = (resolvedSearchParams?.mood ?? "All").trim();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: moodRowsData, error: moodRowsError } = await supabase
    .from("memories")
    .select("mood")
    .eq("user_id", user.id)
    .order("mood", { ascending: true });

  const moodOptions = getMoodOptions(
    (moodRowsData ?? []) as Array<{ mood: string | null }>,
  );

  const selectedMood =
    requestedMood === "All" || moodOptions.includes(requestedMood)
      ? requestedMood
      : "All";

  let memoriesQuery = supabase
    .from("memories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (selectedMood !== "All") {
    memoriesQuery = memoriesQuery.eq("mood", selectedMood);
  }

  if (searchQuery) {
    memoriesQuery = memoriesQuery.ilike(
      "title",
      `%${searchQuery}%`,
    );
  }

  const { data: memoriesData, error: memoriesError } =
    await memoriesQuery;

  const memories = (memoriesData ?? []) as Memory[];

  const coverImagePaths = memories
    .map((memory) => memory.cover_image_path)
    .filter((path): path is string => Boolean(path));

  const signedUrlByPath = new Map<string, string>();

  let signedImageErrorMessage = "";

  if (coverImagePaths.length > 0) {
    const {
      data: signedImageData,
      error: signedImageError,
    } = await supabase.storage
      .from("memory-images")
      .createSignedUrls(coverImagePaths, 60 * 60);

    if (signedImageError) {
      signedImageErrorMessage = signedImageError.message;
    }

    signedImageData?.forEach((signedImage) => {
      if (signedImage.path && signedImage.signedUrl) {
        signedUrlByPath.set(
          signedImage.path,
          signedImage.signedUrl,
        );
      }
    });
  }

  const pageError = moodRowsError ?? memoriesError;

  return (
    <AppShell activePath="/vault">
      <PageHero
        eyebrow="Memory Vault"
        title="Your ARIRANG Visual Diary"
        description="Save private BTS memories, visual covers, concert reflections, fan letters, and the moments that shaped your ARMY journey."
      />

      <MemoryForm userId={user.id} />

      <VaultTools
        moodOptions={moodOptions}
        searchQuery={searchQuery}
        selectedMood={selectedMood}
      />

      {pageError ? (
        <div className="rounded-4xlrder border-[#E11D48] bg-[#FFF1F3] p-6 text-[#B91C3B]">
          <h2 className="font-era text-xl leading-[1.1]">
            Memories Could Not Load
          </h2>

          <p className="mt-3 text-sm leading-6">
            Supabase returned this message: {pageError.message}
          </p>
        </div>
      ) : null}

      {signedImageErrorMessage ? (
        <div className="rounded-4xl border border-[#E11D48] bg-[#FFF1F3] p-6 text-[#B91C3B]">
          <h2 className="font-era text-xl leading-[1.1]">
            Some Diary Images Could Not Load
          </h2>

          <p className="mt-3 text-sm leading-6">
            Supabase returned this message: {signedImageErrorMessage}
          </p>
        </div>
      ) : null}

      {!pageError && memories.length > 0 ? (
        <div className="space-y-5">
          <div>
            <h2 className="font-era text-3xl leading-[1.05] text-white!">
              {searchQuery || selectedMood !== "All"
                ? "Filtered Diary Entries"
                : "Saved Visual Memories"}
            </h2>

            <p className="mt-2 text-sm text-white/70">
              {searchQuery
                ? `${memories.length} memor${
                    memories.length === 1 ? "y" : "ies"
                  } found for “${searchQuery}”.`
                : selectedMood !== "All"
                  ? `Showing ${memories.length} ${selectedMood} memor${
                      memories.length === 1 ? "y" : "ies"
                    }.`
                  : "Your newest visual diary entries appear first."}
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {memories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                userId={user.id}
                coverImageUrl={
                  memory.cover_image_path
                    ? signedUrlByPath.get(memory.cover_image_path) ??
                      null
                    : null
                }
              />
            ))}
          </div>
        </div>
      ) : null}

      {!pageError && memories.length === 0 ? (
        <div className="rounded-4xl border border-[#2A2A2A] bg-white p-8 text-center text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
          <p className="font-era text-3xl leading-[1.05] text-[#E11D48]">
            {searchQuery || selectedMood !== "All"
              ? "No Matching Memories"
              : "Your Visual Diary Is Empty"}
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#4B4B4B]">
            {searchQuery || selectedMood !== "All"
              ? "No diary entries match the current filters. Try another search or reset the Vault."
              : "Save your first BTS memory and optionally add a visual cover image."}
          </p>

          {searchQuery || selectedMood !== "All" ? (
            <Link
              href="/vault"
              className="font-era-label mt-5 inline-flex rounded-full bg-[#E11D48] px-6 py-3.5 text-[10px] text-white! transition hover:bg-[#C5163D]"
            >
              Reset Vault
            </Link>
          ) : null}
        </div>
      ) : null}
    </AppShell>
  );
}