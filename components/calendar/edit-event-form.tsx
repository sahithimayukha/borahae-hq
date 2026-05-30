"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { CalendarEvent } from "@/types/database";

type EditEventFormProps = {
  event: CalendarEvent;
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

export function EditEventForm({
  event,
  userId,
}: EditEventFormProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(event.title);
  const [category, setCategory] = useState(event.category);
  const [eventDate, setEventDate] = useState(event.event_date);
  const [location, setLocation] = useState(event.location ?? "");
  const [description, setDescription] = useState(
    event.description ?? "",
  );
  const [eventLink, setEventLink] = useState(event.event_link ?? "");
  const [isGlobal, setIsGlobal] = useState(event.is_global);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function restoreSavedValues() {
    setTitle(event.title);
    setCategory(event.category);
    setEventDate(event.event_date);
    setLocation(event.location ?? "");
    setDescription(event.description ?? "");
    setEventLink(event.event_link ?? "");
    setIsGlobal(event.is_global);
    setMessage("");
    setErrorMessage("");
  }

  function handleCancel() {
    restoreSavedValues();
    setIsEditing(false);
  }

  async function handleUpdate(
    formEvent: React.FormEvent<HTMLFormElement>,
  ) {
    formEvent.preventDefault();

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

    const { error } = await supabase
      .from("events")
      .update({
        title: trimmedTitle,
        category,
        event_date: eventDate,
        location: trimmedLocation || null,
        description: trimmedDescription || null,
        event_link: trimmedEventLink || null,
        is_global: isGlobal,
        updated_at: new Date().toISOString(),
      })
      .eq("id", event.id)
      .eq("created_by", userId);

    if (error) {
      setErrorMessage(error.message);
      setIsSaving(false);
      return;
    }

    setMessage("Your calendar event has been updated.");
    setIsSaving(false);

    router.refresh();

    window.setTimeout(() => {
      setIsEditing(false);
      setMessage("");
    }, 900);
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        style={{
          fontSize: "10px",
          lineHeight: "1",
          fontWeight: 900,
        }}
        className="inline-flex items-center justify-center rounded-full border border-[#111111] bg-white px-3 py-2 font-black uppercase tracking-[0.14em] text-[#111111] transition hover:bg-[#F7F7F7]"
      >
        Edit
      </button>
    );
  }

  return (
    <form
      onSubmit={handleUpdate}
      className="mt-6 rounded-4xl border border-[#2A2A2A] bg-[#F7F7F7] p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-era-label text-[10px] text-[#E11D48]">
            Event Editor
          </p>

          <h3 className="font-era mt-3 text-2xl leading-[1.08] text-[#111111]">
            Update This Event
          </h3>
        </div>

        <button
          type="button"
          onClick={handleCancel}
          className="font-era-label inline-flex w-fit rounded-full border border-[#2A2A2A] bg-white px-4 py-2 text-[9px] text-[#111111] transition hover:bg-[#EFEFEF]"
        >
          Cancel
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor={`edit-title-${event.id}`}
            className="font-era-label mb-2 block text-[9px] text-[#111111]"
          >
            Event Title
          </label>

          <input
            id={`edit-title-${event.id}`}
            type="text"
            value={title}
            onChange={(inputEvent) =>
              setTitle(inputEvent.target.value)
            }
            maxLength={120}
            required
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none transition focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div>
          <label
            htmlFor={`edit-category-${event.id}`}
            className="font-era-label mb-2 block text-[9px] text-[#111111]"
          >
            Category
          </label>

          <select
            id={`edit-category-${event.id}`}
            value={category}
            onChange={(inputEvent) =>
              setCategory(inputEvent.target.value)
            }
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none transition focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
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
            htmlFor={`edit-date-${event.id}`}
            className="font-era-label mb-2 block text-[9px] text-[#111111]"
          >
            Event Date
          </label>

          <input
            id={`edit-date-${event.id}`}
            type="date"
            value={eventDate}
            onChange={(inputEvent) =>
              setEventDate(inputEvent.target.value)
            }
            required
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none transition focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div>
          <label
            htmlFor={`edit-location-${event.id}`}
            className="font-era-label mb-2 block text-[9px] text-[#111111]"
          >
            Location
          </label>

          <input
            id={`edit-location-${event.id}`}
            type="text"
            value={location}
            onChange={(inputEvent) =>
              setLocation(inputEvent.target.value)
            }
            placeholder="Example: Online, Seoul, Bengaluru"
            maxLength={120}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor={`edit-description-${event.id}`}
          className="font-era-label mb-2 block text-[9px] text-[#111111]"
        >
          Description
        </label>

        <textarea
          id={`edit-description-${event.id}`}
          value={description}
          onChange={(inputEvent) =>
            setDescription(inputEvent.target.value)
          }
          placeholder="Add a short note about the event..."
          maxLength={600}
          rows={4}
          className="w-full resize-y rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor={`edit-link-${event.id}`}
          className="font-era-label mb-2 block text-[9px] text-[#111111]"
        >
          External Link
        </label>

        <input
          id={`edit-link-${event.id}`}
          type="url"
          value={eventLink}
          onChange={(inputEvent) =>
            setEventLink(inputEvent.target.value)
          }
          placeholder="https://example.com"
          maxLength={500}
          className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
        />
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#2A2A2A] bg-white p-4">
        <input
          type="checkbox"
          checked={isGlobal}
          onChange={(inputEvent) =>
            setIsGlobal(inputEvent.target.checked)
          }
          className="mt-1 h-4 w-4 accent-[#E11D48]"
        />

        <span>
          <span className="font-era-label block text-[9px] text-[#111111]">
            Global Event
          </span>

          <span className="mt-2 block text-sm leading-6 text-[#4B4B4B]">
            Select this when ARMY can join from any location.
          </span>
        </span>
      </label>

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-[#E11D48] bg-[#FFF1F3] px-4 py-3 text-sm font-bold text-[#B91C3B]">
          {errorMessage}
        </div>
      ) : null}

      {message ? (
        <div className="mt-4 rounded-2xl border border-[#166534] bg-[#F0FDF4] px-4 py-3 text-sm font-bold text-[#166534]">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSaving}
        className="font-era-label mt-5 inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}