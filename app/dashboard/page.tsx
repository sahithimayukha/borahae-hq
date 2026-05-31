import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { NextEventCountdown } from "@/components/calendar/next-event-countdown";
import { ArirangEraSection } from "@/components/era/arirang-era-section";
import { DailyMemoryPrompt } from "@/components/vault/daily-memory-prompt";
import { createClient } from "@/lib/supabase/server";
import type {
  CalendarEvent,
  FanProject,
  Profile,
  UserReminder,
} from "@/types/database";

type ProfileSummaryProps = {
  profile: Profile | null;
  fallbackDisplayName: string;
};

type FeaturedProjectsCardProps = {
  projects: FanProject[];
};

type StatCardProps = {
  label: string;
  value: string | number;
  description: string;
};

type QuickActionProps = {
  label: string;
  description: string;
  href: string;
};

type DashboardReminderRecord = {
  reminder: UserReminder;
  title: string;
  targetLabel: string;
};

type UpcomingRemindersCardProps = {
  reminders: DashboardReminderRecord[];
};

const cardClass =
  "rounded-[1.5rem] border border-[#2A2A2A] bg-white p-4 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:rounded-[2rem] sm:p-6";

const quickActions: QuickActionProps[] = [
  {
    label: "Add Memory",
    description: "Save a personal BTS moment inside your private archive.",
    href: "/vault",
  },
  {
    label: "Add Event",
    description: "Create a reminder for an ARMY calendar moment.",
    href: "/calendar",
  },
  {
    label: "Submit Project",
    description: "Share a fan project for community review.",
    href: "/projects",
  },
  {
    label: "Edit Profile",
    description: "Update your personal ARMY identity details.",
    href: "/profile",
  },
];

function getTodayInIndia() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getTomorrowInIndia() {
  const tomorrow = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(tomorrow);
}

