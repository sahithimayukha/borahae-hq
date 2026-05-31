import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { PageHero } from "@/components/app/page-hero";
import { AddToCalendarButton } from "@/components/calendar/add-to-calendar-button";
import { DeleteEventButton } from "@/components/calendar/delete-event-button";
import { EditEventForm } from "@/components/calendar/edit-event-form";
import { EventForm } from "@/components/calendar/event-form";
import { ReminderButton } from "@/components/reminders/reminder-button";
import { SavedItemButton } from "@/components/saved/saved-item-button";
import { createClient } from "@/lib/supabase/server";
import type { CalendarEvent } from "@/types/database";

const EVENTS_PER_PAGE = 8;

const eventCategories = [
  "All",
  "Anniversary",
  "Birthday",
  "Comeback",
  "Concert",
  "Soundcheck",
  "Streaming",
  "Online Event",
  "Ticketing",
  "Voting",
  "Pop-Up",
  "Exhibition",
  "Light Show",
  "Watch Party",
  "Charity",
  "Past",
];

const calendarViews = ["upcoming", "past"] as const;

type CalendarView = (typeof calendarViews)[number];

type CalendarEventWithReadOnly = CalendarEvent & {
  is_read_only?: boolean;
};

type CalendarPageProps = {
  searchParams?: Promise<{
    category?: string;
    q?: string;
    view?: string;
    page?: string;
  }>;
};

type EventCardProps = {
  event: CalendarEventWithReadOnly;
  currentUserId: string;
  today: string;
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
  page?: number;
};

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  selectedCategory: string;
  selectedView: CalendarView;
  searchQuery: string;
};

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

function BookmarkIcon() {
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
      <path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4Z" />
    </svg>
  );
}

function ConcertIcon() {
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
      <path d="M4 7h16" />

      <path d="M4 17h16" />

      <path d="M6 7v10" />

      <path d="M18 7v10" />

      <path d="M9 11h6" />

      <path d="M9 14h6" />
    </svg>
  );
}

function getTodayInIndia() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

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
  page = 1,
}: CalendarHrefOptions) {
  const params = new URLSearchParams();

  if (category !== "All") {
    params.set("category", category);
  }

  if (view !== "upcoming") {
    params.set("view", view);
  }

  if (searchQuery) {
    params.set("q", searchQuery);
  }

  if (page > 1) {
    params.set("page", page.toString());
  }

  const queryString = params.toString();

  return queryString ? `/calendar?${queryString}` : "/calendar";
}

function getViewLabel(view: CalendarView) {
  if (view === "past") {
    return "Past Events";
  }

  return "Upcoming Events";
}

function getViewDescription(view: CalendarView) {
  if (view === "past") {
    return "Browse completed events from the BorahaeHQ archive.";
  }

  return "Showing events scheduled for today or later.";
}

