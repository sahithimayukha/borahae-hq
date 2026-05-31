import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { PageHero } from "@/components/app/page-hero";
import { DeleteReminderButton } from "@/components/reminders/delete-reminder-button";
import { createClient } from "@/lib/supabase/server";
import type {
  CalendarEvent,
  FanProject,
  UserReminder,
} from "@/types/database";

type ReminderCardRecord = {
  reminder: UserReminder;
  title: string;
  targetDate: string | null;
  location: string;
  link: string | null;
  targetLabel: string;
};

type ReminderSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  reminders: ReminderCardRecord[];
  emptyMessage: string;
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
  }).format(
    new Date(`${date}T00:00:00`),
  );
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

function ReminderCard({
  record,
}: {
  record: ReminderCardRecord;
}) {
  return (
    <article className="min-w-0 overflow-hidden rounded-3xl border border-[#2A2A2A] bg-white p-4 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:rounded-4xl sm:p-6">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-era-label flex items-center gap-2 text-[10px] text-[#E11D48]">
            <BellIcon />

            {getReminderOptionLabel(
              record.reminder.reminder_option,
            )}
          </p>

          <h2 className="font-era mt-3 wrap-break-word text-2xl leading-[1.1] text-[#111111]">
            {record.title}
          </h2>
        </div>

        <span className="font-era-label inline-flex w-fit shrink-0 rounded-full bg-[#111111] px-4 py-2 text-[10px] text-white!">
          {record.targetLabel}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-[#FFF1F3] p-4">
          <p className="font-era-label text-[9px] text-[#B91C3B]">
            Reminder Date
          </p>

          <p className="mt-2 text-sm font-black text-[#111111]">
            {formatDate(
              record.reminder.remind_on,
            )}
          </p>
        </div>

        <div className="rounded-2xl bg-[#F7F7F7] p-4">
          <p className="font-era-label text-[9px] text-[#666666]">
            Activity Date
          </p>

          <p className="mt-2 text-sm font-black text-[#111111]">
            {formatDate(record.targetDate)}
          </p>
        </div>
      </div>

      {record.location ? (
        <p className="mt-5 wrap-break-word text-sm font-semibold leading-6 text-[#4B4B4B]">
          {record.location}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {record.link ? (
          <a
            href={record.link}
            target="_blank"
            rel="noreferrer"
            className="font-era-label inline-flex whitespace-nowrap rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
          >
            Open Activity
          </a>
        ) : null}

        <DeleteReminderButton
          reminderId={record.reminder.id}
        />
      </div>
    </article>
  );
}

function ReminderSection({
  eyebrow,
  title,
  description,
  reminders,
  emptyMessage,
}: ReminderSectionProps) {
  return (
    <section className="min-w-0 space-y-5">
      <div>
        <p className="font-era-label text-[10px] text-[#E11D48]">
          {eyebrow}
        </p>

        <h2 className="font-era mt-3 text-3xl leading-[1.05] text-white!">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
          {description}
        </p>
      </div>

      {reminders.length > 0 ? (
        <div className="grid min-w-0 gap-5 lg:grid-cols-2">
          {reminders.map((record) => (
            <ReminderCard
              key={record.reminder.id}
              record={record}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#111111] p-5 text-white/65">
          <p className="text-sm font-semibold leading-6">
            {emptyMessage}
          </p>
        </div>
      )}
    </section>
  );
}

export default async function RemindersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    data: reminderData,
    error: reminderError,
  } = await supabase
    .from("user_reminders")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_enabled", true)
    .order("remind_on", {
      ascending: true,
    });

  const reminders =
    (reminderData ?? []) as UserReminder[];

  const eventIds = reminders
    .map((reminder) => reminder.event_id)
    .filter(
      (id): id is string => Boolean(id),
    );

  const projectIds = reminders
    .map(
      (reminder) =>
        reminder.fan_project_id,
    )
    .filter(
      (id): id is string => Boolean(id),
    );

  let events: CalendarEvent[] = [];

  let projects: FanProject[] = [];

  if (eventIds.length > 0) {
    const { data: eventData } =
      await supabase
        .from("events")
        .select("*")
        .in("id", eventIds);

    events =
      (eventData ?? []) as CalendarEvent[];
  }

  if (projectIds.length > 0) {
    const { data: projectData } =
      await supabase
        .from("fan_projects")
        .select("*")
        .in("id", projectIds);

    projects =
      (projectData ?? []) as FanProject[];
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

  const reminderRecords =
    reminders
      .map((reminder) => {
        if (
          reminder.target_type ===
            "event" &&
          reminder.event_id
        ) {
          const event = eventMap.get(
            reminder.event_id,
          );

          if (!event) {
            return null;
          }

          return {
            reminder,
            title: event.title,
            targetDate: event.event_date,
            location:
              event.location ?? "",
            link:
              event.event_link ?? null,
            targetLabel: "Calendar Event",
          };
        }

        if (
          reminder.target_type ===
            "fan_project" &&
          reminder.fan_project_id
        ) {
          const project = projectMap.get(
            reminder.fan_project_id,
          );

          if (!project) {
            return null;
          }

          const location = [
            project.city,
            project.country,
          ]
            .filter(Boolean)
            .join(", ");

          return {
            reminder,
            title: project.title,
            targetDate:
              project.project_date,
            location,
            link:
              project.project_link ??
              null,
            targetLabel: "Fan Project",
          };
        }

        return null;
      })
      .filter(
        (
          record,
        ): record is ReminderCardRecord =>
          Boolean(record),
      );

  const today = getTodayInIndia();

  const dueToday = reminderRecords.filter(
    (record) =>
      record.reminder.remind_on ===
      today,
  );

  const upcoming = reminderRecords.filter(
    (record) =>
      record.reminder.remind_on >
      today,
  );

  const past = reminderRecords.filter(
    (record) =>
      record.reminder.remind_on <
      today,
  );

  return (
    <AppShell activePath="/reminders">
      <PageHero
        eyebrow="Smart Reminders"
        title="My ARMY Reminders"
        description="Keep your concerts, comeback moments, fan projects, and community activities close without relying on scattered screenshots."
      />

      {reminderError ? (
        <div className="rounded-4xl border border-[#E11D48] bg-[#FFF1F3] p-6 text-[#B91C3B]">
          <h2 className="font-era text-xl leading-[1.1]">
            Reminders Could Not Load
          </h2>

          <p className="mt-3 text-sm leading-6">
            Supabase returned this message:{" "}
            {reminderError.message}
          </p>
        </div>
      ) : null}

      {!reminderError ? (
        <>
          <ReminderSection
            eyebrow="Today"
            title="Due Today"
            description="These saved activities need your attention today."
            reminders={dueToday}
            emptyMessage="No reminders are due today."
          />

          <ReminderSection
            eyebrow="Coming Up"
            title="Upcoming Reminders"
            description="Your saved reminders for future ARMY moments."
            reminders={upcoming}
            emptyMessage="No upcoming reminders yet. Save one from Calendar or Fan Projects."
          />

          <ReminderSection
            eyebrow="Archive"
            title="Past Reminders"
            description="Completed reminder dates stay here until you remove them."
            reminders={past}
            emptyMessage="No past reminders yet."
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
              className="font-era-label inline-flex rounded-full border border-white/25 bg-[#151515] px-5 py-3 text-[10px] text-white! transition hover:bg-[#222222]"
            >
              Browse Fan Projects
            </Link>
          </div>
        </>
      ) : null}
    </AppShell>
  );
}