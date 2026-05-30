import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { PageHero } from "@/components/app/page-hero";
import { DeleteProjectButton } from "@/components/projects/delete-project-button";
import { EditProjectForm } from "@/components/projects/edit-project-form";
import { ProjectForm } from "@/components/projects/project-form";
import { createClient } from "@/lib/supabase/server";
import type { FanProject, Profile } from "@/types/database";

const projectCategories = [
  "All",
  "Charity",
  "Birthday Café",
  "Streaming",
  "Watch Party",
  "Online Event",
  "Meetup",
];

type ProjectsPageProps = {
  searchParams?: Promise<{
    category?: string;
    q?: string;
  }>;
};

type FanProjectCardProps = {
  project: FanProject;
};

type ProjectToolsProps = {
  selectedCategory: string;
  searchQuery: string;
};

type MySubmittedProjectsProps = {
  projects: FanProject[];
  userId: string;
};

function formatProjectDate(date: string | null) {
  if (!date) {
    return "Date To Be Announced";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatSubmittedDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getCategoryHref(category: string, searchQuery: string) {
  const params = new URLSearchParams();

  if (category !== "All") {
    params.set("category", category);
  }

  if (searchQuery) {
    params.set("q", searchQuery);
  }

  const queryString = params.toString();

  return queryString ? `/projects?${queryString}` : "/projects";
}

function getStatusStyles(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "approved") {
    return "border-[#166534] bg-[#DCFCE7] text-[#166534]";
  }

  if (normalizedStatus === "rejected") {
    return "border-[#B91C3B] bg-[#FFF1F3] text-[#B91C3B]";
  }

  return "border-[#E11D48] bg-[#FFF1F3] text-[#B91C3B]";
}

function getStatusMessage(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "approved") {
    return "This submission has been approved and can appear in the public project feed.";
  }

  if (normalizedStatus === "rejected") {
    return "This submission was not approved for the public feed.";
  }

  return "This submission is waiting for review. It is not visible in the public feed yet.";
}