function EventCard({ event, currentUserId, today }: EventCardProps) {
  const isPastEvent = event.event_date < today || event.category === "Past";

  const isReadOnlyEvent = event.is_read_only === true;

  const canManageEvent =
    event.created_by === currentUserId && !isPastEvent && !isReadOnlyEvent;

  return (
    <article className="relative min-w-0 rounded-3xl border border-[#2A2A2A] bg-white p-4 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:rounded-4xl sm:p-6">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-era-label text-[10px] text-[#E11D48]">
            {formatEventDate(event.event_date)}
          </p>

          <h2 className="font-era mt-3 wrap-break-word text-2xl leading-[1.1] text-[#111111]">
            {event.title}
          </h2>
        </div>

        <span className="font-era-label inline-flex w-fit shrink-0 rounded-full bg-[#111111] px-4 py-2 text-[10px] text-white!">
          {isPastEvent ? "Past" : event.category}
        </span>
      </div>

      {event.description ? (
        <p className="mt-5 wrap-break-word text-sm leading-6 text-[#4B4B4B]">
          {event.description}
        </p>
      ) : null}

      <div className="mt-6 flex min-w-0 flex-wrap gap-3 text-sm font-bold text-[#111111]">
        {event.location ? (
          <span className="max-w-full wrap-break-word rounded-full bg-[#F7F7F7] px-4 py-2">
            {event.location}
          </span>
        ) : null}

        {event.is_global ? (
          <span className="rounded-full bg-[#F7F7F7] px-4 py-2">Global</span>
        ) : null}

        {isReadOnlyEvent ? (
          <span className="rounded-full bg-[#FFF1F3] px-4 py-2 text-[#B91C3B]">
            Official Event
          </span>
        ) : null}
      </div>

      <div className="mt-6 border-t border-[#E7E7E7] pt-4">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:flex-nowrap">
          {event.event_link ? (
            <a
              href={event.event_link}
              target="_blank"
              rel="noreferrer"
              className="font-era-label inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full bg-[#E11D48] px-3 text-[8px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
            >
              View Event
            </a>
          ) : null}

          {!isPastEvent ? (
            <ReminderButton targetType="event" targetId={event.id} />
          ) : null}

          <SavedItemButton itemType="event" itemId={event.id} />

          <AddToCalendarButton
            title={event.title}
            eventDate={event.event_date}
            description={event.description}
            location={event.location}
            eventLink={event.event_link}
          />
        </div>

        {canManageEvent ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#ECECEC] pt-4">
            <p className="font-era-label text-[9px] text-[#777777]">
              Manage Your Event
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <EditEventForm event={event} userId={currentUserId} />

              <DeleteEventButton eventId={event.id} />
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function CalendarTools({
  selectedCategory,
  selectedView,
  searchQuery,
}: CalendarToolsProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#0B0B0B] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:rounded-4xl sm:p-5">
      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="font-era-label text-[10px] text-[#E11D48]">
              Search Calendar
            </p>

            <h2 className="font-era mt-3 text-3xl leading-[1.05] text-white!">
              Find An Event
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
              Search event titles using words such as concert, birthday,
              anniversary, streaming, pop-up, or ARIRANG.
            </p>
          </div>

          <form
            action="/calendar"
            method="get"
            className="flex min-w-0 w-full flex-col gap-3 sm:flex-row lg:max-w-xl"
          >
            {selectedCategory !== "All" ? (
              <input type="hidden" name="category" value={selectedCategory} />
            ) : null}

            {selectedView !== "upcoming" ? (
              <input type="hidden" name="view" value={selectedView} />
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
              className="font-era-label inline-flex shrink-0 items-center justify-center rounded-full bg-[#E11D48] px-6 py-3.5 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
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
                className="font-era-label inline-flex shrink-0 items-center justify-center rounded-full border border-white/30 bg-[#151515] px-6 py-3.5 text-[10px] text-white! transition hover:bg-[#222222]"
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
                  className={`font-era-label rounded-full px-4 py-2 text-[10px] transition ${
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

          <div className="mt-4 flex flex-wrap gap-3">
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
                  className={`font-era-label rounded-full px-4 py-2 text-[10px] transition ${
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

function Pagination({
  currentPage,
  totalPages,
  selectedCategory,
  selectedView,
  searchQuery,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Calendar pagination"
      className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-[#111111] p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="font-era-label text-center text-[10px] text-white/70 sm:text-left">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center justify-center gap-3 sm:justify-end">
        {currentPage > 1 ? (
          <Link
            href={getCalendarHref({
              category: selectedCategory,
              view: selectedView,
              searchQuery,
              page: currentPage - 1,
            })}
            className="font-era-label inline-flex rounded-full border border-white/20 bg-[#1A1A1A] px-5 py-3 text-[10px] text-white! transition hover:bg-[#262626]"
          >
            ← Previous
          </Link>
        ) : (
          <span className="font-era-label inline-flex cursor-not-allowed rounded-full border border-white/10 bg-[#151515] px-5 py-3 text-[10px] text-white/25">
            ← Previous
          </span>
        )}

        {currentPage < totalPages ? (
          <Link
            href={getCalendarHref({
              category: selectedCategory,
              view: selectedView,
              searchQuery,
              page: currentPage + 1,
            })}
            className="font-era-label inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:bg-[#C5163D]"
          >
            Next →
          </Link>
        ) : (
          <span className="font-era-label inline-flex cursor-not-allowed rounded-full bg-[#501522] px-5 py-3 text-[10px] text-white/35">
            Next →
          </span>
        )}
      </div>
    </nav>
  );
}

export default async function CalendarPage({
  searchParams,
}: CalendarPageProps) {
  const resolvedSearchParams = await searchParams;

  const searchQuery = (resolvedSearchParams?.q ?? "").trim().slice(0, 80);

  const requestedCategory = resolvedSearchParams?.category ?? "All";

  const selectedCategory = eventCategories.includes(requestedCategory)
    ? requestedCategory
    : "All";

  const requestedView = resolvedSearchParams?.view ?? "upcoming";

  const selectedView: CalendarView = calendarViews.includes(
    requestedView as CalendarView,
  )
    ? (requestedView as CalendarView)
    : "upcoming";

  const requestedPage = Number.parseInt(resolvedSearchParams?.page ?? "1", 10);

  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const today = getTodayInIndia();

  let eventsQuery = supabase.from("events").select("*", {
    count: "exact",
  });

  if (selectedView === "past") {
    eventsQuery = eventsQuery.lt("event_date", today);
  } else {
    eventsQuery = eventsQuery.gte("event_date", today);
  }

  if (selectedCategory !== "All") {
    eventsQuery = eventsQuery.eq("category", selectedCategory);
  }

  if (searchQuery) {
    eventsQuery = eventsQuery.ilike("title", `%${searchQuery}%`);
  }

  const rangeStart = (currentPage - 1) * EVENTS_PER_PAGE;

  const rangeEnd = rangeStart + EVENTS_PER_PAGE - 1;

  eventsQuery = eventsQuery
    .order("event_date", {
      ascending: selectedView !== "past",
    })
    .range(rangeStart, rangeEnd);

  const { data, error, count } = await eventsQuery;

  const events = (data ?? []) as CalendarEventWithReadOnly[];

  const totalEvents = count ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalEvents / EVENTS_PER_PAGE));

  if (currentPage > totalPages && totalEvents > 0) {
    redirect(
      getCalendarHref({
        category: selectedCategory,
        view: selectedView,
        searchQuery,
        page: totalPages,
      }),
    );
  }

  return (
    <AppShell activePath="/calendar">
      <PageHero
        eyebrow="ARMY Calendar"
        title="Your ARIRANG Calendar"
        description="Track upcoming concerts, anniversaries, comeback dates, streaming moments, and important ARMY events inside one organized calendar."
      />

      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-end">
        <Link
          href="/reminders"
          className="font-era-label inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#E11D48] bg-white px-4 py-3 text-center text-[9px] text-[#B91C3B] transition hover:-translate-y-0.5 hover:bg-[#FFF1F3] sm:px-5 sm:text-[10px]"
        >
          <BellIcon />
          My Reminders
        </Link>

        <Link
          href="/concert-mode"
          className="font-era-label inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#E11D48] px-4 py-3 text-center text-[9px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D] sm:px-5 sm:text-[10px]"
        >
          <ConcertIcon />
          Open Concert Mode
        </Link>

        <Link
          href="/saved"
          className="font-era-label col-span-2 inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/25 bg-[#151515] px-5 py-3 text-center text-[9px] text-white! transition hover:-translate-y-0.5 hover:bg-[#222222] sm:col-span-1 sm:text-[10px]"
        >
          <BookmarkIcon />
          My Saved
        </Link>
      </div>

      <EventForm userId={user.id} />

      <CalendarTools
        selectedCategory={selectedCategory}
        selectedView={selectedView}
        searchQuery={searchQuery}
      />

      {error ? (
        <div className="rounded-4xl border border-[#E11D48] bg-[#FFF1F3] p-6 text-[#B91C3B]">
          <h2 className="font-era text-xl leading-[1.1]">
            Calendar Could Not Load
          </h2>

          <p className="mt-3 text-sm leading-6">
            Supabase returned this message: {error.message}
          </p>
        </div>
      ) : null}

      {!error && events.length > 0 ? (
        <div className="min-w-0 space-y-5">
          <div>
            <h2 className="font-era text-3xl leading-[1.05] text-white!">
              {searchQuery ? "Search Results" : getViewLabel(selectedView)}
            </h2>

            <p className="mt-2 text-sm text-white/70">
              {searchQuery
                ? `${totalEvents} event result${
                    totalEvents === 1 ? "" : "s"
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

          <div className="grid min-w-0 gap-5 lg:grid-cols-2">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                currentUserId={user.id}
                today={today}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            selectedCategory={selectedCategory}
            selectedView={selectedView}
            searchQuery={searchQuery}
          />
        </div>
      ) : null}

      {!error && events.length === 0 ? (
        <div className="rounded-4xl border border-[#2A2A2A] bg-white p-8 text-center text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
          <p className="font-era text-3xl leading-[1.05] text-[#E11D48]">
            No Matching Events
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#4B4B4B]">
            {searchQuery
              ? `We could not find an event titled “${searchQuery}”. Try another word, choose another category, or reset the calendar.`
              : `There are no ${getViewLabel(
                  selectedView,
                ).toLowerCase()} in this category yet. Try another timeline or add a new event.`}
          </p>

          {searchQuery ||
          selectedCategory !== "All" ||
          selectedView !== "upcoming" ? (
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