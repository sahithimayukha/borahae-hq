import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { PageHero } from "@/components/app/page-hero";
import { createClient } from "@/lib/supabase/server";
import type {
  CalendarEvent,
  FanProject,
  SavedItem,
  UserReminder,
} from "@/types/database";

const concertEventCategories = [
  "Concert",
  "Soundcheck",
  "Ticketing",
];

const reminderCategories = [
  "Concert",
  "Soundcheck",
  "Ticketing",
];

const concertChecklist = [
  "Check the latest official concert notice.",
  "Confirm your ticket or mobile-ticket access.",
  "Review the venue rules and prohibited items.",
  "Prepare your photo identification if required.",
  "Charge your phone and portable charger.",
  "Check your travel route and return plan.",
  "Pack water and weather-appropriate essentials.",
  "Keep emergency contact details available.",
];

const quickLinks = [
  {
    label: "Browse Calendar",
    description: "View every ARMY event and concert-related date.",
    href: "/calendar",
  },
  {
    label: "My Reminders",
    description: "Review reminders saved from Calendar and Fan Projects.",
    href: "/reminders",
  },
  {
    label: "My Saved",
    description:
      "Review the Calendar events and Fan Projects you bookmarked.",
    href: "/saved",
  },
  {
    label: "Concert Preparation Guide",
    description:
      "Review membership, presale, ticketing, and concert-day guidance.",
    href: "/army-guide/concert-prep",
  },
  {
    label: "Browse Fan Projects",
    description:
      "Explore approved ARMY activities connected to concert periods.",
    href: "/projects",
  },
];

type ReminderRecord = {
  reminder: UserReminder;
  event: CalendarEvent;
};

