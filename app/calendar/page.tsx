import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { PageHero } from "@/components/app/page-hero";
import { DeleteEventButton } from "@/components/calendar/delete-event-button";
import { EditEventForm } from "@/components/calendar/edit-event-form";
import { EventForm } from "@/components/calendar/event-form";
import { createClient } from "@/lib/supabase/server";
import type { CalendarEvent } from "@/types/database";

const eventCategories = [
  "All",
  "Anniversary",
  "Birthday",
  "Comeback",
  "Streaming",
  "Voting",
  "Fan Event",
  "Watch Party",
  "Charity",
];

const calendarViews = ["all", "upcoming", "past"] as const;

type CalendarView = (typeof calendarViews)[number];

type CalendarPageProps = {
  searchParams?: Promise<{
    category?: string;
    q?: string;
    view?: string;
  }>;
};

type EventCardProps = {
  event: CalendarEvent;
  currentUserId: string;
};

type CalendarToolsProps = {
  selectedCategory: string;
  selectedView: CalendarView;
  searchQuery: string;
};

type CalendarHrefOptions = {
  category: string;
  view: CalendarView;
  searchQuery: string;
};

function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function getCalendarHref({
  category,
  view,
  searchQuery,
}: CalendarHrefOptions) {
  const params = new URLSearchParams();

  if (category !== "All") {
    params.set("category", category);
  }

  if (view !== "all") {
    params.set("view", view);
  }

  if (searchQuery) {
    params.set("q", searchQuery);
  }

  const queryString = params.toString();

  return queryString ? `/calendar?${queryString}` : "/calendar";
}

function getViewLabel(view: CalendarView) {
  if (view === "upcoming") {
    return "Upcoming Only";
  }

  if (view === "past") {
    return "Past Only";
  }

  return "All Events";
}

function getViewDescription(view: CalendarView) {
  if (view === "upcoming") {
    return "Showing events scheduled for today or later.";
  }

  if (view === "past") {
    return "Showing events that happened before today.";
  }

  return "Showing past and upcoming events together.";
}

