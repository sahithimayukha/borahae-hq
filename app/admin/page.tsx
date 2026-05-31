import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { PageHero } from "@/components/app/page-hero";
import { SubmitLoadingButton } from "@/components/ui/submit-loading-button";
import { createClient } from "@/lib/supabase/server";
import type { OfficialNoticeImport, Profile } from "@/types/database";

type AdminToolCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
};

type OfficialSyncResponse = {
  ok: boolean;
  runStatus: string;
  sourcesChecked?: number;
  pagesChecked?: number;
  noticesAdded?: number;
  failedSources?: number;
};

type AdminPageProps = {
  searchParams?: Promise<{
    sync?: string;
    added?: string;
    publish?: string;
    detail?: string;
  }>;
};

const publishCategories = [
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
  "Photo Experience",
  "Light Show",
  "Charity",
  "Meetup",
  "Past",
];

function formatDetectedDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

async function updateNoticeStatus(formData: FormData) {
  "use server";

  const noticeId = String(formData.get("noticeId") ?? "");

  const requestedStatus = String(formData.get("reviewStatus") ?? "");

  if (!noticeId || !["approved", "rejected"].includes(requestedStatus)) {
    throw new Error("Invalid official-update review request.");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  const profile = (profileData ?? null) as Pick<Profile, "is_admin"> | null;

  if (!profile?.is_admin) {
    redirect("/dashboard");
  }

  const { error } = await supabase
    .from("official_notice_imports")
    .update({
      review_status: requestedStatus,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", noticeId);

  if (error) {
    throw new Error(`Official update could not be reviewed: ${error.message}`);
  }

  revalidatePath("/admin");
}

async function publishOfficialNotice(formData: FormData) {
  "use server";

  const noticeId = String(formData.get("noticeId") ?? "").trim();

  const destination = String(formData.get("destination") ?? "").trim();

  const publicTitle = String(formData.get("publicTitle") ?? "").trim();

  const publicCategory = String(formData.get("publicCategory") ?? "").trim();

  const publicDate = String(formData.get("publicDate") ?? "").trim();

  const publicDescription = String(
    formData.get("publicDescription") ?? "",
  ).trim();

  const publicLocation = String(formData.get("publicLocation") ?? "").trim();

  const publicLink = String(formData.get("publicLink") ?? "").trim();

  const publicIsGlobal = formData.get("publicIsGlobal") === "on";

  if (
    !noticeId ||
    !destination ||
    !publicTitle ||
    !publicCategory ||
    !publicDate
  ) {
    redirect(
      `/admin?publish=error&detail=${encodeURIComponent(
        "Destination, title, category, and date are required.",
      )}`,
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.rpc("publish_official_notice", {
    notice_id: noticeId,
    destination,
    public_title: publicTitle,
    public_category: publicCategory,
    public_date: publicDate,
    public_description: publicDescription,
    public_location: publicLocation,
    public_link: publicLink,
    public_is_global: publicIsGlobal,
  });

  if (error) {
    redirect(
      `/admin?publish=error&detail=${encodeURIComponent(error.message)}`,
    );
  }

  revalidatePath("/admin");
  revalidatePath("/calendar");
  revalidatePath("/projects");
  revalidatePath("/dashboard");

  redirect("/admin?publish=success");
}

async function runOfficialSourceSync() {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: canRunSync, error: permissionError } = await supabase.rpc(
    "can_run_official_source_sync",
    {},
  );

  if (permissionError || !canRunSync) {
    redirect("/dashboard");
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    redirect("/login");
  }

  const functionUrl = process.env.SUPABASE_OFFICIAL_SYNC_URL?.trim();

  const supabasePublicKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!functionUrl || !supabasePublicKey) {
    redirect(
      `/admin?sync=error&detail=${encodeURIComponent(
        "Missing SUPABASE_OFFICIAL_SYNC_URL or Supabase public key.",
      )}`,
    );
  }

  const response = await fetch(functionUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: supabasePublicKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
    cache: "no-store",
  });

  const responseText = await response.text();

  if (!response.ok) {
    redirect(
      `/admin?sync=error&detail=${encodeURIComponent(
        responseText.slice(0, 300),
      )}`,
    );
  }

  let result: OfficialSyncResponse | null = null;

  try {
    result = JSON.parse(responseText) as OfficialSyncResponse;
  } catch {
    redirect(
      `/admin?sync=error&detail=${encodeURIComponent(
        "The Edge Function returned an invalid response.",
      )}`,
    );
  }

  const noticesAdded = result?.noticesAdded ?? 0;

  revalidatePath("/admin");

  redirect(`/admin?sync=success&added=${noticesAdded}`);
}

function AdminToolCard({
  eyebrow,
  title,
  description,
  href,
  actionLabel,
}: AdminToolCardProps) {
  return (
    <Link
      href={href}
      className="group min-w-0 rounded-3xl border border-[#2A2A2A] bg-white p-5 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-[#E11D48] sm:rounded-4xl sm:p-6"
    >
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#E11D48]">
        {eyebrow}
      </p>

      <h2 className="font-era mt-4 text-3xl leading-[1.08] text-[#111111]">
        {title}
      </h2>

      <p className="mt-4 text-sm leading-6 text-[#4B4B4B]">{description}</p>

      <p className="mt-6 text-[9px] font-black uppercase tracking-[0.14em] text-[#E11D48]">
        {actionLabel} →
      </p>
    </Link>
  );
}

function OfficialUpdatesInbox({
  notices,
}: {
  notices: OfficialNoticeImport[];
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#0B0B0B] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.42)] sm:rounded-4xl sm:p-8">
      <div>
        <p className="font-era-label text-[10px] text-[#E11D48]">
          Official Source Monitor
        </p>

        <h2 className="font-era-display mt-4 text-4xl leading-[0.95] text-white! sm:text-6xl">
          Official Updates
          <span className="mt-3 block w-fit bg-[#E11D48] px-4 py-2 text-white!">
            Inbox.
          </span>
        </h2>

        <p className="mt-5 max-w-3xl border-l-4 border-[#E11D48] pl-4 text-sm font-semibold leading-7 text-white/70">
          The daily backend collector checks official BTS sources. New page
          changes stay private here until you review them.
        </p>

        <form action={runOfficialSourceSync} className="mt-6">
          <SubmitLoadingButton
            pendingText="Checking..."
            className="font-era-label inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
          >
            Check Official Sources Now
          </SubmitLoadingButton>
        </form>
      </div>

      {notices.length > 0 ? (
        <div className="mt-8 grid min-w-0 gap-5">
          {notices.map((notice) => (
            <article
              key={notice.id}
              className="min-w-0 overflow-hidden rounded-[1.4rem] border border-white/15 bg-white p-4 text-[#111111] sm:p-5"
            >
              <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <p className="font-era-label text-[9px] text-[#E11D48]">
                    {notice.source_name}
                  </p>

                  <h3 className="font-era mt-3 wrap-break-word text-2xl leading-[1.08] text-[#111111]">
                    {notice.notice_title}
                  </h3>

                  <p className="mt-3 text-xs font-bold leading-5 text-[#666666]">
                    Detected {formatDetectedDate(notice.discovered_at)}
                  </p>
                </div>

                <span className="font-era-label inline-flex w-fit shrink-0 rounded-full bg-[#FFF1F3] px-4 py-2 text-[9px] text-[#B91C3B]">
                  Pending Review
                </span>
              </div>

              {notice.raw_summary ? (
                <details className="mt-5 rounded-2xl bg-[#F7F7F7] p-4">
                  <summary className="cursor-pointer text-xs font-black uppercase tracking-widest text-[#E11D48]">
                    View Detected Page Summary
                  </summary>

                  <p className="mt-3 wrap-break-word text-xs leading-6 text-[#4B4B4B]">
                    {notice.raw_summary}
                  </p>
                </details>
              ) : null}

              <div className="mt-5">
                <a
                  href={notice.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-era-label inline-flex rounded-full bg-[#111111] px-4 py-3 text-[9px] text-white! transition hover:bg-[#E11D48]"
                >
                  Open Official Page
                </a>
              </div>

              <details className="mt-5 rounded-2xl border border-[#2A2A2A] bg-[#FFF8F9] p-4">
                <summary className="cursor-pointer text-xs font-black uppercase tracking-widest text-[#E11D48]">
                  Publish Official Record
                </summary>

                <form
                  action={publishOfficialNotice}
                  className="mt-5 grid gap-4"
                >
                  <input type="hidden" name="noticeId" value={notice.id} />

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-xs font-black uppercase tracking-widest text-[#111111]">
                      Destination
                      <select
                        name="destination"
                        required
                        defaultValue="Calendar"
                        className="rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold normal-case tracking-normal text-[#111111] outline-none focus:border-[#E11D48]"
                      >
                        <option value="Calendar">Calendar</option>

                        <option value="Fan Projects">Fan Projects</option>
                      </select>
                    </label>

                    <label className="grid gap-2 text-xs font-black uppercase tracking-widest text-[#111111]">
                      Category
                      <select
                        name="publicCategory"
                        required
                        defaultValue="Fan Event"
                        className="rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold normal-case tracking-normal text-[#111111] outline-none focus:border-[#E11D48]"
                      >
                        {publishCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="grid gap-2 text-xs font-black uppercase tracking-widest text-[#111111]">
                    Public Title
                    <input
                      name="publicTitle"
                      type="text"
                      required
                      defaultValue={notice.notice_title}
                      className="rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold normal-case tracking-normal text-[#111111] outline-none focus:border-[#E11D48]"
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-xs font-black uppercase tracking-widesttext-[#111111]">
                      Date
                      <input
                        name="publicDate"
                        type="date"
                        required
                        defaultValue={notice.notice_date ?? ""}
                        className="rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold normal-case tracking-normal text-[#111111] outline-none focus:border-[#E11D48]"
                      />
                    </label>

                    <label className="grid gap-2 text-xs font-black uppercase tracking-widest text-[#111111]">
                      Location
                      <input
                        name="publicLocation"
                        type="text"
                        placeholder="Global, Seoul, Busan..."
                        className="rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold normal-case tracking-normal text-[#111111] outline-none placeholder:text-[#777777] focus:border-[#E11D48]"
                      />
                    </label>
                  </div>

                  <label className="grid gap-2 text-xs font-black uppercase tracking-widest text-[#111111]">
                    Description
                    <textarea
                      name="publicDescription"
                      rows={4}
                      defaultValue={notice.raw_summary ?? ""}
                      className="resize-y rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold leading-6 normal-case tracking-normal text-[#111111] outline-none focus:border-[#E11D48]"
                    />
                  </label>

                  <label className="grid gap-2 text-xs font-black uppercase tracking-widest text-[#111111]">
                    Official Link
                    <input
                      name="publicLink"
                      type="url"
                      defaultValue={notice.source_url}
                      className="rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold normal-case tracking-normal text-[#111111] outline-none focus:border-[#E11D48]"
                    />
                  </label>

                  <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#111111]">
                    <input
                      name="publicIsGlobal"
                      type="checkbox"
                      className="h-4 w-4 accent-[#E11D48]"
                    />
                    Global Event
                  </label>

                  <SubmitLoadingButton
                    pendingText="Publishing..."
                    style={{
                      fontSize: "10px",
                      lineHeight: "1",
                      fontWeight: 900,
                    }}
                    className="font-era-label inline-flex w-fit rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:bg-[#C5163D]"
                  >
                    Publish Official Record
                  </SubmitLoadingButton>
                </form>
              </details>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <form action={updateNoticeStatus}>
                  <input type="hidden" name="noticeId" value={notice.id} />

                  <input type="hidden" name="reviewStatus" value="approved" />

                  <SubmitLoadingButton
                    pendingText="Saving..."
                    style={{
                      fontSize: "10px",
                      lineHeight: "1",
                      fontWeight: 900,
                    }}
                    className="font-era-label inline-flex rounded-full border border-[#E11D48] bg-white px-4 py-3 text-[9px] text-[#B91C3B] transition hover:bg-[#FFF1F3]"
                  >
                    Mark Reviewed Without Publishing
                  </SubmitLoadingButton>
                </form>

                <form action={updateNoticeStatus}>
                  <input type="hidden" name="noticeId" value={notice.id} />

                  <input type="hidden" name="reviewStatus" value="rejected" />

                  <SubmitLoadingButton
                    pendingText="Dismissing..."
                    style={{
                      fontSize: "10px",
                      lineHeight: "1",
                      fontWeight: 900,
                    }}
                    className="font-era-label inline-flex rounded-full border border-[#2A2A2A] bg-white px-4 py-3 text-[9px] text-[#111111] transition hover:bg-[#F7F7F7]"
                  >
                    Dismiss
                  </SubmitLoadingButton>
                </form>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.4rem] border border-white/15 bg-white/5 p-5">
          <p className="font-era text-2xl leading-[1.08] text-[#111111]">
            Inbox Clear
          </p>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#111111]/60">
            No new official-source changes are waiting for review. The daily
            collector will place future updates here automatically.
          </p>
        </div>
      )}
    </section>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const resolvedSearchParams = await searchParams;

  const syncStatus = resolvedSearchParams?.sync ?? "";

  const publishStatus = resolvedSearchParams?.publish ?? "";

  const addedCount =
    Number.parseInt(resolvedSearchParams?.added ?? "0", 10) || 0;

  const detail = resolvedSearchParams?.detail ?? "";

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

  const { data: noticeData } = await supabase
    .from("official_notice_imports")
    .select("*")
    .eq("review_status", "pending")
    .order("discovered_at", {
      ascending: false,
    })
    .limit(12);

  const notices = (noticeData ?? []) as OfficialNoticeImport[];

  return (
    <AppShell activePath="/admin">
      <PageHero
        eyebrow="Admin"
        title="BorahaeHQ Admin"
        description="Manage moderation, support requests, and newly detected updates from official BTS sources."
      />

      {syncStatus === "success" ? (
        <div className="rounded-2xl border border-[#166534] bg-[#DCFCE7] p-4 text-[#166534]">
          <p className="text-sm font-black">Official-source check complete.</p>

          <p className="mt-1 text-xs font-semibold">
            {addedCount === 0
              ? "No new official updates were detected."
              : `${addedCount} new official update${
                  addedCount === 1 ? "" : "s"
                } added to the review inbox.`}
          </p>
        </div>
      ) : null}

      {syncStatus === "error" ? (
        <div className="rounded-2xl border border-[#B91C3B] bg-[#FFF1F3] p-4 text-[#B91C3B]">
          <p className="text-sm font-black">
            Official-source check could not run.
          </p>

          <p className="mt-1 wrap-break-word text-xs font-semibold">
            {detail ||
              "Try again shortly or inspect the Edge Function logs in Supabase."}
          </p>
        </div>
      ) : null}

      {publishStatus === "success" ? (
        <div className="rounded-2xl border border-[#166534] bg-[#DCFCE7] p-4 text-[#166534]">
          <p className="text-sm font-black">Official record published.</p>

          <p className="mt-1 text-xs font-semibold">
            The locked official record is now visible in its selected public
            section.
          </p>
        </div>
      ) : null}

      {publishStatus === "error" ? (
        <div className="rounded-2xl border border-[#B91C3B] bg-[#FFF1F3] p-4 text-[#B91C3B]">
          <p className="text-sm font-black">
            Official record could not be published.
          </p>

          <p className="mt-1 wrap-break-word text-xs font-semibold">
            {detail || "Check the required fields and try again."}
          </p>
        </div>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-2">
        <AdminToolCard
          eyebrow="01"
          title="Review Fan Projects"
          description="Approve or reject pending ARMY fan-project submissions before they appear in the public community feed."
          href="/admin/projects"
          actionLabel="Open Project Review"
        />

        <AdminToolCard
          eyebrow="02"
          title="Private Support Inbox"
          description="Review account-deletion requests, privacy questions, and technical-support messages submitted privately by users."
          href="/admin/support"
          actionLabel="Open Support Inbox"
        />
      </section>

      <OfficialUpdatesInbox notices={notices} />
    </AppShell>
  );
}

