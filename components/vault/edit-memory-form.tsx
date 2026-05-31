/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Memory } from "@/types/database";
import { DateInput } from "@/components/ui/date-input";

type EditMemoryFormProps = {
  memory: Memory;
  userId: string;
  currentCoverImageUrl: string | null;
};

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];

const maximumImageSizeInBytes = 5 * 1024 * 1024;

function getFileExtension(file: File) {
  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  return "jpg";
}

function validateImage(file: File | null) {
  if (!file) {
    return "";
  }

  if (!acceptedImageTypes.includes(file.type)) {
    return "Please upload a JPG, PNG, or WEBP image.";
  }

  if (file.size > maximumImageSizeInBytes) {
    return "Image size must be 5 MB or smaller.";
  }

  return "";
}

export function EditMemoryForm({
  memory,
  userId,
  currentCoverImageUrl,
}: EditMemoryFormProps) {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(memory.title);
  const [content, setContent] = useState(memory.content);
  const [mood, setMood] = useState(memory.mood ?? "");
  const [memoryDate, setMemoryDate] = useState(memory.memory_date ?? "");

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [newImagePreviewUrl, setNewImagePreviewUrl] = useState<string | null>(
    null,
  );

  const [shouldRemoveCurrentImage, setShouldRemoveCurrentImage] =
    useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!selectedImage) {
      setNewImagePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);

    setNewImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImage]);

  function restoreSavedValues() {
    setTitle(memory.title);
    setContent(memory.content);
    setMood(memory.mood ?? "");
    setMemoryDate(memory.memory_date ?? "");
    setSelectedImage(null);
    setShouldRemoveCurrentImage(false);
    setMessage("");
    setErrorMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleCancel() {
    restoreSavedValues();
    setIsEditing(false);
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    const imageError = validateImage(file);

    setMessage("");
    setErrorMessage(imageError);

    if (imageError) {
      setSelectedImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setSelectedImage(file);
    setShouldRemoveCurrentImage(false);
  }

  function clearNewImage() {
    setSelectedImage(null);
    setErrorMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removeCurrentImage() {
    setShouldRemoveCurrentImage(true);
    setSelectedImage(null);
    setErrorMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function restoreCurrentImage() {
    setShouldRemoveCurrentImage(false);
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const trimmedMood = mood.trim();

    if (!trimmedTitle) {
      setErrorMessage("Please enter a memory title.");
      return;
    }

    if (trimmedTitle.length < 3) {
      setErrorMessage("Memory title must contain at least 3 characters.");
      return;
    }

    if (!trimmedContent) {
      setErrorMessage("Please write your memory before saving it.");
      return;
    }

    const imageError = validateImage(selectedImage);

    if (imageError) {
      setErrorMessage(imageError);
      return;
    }

    setIsSaving(true);

    const supabase = createClient();

    const previousCoverImagePath = memory.cover_image_path;

    let nextCoverImagePath = previousCoverImagePath;

    if (shouldRemoveCurrentImage) {
      nextCoverImagePath = null;
    }

    if (selectedImage) {
      const fileExtension = getFileExtension(selectedImage);

      nextCoverImagePath = `${userId}/${crypto.randomUUID()}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("memory-images")
        .upload(nextCoverImagePath, selectedImage, {
          cacheControl: "3600",
          contentType: selectedImage.type,
          upsert: false,
        });

      if (uploadError) {
        setErrorMessage(uploadError.message);
        setIsSaving(false);
        return;
      }
    }

    const { error: updateError } = await supabase
      .from("memories")
      .update({
        title: trimmedTitle,
        content: trimmedContent,
        mood: trimmedMood || null,
        memory_date: memoryDate || null,
        cover_image_path: nextCoverImagePath,
        updated_at: new Date().toISOString(),
      })
      .eq("id", memory.id)
      .eq("user_id", userId);

    if (updateError) {
      if (
        selectedImage &&
        nextCoverImagePath &&
        nextCoverImagePath !== previousCoverImagePath
      ) {
        await supabase.storage
          .from("memory-images")
          .remove([nextCoverImagePath]);
      }

      setErrorMessage(updateError.message);
      setIsSaving(false);
      return;
    }

    if (
      previousCoverImagePath &&
      previousCoverImagePath !== nextCoverImagePath
    ) {
      const { error: removeOldImageError } = await supabase.storage
        .from("memory-images")
        .remove([previousCoverImagePath]);

      if (removeOldImageError) {
        setErrorMessage(
          "Your memory was updated, but the previous cover image could not be cleaned up automatically.",
        );

        setIsSaving(false);
        router.refresh();
        return;
      }
    }

    setMessage("Your visual diary memory has been updated.");
    setIsSaving(false);

    router.refresh();

    window.setTimeout(() => {
      setIsEditing(false);
      setMessage("");
    }, 900);
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        style={{
          fontSize: "10px",
          lineHeight: "1",
          fontWeight: 900,
        }}
        className="inline-flex items-center justify-center rounded-full border border-[#111111] bg-white px-3 py-2 font-black uppercase tracking-[0.14em] text-[#111111] transition hover:bg-[#F7F7F7]"
      >
        Edit
      </button>
    );
  }

  return (
    <form
      onSubmit={handleUpdate}
      className="mt-6 rounded-4xl border border-[#2A2A2A] bg-[#F7F7F7] p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-era-label text-[10px] text-[#E11D48]">
            Visual Diary Editor
          </p>

          <h3 className="font-era mt-3 text-2xl leading-[1.08] text-[#111111]">
            Update This Memory
          </h3>
        </div>

        <button
          type="button"
          onClick={handleCancel}
          className="font-era-label inline-flex w-fit rounded-full border border-[#2A2A2A] bg-white px-4 py-2 text-[9px] text-[#111111] transition hover:bg-[#EFEFEF]"
        >
          Cancel
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor={`edit-memory-title-${memory.id}`}
            className="font-era-label mb-2 block text-[9px] text-[#111111]"
          >
            Memory Title
          </label>

          <input
            id={`edit-memory-title-${memory.id}`}
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            required
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none transition focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div>
          <label
            htmlFor={`edit-memory-date-${memory.id}`}
            className="font-era-label mb-2 block text-[9px] text-[#111111]"
          >
            Memory Date
          </label>

          <DateInput
            id={`edit-memory-date-${memory.id}`}
            // type="date"
            value={memoryDate}
            onChange={(event) => setMemoryDate(event.target.value)}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none transition focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor={`edit-memory-mood-${memory.id}`}
          className="font-era-label mb-2 block text-[9px] text-[#111111]"
        >
          Mood
        </label>

        <input
          id={`edit-memory-mood-${memory.id}`}
          type="text"
          value={mood}
          onChange={(event) => setMood(event.target.value)}
          placeholder="Example: Comforted, Proud, Nostalgic"
          maxLength={80}
          className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor={`edit-memory-content-${memory.id}`}
          className="font-era-label mb-2 block text-[9px] text-[#111111]"
        >
          Journal Entry
        </label>

        <textarea
          id={`edit-memory-content-${memory.id}`}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write the moment you want to preserve..."
          maxLength={3000}
          rows={7}
          required
          className="w-full resize-y rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
        />
      </div>

      <div className="mt-4 rounded-4xl border border-dashed border-[#2A2A2A] bg-white p-5">
        <p className="font-era-label text-[9px] text-[#111111]">Cover Image</p>

        <p className="mt-2 text-xs font-semibold leading-5 text-[#777777]">
          Keep the current cover, remove it, or upload one replacement image.
          Supported formats: JPG, PNG, and WEBP. Maximum size: 5 MB.
        </p>

        {currentCoverImageUrl && !shouldRemoveCurrentImage ? (
          <div className="mt-4 overflow-hidden rounded-4xl border border-[#2A2A2A] bg-[#F7F7F7] p-3">
            <img
              src={currentCoverImageUrl}
              alt={`Current cover for ${memory.title}`}
              className="h-56 w-full rounded-2xl object-cover"
            />

            <button
              type="button"
              onClick={removeCurrentImage}
              className="font-era-label mt-3 inline-flex rounded-full border border-[#E11D48] bg-[#FFF1F3] px-4 py-2 text-[9px] text-[#B91C3B] transition hover:bg-[#FFE4E9]"
            >
              Remove Current Cover
            </button>
          </div>
        ) : null}

        {currentCoverImageUrl && shouldRemoveCurrentImage ? (
          <div className="mt-4 rounded-2xl border border-[#E11D48] bg-[#FFF1F3] p-4">
            <p className="text-sm font-bold text-[#B91C3B]">
              The current cover image will be removed when you save.
            </p>

            <button
              type="button"
              onClick={restoreCurrentImage}
              className="font-era-label mt-3 inline-flex rounded-full border border-[#111111] bg-white px-4 py-2 text-[9px] text-[#111111] transition hover:bg-[#F7F7F7]"
            >
              Keep Existing Cover
            </button>
          </div>
        ) : null}

        <label
          htmlFor={`edit-memory-image-${memory.id}`}
          className="font-era-label mt-5 block text-[9px] text-[#111111]"
        >
          Upload Replacement Image
        </label>

        <input
          ref={fileInputRef}
          id={`edit-memory-image-${memory.id}`}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="mt-3 block w-full cursor-pointer text-sm font-semibold text-[#4B4B4B] file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#111111] file:px-5 file:py-3 file:text-[10px] file:font-black file:uppercase file:tracking-[0.13em] file:text-white hover:file:bg-[#E11D48]"
        />

        {newImagePreviewUrl ? (
          <div className="mt-4 overflow-hidden rounded-4xl border border-[#2A2A2A] bg-[#F7F7F7] p-3">
            <img
              src={newImagePreviewUrl}
              alt="New visual diary cover preview"
              className="h-56 w-full rounded-2xl object-cover"
            />

            <button
              type="button"
              onClick={clearNewImage}
              className="font-era-label mt-3 inline-flex rounded-full border border-[#E11D48] bg-[#FFF1F3] px-4 py-2 text-[9px] text-[#B91C3B] transition hover:bg-[#FFE4E9]"
            >
              Remove New Image
            </button>
          </div>
        ) : null}
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-[#E11D48] bg-[#FFF1F3] px-4 py-3 text-sm font-bold text-[#B91C3B]">
          {errorMessage}
        </div>
      ) : null}

      {message ? (
        <div className="mt-4 rounded-2xl border border-[#166534] bg-[#F0FDF4] px-4 py-3 text-sm font-bold text-[#166534]">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSaving}
        className="font-era-label mt-5 inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}