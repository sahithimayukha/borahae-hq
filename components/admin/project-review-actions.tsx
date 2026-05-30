"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ReviewStatus = "approved" | "rejected";

type ProjectReviewActionsProps = {
  projectId: string;
};

export function ProjectReviewActions({
  projectId,
}: ProjectReviewActionsProps) {
  const router = useRouter();

  const [activeStatus, setActiveStatus] =
    useState<ReviewStatus | null>(null);

  async function updateProjectStatus(nextStatus: ReviewStatus) {
    const actionLabel =
      nextStatus === "approved" ? "approve" : "reject";

    const shouldContinue = window.confirm(
      `Are you sure you want to ${actionLabel} this fan project?`,
    );

    if (!shouldContinue) {
      return;
    }

    setActiveStatus(nextStatus);

    const supabase = createClient();

    const { error } = await supabase
      .from("fan_projects")
      .update({
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .eq("status", "pending");

    if (error) {
      window.alert(error.message);
      setActiveStatus(null);
      return;
    }

    setActiveStatus(null);

    router.refresh();
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => updateProjectStatus("approved")}
        disabled={activeStatus !== null}
        style={{
          fontSize: "10px",
          lineHeight: "1",
          fontWeight: 900,
        }}
        className="inline-flex items-center justify-center rounded-full border border-[#166534] bg-[#F0FDF4] px-3 py-2 uppercase tracking-[0.14em] text-[#166534] transition hover:bg-[#DCFCE7] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {activeStatus === "approved" ? "Approving..." : "Approve"}
      </button>

      <button
        type="button"
        onClick={() => updateProjectStatus("rejected")}
        disabled={activeStatus !== null}
        style={{
          fontSize: "10px",
          lineHeight: "1",
          fontWeight: 900,
        }}
        className="inline-flex items-center justify-center rounded-full border border-[#E11D48] bg-[#FFF1F3] px-3 py-2 uppercase tracking-[0.14em] text-[#B91C3B] transition hover:bg-[#FFE4E9] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {activeStatus === "rejected" ? "Rejecting..." : "Reject"}
      </button>
    </div>
  );
}