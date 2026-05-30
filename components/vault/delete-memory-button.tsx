"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type DeleteMemoryButtonProps = {
  memoryId: string;
  coverImagePath?: string | null;
};

export function DeleteMemoryButton({
  memoryId,
  coverImagePath = null,
}: DeleteMemoryButtonProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const shouldDelete = window.confirm(
      "Delete this visual diary memory permanently?",
    );

    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);

    const supabase = createClient();

    const { error: memoryDeleteError } = await supabase
      .from("memories")
      .delete()
      .eq("id", memoryId);

    if (memoryDeleteError) {
      window.alert(memoryDeleteError.message);
      setIsDeleting(false);
      return;
    }

    if (coverImagePath) {
      const { error: imageDeleteError } = await supabase.storage
        .from("memory-images")
        .remove([coverImagePath]);

      if (imageDeleteError) {
        window.alert(
          "The memory was deleted, but its stored cover image could not be cleaned up automatically.",
        );
      }
    }

    setIsDeleting(false);

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      style={{
        fontSize: "10px",
        lineHeight: "1",
        fontWeight: 900,
      }}
      className="inline-flex items-center justify-center rounded-full border border-[#E11D48] bg-[#FFF1F3] px-3 py-2 font-black uppercase tracking-[0.14em] text-[#B91C3B] transition hover:bg-[#FFE4E9] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}