function EventCard({ event, currentUserId }: EventCardProps) {
  const canManageEvent = event.created_by === currentUserId;

  return (
    <article className="rounded-4xl border border-[#2A2A2A] bg-white p-6 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-era-label text-[10px] text-[#E11D48]">
            {formatEventDate(event.event_date)}
          </p>

          <h2 className="font-era mt-3 text-2xl leading-[1.1] text-[#111111]">
            {event.title}
          </h2>
        </div>

        <span className="font-era-label inline-flex w-fit rounded-full bg-[#111111] px-4 py-2 text-[10px] text-white!">
          {event.category}
        </span>
      </div>

      {event.description ? (
        <p className="mt-5 text-sm leading-6 text-[#4B4B4B]">
          {event.description}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-[#111111]">
        {event.location ? (
          <span className="rounded-full bg-[#F7F7F7] px-4 py-2">
            {event.location}
          </span>
        ) : null}

        {event.is_global ? (
          <span className="rounded-full bg-[#F7F7F7] px-4 py-2">
            Global
          </span>
        ) : null}
      </div>

      {event.event_link ? (
        <a
          href={event.event_link}
          target="_blank"
          rel="noreferrer"
          className="font-era-label mt-6 inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
        >
          View Event
        </a>
      ) : null}

      {canManageEvent ? (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <EditEventForm
            event={event}
            userId={currentUserId}
          />

          <DeleteEventButton eventId={event.id} />
        </div>
      ) : null}
    </article>
  );
}

function CalendarTools({
  selectedCategory,
  selectedView,
  searchQuery,
}: CalendarToolsProps) {
  return (
    <section className="rounded-4xl border border-[#2A2A2A] bg-[#0B0B0B] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-era-label text-[10px] text-[#E11D48]">
              Search Calendar
            </p>

            <h2 className="font-era mt-3 text-3xl leading-[1.05] text-white!">
              Find An Event
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
              Search event titles using words such as birthday, anniversary,
              watch party, streaming, or charity.
            </p>
          </div>

          <form
            action="/calendar"
            method="get"
            className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl"
          >
            {selectedCategory !== "All" ? (
              <input
                type="hidden"
                name="category"
                value={selectedCategory}
              />
            ) : null}

            {selectedView !== "all" ? (
              <input
                type="hidden"
                name="view"
                value={selectedView}
              />
            ) : null}

            <label htmlFor="event-search" className="sr-only">
              Search calendar events by title
            </label>

            <input
              id="event-search"
              name="q"
              type="search"
              defaultValue={searchQuery}
              placeholder="Search event title..."
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
                href={getCalendarHref({
                  category: selectedCategory,
                  view: selectedView,
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
            Choose Event Timeline
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {calendarViews.map((view) => {
              const isActive = selectedView === view;

              return (
                <Link
                  key={view}
                  href={getCalendarHref({
                    category: selectedCategory,
                    view,
                    searchQuery,
                  })}
                  className={`font-era-label shrink-0 rounded-full px-4 py-2 text-[10px] transition ${
                    isActive
                      ? "bg-[#E11D48] text-white!"
                      : "bg-[#151515] text-white! hover:bg-[#222222]"
                  }`}
                >
                  {getViewLabel(view)}
                </Link>
              );
            })}
          </div>

          <p className="mt-3 text-xs font-semibold leading-5 text-white/55">
            {getViewDescription(selectedView)}
          </p>
        </div>

        <div className="border-t border-white/10 pt-5">
          <p className="font-era-label text-[10px] text-white!">
            Filter By Category
          </p>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {eventCategories.map((category) => {
              const isActive = selectedCategory === category;

              return (
                <Link
                  key={category}
                  href={getCalendarHref({
                    category,
                    view: selectedView,
                    searchQuery,
                  })}
                  className={`font-era-label shrink-0 rounded-full px-4 py-2 text-[10px] transition ${
                    isActive
                      ? "bg-[#E11D48] text-white!"
                      : "bg-[#151515] text-white! hover:bg-[#222222]"
                  }`}
                >
                  {category}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function CalendarPage({
  searchParams,
}: CalendarPageProps) {
  const resolvedSearchParams = await searchParams;

  const searchQuery = (resolvedSearchParams?.q ?? "")
    .trim()
    .slice(0, 80);

  const requestedCategory =
    resolvedSearchParams?.category ?? "All";

  const selectedCategory = eventCategories.includes(
    requestedCategory,
  )
    ? requestedCategory
    : "All";

  const requestedView = resolvedSearchParams?.view ?? "all";

  const selectedView: CalendarView = calendarViews.includes(
    requestedView as CalendarView,
  )
    ? (requestedView as CalendarView)
    : "all";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const today = new Date().toISOString().slice(0, 10);

  let eventsQuery = supabase.from("events").select("*");

  if (selectedView === "upcoming") {
    eventsQuery = eventsQuery.gte("event_date", today);
  }

  if (selectedView === "past") {
    eventsQuery = eventsQuery.lt("event_date", today);
  }

  if (selectedCategory !== "All") {
    eventsQuery = eventsQuery.eq("category", selectedCategory);
  }

  if (searchQuery) {
    eventsQuery = eventsQuery.ilike(
      "title",
      `%${searchQuery}%`,
    );
  }

  eventsQuery = eventsQuery.order("event_date", {
    ascending: selectedView !== "past",
  });

  const { data, error } = await eventsQuery;

  const events = (data ?? []) as CalendarEvent[];

  return (
    <AppShell activePath="/calendar">
      <PageHero
        eyebrow="ARMY Calendar"
        title="Your ARIRANG Calendar"
        description="Track anniversaries, birthdays, fan events, streaming moments, and important ARMY dates inside one organized calendar."
      />

      <EventForm userId={user.id} />

      <CalendarTools
        selectedCategory={selectedCategory}
        selectedView={selectedView}
        searchQuery={searchQuery}
      />

      {error ? (
        <div className="rounded-4xlrder border-[#E11D48] bg-[#FFF1F3] p-6 text-[#B91C3B]">
          <h2 className="font-era text-xl leading-[1.1]">
            Calendar Could Not Load
          </h2>

          <p className="mt-3 text-sm leading-6">
            Supabase returned this message: {error.message}
          </p>
        </div>
      ) : null}

      {!error && events.length > 0 ? (
        <div className="space-y-5">
          <div>
            <h2 className="font-era text-3xl leading-[1.05] text-white!">
              {searchQuery
                ? "Search Results"
                : getViewLabel(selectedView)}
            </h2>

            <p className="mt-2 text-sm text-white/70">
              {searchQuery
                ? `${events.length} event result${
                    events.length === 1 ? "" : "s"
                  } found for “${searchQuery}”${
                    selectedCategory !== "All"
                      ? ` inside ${selectedCategory}.`
                      : "."
                  }`
                : `${getViewDescription(selectedView)} ${
                    selectedCategory === "All"
                      ? "All categories are included."
                      : `Category: ${selectedCategory}.`
                  }`}
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                currentUserId={user.id}
              />
            ))}
          </div>
        </div>
      ) : null}

      {!error && events.length === 0 ? (
        <div className="rounded-4xl border border-[#2A2A2A] bg-white p-8 text-center text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
          <p className="font-era text-3xl leading-[1.05] text-[#E11D48]">
            No Matching Events
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#4B4B4B]">
            {searchQuery
              ? `We could not find an event titled “${searchQuery}”. Try another word, choose a different timeline, select another category, or reset the calendar.`
              : `There are no ${getViewLabel(
                  selectedView,
                ).toLowerCase()} in this category yet. Try another timeline or add a new event.`}
          </p>

          {searchQuery ||
          selectedCategory !== "All" ||
          selectedView !== "all" ? (
            <Link
              href="/calendar"
              className="font-era-label mt-5 inline-flex rounded-full bg-[#E11D48] px-6 py-3.5 text-[10px] text-white! transition hover:bg-[#C5163D]"
            >
              Reset Calendar
            </Link>
          ) : null}
        </div>
      ) : null}
    </AppShell>
  );
}