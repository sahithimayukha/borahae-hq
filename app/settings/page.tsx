import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { PageHero } from "@/components/app/page-hero";
import { PasswordForm } from "@/components/settings/password-form";
import { SupportRequestForm } from "@/components/settings/support-request-form";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell activePath="/settings">
      <PageHero
        eyebrow="Settings"
        title="Account Settings"
        description="Manage your account security and send private support requests without exposing personal contact details publicly."
      />

      <PasswordForm userEmail={user.email ?? null} />

      <SupportRequestForm userId={user.id} userEmail={user.email ?? null} />
    </AppShell>
  );
}