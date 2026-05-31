"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ReminderTargetType = "event" | "fan_project";

type ReminderOption =
  | "same_day"
  | "1_day_before"
  | "3_days_before"
  | "7_days_before";

type ReminderRecord = {
  id: string;
  user_id: string;
  target_type: ReminderTargetType;
  event_id: string | null;
  fan_project_id: string | null;
  reminder_option: ReminderOption;
  remind_on: string;
  is_enabled: boolean;
};

type ReminderButtonProps = {
  targetType: ReminderTargetType;
  targetId: string;
};

const reminderOptions: {
  value: ReminderOption;
  label: string;
  daysBefore: number;
}[] = [
  {
    value: "same_day",
    label: "On the day",
    daysBefore: 0,
  },
  {
    value: "1_day_before",
    label: "1 day before",
    daysBefore: 1,
  },
  {
    value: "3_days_before",
    label: "3 days before",
    daysBefore: 3,
  },
  {
    value: "7_days_before",
    label: "1 week before",
    daysBefore: 7,
  },
];

const compactButtonTextClass =
  "text-[8px] font-black uppercase leading-none tracking-[0.12em]";

function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3 w-3 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />

      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

function calculateReminderDate(
  targetDate: string,
  daysBefore: number,
) {
  const date = new Date(`${targetDate}T00:00:00`);

  date.setDate(date.getDate() - daysBefore);

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function ReminderButton({
  targetType,
  targetId,
}: ReminderButtonProps) {
  const router = useRouter();

  const [existingReminder, setExistingReminder] =
    useState<ReminderRecord | null>(null);

  const [selectedOption, setSelectedOption] =
    useState<ReminderOption>("1_day_before");

  const [isPanelOpen, setIsPanelOpen] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadReminder() {
      setIsLoading(true);
      setErrorMessage("");

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (isMounted) {
          setIsLoading(false);
        }

        return;
      }

      let query = supabase
        .from("user_reminders")
        .select("*")
        .eq("user_id", user.id)
        .eq("target_type", targetType)
        .eq("is_enabled", true);

      query =
        targetType === "event"
          ? query.eq("event_id", targetId)
          : query.eq("fan_project_id", targetId);

      const { data, error } = await query
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      if (error) {
        setErrorMessage(
          "Reminder status could not load.",
        );

        setIsLoading(false);

        return;
      }

      const reminder =
        (data ?? null) as ReminderRecord | null;

      setExistingReminder(reminder);

      if (reminder) {
        setSelectedOption(
          reminder.reminder_option,
        );
      }

      setIsLoading(false);
    }

    void loadReminder();

    return () => {
      isMounted = false;
    };
  }, [targetId, targetType]);

  async function getTargetDate() {
    const supabase = createClient();

    if (targetType === "event") {
      const { data, error } = await supabase
        .from("events")
        .select("event_date")
        .eq("id", targetId)
        .single();

      if (error || !data) {
        return null;
      }

      return data.event_date;
    }

    const { data, error } = await supabase
      .from("fan_projects")
      .select("project_date")
      .eq("id", targetId)
      .single();

    if (error || !data) {
      return null;
    }

    return data.project_date;
  }

  async function saveReminder() {
    setErrorMessage("");
    setIsSaving(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMessage(
        "Please sign in before saving a reminder.",
      );

      setIsSaving(false);

      return;
    }

    const targetDate =
      await getTargetDate();

    if (!targetDate) {
      setErrorMessage(
        "This reminder could not be created because the date is missing.",
      );

      setIsSaving(false);

      return;
    }

    const selectedReminder =
      reminderOptions.find(
        (option) =>
          option.value === selectedOption,
      );

    if (!selectedReminder) {
      setErrorMessage(
        "Please choose a reminder option.",
      );

      setIsSaving(false);

      return;
    }

    const remindOn =
      calculateReminderDate(
        targetDate,
        selectedReminder.daysBefore,
      );

    const payload = {
      user_id: user.id,
      target_type: targetType,
      event_id:
        targetType === "event"
          ? targetId
          : null,
      fan_project_id:
        targetType === "fan_project"
          ? targetId
          : null,
      reminder_option:
        selectedOption,
      remind_on: remindOn,
      is_enabled: true,
    };

    if (existingReminder) {
      const { data, error } =
        await supabase
          .from("user_reminders")
          .update(payload)
          .eq("id", existingReminder.id)
          .eq("user_id", user.id)
          .select("*")
          .single();

      if (error) {
        setErrorMessage(
          "Your reminder could not be updated. Please try again.",
        );

        setIsSaving(false);

        return;
      }

      setExistingReminder(
        data as ReminderRecord,
      );
    } else {
      const { data, error } =
        await supabase
          .from("user_reminders")
          .insert(payload)
          .select("*")
          .single();

      if (error) {
        setErrorMessage(
          "Your reminder could not be saved. Please try again.",
        );

        setIsSaving(false);

        return;
      }

      setExistingReminder(
        data as ReminderRecord,
      );
    }

    setIsSaving(false);
    setIsPanelOpen(false);

    router.refresh();
  }

  async function removeReminder() {
    if (!existingReminder) {
      return;
    }

    setErrorMessage("");
    setIsSaving(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMessage(
        "Please sign in before removing a reminder.",
      );

      setIsSaving(false);

      return;
    }

    const { error } = await supabase
      .from("user_reminders")
      .delete()
      .eq("id", existingReminder.id)
      .eq("user_id", user.id);

    if (error) {
      setErrorMessage(
        "Your reminder could not be removed. Please try again.",
      );

      setIsSaving(false);

      return;
    }

    setExistingReminder(null);
    setIsSaving(false);
    setIsPanelOpen(false);

    router.refresh();
  }

  function cancelReminderChanges() {
    setErrorMessage("");

    if (existingReminder) {
      setSelectedOption(
        existingReminder.reminder_option,
      );
    } else {
      setSelectedOption(
        "1_day_before",
      );
    }

    setIsPanelOpen(false);
  }

  if (isLoading) {
    return (
      <span
        className={`inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#D8D8D8] bg-white px-3 text-[#777777] ${compactButtonTextClass}`}
      >
        <BellIcon />
        Loading
      </span>
    );
  }

  return (
    <div className="relative inline-flex">
      <button
        type="button"
                      style={{
        fontSize: "10px",
        lineHeight: "1",
        fontWeight: 900,
        letterSpacing: "0.12em",
      }}
        onClick={() =>
          setIsPanelOpen(
            (current) => !current,
          )
        }
        className={`inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 transition ${compactButtonTextClass} ${
          existingReminder
            ? "border-[#166534] bg-[#F0FDF4] text-[#166534] hover:bg-[#DCFCE7]"
            : "border-[#E11D48] bg-white text-[#B91C3B] hover:-translate-y-0.5 hover:bg-[#FFF1F3]"
        }`}
      >
        <BellIcon />


        {existingReminder
          ? "Reminder Set"
          : "Remind Me"}
      </button>

      {isPanelOpen ? (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-[#2A2A2A] bg-white p-4 shadow-[0_20px_55px_rgba(0,0,0,0.24)]">
          <p className="font-era-label text-[10px] text-[#E11D48]">
            Choose Reminder
          </p>

          <div className="mt-3 space-y-2">
            {reminderOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E5E5E5] bg-[#F7F7F7] px-3 py-2.5 text-xs font-bold text-[#111111] transition hover:border-[#E11D48]"
              >
                <input
                  type="radio"
                  name={`reminder-${targetType}-${targetId}`}
                  value={option.value}
                  checked={
                    selectedOption ===
                    option.value
                  }
                  onChange={() =>
                    setSelectedOption(
                      option.value,
                    )
                  }
                  className="accent-[#E11D48]"
                />

                <span>{option.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveReminder}
              disabled={isSaving}
                            style={{
        fontSize: "10px",
        lineHeight: "1",
        fontWeight: 900,
        letterSpacing: "0.12em",
      }}
              className="font-era-label inline-flex rounded-full bg-[#E11D48] px-4 py-3 text-[10px] text-white! transition hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving
                ? "Saving..."
                : existingReminder
                  ? "Update"
                  : "Save"}
            </button>

            {existingReminder ? (
              <button
                type="button"
                onClick={removeReminder}
                disabled={isSaving}
                              style={{
        fontSize: "10px",
        lineHeight: "1",
        fontWeight: 900,
        letterSpacing: "0.12em",
      }}
                className="font-era-label inline-flex rounded-full border border-[#E11D48] bg-white px-4 py-3 text-[10px] text-[#B91C3B] transition hover:bg-[#FFF1F3] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Remove
              </button>
            ) : null}

            <button
              type="button"
              onClick={cancelReminderChanges}
              disabled={isSaving}
                            style={{
        fontSize: "10px",
        lineHeight: "1",
        fontWeight: 900,
        letterSpacing: "0.12em",
      }}
              className="font-era-label inline-flex rounded-full border border-[#2A2A2A] bg-white px-4 py-3 text-[10px] text-[#111111] transition hover:bg-[#F7F7F7] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>

          {errorMessage ? (
            <p className="mt-3 text-xs font-bold leading-5 text-[#B91C3B]">
              {errorMessage}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
