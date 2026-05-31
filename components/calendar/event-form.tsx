"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DateInput } from "@/components/ui/date-input";

type EventFormProps = {
  userId: string;
};

const eventCategories = [
  "Anniversary",
  "Birthday",
  "Comeback",
  "Concert",
  "Streaming",
  "Voting",
  "Fan Event",
  "Watch Party",
  "Charity",
];

function isValidOptionalUrl(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return true;
  }

  try {
    const url = new URL(trimmedValue);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function EventForm({ userId }: EventFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(eventCategories[0]);
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [isGlobal, setIsGlobal] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    const trimmedTitle = title.trim();
    const trimmedLocation = location.trim();
    const trimmedDescription = description.trim();
    const trimmedEventLink = eventLink.trim();

    if (!trimmedTitle) {
      setErrorMessage("Please enter an event title.");
      return;
    }

    if (trimmedTitle.length < 3) {
      setErrorMessage("Event title must contain at least 3 characters.");
      return;
    }

    if (!eventDate) {
      setErrorMessage("Please choose an event date.");
      return;
    }

    if (!eventCategories.includes(category)) {
      setErrorMessage("Please choose a valid event category.");
      return;
    }

    if (!isValidOptionalUrl(trimmedEventLink)) {
      setErrorMessage(
        "Event link must start with http:// or https://, or remain empty.",
      );
      return;
    }

    setIsSaving(true);

    const supabase = createClient();

    const { error } = await supabase.from("events").insert({
      created_by: userId,
      title: trimmedTitle,
      category,
      event_date: eventDate,
      location: trimmedLocation || null,
      description: trimmedDescription || null,
      event_link: trimmedEventLink || null,
      is_global: isGlobal,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSaving(false);
      return;
    }

    setTitle("");
    setCategory(eventCategories[0]);
    setEventDate("");
    setLocation("");
    setDescription("");
    setEventLink("");
    setIsGlobal(false);

    setMessage("Your calendar event has been added.");
    setIsSaving(false);

    router.refresh();
  }

  return (
    <section className="rounded-4xl border border-[#2A2A2A] bg-white p-6 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-8">
      <p className="font-era-label text-[10px] text-[#E11D48]">
        Calendar Editor
      </p>

      <h2 className="font-era mt-3 text-3xl leading-[1.08] text-[#111111]">
        Add An ARMY Event
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4B4B4B]">
        Add an anniversary, birthday, comeback reminder, fan event, streaming
        moment, voting deadline, watch party, or charity project date.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="event-title"
              className="font-era-label mb-2 block text-[10px] text-[#111111]"
            >
              Event Title
            </label>

            <input
              id="event-title"
              name="eventTitle"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: ARIRANG streaming party"
              maxLength={120}
              required
              className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
            />
          </div>

          <div>
            <label
              htmlFor="event-category"
              className="font-era-label mb-2 block text-[10px] text-[#111111]"
            >
              Category
            </label>

            <select
              id="event-category"
              name="eventCategory"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
            >
              {eventCategories.map((eventCategory) => (
                <option key={eventCategory} value={eventCategory}>
                  {eventCategory}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="event-date"
              className="font-era-label mb-2 block text-[10px] text-[#111111]"
            >
              Event Date
            </label>

            <DateInput
              id="event-date"
              name="eventDate"
              // type="date"
              value={eventDate}
              onChange={(event) => setEventDate(event.target.value)}
              required
              className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
            />
          </div>

          <div>
            <label
              htmlFor="event-location"
              className="font-era-label mb-2 block text-[10px] text-[#111111]"
            >
              Location
            </label>

            <input
              id="event-location"
              name="eventLocation"
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Example: Online, Seoul, Bengaluru"
              maxLength={120}
              className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="event-description"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Description
          </label>

          <textarea
            id="event-description"
            name="eventDescription"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add a short note about the event..."
            maxLength={600}
            rows={4}
            className="w-full resize-y rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold leading-6 text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div>
          <label
            htmlFor="event-link"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            External Link
          </label>

          <input
            id="event-link"
            name="eventLink"
            type="url"
            value={eventLink}
            onChange={(event) => setEventLink(event.target.value)}
            placeholder="https://example.com"
            maxLength={500}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />

          <p className="mt-2 text-xs font-semibold leading-5 text-[#777777]">
            Optional. Use an official or trusted source when adding an external
            link.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#2A2A2A] bg-[#F7F7F7] p-4">
          <input
            type="checkbox"
            checked={isGlobal}
            onChange={(event) => setIsGlobal(event.target.checked)}
            className="mt-1 h-4 w-4 accent-[#E11D48]"
          />

          <span>
            <span className="font-era-label block text-[10px] text-[#111111]">
              Global Event
            </span>

            <span className="mt-2 block text-sm leading-6 text-[#4B4B4B]">
              Select this when ARMY can join from any location.
            </span>
          </span>
        </label>

        {errorMessage ? (
          <div className="rounded-2xl border border-[#E11D48] bg-[#FFF1F3] px-4 py-3 text-sm font-bold text-[#B91C3B]">
            {errorMessage}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-2xl border border-[#166534] bg-[#F0FDF4] px-4 py-3 text-sm font-bold text-[#166534]">
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSaving}
          className="font-era-label inline-flex rounded-full bg-[#E11D48] px-6 py-3.5 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Adding Event..." : "Add Calendar Event"}
        </button>
      </form>
    </section>
  );
}