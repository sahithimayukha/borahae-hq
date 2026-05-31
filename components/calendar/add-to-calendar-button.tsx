"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

type AddToCalendarButtonProps = {
  title: string;
  eventDate: string;
  description?: string | null;
  location?: string | null;
  eventLink?: string | null;
};

function AddCalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3 w-3 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        width="18"
        height="18"
        x="3"
        y="4"
        rx="2"
      />

      <path d="M16 2v4" />

      <path d="M8 2v4" />

      <path d="M3 10h18" />

      <path d="M12 14v4" />

      <path d="M10 16h4" />
    </svg>
  );
}

function getNextDate(date: string) {
  const currentDate =
    new Date(`${date}T00:00:00Z`);

  currentDate.setUTCDate(
    currentDate.getUTCDate() + 1,
  );

  return currentDate
    .toISOString()
    .slice(0, 10);
}

function formatGoogleDate(date: string) {
  return date.replaceAll("-", "");
}

function escapeIcsText(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replace(/\r?\n/g, "\\n");
}

function createEventDetails({
  description,
  eventLink,
}: {
  description?: string | null;
  eventLink?: string | null;
}) {
  return [
    description?.trim(),
    eventLink
      ? `Official or trusted event link: ${eventLink}`
      : null,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function AddToCalendarButton({
  title,
  eventDate,
  description,
  location,
  eventLink,
}: AddToCalendarButtonProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] =
    useState(false);

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      if (
        !containerRef.current ||
        containerRef.current.contains(
          event.target as Node,
        )
      ) {
        return;
      }

      setIsOpen(false);
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  const nextDate =
    getNextDate(eventDate);

  const details =
    createEventDetails({
      description,
      eventLink,
    });

  function openGoogleCalendar() {
    const params =
      new URLSearchParams({
        action: "TEMPLATE",
        text: title,
        dates: `${formatGoogleDate(
          eventDate,
        )}/${formatGoogleDate(
          nextDate,
        )}`,
      });

    if (details) {
      params.set(
        "details",
        details,
      );
    }

    if (location) {
      params.set(
        "location",
        location,
      );
    }

    window.open(
      `https://calendar.google.com/calendar/render?${params.toString()}`,
      "_blank",
      "noopener,noreferrer",
    );

    setIsOpen(false);
  }

  function downloadIcsFile() {
    const uid = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}@borahaehq`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//BorahaeHQ//ARMY Calendar//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTART;VALUE=DATE:${formatGoogleDate(
        eventDate,
      )}`,
      `DTEND;VALUE=DATE:${formatGoogleDate(
        nextDate,
      )}`,
      `SUMMARY:${escapeIcsText(
        title,
      )}`,
      details
        ? `DESCRIPTION:${escapeIcsText(
            details,
          )}`
        : null,
      location
        ? `LOCATION:${escapeIcsText(
            location,
          )}`
        : null,
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");

    const blob =
      new Blob(
        [icsContent],
        {
          type: "text/calendar;charset=utf-8",
        },
      );

    const fileUrl =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = fileUrl;

    link.download = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(
        /^-|-$/g,
        "",
      ) || "borahaehq-event"}.ics`;

    document.body.appendChild(
      link,
    );

    link.click();
    link.remove();

    URL.revokeObjectURL(
      fileUrl,
    );

    setIsOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className="relative ml-auto inline-flex shrink-0"
    >
      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (current) => !current,
          )
        }
        aria-label="Add event to calendar"
        title="Add to calendar"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#2A2A2A] bg-white text-[#111111] transition hover:-translate-y-0.5 hover:border-[#E11D48] hover:bg-[#FFF1F3] hover:text-[#B91C3B]"
      >
        <AddCalendarIcon />
      </button>

      {isOpen ? (
<div className="absolute right-0 top-full z-50 mt-2 w-36 rounded-xl border border-[#2A2A2A] bg-white p-1 shadow-[0_14px_34px_rgba(0,0,0,0.18)]">
  <button
    type="button"
    onClick={openGoogleCalendar}
    className="w-full whitespace-nowrap rounded-lg px-2 py-1.5 text-left text-[10px]! font-extrabold! uppercase leading-none! tracking-[0.04em] text-[#111111] transition hover:bg-[#FFF1F3] hover:text-[#B91C3B]"
  >
    Google Calendar
  </button>

  <button
    type="button"
    onClick={downloadIcsFile}
    className="mt-0.5 w-full whitespace-nowrap rounded-lg px-2 py-1.5 text-left text-[10px]! font-extrabold! uppercase leading-none! tracking-[0.04em] text-[#111111] transition hover:bg-[#FFF1F3] hover:text-[#B91C3B]"
  >
    Download .ics
  </button>
</div>
      ) : null}
    </div>
  );
}