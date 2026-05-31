import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { PageHero } from "@/components/app/page-hero";
import { SavedItemButton } from "@/components/saved/saved-item-button";
import { createClient } from "@/lib/supabase/server";
import type {
  CalendarEvent,
  FanProject,
  SavedItem,
} from "@/types/database";

type SavedEventRecord = {
  savedItem: SavedItem;
  event: CalendarEvent;
};

type SavedProjectRecord = {
  savedItem: SavedItem;
  project: FanProject;
};

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

function SavedEventsSection({
  records,
}: {
  records: SavedEventRecord[];
}) {
  return (
    <section>
      <p className="font-era-label text-[10px] text-[#E11D48]">
        Saved Calendar Events
      </p>

      <h2 className="font-era mt-3 text-3xl leading-[1.05] text-white!">
        Events You Bookmarked
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
        Keep important ARMY dates close without searching through the full
        Calendar again.
      </p>

      {records.length > 0 ? (
        <div className="mt-5 grid min-w-0 gap-5 lg:grid-cols-2">
          {records.map(({ savedItem, event }) => (
            <article
              key={savedItem.id}
              className="min-w-0 overflow-hidden rounded-3xl border border-[#2A2A2A] bg-white p-5 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
            >
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-era-label text-[10px] text-[#E11D48]">
                    {formatDate(event.event_date)}
                  </p>

                  <h3 className="font-era mt-3 wrap-break-word text-2xl leading-[1.08] text-[#111111]">
                    {event.title}
                  </h3>
                </div>

                <span className="font-era-label inline-flex w-fit shrink-0 rounded-full bg-[#111111] px-4 py-2 text-[9px] text-white!">
                  {event.category}
                </span>
              </div>

              {event.description ? (
                <p className="mt-4 wrap-break-word text-sm leading-6 text-[#4B4B4B]">
                  {event.description}
                </p>
              ) : null}

              <div className="mt-5 flex min-w-0 flex-wrap gap-3 text-sm font-bold text-[#111111]">
                {event.location ? (
                  <span className="max-w-full wrap-break-word rounded-full bg-[#F7F7F7] px-4 py-2">
                    {event.location}
                  </span>
                ) : null}

                {event.is_global ? (
                  <span className="rounded-full bg-[#F7F7F7] px-4 py-2">
                    Global
                  </span>
                ) : null}
              </div>

              <div className="mt-6 flex flex-wrap items-start gap-3">
                {event.event_link ? (
                  <a
                    href={event.event_link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-era-label inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
                  >
                    Open Event
                  </a>
                ) : null}

                <SavedItemButton itemType="event" itemId={event.id} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-3xl border border-white/10 bg-[#111111] p-5 text-white/65">
          <p className="text-sm font-semibold leading-6">
            No saved Calendar events yet. Open Calendar and choose Save on any
            event you want to keep close.
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
  );
}

function SavedProjectsSection({
  records,
}: {
  records: SavedProjectRecord[];
}) {
  return (
    <section>
      <p className="font-era-label text-[10px] text-[#E11D48]">
        Saved Fan Projects
      </p>

      <h2 className="font-era mt-3 text-3xl leading-[1.05] text-white!">
        Projects You Kept Close
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
        Bookmark useful fan projects so you can find them again without
        retracing a trail of screenshots.
      </p>

      {records.length > 0 ? (
        <div className="mt-5 grid min-w-0 gap-5 lg:grid-cols-2">
          {records.map(({ savedItem, project }) => {
            const location = [
              project.city,
              project.country,
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <article
                key={savedItem.id}
                className="min-w-0 overflow-hidden rounded-3xl border border-[#2A2A2A] bg-white p-5 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
              >
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-era-label text-[10px] text-[#E11D48]">
                      {formatDate(project.project_date)}
                    </p>

                    <h3 className="font-era mt-3 wrap-break-word text-2xl leading-[1.08] text-[#111111]">
                      {project.title}
                    </h3>

                    {project.organizer_name ? (
                      <p className="mt-2 wrap-break-word text-sm font-semibold text-[#4B4B4B]">
                        Organized by {project.organizer_name}
                      </p>
                    ) : null}
                  </div>

                  <span className="font-era-label inline-flex w-fit shrink-0 rounded-full bg-[#111111] px-4 py-2 text-[9px] text-white!">
                    {project.category}
                  </span>
                </div>

                {project.description ? (
                  <p className="mt-4 wrap-break-word text-sm leading-6 text-[#4B4B4B]">
                    {project.description}
                  </p>
                ) : null}

                {location ? (
                  <div className="mt-5">
                    <span className="inline-flex max-w-full wrap-break-word rounded-full bg-[#F7F7F7] px-4 py-2 text-sm font-bold text-[#111111]">
                      {location}
                    </span>
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap items-start gap-3">
                  {project.project_link ? (
                    <a
                      href={project.project_link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-era-label inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
                    >
                      Open Project
                    </a>
                  ) : null}

                  <SavedItemButton itemType="project" itemId={project.id} />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-3xl border border-white/10 bg-[#111111] p-5 text-white/65">
          <p className="text-sm font-semibold leading-6">
            No saved Fan Projects yet. Open Fan Projects and choose Save on a
            project you want to revisit.
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
  );
}

export default async function SavedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    data: savedItemsData,
    error,
  } = await supabase
    .from("saved_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  const savedItems =
    (savedItemsData ?? []) as SavedItem[];

  const savedEventItems = savedItems.filter(
    (item) =>
      item.item_type === "event" &&
      Boolean(item.event_id),
  );

  const savedProjectItems = savedItems.filter(
    (item) =>
      item.item_type === "project" &&
      Boolean(item.project_id),
  );

  const eventIds = savedEventItems
    .map((item) => item.event_id)
    .filter((id): id is string => Boolean(id));

  const projectIds = savedProjectItems
    .map((item) => item.project_id)
    .filter((id): id is string => Boolean(id));

  let events: CalendarEvent[] = [];

  let projects: FanProject[] = [];

  if (eventIds.length > 0) {
    const { data } = await supabase
      .from("events")
      .select("*")
      .in("id", eventIds);

    events =
      (data ?? []) as CalendarEvent[];
  }

  if (projectIds.length > 0) {
    const { data } = await supabase
      .from("fan_projects")
      .select("*")
      .in("id", projectIds)
      .eq("status", "approved");

    projects =
      (data ?? []) as FanProject[];
  }

  const eventMap = new Map(
    events.map((event) => [
      event.id,
      event,
    ]),
  );

  const projectMap = new Map(
    projects.map((project) => [
      project.id,
      project,
    ]),
  );

  const savedEventRecords = savedEventItems
    .map((savedItem) => {
      if (!savedItem.event_id) {
        return null;
      }

      const event =
        eventMap.get(savedItem.event_id);

      if (!event) {
        return null;
      }

      return {
        savedItem,
        event,
      };
    })
    .filter(
      (
        record,
      ): record is SavedEventRecord =>
        Boolean(record),
    );

  const savedProjectRecords = savedProjectItems
    .map((savedItem) => {
      if (!savedItem.project_id) {
        return null;
      }

      const project =
        projectMap.get(
          savedItem.project_id,
        );

      if (!project) {
        return null;
      }

      return {
        savedItem,
        project,
      };
    })
    .filter(
      (
        record,
      ): record is SavedProjectRecord =>
        Boolean(record),
    );

  return (
    <AppShell activePath="/saved">
      <PageHero
        eyebrow="Personal Bookmarks"
        title="My Saved"
        description="Keep important Calendar events and Fan Projects inside one calm personal collection instead of relying on scattered screenshots."
      />

      <div className="flex flex-wrap gap-3">
        <Link
          href="/calendar"
          className="font-era-label inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
        >
          Browse Calendar
        </Link>

        <Link
          href="/projects"
          className="font-era-label inline-flex rounded-full border border-white/25 bg-[#151515] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#222222]"
        >
          Browse Fan Projects
        </Link>

        <Link
          href="/concert-mode"
          className="font-era-label inline-flex rounded-full border border-white/25 bg-[#151515] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#222222]"
        >
          Open Concert Mode
        </Link>
      </div>

      {error ? (
        <div className="rounded-4xl border border-[#E11D48] bg-[#FFF1F3] p-6 text-[#B91C3B]">
          <h2 className="font-era text-xl leading-[1.1]">
            Saved Items Could Not Load
          </h2>

          <p className="mt-3 text-sm leading-6">
            Supabase returned this message: {error.message}
          </p>
        </div>
      ) : (
        <>
          <SavedEventsSection
            records={savedEventRecords}
          />

          <SavedProjectsSection
            records={savedProjectRecords}
          />
        </>
      )}
    </AppShell>
  );
}
