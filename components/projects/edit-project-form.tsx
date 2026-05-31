"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { FanProject } from "@/types/database";

type EditProjectFormProps = {
  project: FanProject;
  userId: string;
};

const projectCategories = [
  "Charity",
  "Birthday Café",
  "Streaming",
  "Watch Party",
  "Online Event",
  "Meetup",
];

function isValidOptionalUrl(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return true;
  }

  try {
    const url = new URL(trimmedValue);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function EditProjectForm({ project, userId }: EditProjectFormProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(project.title);
  const [category, setCategory] = useState(project.category);

  const [organizerName, setOrganizerName] = useState(
    project.organizer_name ?? "",
  );

  const [projectDate, setProjectDate] = useState(project.project_date ?? "");

  const [country, setCountry] = useState(project.country ?? "");
  const [city, setCity] = useState(project.city ?? "");

  const [description, setDescription] = useState(project.description ?? "");

  const [projectLink, setProjectLink] = useState(project.project_link ?? "");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function restoreSavedValues() {
    setTitle(project.title);
    setCategory(project.category);
    setOrganizerName(project.organizer_name ?? "");
    setProjectDate(project.project_date ?? "");
    setCountry(project.country ?? "");
    setCity(project.city ?? "");
    setDescription(project.description ?? "");
    setProjectLink(project.project_link ?? "");
    setMessage("");
    setErrorMessage("");
  }

  function handleCancel() {
    restoreSavedValues();
    setIsEditing(false);
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    const trimmedTitle = title.trim();
    const trimmedOrganizerName = organizerName.trim();
    const trimmedCountry = country.trim();
    const trimmedCity = city.trim();
    const trimmedDescription = description.trim();
    const trimmedProjectLink = projectLink.trim();

    if (!trimmedTitle) {
      setErrorMessage("Please enter a project title.");
      return;
    }

    if (trimmedTitle.length < 3) {
      setErrorMessage("Project title must contain at least 3 characters.");

      return;
    }

    if (!projectCategories.includes(category)) {
      setErrorMessage("Please choose a valid project category.");
      return;
    }

    if (!trimmedDescription) {
      setErrorMessage("Please add a short project description.");
      return;
    }

    if (!isValidOptionalUrl(trimmedProjectLink)) {
      setErrorMessage(
        "Project link must start with http:// or https://, or remain empty.",
      );

      return;
    }

    setIsSaving(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("fan_projects")
      .update({
        title: trimmedTitle,
        category,
        organizer_name: trimmedOrganizerName || null,
        project_date: projectDate || null,
        country: trimmedCountry || null,
        city: trimmedCity || null,
        description: trimmedDescription,
        project_link: trimmedProjectLink || null,
        status: "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", project.id)
      .eq("created_by", userId)
      .eq("is_read_only", false);

    if (error) {
      setErrorMessage(error.message);
      setIsSaving(false);

      return;
    }

    setMessage("Your changes were saved and sent for review.");

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
          letterSpacing: "0.12em",
        }}
        className="inline-flex h-9 items-center justify-center rounded-full border border-[#111111] bg-white px-3 font-black uppercase tracking-[0.14em] text-[#111111] transition hover:bg-[#F7F7F7]"
      >
        Edit
      </button>
    );
  }

  return (
    <form
      onSubmit={handleUpdate}
      className="mt-5 w-full rounded-4xl border border-[#2A2A2A] bg-[#F7F7F7] p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-era-label text-[10px] text-[#E11D48]">
            Project Editor
          </p>

          <h3 className="font-era mt-3 text-2xl leading-[1.08] text-[#111111]">
            Update This Project
          </h3>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#4B4B4B]">
            Edited projects return to pending review before appearing in the
            public feed again.
          </p>
        </div>

        <button
          type="button"
          style={{
            fontSize: "10px",
            lineHeight: "1",
            fontWeight: 900,
            letterSpacing: "0.12em",
          }}
          onClick={handleCancel}
          className="font-era-label inline-flex w-fit rounded-full border border-[#2A2A2A] bg-white px-4 py-2 text-[9px] text-[#111111] transition hover:bg-[#EFEFEF]"
        >
          Cancel
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor={`edit-project-title-${project.id}`}
            className="font-era-label mb-2 block text-[9px] text-[#111111]"
          >
            Project Title
          </label>

          <input
            id={`edit-project-title-${project.id}`}
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
            htmlFor={`edit-project-category-${project.id}`}
            className="font-era-label mb-2 block text-[9px] text-[#111111]"
          >
            Category
          </label>

          <select
            id={`edit-project-category-${project.id}`}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none transition focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          >
            {projectCategories.map((projectCategory) => (
              <option key={projectCategory} value={projectCategory}>
                {projectCategory}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={`edit-project-organizer-${project.id}`}
            className="font-era-label mb-2 block text-[9px] text-[#111111]"
          >
            Organizer Name
          </label>

          <input
            id={`edit-project-organizer-${project.id}`}
            type="text"
            value={organizerName}
            onChange={(event) => setOrganizerName(event.target.value)}
            placeholder="Example: ARMY Bengaluru"
            maxLength={120}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div>
          <label
            htmlFor={`edit-project-date-${project.id}`}
            className="font-era-label mb-2 block text-[9px] text-[#111111]"
          >
            Project Date
          </label>

          <input
            id={`edit-project-date-${project.id}`}
            type="date"
            value={projectDate}
            onChange={(event) => setProjectDate(event.target.value)}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none transition focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div>
          <label
            htmlFor={`edit-project-country-${project.id}`}
            className="font-era-label mb-2 block text-[9px] text-[#111111]"
          >
            Country
          </label>

          <input
            id={`edit-project-country-${project.id}`}
            type="text"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            placeholder="Example: India or Global"
            maxLength={80}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div>
          <label
            htmlFor={`edit-project-city-${project.id}`}
            className="font-era-label mb-2 block text-[9px] text-[#111111]"
          >
            City Or Online Location
          </label>

          <input
            id={`edit-project-city-${project.id}`}
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Example: Seoul, Bengaluru, Online"
            maxLength={120}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor={`edit-project-description-${project.id}`}
          className="font-era-label mb-2 block text-[9px] text-[#111111]"
        >
          Project Description
        </label>

        <textarea
          id={`edit-project-description-${project.id}`}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={1000}
          rows={5}
          required
          className="w-full resize-y rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#111111] outline-none transition focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor={`edit-project-link-${project.id}`}
          className="font-era-label mb-2 block text-[9px] text-[#111111]"
        >
          External Project Link
        </label>

        <input
          id={`edit-project-link-${project.id}`}
          type="url"
          value={projectLink}
          onChange={(event) => setProjectLink(event.target.value)}
          placeholder="https://example.com"
          maxLength={500}
          className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
        />
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
        style={{
          fontSize: "10px",
          lineHeight: "1",
          fontWeight: 900,
          letterSpacing: "0.12em",
        }}
        className="font-era-label mt-5 inline-flex rounded-full bg-[#E11D48] px-5 py-3 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save Changes And Send For Review"}
      </button>
    </form>
  );
}