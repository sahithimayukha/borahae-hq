import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Calendar", href: "/calendar" },
  { label: "Fan Projects", href: "/projects" },
  { label: "Memory Vault", href: "/vault" },
  { label: "My Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
];

type AppSidebarProps = {
  activePath?: string;
};

export function AppSidebar({ activePath = "/dashboard" }: AppSidebarProps) {
  return (
    <aside className="hidden rounded-4xl border border-[#2A2A2A] bg-[#0B0B0B] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.45)] md:block">
      <Link href="/dashboard" className="font-era text-3xl text-white!">
        BorahaeHQ
      </Link>

      <p className="font-era-label mt-3 bg-[#E11D48] px-3 py-2 text-[10px] text-white!">
        ARMY Hub
      </p>

      <nav className="mt-8 space-y-2">
        {navigationItems.map((item) => {
          const isActive = activePath === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`font-era-label block rounded-2xl px-4 py-3 text-[11px] transition ${
                isActive
                  ? "bg-[#E11D48] text-white!"
                  : "text-white! hover:bg-[#151515]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">
        <LogoutButton />
      </div>
    </aside>
  );
}

export function MobileAppNavigation({
  activePath = "/dashboard",
}: AppSidebarProps) {
  return (
    <div className="space-y-4 md:hidden">
      <div className="rounded-4xlrder border-[#2A2A2A] bg-[#0B0B0B] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
        <Link href="/dashboard" className="font-era text-2xl text-white!">
          BorahaeHQ
        </Link>

        <p className="font-era-label mt-3 inline-flex bg-[#E11D48] px-3 py-2 text-[10px] text-white!">
          ARMY Hub
        </p>
      </div>

      <nav className="flex gap-3 overflow-x-auto rounded-4xlrder border-[#2A2A2A] bg-[#0B0B0B] p-3 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
        {navigationItems.map((item) => {
          const isActive = activePath === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`font-era-label shrink-0 rounded-full px-4 py-2 text-[10px] transition ${
                isActive
                  ? "bg-[#E11D48] text-white!"
                  : "bg-[#151515] text-white!"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}