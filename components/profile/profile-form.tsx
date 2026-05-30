"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

type ProfileFormProps = {
  userId: string;
  userEmail: string | null;
  initialProfile: Profile | null;
  fallbackDisplayName: string;
};

export function ProfileForm({
  userId,
  userEmail,
  initialProfile,
  fallbackDisplayName,
}: ProfileFormProps) {
  const router = useRouter();

  const [displayName, setDisplayName] = useState(
    initialProfile?.display_name || fallbackDisplayName,
  );

  const [country, setCountry] = useState(initialProfile?.country || "");

  const [armySince, setArmySince] = useState(
    initialProfile?.army_since?.toString() || "",
  );

  const [bias, setBias] = useState(initialProfile?.bias || "");

  const [favoriteAlbum, setFavoriteAlbum] = useState(
    initialProfile?.favorite_album || "",
  );

  const [favoriteSong, setFavoriteSong] = useState(
    initialProfile?.favorite_song || "",
  );

  const [favoriteEra, setFavoriteEra] = useState(
    initialProfile?.favorite_era || "",
  );

  const [favoriteQuote, setFavoriteQuote] = useState(
    initialProfile?.favorite_quote || "",
  );

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSaveProfile(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    const trimmedDisplayName = displayName.trim();

    if (!trimmedDisplayName) {
      setErrorMessage("Please enter your display name.");
      return;
    }

    const parsedArmySince = armySince ? Number(armySince) : null;

    if (
      parsedArmySince !== null &&
      (!Number.isInteger(parsedArmySince) ||
        parsedArmySince < 2013 ||
        parsedArmySince > new Date().getFullYear())
    ) {
      setErrorMessage(
        `ARMY since year must be between 2013 and ${new Date().getFullYear()}.`,
      );

      return;
    }

    setIsSaving(true);

    const supabase = createClient();

    const profilePayload = {
      user_id: userId,
      display_name: trimmedDisplayName,
      country: country.trim() || null,
      army_since: parsedArmySince,
      bias: bias.trim() || null,
      favorite_album: favoriteAlbum.trim() || null,
      favorite_song: favoriteSong.trim() || null,
      favorite_era: favoriteEra.trim() || null,
      favorite_quote: favoriteQuote.trim() || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(profilePayload, {
        onConflict: "user_id",
      });

    if (error) {
      setErrorMessage(error.message);
      setIsSaving(false);
      return;
    }

    setMessage("Your ARMY profile has been saved.");
    setIsSaving(false);

    router.refresh();
  }

  return (
    <form
      onSubmit={handleSaveProfile}
      className="rounded-4xl border border-[#2A2A2A] bg-white p-6 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-8"
    >
      <p className="font-era-label text-[10px] text-[#E11D48]">
        Personal Details
      </p>

      <h2 className="font-era mt-3 text-3xl leading-[1.08] text-[#111111]">
        Edit Your ARMY Profile
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4B4B4B]">
        Add details that make your personal dashboard feel more like your own
        ARMY home base.
      </p>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="displayName"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Display Name
          </label>

          <input
            id="displayName"
            name="displayName"
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Your ARMY name"
            maxLength={80}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Account Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={userEmail ?? ""}
            disabled
            className="w-full cursor-not-allowed rounded-2xl border border-[#D1D5DB] bg-[#F7F7F7] px-4 py-3.5 text-sm font-semibold text-[#777777]"
          />
        </div>

        <div>
          <label
            htmlFor="country"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Country
          </label>

          <input
            id="country"
            name="country"
            type="text"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            placeholder="Your country"
            maxLength={80}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div>
          <label
            htmlFor="armySince"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            ARMY Since Year
          </label>

          <input
            id="armySince"
            name="armySince"
            type="number"
            value={armySince}
            onChange={(event) => setArmySince(event.target.value)}
            placeholder="Example: 2020"
            min={2013}
            max={new Date().getFullYear()}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div>
          <label
            htmlFor="bias"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Bias
          </label>

          <input
            id="bias"
            name="bias"
            type="text"
            value={bias}
            onChange={(event) => setBias(event.target.value)}
            placeholder="Your bias or OT7"
            maxLength={80}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div>
          <label
            htmlFor="favoriteAlbum"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Favorite Album
          </label>

          <input
            id="favoriteAlbum"
            name="favoriteAlbum"
            type="text"
            value={favoriteAlbum}
            onChange={(event) => setFavoriteAlbum(event.target.value)}
            placeholder="Your favorite album"
            maxLength={120}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div>
          <label
            htmlFor="favoriteSong"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Favorite Song
          </label>

          <input
            id="favoriteSong"
            name="favoriteSong"
            type="text"
            value={favoriteSong}
            onChange={(event) => setFavoriteSong(event.target.value)}
            placeholder="Your favorite song"
            maxLength={120}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div>
          <label
            htmlFor="favoriteEra"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Favorite Era
          </label>

          <input
            id="favoriteEra"
            name="favoriteEra"
            type="text"
            value={favoriteEra}
            onChange={(event) => setFavoriteEra(event.target.value)}
            placeholder="Your favorite BTS era"
            maxLength={120}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="favoriteQuote"
          className="font-era-label mb-2 block text-[10px] text-[#111111]"
        >
          Favorite Quote
        </label>

        <textarea
          id="favoriteQuote"
          name="favoriteQuote"
          value={favoriteQuote}
          onChange={(event) => setFavoriteQuote(event.target.value)}
          placeholder="A favorite BTS quote or personal note"
          maxLength={300}
          rows={5}
          className="w-full resize-y rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold leading-6 text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
        />
      </div>

      {errorMessage ? (
        <div className="mt-5 rounded-2xl border border-[#E11D48] bg-[#FFF1F3] px-4 py-3 text-sm font-bold text-[#B91C3B]">
          {errorMessage}
        </div>
      ) : null}

      {message ? (
        <div className="mt-5 rounded-2xl border border-[#166534] bg-[#F0FDF4] px-4 py-3 text-sm font-bold text-[#166534]">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSaving}
        className="font-era-label mt-6 inline-flex rounded-full bg-[#E11D48] px-6 py-3.5 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}