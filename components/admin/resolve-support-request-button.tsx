"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ResolveSupportRequestButtonProps = {
  requestId: string;
};

export function ResolveSupportRequestButton({
  requestId,
}: ResolveSupportRequestButtonProps) {
  const router = useRouter();

  const [isResolving, setIsResolving] = useState(false);

  async function handleResolve() {
    const shouldResolve = window.confirm(
      "Mark this private support request as resolved?",
    );

    if (!shouldResolve) {
      return;
    }

    setIsResolving(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("support_requests")
      .update({
        status: "resolved",
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .eq("status", "open");

    if (error) {
      window.alert(error.message);
      setIsResolving(false);
      return;
    }

    setIsResolving(false);

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleResolve}
      disabled={isResolving}
      style={{
        fontSize: "10px",
        fontWeight: 900,
        lineHeight: "1",
      }}
      className="inline-flex items-center justify-center rounded-full border border-[#166534] bg-[#F0FDF4] px-3 py-2 uppercase tracking-[0.14em] text-[#166534] transition hover:bg-[#DCFCE7] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isResolving ? "Resolving..." : "Mark Resolved"}
    </button>
  );
}