import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";

const normalNavigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Calendar",
    href: "/calendar",
  },
  {
    label: "Fan Projects",
    href: "/projects",
  },
  {
    label: "Memory Vault",
    href: "/vault",
  },
  {
    label: "My Profile",
    href: "/profile",
  },
  {
    label: "Settings",
    href: "/settings",
  },
];

type AppSidebarProps = {
  activePath?: string;
  isAdmin?: boolean;
};

function getNavigationItems(isAdmin: boolean) {
  if (!isAdmin) {
    return normalNavigationItems;
  }

  return [
    ...normalNavigationItems,
    {
      label: "Admin",
      href: "/admin",
    },
  ];
}

function isNavigationItemActive(activePath: string, itemHref: string) {
  if (itemHref === "/admin") {
    return activePath === "/admin" || activePath.startsWith("/admin/");
  }

  return activePath === itemHref;
}

export function AppSidebar({
  activePath = "/dashboard",
  isAdmin = false,
}: AppSidebarProps) {
  const navigationItems = getNavigationItems(isAdmin);

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
          const isActive = isNavigationItemActive(activePath, item.href);

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
  isAdmin = false,
}: AppSidebarProps) {
  const navigationItems = getNavigationItems(isAdmin);
  return (
    <div className="md:hidden">
      <header className="sticky top-3 z-50 rounded-4xl border border-[#2A2A2A] bg-[#0B0B0B] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link href="/dashboard" className="font-era text-2xl text-white!">
              BorahaeHQ
            </Link>

            <p className="font-era-label mt-2 inline-flex bg-[#E11D48] px-3 py-1.5 text-[9px] text-white!">
              ARMY Hub
            </p>
          </div>

          <details className="group relative">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-2xl border border-[#2A2A2A] bg-[#151515] text-lg text-white! transition hover:bg-[#222222]">
              ☰
            </summary>

            <div className="absolute right-0 top-14 z-50 w-64 rounded-3xl border border-[#2A2A2A] bg-[#0B0B0B] p-3 shadow-[0_20px_70px_rgba(0,0,0,0.6)]">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const isActive = activePath === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`font-era-label block rounded-2xl px-4 py-3 text-[10px] transition ${
                        isActive
                          ? "bg-[#E11D48] text-white!"
                          : "bg-[#151515] text-white! hover:bg-[#222222]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-3 border-t border-[#2A2A2A] pt-3">
                <LogoutButton />
              </div>
            </div>
          </details>
        </div>
      </header>
    </div>
  );
}