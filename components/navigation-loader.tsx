"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function NavigationLoader() {
  const router = useRouter();
  const pathname = usePathname();

  const [isVisible, setIsVisible] = useState(false);

  const navigationStarted = useRef(false);
  const navigationTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);
  const safetyTimer = useRef<number | null>(null);

  useEffect(() => {
    function handleInternalLinkClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const clickedElement = event.target as HTMLElement | null;
      const link = clickedElement?.closest("a");

      if (!link) {
        return;
      }

      const href = link.getAttribute("href");

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        link.target === "_blank" ||
        link.hasAttribute("download")
      ) {
        return;
      }

      const destination = new URL(link.href, window.location.href);
      const currentPage = new URL(window.location.href);

      if (destination.origin !== currentPage.origin) {
        return;
      }

      const destinationPath =
        destination.pathname + destination.search + destination.hash;

      const currentPath =
        currentPage.pathname + currentPage.search + currentPage.hash;

      if (destinationPath === currentPath) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (navigationStarted.current) {
        return;
      }

      navigationStarted.current = true;
      setIsVisible(true);

      navigationTimer.current = window.setTimeout(() => {
        router.push(destinationPath);
      }, 120);
    }

    document.addEventListener("click", handleInternalLinkClick, true);

    return () => {
      document.removeEventListener("click", handleInternalLinkClick, true);

      if (navigationTimer.current) {
        window.clearTimeout(navigationTimer.current);
      }
    };
  }, [router]);

  useEffect(() => {
    if (!navigationStarted.current) {
      return;
    }

    hideTimer.current = window.setTimeout(() => {
      setIsVisible(false);
      navigationStarted.current = false;
    }, 650);

    return () => {
      if (hideTimer.current) {
        window.clearTimeout(hideTimer.current);
      }
    };
  }, [pathname]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    safetyTimer.current = window.setTimeout(() => {
      setIsVisible(false);
      navigationStarted.current = false;
    }, 8000);

    return () => {
      if (safetyTimer.current) {
        window.clearTimeout(safetyTimer.current);
      }
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading BorahaeHQ"
      className="fixed inset-0 z-9999 flex min-h-screen items-center justify-center bg-[#080808] px-6"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#E11D48]/25" />

          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-r-[#E11D48] border-t-[#E11D48]" />

          <div className="h-10 w-10 rounded-full bg-[#E11D48]/15 shadow-[0_0_45px_rgba(225,29,72,0.55)]" />

          <div className="absolute h-3 w-3 rounded-full bg-[#E11D48] shadow-[0_0_22px_rgba(225,29,72,0.95)]" />
        </div>

        <p className="font-era-label mt-6 text-[10px] text-[#E11D48]">
          BorahaeHQ
        </p>

        <h2 className="font-era mt-3 text-3xl leading-[1.05] text-white">
          Loading Your ARMY Hub
        </h2>

        <p className="mt-3 max-w-xs text-sm leading-6 text-white/55">
          Gathering your calendar, projects, and memories.
        </p>

        <div className="mt-6 flex gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#E11D48]" />

          <span className="h-2 w-2 animate-pulse rounded-full bg-[#E11D48] [animation-delay:180ms]" />

          <span className="h-2 w-2 animate-pulse rounded-full bg-[#E11D48] [animation-delay:360ms]" />
        </div>
      </div>
    </div>
  );
}