"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DateInput } from "@/components/ui/date-input";

type ProjectFormProps = {
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

export function ProjectForm({ userId }: ProjectFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(projectCategories[0]);
  const [organizerName, setOrganizerName] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [projectLink, setProjectLink] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

    const { error } = await supabase.from("fan_projects").insert({
      created_by: userId,
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
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSaving(false);
      return;
    }

    setTitle("");
    setCategory(projectCategories[0]);
    setOrganizerName("");
    setProjectDate("");
    setCountry("");
    setCity("");
    setDescription("");
    setProjectLink("");

    setMessage("Your fan project has been submitted for review.");

    setIsSaving(false);

    router.refresh();
  }

  return (
    <section className="rounded-4xl border border-[#2A2A2A] bg-white p-6 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-8">
      <p className="font-era-label text-[10px] text-[#E11D48]">
        Community Submission
      </p>

      <h2 className="font-era mt-3 text-3xl leading-[1.08] text-[#111111]">
        Submit A Fan Project
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4B4B4B]">
        Share a charity drive, birthday café, streaming project, watch party,
        online event, or meetup for review. Approved projects can appear in the
        community feed.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="project-title"
              className="font-era-label mb-2 block text-[10px] text-[#111111]"
            >
              Project Title
            </label>

            <input
              id="project-title"
              name="projectTitle"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: ARIRANG Global Streaming Night"
              maxLength={120}
              required
              className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
            />
          </div>

          <div>
            <label
              htmlFor="project-category"
              className="font-era-label mb-2 block text-[10px] text-[#111111]"
            >
              Category
            </label>

            <select
              id="project-category"
              name="projectCategory"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
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
              htmlFor="organizer-name"
              className="font-era-label mb-2 block text-[10px] text-[#111111]"
            >
              Organizer Name
            </label>

            <input
              id="organizer-name"
              name="organizerName"
              type="text"
              value={organizerName}
              onChange={(event) => setOrganizerName(event.target.value)}
              placeholder="Example: ARMY Bengaluru"
              maxLength={120}
              className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
            />
          </div>

          <div>
            <label
              htmlFor="project-date"
              className="font-era-label mb-2 block text-[10px] text-[#111111]"
            >
              Project Date
            </label>

            <DateInput
              id="project-date"
              name="projectDate"
              // type="date"
              value={projectDate}
              onChange={(event) => setProjectDate(event.target.value)}
              className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
            />
          </div>

          <div>
            <label
              htmlFor="project-country"
              className="font-era-label mb-2 block text-[10px] text-[#111111]"
            >
              Country
            </label>

            <input
              id="project-country"
              name="projectCountry"
              type="text"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              placeholder="Example: India or Global"
              maxLength={80}
              className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
            />
          </div>

          <div>
            <label
              htmlFor="project-city"
              className="font-era-label mb-2 block text-[10px] text-[#111111]"
            >
              City Or Online Location
            </label>

            <input
              id="project-city"
              name="projectCity"
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Example: Seoul, Bengaluru, Online"
              maxLength={120}
              className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="project-description"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Project Description
          </label>

          <textarea
            id="project-description"
            name="projectDescription"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Explain the purpose of the project and how ARMY can join..."
            maxLength={1000}
            rows={5}
            required
            className="w-full resize-y rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold leading-6 text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />
        </div>

        <div>
          <label
            htmlFor="project-link"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            External Project Link
          </label>

          <input
            id="project-link"
            name="projectLink"
            type="url"
            value={projectLink}
            onChange={(event) => setProjectLink(event.target.value)}
            placeholder="https://example.com"
            maxLength={500}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />

          <p className="mt-2 text-xs font-semibold leading-5 text-[#777777]">
            Optional. Add a trusted page containing the official project
            details, registration form, or organizer information.
          </p>
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
          {isSaving ? "Submitting..." : "Submit Project For Review"}
        </button>
      </form>
    </section>
  );
}