/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type MemoryFormProps = {
  userId: string;
};

const acceptedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

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

export function MemoryForm({ userId }: MemoryFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [memoryDate, setMemoryDate] = useState("");

  const [selectedImage, setSelectedImage] = useState<File | null>(
    null,
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImage]);

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
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
  }

  function clearSelectedImage() {
    setSelectedImage(null);
    setErrorMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
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

    let coverImagePath: string | null = null;

    if (selectedImage) {
      const fileExtension = getFileExtension(selectedImage);

      coverImagePath = `${userId}/${crypto.randomUUID()}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("memory-images")
        .upload(coverImagePath, selectedImage, {
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

    const { error: insertError } = await supabase
      .from("memories")
      .insert({
        user_id: userId,
        title: trimmedTitle,
        content: trimmedContent,
        mood: trimmedMood || null,
        memory_date: memoryDate || null,
        visibility: "private",
        cover_image_path: coverImagePath,
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      if (coverImagePath) {
        await supabase.storage
          .from("memory-images")
          .remove([coverImagePath]);
      }

      setErrorMessage(insertError.message);
      setIsSaving(false);
      return;
    }

    setTitle("");
    setContent("");
    setMood("");
    setMemoryDate("");
    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setMessage("Your visual diary memory has been saved.");
    setIsSaving(false);

    router.refresh();
  }

  return (
    <section className="rounded-4xl border border-[#2A2A2A] bg-white p-6 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-8">
      <p className="font-era-label text-[10px] text-[#E11D48]">
        Personal Visual Diary
      </p>

      <h2 className="font-era mt-3 text-3xl leading-[1.08] text-[#111111]">
        Save A Memory
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4B4B4B]">
        Write a private BTS memory and optionally add one image as its visual
        cover.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="memory-title"
              className="font-era-label mb-2 block text-[10px] text-[#111111]"
            >
              Memory Title
            </label>

            <input
              id="memory-title"
              name="memoryTitle"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: My first ARIRANG listening day"
              maxLength={120}
              required
              className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
            />
          </div>

          <div>
            <label
              htmlFor="memory-date"
              className="font-era-label mb-2 block text-[10px] text-[#111111]"
            >
              Memory Date
            </label>

            <input
              id="memory-date"
              name="memoryDate"
              type="date"
              value={memoryDate}
              onChange={(event) => setMemoryDate(event.target.value)}
              className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="memory-mood"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Mood
          </label>

          <input
            id="memory-mood"
            name="memoryMood"
            type="text"
            value={mood}
            onChange={(event) => setMood(event.target.value)}
            placeholder="Example: Comforted, Proud, Nostalgic"
            maxLength={80}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div>
          <label
            htmlFor="memory-content"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Journal Entry
          </label>

          <textarea
            id="memory-content"
            name="memoryContent"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write the moment you want to preserve..."
            maxLength={3000}
            rows={7}
            required
            className="w-full resize-y rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold leading-6 text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div className="rounded-4xl border border-dashed border-[#2A2A2A] bg-[#F7F7F7] p-5">
          <label
            htmlFor="memory-cover-image"
            className="font-era-label block text-[10px] text-[#111111]"
          >
            Optional Cover Image
          </label>

          <p className="mt-2 text-xs font-semibold leading-5 text-[#777777]">
            Upload one JPG, PNG, or WEBP image. Maximum file size: 5 MB.
          </p>

          <input
            ref={fileInputRef}
            id="memory-cover-image"
            name="memoryCoverImage"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="mt-4 block w-full cursor-pointer text-sm font-semibold text-[#4B4B4B] file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#111111] file:px-5 file:py-3 file:text-[10px] file:font-black file:uppercase file:tracking-[0.13em] file:text-white hover:file:bg-[#E11D48]"
          />

          {previewUrl ? (
            <div className="mt-5 overflow-hidden rounded-4xl border border-[#2A2A2A] bg-white p-3">
              <img
                src={previewUrl}
                alt="Selected memory cover preview"
                className="h-64 w-full rounded-2xl object-cover"
              />

              <button
                type="button"
                onClick={clearSelectedImage}
                className="font-era-label mt-3 inline-flex rounded-full border border-[#E11D48] bg-[#FFF1F3] px-4 py-2 text-[9px] text-[#B91C3B] transition hover:bg-[#FFE4E9]"
              >
                Remove Image
              </button>
            </div>
          ) : null}
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-[#E11D48] bg-[#FFF1F3] px-4 py-3 text-sm font-bold text-[#B91C3B]">
            {errorMessage}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-2xl border border-[#166534] bg-[#F0FDF4] px-4 py-3 text-sm font-bold text-[#166534]">
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSaving}
          className="font-era-label inline-flex rounded-full bg-[#E11D48] px-6 py-3.5 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving Memory..." : "Save Visual Diary Memory"}
        </button>
      </form>
    </section>
  );
}