import type { ReactNode } from "react";
import { AppSidebar, MobileAppNavigation } from "@/components/app/app-sidebar";

type AppShellProps = {
  children: ReactNode;
  activePath?: string;
};

export function AppShell({ children, activePath }: AppShellProps) {
  return (
    <main className="arirang-app min-h-screen bg-transparent px-4 py-4 text-white sm:px-6 md:px-10 md:py-6">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[280px_1fr]">
        <AppSidebar activePath={activePath} />

        <section className="space-y-6">
          <MobileAppNavigation activePath={activePath} />
          {children}
        </section>
      </div>
    </main>
  );
}