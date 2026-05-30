import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { PageHero } from "@/components/app/page-hero";
import { ProfileCompletionMeter } from "@/components/profile/profile-completion-meter";
import { ProfileForm } from "@/components/profile/profile-form";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const savedProfile = (profile ?? null) as Profile | null;

  const fallbackDisplayName =
    user.user_metadata?.display_name || user.email?.split("@")[0] || "ARMY";

  return (
    <AppShell activePath="/profile">
      <PageHero
        eyebrow="My ARMY Profile"
        title="Build Your ARMY Identity"
        description="Save your ARMY since year, country, bias, favorite album, favorite song, favorite era, and personal fandom details."
      />

      {error ? (
        <div className="rounded-4xl border border-[#E11D48] bg-[#FFF1F3] p-6 text-[#B91C3B]">
          <h2 className="font-era text-xl leading-[1.1]">
            Profile Could Not Load
          </h2>

          <p className="mt-3 text-sm leading-6">
            Supabase returned this message: {error.message}
          </p>
        </div>
      ) : null}

      {!error ? (
        <>
          <ProfileCompletionMeter
            profile={savedProfile}
            fallbackDisplayName={fallbackDisplayName}
            showEditLink={false}
          />

          <ProfileForm
            userId={user.id}
            userEmail={user.email ?? null}
            initialProfile={savedProfile}
            fallbackDisplayName={fallbackDisplayName}
          />
        </>
      ) : null}
    </AppShell>
  );
}