function FanProjectCard({ project }: FanProjectCardProps) {
  const locationText = [project.city, project.country]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="rounded-4xl border border-[#2A2A2A] bg-white p-6 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-era-label text-[10px] text-[#E11D48]">
            {formatProjectDate(project.project_date)}
          </p>

          <h2 className="font-era mt-3 text-2xl leading-[1.1] text-[#111111]">
            {project.title}
          </h2>

          {project.organizer_name ? (
            <p className="mt-2 text-sm font-semibold text-[#4B4B4B]">
              Organized by {project.organizer_name}
            </p>
          ) : null}
        </div>

        <span className="font-era-label inline-flex w-fit rounded-full bg-[#111111] px-4 py-2 text-[10px] text-white!">
          {project.category}
        </span>
      </div>

      {project.description ? (
        <p className="mt-5 text-sm leading-6 text-[#4B4B4B]">
          {project.description}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-[#111111]">
        {locationText ? (
          <span className="rounded-full bg-[#F7F7F7] px-4 py-2">
            {locationText}
          </span>
        ) : null}

        <span className="rounded-full bg-[#F7F7F7] px-4 py-2">
          {project.status}
        </span>
      </div>

      {project.project_link ? (
        <a
          href={project.project_link}
          target="_blank"
          rel="noreferrer"
          className="font-era-label mt-6 inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
        >
          View Project
        </a>
      ) : null}
    </article>
  );
}

function MySubmittedProjects({
  projects,
  userId,
}: MySubmittedProjectsProps) {
  return (
    <section className="relative overflow-hidden rounded-4xl border border-[#2A2A2A] bg-[#0B0B0B] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.42)] sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.24),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.10),transparent_28%)]" />

      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(135deg,#fff_1px,transparent_1px)] bg-size-[18px_18px]" />

      <div className="relative z-10">
        <p className="font-era-label text-[10px] text-[#E11D48]">
          Personal Submissions
        </p>

        <h2 className="font-era-display mt-4 max-w-4xl text-5xl text-white! sm:text-6xl">
          My Submitted
          <span className="mt-3 block w-fit bg-[#E11D48] px-4 py-2 text-white!">
            Projects.
          </span>
        </h2>

        <p className="mt-5 max-w-2xl border-l-4 border-[#E11D48] pl-4 text-sm font-semibold leading-7 text-white/75">
          Track the review status of the projects you submitted. Pending and
          rejected projects remain visible only inside your personal account.
        </p>

        {projects.length > 0 ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {projects.map((project) => {
              const locationText = [project.city, project.country]
                .filter(Boolean)
                .join(", ");

              return (
                <article
                  key={project.id}
                  className="rounded-4xl border border-white/15 bg-white p-5 text-[#111111] shadow-[0_18px_50px_rgba(0,0,0,0.25)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-era-label text-[10px] text-[#E11D48]">
                        Submitted {formatSubmittedDate(project.created_at)}
                      </p>

                      <h3 className="font-era mt-3 text-2xl leading-[1.1] text-[#111111]">
                        {project.title}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-[#4B4B4B]">
                        {project.category}
                      </p>
                    </div>

                    <span
                      className={`font-era-label inline-flex w-fit rounded-full border px-4 py-2 text-[10px] ${getStatusStyles(
                        project.status,
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {project.description ? (
                    <p className="mt-5 text-sm leading-6 text-[#4B4B4B]">
                      {project.description}
                    </p>
                  ) : null}

                  <p className="mt-5 rounded-2xl bg-[#F7F7F7] p-4 text-xs font-semibold leading-5 text-[#4B4B4B]">
                    {getStatusMessage(project.status)}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-[#111111]">
                    {locationText ? (
                      <span className="rounded-full bg-[#F7F7F7] px-4 py-2">
                        {locationText}
                      </span>
                    ) : null}

                    <span className="rounded-full bg-[#F7F7F7] px-4 py-2">
                      {formatProjectDate(project.project_date)}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {project.status.toLowerCase() === "pending" ? (
                      <>
                        <EditProjectForm
                          project={project}
                          userId={userId}
                        />

                        <DeleteProjectButton
                          projectId={project.id}
                          userId={userId}
                        />
                      </>
                    ) : null}

                    {project.project_link ? (
                      <a
                        href={project.project_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-[#111111] px-3 py-2 text-[8px] font-black uppercase leading-none tracking-[0.14em] text-white! transition hover:bg-[#E11D48]"
                      >
                        Open Link
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-4xl border border-white/15 bg-black/35 p-6">
            <p className="font-era text-2xl leading-[1.1] text-white!">
              No Submissions Yet
            </p>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
              Submit your first fan project using the form above. It will appear
              here with a pending status while it waits for review.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectTools({
  selectedCategory,
  searchQuery,
}: ProjectToolsProps) {
  return (
    <section className="rounded-4xl border border-[#2A2A2A] bg-[#0B0B0B] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-era-label text-[10px] text-[#E11D48]">
              Search Projects
            </p>

            <h2 className="font-era mt-3 text-3xl leading-[1.05] text-white!">
              Find A Fan Project
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
              Search approved fan-project titles using words such as charity,
              birthday, café, streaming, meetup, or watch party.
            </p>
          </div>

          <form
            action="/projects"
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

            <label htmlFor="project-search" className="sr-only">
              Search approved fan projects by title
            </label>

            <input
              id="project-search"
              name="q"
              type="search"
              defaultValue={searchQuery}
              placeholder="Search project title..."
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
                href={getCategoryHref(selectedCategory, "")}
                className="font-era-label inline-flex items-center justify-center rounded-full border border-white/30 bg-[#151515] px-6 py-3.5 text-[10px] text-white! transition hover:bg-[#222222]"
              >
                Clear
              </Link>
            ) : null}
          </form>
        </div>

        <div className="border-t border-white/10 pt-5">
          <p className="font-era-label text-[10px] text-white!">
            Filter By Category
          </p>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {projectCategories.map((category) => {
              const isActive = selectedCategory === category;

              return (
                <Link
                  key={category}
                  href={getCategoryHref(category, searchQuery)}
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

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const resolvedSearchParams = await searchParams;

  const searchQuery = (resolvedSearchParams?.q ?? "")
    .trim()
    .slice(0, 80);

  const requestedCategory = resolvedSearchParams?.category ?? "All";

  const selectedCategory = projectCategories.includes(requestedCategory)
    ? requestedCategory
    : "All";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const profile = (profileData ?? null) as Profile | null;

  let publicProjectsQuery = supabase
    .from("fan_projects")
    .select("*")
    .eq("status", "approved")
    .order("project_date", { ascending: true });

  if (selectedCategory !== "All") {
    publicProjectsQuery = publicProjectsQuery.eq(
      "category",
      selectedCategory,
    );
  }

  if (searchQuery) {
    publicProjectsQuery = publicProjectsQuery.ilike(
      "title",
      `%${searchQuery}%`,
    );
  }

  const [
    { data: publicProjectsData, error: publicProjectsError },
    { data: submittedProjectsData, error: submittedProjectsError },
  ] = await Promise.all([
    publicProjectsQuery,

    supabase
      .from("fan_projects")
      .select("*")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const publicProjects = (publicProjectsData ?? []) as FanProject[];

  const submittedProjects =
    (submittedProjectsData ?? []) as FanProject[];

  return (
    <AppShell activePath="/projects">
      <PageHero
        eyebrow="Fan Projects"
        title="Discover ARMY Projects"
        description="Explore approved charity drives, birthday cafés, watch parties, streaming projects, meetups, and community-led ARMY moments."
      />

      {profile?.is_admin ? (
  <div className="flex justify-end">
    <Link
      href="/admin/projects"
      style={{
        color: "#FFFFFF",
        backgroundColor: "#E11D48",
        fontSize: "12px",
        fontWeight: 900,
        lineHeight: "1",
      }}
      className="inline-flex items-center justify-center rounded-full border border-[#E11D48] px-4 py-2 uppercase tracking-[0.14em] shadow-[0_10px_30px_rgba(225,29,72,0.28)] transition hover:-translate-y-0.5 hover:bg-[#C5163D]!"
    >
      Review Pending Projects
    </Link>
  </div>
) : null}

      <ProjectForm userId={user.id} />

      {submittedProjectsError ? (
        <div className="rounded-4xl border border-[#E11D48] bg-[#FFF1F3] p-6 text-[#B91C3B]">
          <h2 className="font-era text-xl leading-[1.1]">
            Your Submissions Could Not Load
          </h2>

          <p className="mt-3 text-sm leading-6">
            Supabase returned this message: {submittedProjectsError.message}
          </p>
        </div>
      ) : (
        <MySubmittedProjects
          projects={submittedProjects}
          userId={user.id}
        />
      )}

      <ProjectTools
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />

      {publicProjectsError ? (
        <div className="rounded-4xl border border-[#E11D48] bg-[#FFF1F3] p-6 text-[#B91C3B]">
          <h2 className="font-era text-xl leading-[1.1]">
            Fan Projects Could Not Load
          </h2>

          <p className="mt-3 text-sm leading-6">
            Supabase returned this message: {publicProjectsError.message}
          </p>
        </div>
      ) : null}

      {!publicProjectsError && publicProjects.length > 0 ? (
        <div className="space-y-5">
          <div>
            <h2 className="font-era text-3xl leading-[1.05] text-white!">
              {searchQuery
                ? "Search Results"
                : "Approved Community Projects"}
            </h2>

            <p className="mt-2 text-sm text-white/70">
              {searchQuery
                ? `${publicProjects.length} approved project result${
                    publicProjects.length === 1 ? "" : "s"
                  } found for “${searchQuery}”${
                    selectedCategory !== "All"
                      ? ` inside ${selectedCategory}.`
                      : "."
                  }`
                : `Showing ${
                    selectedCategory === "All"
                      ? "all"
                      : selectedCategory
                  } approved community projects.`}
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {publicProjects.map((project) => (
              <FanProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        </div>
      ) : null}

      {!publicProjectsError && publicProjects.length === 0 ? (
        <div className="rounded-4xl border border-[#2A2A2A] bg-white p-8 text-center text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
          <p className="font-era text-3xl leading-[1.05] text-[#E11D48]">
            No Matching Projects
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#4B4B4B]">
            {searchQuery
              ? `We could not find an approved fan project titled “${searchQuery}”. Try another word, select a different category, or clear the search.`
              : "There are no approved projects in this category yet. Try another category or submit a new fan project for review."}
          </p>

          {searchQuery || selectedCategory !== "All" ? (
            <Link
              href="/projects"
              className="font-era-label mt-5 inline-flex rounded-full bg-[#E11D48] px-6 py-3.5 text-[10px] text-white! transition hover:bg-[#C5163D]"
            >
              Reset Projects
            </Link>
          ) : null}
        </div>
      ) : null}
    </AppShell>
  );
}