function formatShortDate(date: string | null) {
  if (!date) {
    return "TBA";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatReminderDate(date: string) {
  const today = getTodayInIndia();

  const tomorrow = getTomorrowInIndia();

  if (date === today) {
    return "Today";
  }

  if (date === tomorrow) {
    return "Tomorrow";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
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

function StatCard({ label, value, description }: StatCardProps) {
  return (
    <article className="rounded-3xl border border-[#2A2A2A] bg-white p-4 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:rounded-4xl sm:p-5">
      <p className="font-era-label text-[9px] text-[#E11D48] sm:text-[10px]">
        {label}
      </p>

      <p className="mt-3 text-2xl font-black text-[#111111] sm:text-3xl">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-[#4B4B4B] sm:text-sm sm:leading-6">
        {description}
      </p>
    </article>
  );
}

function QuickActionsSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#0B0B0B] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.42)] sm:rounded-4xl sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.24),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.10),transparent_28%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,#fff_1px,transparent_1px)] bg-size-[18px_18px] opacity-[0.08]" />

      <div className="relative z-10">
        <p className="font-era-label text-[10px] text-[#E11D48]">
          Quick Actions
        </p>

        <h2 className="font-era-display mt-4 max-w-3xl text-4xl text-white! sm:text-6xl">
          Keep Your Hub
          <span className="mt-2 block w-fit bg-[#E11D48] px-3 py-2 text-white! sm:mt-3 sm:px-4">
            Organized.
          </span>
        </h2>

        <p className="mt-5 max-w-2xl border-l-4 border-[#E11D48] pl-4 text-sm font-semibold leading-6 text-white/75 sm:leading-7">
          Open the feature you need without wandering through extra dashboard
          widgets.
        </p>

        <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group rounded-[1.4rem] border border-white/15 bg-white p-4 text-[#111111] shadow-[0_18px_50px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:border-[#E11D48] sm:rounded-4xl sm:p-5"
            >
              <p className="font-era text-xl leading-[1.05] text-[#111111] sm:text-2xl">
                {action.label}
              </p>

              <p className="mt-3 text-sm leading-6 text-[#4B4B4B]">
                {action.description}
              </p>

              <p className="font-era-label mt-5 text-[10px] text-[#E11D48]">
                Open →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function UpcomingRemindersCard({ reminders }: UpcomingRemindersCardProps) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#0B0B0B] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.42)] sm:rounded-4xl sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.20),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.08),transparent_28%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,#fff_1px,transparent_1px)] bg-size-[18px_18px] opacity-[0.05]" />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-era-label flex items-center gap-2 text-[10px] text-[#E11D48]">
              <BellIcon />
              Upcoming Reminders
            </p>

            <h2 className="font-era mt-3 text-2xl leading-[1.08] text-white!">
              Your ARMY Reminder List
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              Your closest reminder dates appear here so important ARMY moments
              do not get buried beneath screenshots and tabs.
            </p>
          </div>

          <Link
            href="/reminders"
            className="font-era-label inline-flex w-fit shrink-0 rounded-full bg-[#E11D48] px-4 py-2 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
          >
            View All
          </Link>
        </div>

        {reminders.length > 0 ? (
          <div className="mt-6 space-y-3">
            {reminders.map((record) => (
              <div
                key={record.reminder.id}
                className="rounded-2xl border border-white/15 bg-black/35 p-4 backdrop-blur-sm"
              >
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="wrap-break-word text-sm font-black text-white!">
                      {record.title}
                    </p>

                    <p className="font-era-label mt-2 text-[9px] text-[#E11D48]">
                      {record.targetLabel}
                    </p>
                  </div>

                  <span className="font-era-label inline-flex w-fit shrink-0 rounded-full bg-[#E11D48] px-3 py-1 text-[9px] text-white!">
                    {formatReminderDate(record.reminder.remind_on)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-4">
            <p className="text-sm leading-6 text-white/65">
              No upcoming reminders yet. Open Calendar or Fan Projects and
              choose Remind Me on an activity you want to follow.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

function FeaturedProjectsCard({ projects }: FeaturedProjectsCardProps) {
  return (
    <article className={cardClass}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-era-label text-[10px] text-[#E11D48]">Community</p>

          <h2 className="font-era mt-3 text-2xl leading-[1.08] text-[#111111]">
            Featured Fan Projects
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#4B4B4B]">
            Approved ARMY projects from the community feed.
          </p>
        </div>

        <Link
          href="/projects"
          className="font-era-label inline-flex w-fit rounded-full bg-[#E11D48] px-4 py-2 text-[10px] text-white! transition hover:bg-[#C5163D]"
        >
          View All
        </Link>
      </div>

      {projects.length > 0 ? (
        <div className="mt-6 space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-[#2A2A2A] bg-[#F7F7F7] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-black text-[#111111]">
                    {project.title}
                  </p>

                  <p className="font-era-label mt-2 text-[9px] text-[#E11D48]">
                    {project.category}
                  </p>
                </div>

                <span className="font-era-label inline-flex w-fit rounded-full bg-[#111111] px-3 py-1 text-[9px] text-white!">
                  {formatShortDate(project.project_date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-[#F7F7F7] p-4">
          <p className="text-sm leading-6 text-[#4B4B4B]">
            No approved projects yet. Community projects will appear here after
            review.
          </p>
        </div>
      )}
    </article>
  );
}

function ProfileSummary({ profile, fallbackDisplayName }: ProfileSummaryProps) {
  if (!profile) {
    return (
      <article className={cardClass}>
        <p className="font-era-label text-[10px] text-[#E11D48]">
          My ARMY Profile
        </p>

        <h2 className="font-era mt-3 text-2xl leading-[1.08] text-[#111111]">
          Create Your Profile
        </h2>

        <p className="mt-4 text-sm leading-6 text-[#4B4B4B]">
          Add your country, ARMY since year, bias, favorite album, favorite
          song, and favorite era.
        </p>

        <Link
          href="/profile"
          className="font-era-label mt-5 inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:bg-[#C5163D]"
        >
          Create Profile
        </Link>
      </article>
    );
  }

  const details = [
    {
      label: "Country",
      value: profile.country,
    },
    {
      label: "ARMY Since",
      value: profile.army_since?.toString(),
    },
    {
      label: "Bias",
      value: profile.bias,
    },
    {
      label: "Favorite Album",
      value: profile.favorite_album,
    },
    {
      label: "Favorite Song",
      value: profile.favorite_song,
    },
    {
      label: "Favorite Era",
      value: profile.favorite_era,
    },
  ];

  return (
    <article className={cardClass}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-era-label text-[10px] text-[#E11D48]">
            My ARMY Profile
          </p>

          <h2 className="font-era mt-3 text-2xl leading-[1.08] text-[#111111]">
            {profile.display_name || fallbackDisplayName}
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#4B4B4B]">
            Your compact personal ARMY profile summary.
          </p>
        </div>

        <Link
          href="/profile"
          className="font-era-label inline-flex w-fit rounded-full border border-[#111111] bg-white px-4 py-2 text-[10px] text-[#111111] transition hover:bg-[#F7F7F7]"
        >
          Edit Profile
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {details.map((detail) => (
          <div key={detail.label} className="rounded-2xl bg-[#F7F7F7] p-4">
            <p className="font-era-label text-[9px] text-[#E11D48]">
              {detail.label}
            </p>

            <p className="mt-2 text-sm font-bold text-[#111111]">
              {detail.value || "Not added yet"}
            </p>
          </div>
        ))}
      </div>

      {profile.favorite_quote ? (
        <div className="mt-4 rounded-2xl border border-[#2A2A2A] bg-white p-4">
          <p className="font-era-label text-[9px] text-[#E11D48]">
            Favorite Quote
          </p>

          <p className="mt-2 text-sm leading-6 text-[#4B4B4B]">
            {profile.favorite_quote}
          </p>
        </div>
      ) : null}
    </article>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const today = getTodayInIndia();

  const [
    { data: profileData },
    { data: eventsData },
    { data: projectsData },
    { data: reminderData },
    { count: memoryCount },
    { count: approvedCommunityProjectCount },
    { count: upcomingEventCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),

    supabase
      .from("events")
      .select("*")
      .gte("event_date", today)
      .order("event_date", {
        ascending: true,
      })
      .limit(4),

    supabase
      .from("fan_projects")
      .select("*")
      .eq("status", "approved")
      .neq("category", "Past")
      .gte("project_date", today)
      .order("project_date", {
        ascending: true,
      })
      .limit(4),

    supabase
      .from("user_reminders")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_enabled", true)
      .gte("remind_on", today)
      .order("remind_on", {
        ascending: true,
      })
      .limit(4),

    supabase
      .from("memories")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id),

    supabase
      .from("fan_projects")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "approved"),

    supabase
      .from("events")
      .select("*", {
        count: "exact",
        head: true,
      })
      .gte("event_date", today),
  ]);

  const profile = (profileData ?? null) as Profile | null;

  const upcomingEvents = (eventsData ?? []) as CalendarEvent[];

  const featuredProjects = (projectsData ?? []) as FanProject[];

  const reminders = (reminderData ?? []) as UserReminder[];

  const reminderEventIds = reminders
    .map((reminder) => reminder.event_id)
    .filter((id): id is string => Boolean(id));

  const reminderProjectIds = reminders
    .map((reminder) => reminder.fan_project_id)
    .filter((id): id is string => Boolean(id));

  let reminderEvents: CalendarEvent[] = [];

  let reminderProjects: FanProject[] = [];

  if (reminderEventIds.length > 0) {
    const { data } = await supabase
      .from("events")
      .select("*")
      .in("id", reminderEventIds);

    reminderEvents = (data ?? []) as CalendarEvent[];
  }

  if (reminderProjectIds.length > 0) {
    const { data } = await supabase
      .from("fan_projects")
      .select("*")
      .in("id", reminderProjectIds);

    reminderProjects = (data ?? []) as FanProject[];
  }

  const reminderEventMap = new Map(
    reminderEvents.map((event) => [event.id, event]),
  );

  const reminderProjectMap = new Map(
    reminderProjects.map((project) => [project.id, project]),
  );

  const dashboardReminders = reminders
    .map((reminder) => {
      if (reminder.target_type === "event" && reminder.event_id) {
        const event = reminderEventMap.get(reminder.event_id);

        if (!event) {
          return null;
        }

        return {
          reminder,
          title: event.title,
          targetLabel: "Calendar Event",
        };
      }

      if (reminder.target_type === "fan_project" && reminder.fan_project_id) {
        const project = reminderProjectMap.get(reminder.fan_project_id);

        if (!project) {
          return null;
        }

        return {
          reminder,
          title: project.title,
          targetLabel: "Fan Project",
        };
      }

      return null;
    })
    .filter((record): record is DashboardReminderRecord => Boolean(record));

  const fallbackDisplayName =
    profile?.display_name ||
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    "ARMY";

  return (
    <AppShell activePath="/dashboard">
      <ArirangEraSection displayName={fallbackDisplayName} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Memories"
          value={memoryCount ?? 0}
          description="Private memories saved inside your vault."
        />

        <StatCard
          label="Projects"
          value={approvedCommunityProjectCount ?? 0}
          description="Approved fan projects available to explore."
        />

        <StatCard
          label="Events"
          value={upcomingEventCount ?? 0}
          description="Upcoming ARMY calendar moments."
        />

        <StatCard
          label="Profile"
          value={profile ? "Ready" : "New"}
          description={
            profile
              ? "Your personal ARMY profile is saved."
              : "Create your personal ARMY profile."
          }
        />
      </div>

      <NextEventCountdown event={upcomingEvents[0] ?? null} />

      <UpcomingRemindersCard reminders={dashboardReminders} />

      <QuickActionsSection />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <DailyMemoryPrompt />

        <FeaturedProjectsCard projects={featuredProjects} />

        <div className="lg:col-span-2">
          <ProfileSummary
            profile={profile}
            fallbackDisplayName={fallbackDisplayName}
          />
        </div>
      </div>
    </AppShell>
  );
}