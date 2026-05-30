"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    setIsSigningOut(false);

    if (error) {
      window.alert(error.message);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSigningOut}
      className="font-era-label inline-flex w-full items-center justify-center rounded-full border border-[#E11D48] bg-[#E11D48] px-5 py-3 text-[11px] text-white! transition hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isSigningOut ? "Signing Out..." : "Sign Out"}
    </button>
  );
}