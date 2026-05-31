"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type {
  SavedItem,
  SavedItemInsert,
  SavedItemType,
} from "@/types/database";

type SavedItemButtonProps = {
  itemType: SavedItemType;
  itemId: string;
};

const compactButtonTextClass =
  "text-[8px] font-black uppercase leading-none tracking-[0.12em]";

function BookmarkIcon({
  isFilled = false,
}: {
  isFilled?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3 w-3 shrink-0"
      fill={isFilled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4Z" />
    </svg>
  );
}

export function SavedItemButton({
  itemType,
  itemId,
}: SavedItemButtonProps) {
  const router = useRouter();

  const [savedItem, setSavedItem] =
    useState<SavedItem | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSavedItem() {
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
        .from("saved_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("item_type", itemType);

      query =
        itemType === "event"
          ? query.eq("event_id", itemId)
          : query.eq("project_id", itemId);

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
          "Saved status could not load.",
        );

        setIsLoading(false);

        return;
      }

      setSavedItem(
        (data ?? null) as SavedItem | null,
      );

      setIsLoading(false);
    }

    void loadSavedItem();

    return () => {
      isMounted = false;
    };
  }, [itemId, itemType]);

  async function saveItem() {
    setErrorMessage("");
    setIsSaving(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMessage(
        "Please sign in before saving this item.",
      );

      setIsSaving(false);

      return;
    }

    const payload: SavedItemInsert =
      itemType === "event"
        ? {
            user_id: user.id,
            item_type: "event",
            event_id: itemId,
            project_id: null,
          }
        : {
            user_id: user.id,
            item_type: "project",
            event_id: null,
            project_id: itemId,
          };

    const { data, error } = await supabase
      .from("saved_items")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      setErrorMessage(
        error.code === "23505"
          ? "This item is already saved."
          : "This item could not be saved. Please try again.",
      );

      setIsSaving(false);

      return;
    }

    setSavedItem(data as SavedItem);
    setIsSaving(false);

    router.refresh();
  }

  async function removeSavedItem() {
    if (!savedItem) {
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
        "Please sign in before removing this item.",
      );

      setIsSaving(false);

      return;
    }

    const { error } = await supabase
      .from("saved_items")
      .delete()
      .eq("id", savedItem.id)
      .eq("user_id", user.id);

    if (error) {
      setErrorMessage(
        "This item could not be removed. Please try again.",
      );

      setIsSaving(false);

      return;
    }

    setSavedItem(null);
    setIsSaving(false);

    router.refresh();
  }

  if (isLoading) {
    return (
      <span
        className={`inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#D8D8D8] bg-white px-3 text-[#777777] ${compactButtonTextClass}`}
      >
        <BookmarkIcon />
        Loading
      </span>
    );
  }

  return (
    <div className="inline-flex flex-col">
      <button
        type="button"
              style={{
        fontSize: "10px",
        lineHeight: "1",
        fontWeight: 900,
        letterSpacing: "0.12em",
      }}
        onClick={
          savedItem
            ? removeSavedItem
            : saveItem
        }
        disabled={isSaving}
        className={`inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 transition disabled:cursor-not-allowed disabled:opacity-60 ${compactButtonTextClass} ${
          savedItem
            ? "border-[#166534] bg-[#F0FDF4] text-[#166534] hover:bg-[#DCFCE7]"
            : "border-[#2A2A2A] bg-white text-[#111111] hover:border-[#E11D48] hover:bg-[#FFF1F3] hover:text-[#B91C3B]"
        }`}
      >
        <BookmarkIcon
          isFilled={Boolean(savedItem)}
        />

        {isSaving
          ? savedItem
            ? "Removing..."
            : "Saving..."
          : savedItem
            ? "Saved"
            : "Save"}
      </button>

      {errorMessage ? (
        <p className="mt-2 max-w-xs text-xs font-bold leading-5 text-[#B91C3B]">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}