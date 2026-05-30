import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { PageHero } from "@/components/app/page-hero";
import { ResolveSupportRequestButton } from "@/components/admin/resolve-support-request-button";
import { createClient } from "@/lib/supabase/server";
import type {
  Profile,
  SupportRequest,
} from "@/types/database";

function formatRequestDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function AdminSupportPage() {
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

  const { data: requestsData, error } = await supabase
    .from("support_requests")
    .select("*")
    .eq("status", "open")
    .order("created_at", {
      ascending: true,
    });

  const requests = (requestsData ?? []) as SupportRequest[];

  return (
    <AppShell activePath="/settings">
      <PageHero
        eyebrow="Admin Support"
        title="Private Support Inbox"
        description="Review private account, privacy, and technical-support requests submitted by BorahaeHQ users."
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-era-label text-[10px] text-[#E11D48]">
            Open Requests
          </p>

          <p className="mt-2 text-sm font-semibold text-white/70">
            {requests.length} request
            {requests.length === 1 ? "" : "s"} waiting for review.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/settings"
            className="inline-flex items-center justify-center rounded-full border border-white/30 bg-[#151515] px-4 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-white! transition hover:bg-[#222222]"
          >
            Back To Settings
          </Link>

          <Link
            href="/admin/projects"
            className="inline-flex items-center justify-center rounded-full bg-[#E11D48] px-4 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-white! transition hover:bg-[#C5163D]"
          >
            Review Projects
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-4xl border border-[#E11D48] bg-[#FFF1F3] p-6 text-[#B91C3B]">
          <h2 className="font-era text-xl leading-[1.1]">
            Support Requests Could Not Load
          </h2>

          <p className="mt-3 text-sm leading-6">
            Supabase returned this message: {error.message}
          </p>
        </div>
      ) : null}

      {!error && requests.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {requests.map((request) => (
            <article
              key={request.id}
              className="rounded-4xl border border-[#2A2A2A] bg-white p-6 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#E11D48]">
                    {formatRequestDate(request.created_at)}
                  </p>

                  <h2 className="font-era mt-3 text-2xl leading-[1.08] text-[#111111]">
                    {request.category}
                  </h2>
                </div>

                <span className="inline-flex w-fit rounded-full bg-[#111111] px-4 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-white!">
                  Open
                </span>
              </div>

              <div className="mt-5 rounded-2xl bg-[#F7F7F7] p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#E11D48]">
                  Private Account Email
                </p>

                <p className="mt-2 break-all text-sm font-bold text-[#111111]">
                  {request.account_email}
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-[#E5E5E5] bg-white p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#E11D48]">
                  Message
                </p>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#4B4B4B]">
                  {request.message}
                </p>
              </div>

              <div className="mt-5">
                <ResolveSupportRequestButton
                  requestId={request.id}
                />
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {!error && requests.length === 0 ? (
        <div className="rounded-4xl border border-[#2A2A2A] bg-white p-8 text-center text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
          <p className="font-era text-3xl leading-[1.05] text-[#E11D48]">
            Support Inbox Is Clear
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#4B4B4B]">
            There are no open private support requests right now.
          </p>
        </div>
      ) : null}
    </AppShell>
  );
}