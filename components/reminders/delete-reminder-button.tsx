"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type DeleteReminderButtonProps = {
  reminderId: string;
};

export function DeleteReminderButton({
  reminderId,
}: DeleteReminderButtonProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function deleteReminder() {
    setErrorMessage("");
    setIsDeleting(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMessage(
        "Please sign in before removing a reminder.",
      );

      setIsDeleting(false);

      return;
    }

    const { error } = await supabase
      .from("user_reminders")
      .delete()
      .eq("id", reminderId)
      .eq("user_id", user.id);

    if (error) {
      setErrorMessage(
        "Your reminder could not be removed. Please try again.",
      );

      setIsDeleting(false);

      return;
    }

    router.refresh();
  }

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={deleteReminder}
        disabled={isDeleting}
              style={{
        fontSize: "10px",
        lineHeight: "1",
        fontWeight: 900,
        letterSpacing: "0.12em",
      }}
        className="font-era-label inline-flex whitespace-nowrap rounded-full border border-[#E11D48] bg-white px-5 py-3 text-[10px] text-[#B91C3B] transition hover:-translate-y-0.5 hover:bg-[#FFF1F3] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting
          ? "Removing..."
          : "Remove Reminder"}
      </button>

      {errorMessage ? (
        <p className="mt-3 max-w-xs text-xs font-bold leading-5 text-[#B91C3B]">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}