function getTodayInIndia() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function formatDate(date: string | null) {
  if (!date) {
    return "Date To Be Announced";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function getDaysUntil(date: string, today: string) {
  const targetDate = new Date(`${date}T00:00:00Z`);
  const currentDate = new Date(`${today}T00:00:00Z`);

  const difference = targetDate.getTime() - currentDate.getTime();

  return Math.max(
    0,
    Math.ceil(difference / (1000 * 60 * 60 * 24)),
  );
}

function getCountdownLabel(daysUntil: number) {
  if (daysUntil === 0) {
    return "Today";
  }

  if (daysUntil === 1) {
    return "Tomorrow";
  }

  return `${daysUntil} days away`;
}

function getReminderOptionLabel(
  option: UserReminder["reminder_option"],
) {
  if (option === "same_day") {
    return "On the day";
  }

  if (option === "1_day_before") {
    return "1 day before";
  }

  if (option === "3_days_before") {
    return "3 days before";
  }

  return "1 week before";
}

function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />

      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" />

      <path d="M16 2v4" />

      <path d="M8 2v4" />

      <path d="M3 10h18" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />

      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ChecklistIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 11 3 3L22 4" />

      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

export default async function ConcertModePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const today = getTodayInIndia();

  const [
    { data: concertDatesData, error: concertDatesError },
    { data: remindersData },
    { data: savedItemsData },
  ] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .in("category", concertEventCategories)
      .gte("event_date", today)
      .order("event_date", {
        ascending: true,
      })
      .limit(10),

    supabase
      .from("user_reminders")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_enabled", true)
      .gte("remind_on", today)
      .order("remind_on", {
        ascending: true,
      }),

    supabase
      .from("saved_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("item_type", "project")
      .order("created_at", {
        ascending: false,
      })
      .limit(6),
  ]);

  const concertDates =
    (concertDatesData ?? []) as CalendarEvent[];

  const reminders =
    (remindersData ?? []) as UserReminder[];

  const savedItems =
    (savedItemsData ?? []) as SavedItem[];

  const nearestConcert =
    concertDates.find(
      (event) => event.category === "Concert",
    ) ?? null;

  const reminderEventIds = reminders
    .map((reminder) => reminder.event_id)
    .filter((id): id is string => Boolean(id));

  let reminderEvents: CalendarEvent[] = [];

  if (reminderEventIds.length > 0) {
    const { data } = await supabase
      .from("events")
      .select("*")
      .in("id", reminderEventIds);

    reminderEvents =
      (data ?? []) as CalendarEvent[];
  }

  const reminderEventMap = new Map(
    reminderEvents.map((event) => [
      event.id,
      event,
    ]),
  );

  const concertReminderRecords = reminders
    .map((reminder) => {
      if (!reminder.event_id) {
        return null;
      }

      const event =
        reminderEventMap.get(
          reminder.event_id,
        );

      if (
        !event ||
        !reminderCategories.includes(
          event.category,
        )
      ) {
        return null;
      }

      return {
        reminder,
        event,
      };
    })
    .filter(
      (
        record,
      ): record is ReminderRecord =>
        Boolean(record),
    )
    .slice(0, 6);

  const savedProjectIds = savedItems
    .map((item) => item.project_id)
    .filter((id): id is string => Boolean(id));

  let savedProjects: FanProject[] = [];

  if (savedProjectIds.length > 0) {
    const { data } = await supabase
      .from("fan_projects")
      .select("*")
      .in("id", savedProjectIds)
      .eq("status", "approved");

    savedProjects =
      (data ?? []) as FanProject[];
  }

  const daysUntilConcert = nearestConcert
    ? getDaysUntil(
        nearestConcert.event_date,
        today,
      )
    : null;

  return (
    <AppShell activePath="/calendar">
      <PageHero
        eyebrow="Concert Mode"
        title="Your Concert Command Center"
        description="Keep your nearest BTS concert, venue details, ticketing dates, soundcheck schedule, reminders, saved projects, and preparation checklist inside one focused page."
      />

      <div className="flex flex-wrap gap-3">
        <Link
          href="/calendar"
          className="font-era-label inline-flex rounded-full border border-white/25 bg-[#151515] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#222222]"
        >
          ← Back To Calendar
        </Link>

        <Link
          href="/army-guide/concert-prep"
          className="font-era-label inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
        >
          Open Concert Preparation Guide
        </Link>
      </div>

      {nearestConcert ? (
        <section className="relative overflow-hidden rounded-3xl border border-[#55202D] bg-[#0B0B0B] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.45)] sm:rounded-4xl sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.28),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.10),transparent_30%)]" />

          <div className="absolute inset-0 bg-[linear-gradient(135deg,#fff_1px,transparent_1px)] bg-size-[18px_18px] opacity-[0.06]" />

          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_220px] lg:items-center">
            <div>
              <p className="font-era-label text-[10px] text-[#E11D48]">
                Next Concert
              </p>

              <h2 className="font-era-display mt-4 text-4xl leading-[1.02] text-white! sm:text-6xl">
                {nearestConcert.title}
              </h2>

              <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-white">
                <span className="rounded-full border border-white/15 bg-black/35 px-4 py-2">
                  {formatDate(
                    nearestConcert.event_date,
                  )}
                </span>

                {nearestConcert.location ? (
                  <span className="rounded-full border border-white/15 bg-black/35 px-4 py-2">
                    {nearestConcert.location}
                  </span>
                ) : null}

                {nearestConcert.is_global ? (
                  <span className="rounded-full border border-white/15 bg-black/35 px-4 py-2">
                    Global
                  </span>
                ) : null}
              </div>

              {nearestConcert.description ? (
                <p className="mt-6 max-w-3xl text-sm font-semibold leading-7 text-white/70">
                  {nearestConcert.description}
                </p>
              ) : null}

              {nearestConcert.event_link ? (
                <a
                  href={nearestConcert.event_link}
                  target="_blank"
                  rel="noreferrer"
                  className="font-era-label mt-6 inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
                >
                  Open Concert Link ↗
                </a>
              ) : null}
            </div>

            <div className="rounded-3xl bg-white p-6 text-center text-[#111111] shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
              <p className="font-era-label text-[10px] text-[#E11D48]">
                Countdown
              </p>

              <p className="font-era-display mt-4 text-6xl leading-none text-[#111111]">
                {daysUntilConcert}
              </p>

              <p className="font-era mt-3 text-2xl leading-none text-[#111111]">
                {getCountdownLabel(
                  daysUntilConcert ?? 0,
                )}
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-3xl border border-[#2A2A2A] bg-white p-6 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:rounded-4xl sm:p-8">
          <p className="font-era-label text-[10px] text-[#E11D48]">
            Next Concert
          </p>

          <h2 className="font-era mt-3 text-3xl leading-[1.05] text-[#111111]">
            No Upcoming Concert Added Yet
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4B4B4B]">
            When a concert event is added to Calendar, its countdown and venue
            information will appear here automatically.
          </p>

          <Link
            href="/calendar"
            className="font-era-label mt-5 inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:bg-[#C5163D]"
          >
            Browse Calendar
          </Link>
        </section>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-[#2A2A2A] bg-white p-5 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:rounded-4xl sm:p-6">
          <p className="font-era-label flex items-center gap-2 text-[10px] text-[#E11D48]">
            <MapPinIcon />
            Venue Information
          </p>

          <h2 className="font-era mt-3 text-2xl leading-[1.08] text-[#111111]">
            Concert Location
          </h2>

          {nearestConcert ? (
            <div className="mt-5 rounded-2xl bg-[#F7F7F7] p-4">
              <p className="text-sm font-black text-[#111111]">
                {nearestConcert.location ||
                  "Venue details have not been added yet."}
              </p>

              <p className="mt-2 text-sm leading-6 text-[#4B4B4B]">
                Confirm the latest venue rules and entry instructions through
                the official concert notice.
              </p>
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-[#4B4B4B]">
              Venue details will appear after an upcoming concert is available
              in Calendar.
            </p>
          )}
        </section>

        <section className="rounded-3xl border border-[#2A2A2A] bg-white p-5 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:rounded-4xl sm:p-6">
          <p className="font-era-label flex items-center gap-2 text-[10px] text-[#E11D48]">
            <ChecklistIcon />
            Preparation
          </p>

          <h2 className="font-era mt-3 text-2xl leading-[1.08] text-[#111111]">
            Concert Checklist
          </h2>

          <ul className="mt-5 space-y-3">
            {concertChecklist.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm font-semibold leading-6 text-[#4B4B4B]"
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#E11D48]" />

                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <p className="font-era-label flex items-center gap-2 text-[10px] text-[#E11D48]">
          <CalendarIcon />
          Concert Timeline
        </p>

        <h2 className="font-era mt-3 text-3xl leading-[1.05] text-white!">
          Important Dates
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
          Upcoming concert, soundcheck, and ticketing dates from your Calendar
          appear here automatically.
        </p>

        {concertDatesError ? (
          <div className="mt-5 rounded-3xl border border-[#E11D48] bg-[#FFF1F3] p-5 text-[#B91C3B]">
            <p className="text-sm font-semibold leading-6">
              Concert dates could not load. Supabase returned:{" "}
              {concertDatesError.message}
            </p>
          </div>
        ) : null}

        {!concertDatesError &&
        concertDates.length > 0 ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {concertDates.map((event) => (
              <article
                key={event.id}
                className="rounded-3xl border border-[#2A2A2A] bg-white p-5 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-era-label text-[10px] text-[#E11D48]">
                      {formatDate(
                        event.event_date,
                      )}
                    </p>

                    <h3 className="font-era mt-3 text-xl leading-[1.08] text-[#111111]">
                      {event.title}
                    </h3>
                  </div>

                  <span className="font-era-label inline-flex w-fit rounded-full bg-[#111111] px-3 py-2 text-[9px] text-white!">
                    {event.category}
                  </span>
                </div>

                {event.location ? (
                  <p className="mt-4 text-sm font-semibold leading-6 text-[#4B4B4B]">
                    {event.location}
                  </p>
                ) : null}

                {event.event_link ? (
                  <a
                    href={event.event_link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-era-label mt-5 inline-flex text-[10px] text-[#E11D48] transition hover:text-[#B91C3B]"
                  >
                    Open Event ↗
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}

        {!concertDatesError &&
        concertDates.length === 0 ? (
          <div className="mt-5 rounded-3xl border border-white/10 bg-[#111111] p-5 text-white/65">
            <p className="text-sm font-semibold leading-6">
              No upcoming concert, soundcheck, or ticketing dates are available
              yet.
            </p>
          </div>
        ) : null}
      </section>

      <section>
        <p className="font-era-label flex items-center gap-2 text-[10px] text-[#E11D48]">
          <BellIcon />
          Ticketing Reminders
        </p>

        <h2 className="font-era mt-3 text-3xl leading-[1.05] text-white!">
          Your Concert Reminders
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
          Your saved concert, ticketing, and soundcheck reminders appear here.
        </p>

        {concertReminderRecords.length > 0 ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {concertReminderRecords.map(
              ({ reminder, event }) => (
                <article
                  key={reminder.id}
                  className="rounded-3xl border border-[#2A2A2A] bg-white p-5 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
                >
                  <p className="font-era-label text-[10px] text-[#E11D48]">
                    {getReminderOptionLabel(
                      reminder.reminder_option,
                    )}
                  </p>

                  <h3 className="font-era mt-3 text-xl leading-[1.08] text-[#111111]">
                    {event.title}
                  </h3>

                  <p className="mt-3 text-sm font-semibold leading-6 text-[#4B4B4B]">
                    Reminder date:{" "}
                    {formatDate(
                      reminder.remind_on,
                    )}
                  </p>
                </article>
              ),
            )}
          </div>
        ) : (
          <div className="mt-5 rounded-3xl border border-white/10 bg-[#111111] p-5 text-white/65">
            <p className="text-sm font-semibold leading-6">
              No concert reminders saved yet. Open Calendar and use Remind Me
              on a concert, soundcheck, or ticketing event.
            </p>

            <Link
              href="/calendar"
              className="font-era-label mt-4 inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:bg-[#C5163D]"
            >
              Browse Calendar
            </Link>
          </div>
        )}
      </section>

      <section>
        <p className="font-era-label text-[10px] text-[#E11D48]">
          Saved Fan Projects
        </p>

        <h2 className="font-era mt-3 text-3xl leading-[1.05] text-white!">
          Projects You Kept Close
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
          Saved fan projects appear here so your concert-period activities stay
          close at hand.
        </p>

        {savedProjects.length > 0 ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {savedProjects.map((project) => {
              const location = [
                project.city,
                project.country,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <article
                  key={project.id}
                  className="rounded-3xl border border-[#2A2A2A] bg-white p-5 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
                >
                  <p className="font-era-label text-[10px] text-[#E11D48]">
                    {formatDate(
                      project.project_date,
                    )}
                  </p>

                  <h3 className="font-era mt-3 text-xl leading-[1.08] text-[#111111]">
                    {project.title}
                  </h3>

                  {location ? (
                    <p className="mt-3 text-sm font-semibold leading-6 text-[#4B4B4B]">
                      {location}
                    </p>
                  ) : null}

                  {project.project_link ? (
                    <a
                      href={project.project_link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-era-label mt-5 inline-flex text-[10px] text-[#E11D48] transition hover:text-[#B91C3B]"
                    >
                      Open Project ↗
                    </a>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 rounded-3xl border border-white/10 bg-[#111111] p-5 text-white/65">
            <p className="text-sm font-semibold leading-6">
              No saved fan projects yet. This section will fill naturally when
              project bookmarks are added during the My Saved feature build.
            </p>

            <Link
              href="/projects"
              className="font-era-label mt-4 inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:bg-[#C5163D]"
            >
              Browse Fan Projects
            </Link>
          </div>
        )}
      </section>

      <section>
        <p className="font-era-label text-[10px] text-[#E11D48]">
          Quick Links
        </p>

        <h2 className="font-era mt-3 text-3xl leading-[1.05] text-white!">
          Open What You Need
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-3xl border border-[#2A2A2A] bg-white p-5 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-[#E11D48]"
            >
              <p className="font-era text-xl leading-[1.08] text-[#111111]">
                {item.label}
              </p>

              <p className="mt-3 text-sm leading-6 text-[#4B4B4B]">
                {item.description}
              </p>

              <p className="font-era-label mt-5 text-[10px] text-[#E11D48]">
                Open →
              </p>
            </Link>
          ))}

          <a
            href="https://weverse.io/bts/notice"
            target="_blank"
            rel="noreferrer"
            className="group rounded-3xl border border-[#55202D] bg-[#16090D] p-5 text-white shadow-[0_20px_70px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-[#E11D48]"
          >
            <p className="font-era text-xl leading-[1.08] text-white!">
              Official BTS Notices
            </p>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Confirm ticketing, venue, and concert instructions through the
              official Weverse notice board.
            </p>

            <p className="font-era-label mt-5 text-[10px] text-[#FF7894]">
              Open Official Notices ↗
            </p>
          </a>
        </div>
      </section>
    </AppShell>
  );
}