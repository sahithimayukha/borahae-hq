import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { PageHero } from "@/components/app/page-hero";
import { ProjectReviewActions } from "@/components/admin/project-review-actions";
import { createClient } from "@/lib/supabase/server";
import type { FanProject, Profile } from "@/types/database";

function formatProjectDate(date: string | null) {
  if (!date) {
    return "Date not added";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default async function AdminProjectsPage() {
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

  if (!profile?.is_admin) {
    redirect("/dashboard");
  }

  const { data: pendingProjectsData, error } = await supabase
    .from("fan_projects")
    .select("*")
    .eq("status", "pending")
    .order("created_at", {
      ascending: true,
    });

  const pendingProjects = (pendingProjectsData ?? []) as FanProject[];

  return (
    <AppShell activePath="/projects">
      <PageHero
        eyebrow="Admin Review"
        title="Review Fan Projects"
        description="Approve or reject pending ARMY project submissions before they appear in the public community feed."
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-era-label text-[10px] text-[#E11D48]">
            Pending Queue
          </p>

          <p className="mt-2 text-sm font-semibold text-white/70">
            {pendingProjects.length} project
            {pendingProjects.length === 1 ? "" : "s"} waiting for review.
          </p>
        </div>

        <Link
          href="/projects"
          className="font-era-label inline-flex rounded-full border border-white/30 bg-[#151515] px-5 py-3 text-[10px] text-white! transition hover:bg-[#222222]"
        >
          Back To Projects
        </Link>
      </div>

      {error ? (
        <div className="rounded-4xl border border-[#E11D48] bg-[#FFF1F3] p-6 text-[#B91C3B]">
          <h2 className="font-era text-xl leading-[1.1]">
            Pending Projects Could Not Load
          </h2>

          <p className="mt-3 text-sm leading-6">
            Supabase returned this message: {error.message}
          </p>
        </div>
      ) : null}

      {!error && pendingProjects.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {pendingProjects.map((project) => (
            <article
              key={project.id}
              className="rounded-4xl border border-[#2A2A2A] bg-white p-6 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-era-label text-[10px] text-[#E11D48]">
                    {formatProjectDate(project.project_date)}
                  </p>

                  <h2 className="font-era mt-3 text-2xl leading-[1.08] text-[#111111]">
                    {project.title}
                  </h2>
                </div>

                <span className="font-era-label inline-flex w-fit rounded-full bg-[#111111] px-4 py-2 text-[9px] text-white!">
                  {project.category}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-[#111111]">
                {project.organizer_name ? (
                  <span className="rounded-full bg-[#F7F7F7] px-4 py-2">
                    Organizer: {project.organizer_name}
                  </span>
                ) : null}

                {project.country ? (
                  <span className="rounded-full bg-[#F7F7F7] px-4 py-2">
                    {project.country}
                  </span>
                ) : null}

                {project.city ? (
                  <span className="rounded-full bg-[#F7F7F7] px-4 py-2">
                    {project.city}
                  </span>
                ) : null}
              </div>

              {project.description ? (
                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[#4B4B4B]">
                  {project.description}
                </p>
              ) : null}

              {project.project_link ? (
                <a
                  href={project.project_link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-[#111111] px-4 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-white! transition hover:bg-[#E11D48]"
                >
                  Open Link
                </a>
              ) : null}

              <ProjectReviewActions projectId={project.id} />
            </article>
          ))}
        </div>
      ) : null}

      {!error && pendingProjects.length === 0 ? (
        <div className="rounded-4xl border border-[#2A2A2A] bg-white p-8 text-center text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
          <p className="font-era text-3xl leading-[1.05] text-[#E11D48]">
            Review Queue Is Clear
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#4B4B4B]">
            There are no pending fan-project submissions right now.
          </p>
        </div>
      ) : null}
    </AppShell>
  );
}