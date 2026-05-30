import type { ReactNode } from "react";
import { AppSidebar, MobileAppNavigation } from "@/components/app/app-sidebar";
import { AppFooter } from "@/components/app/app-footer";
import { createClient } from "@/lib/supabase/server";

type AppShellProps = {
  children: ReactNode;
  activePath?: string;
};

export async function AppShell({ children, activePath }: AppShellProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;

  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("user_id", user.id)
      .maybeSingle();

    isAdmin = profileData?.is_admin ?? false;
  }

  return (
    <main className="arirang-app min-h-screen bg-transparent px-4 py-4 text-white sm:px-6 md:px-10 md:py-6">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[280px_1fr]">
        <AppSidebar activePath={activePath} isAdmin={isAdmin} />

        <section className="space-y-6">
          <MobileAppNavigation activePath={activePath} isAdmin={isAdmin} />

          {children}

          <AppFooter />
        </section>
      </div>
    </main>
  );
}