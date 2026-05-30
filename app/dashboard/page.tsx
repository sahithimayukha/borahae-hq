import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { NextEventCountdown } from "@/components/calendar/next-event-countdown";
import { ArirangEraSection } from "@/components/era/arirang-era-section";
import { DailyMemoryPrompt } from "@/components/vault/daily-memory-prompt";
import { createClient } from "@/lib/supabase/server";
import type { CalendarEvent, FanProject, Profile } from "@/types/database";

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

const cardClass =
  "rounded-[2rem] border border-[#2A2A2A] bg-white p-6 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]";

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

function formatShortDate(date: string | null) {
  if (!date) {
    return "TBA";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function StatCard({ label, value, description }: StatCardProps) {
  return (
    <article className="rounded-4xl border border-[#2A2A2A] bg-white p-5 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
      <p className="font-era-label text-[10px] text-[#E11D48]">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-[#111111]">{value}</p>

      <p className="mt-2 text-sm leading-6 text-[#4B4B4B]">
        {description}
      </p>
    </article>
  );
}

function QuickActionsSection() {
  return (
    <section className="relative overflow-hidden rounded-4xl border border-[#2A2A2A] bg-[#0B0B0B] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.42)] sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.24),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.10),transparent_28%)]" />

      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(135deg,#fff_1px,transparent_1px)]ize:18px_18px]" />

      <div className="relative z-10">
        <p className="font-era-label text-[10px] text-[#E11D48]">
          Quick Actions
        </p>

        <h2 className="font-era-display mt-4 max-w-3xl text-5xl text-white! sm:text-6xl">
          Keep Your Hub
          <span className="mt-3 block w-fit bg-[#E11D48] px-4 py-2 text-white!">
            Organized.
          </span>
        </h2>

        <p className="mt-5 max-w-2xl border-l-4 border-[#E11D48] pl-4 text-sm font-semibold leading-7 text-white/75">
          Open the feature you need without wandering through extra dashboard
          widgets.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group rounded-4xl border border-white/15 bg-white p-5 text-[#111111] shadow-[0_18px_50px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:border-[#E11D48]"
            >
              <p className="font-era text-2xl leading-[1.05] text-[#111111]">
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

function FeaturedProjectsCard({ projects }: FeaturedProjectsCardProps) {
  return (
    <article className={cardClass}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-era-label text-[10px] text-[#E11D48]">
            Community
          </p>

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

function ProfileSummary({
  profile,
  fallbackDisplayName,
}: ProfileSummaryProps) {
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
          <div
            key={detail.label}
            className="rounded-2xl bg-[#F7F7F7] p-4"
          >
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

  const today = new Date().toISOString().slice(0, 10);

  const [
    { data: profileData },
    { data: eventsData },
    { data: projectsData },
    { count: memoryCount },
    { count: approvedCommunityProjectCount },
    { count: upcomingEventCount },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle(),

    supabase
      .from("events")
      .select("*")
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .limit(4),

    supabase
      .from("fan_projects")
      .select("*")
      .eq("status", "approved")
      .order("project_date", { ascending: true })
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

  const fallbackDisplayName =
    profile?.display_name ||
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    "ARMY";

  return (
    <AppShell activePath="/dashboard">
      <ArirangEraSection displayName={fallbackDisplayName} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      <QuickActionsSection />

      <div className="grid gap-6 lg:grid-cols-2">
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