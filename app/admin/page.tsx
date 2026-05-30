import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { PageHero } from "@/components/app/page-hero";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

type AdminToolCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
};

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
      className="group rounded-4xl border border-[#2A2A2A] bg-white p-6 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-[#E11D48]"
    >
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#E11D48]">
        {eyebrow}
      </p>

      <h2 className="font-era mt-4 text-3xl leading-[1.08] text-[#111111]">
        {title}
      </h2>

      <p className="mt-4 text-sm leading-6 text-[#4B4B4B]">
        {description}
      </p>

      <p className="mt-6 text-[9px] font-black uppercase tracking-[0.14em] text-[#E11D48]">
        {actionLabel} →
      </p>
    </Link>
  );
}

export default async function AdminPage() {
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

  return (
    <AppShell activePath="/admin">
      <PageHero
        eyebrow="Admin"
        title="BorahaeHQ Admin"
        description="Manage the essential moderation tools for the fan-project feed and private user-support requests."
      />

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
    </AppShell>
  );
}