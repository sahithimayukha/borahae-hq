"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SupportRequestFormProps = {
  userId: string;
  userEmail: string | null;
};

const supportCategories = [
  "Account Deletion",
  "Privacy Question",
  "Technical Issue",
  "Other",
];

export function SupportRequestForm({
  userId,
  userEmail,
}: SupportRequestFormProps) {
  const [category, setCategory] = useState(supportCategories[0]);
  const [messageText, setMessageText] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const trimmedMessage = messageText.trim();

    if (!userEmail) {
      setErrorMessage(
        "Your account email could not be found. Please sign out and sign in again.",
      );

      return;
    }

    if (!supportCategories.includes(category)) {
      setErrorMessage("Please choose a valid support category.");
      return;
    }

    if (trimmedMessage.length < 10) {
      setErrorMessage(
        "Please write at least 10 characters so the request is clear.",
      );

      return;
    }

    if (trimmedMessage.length > 2000) {
      setErrorMessage(
        "Please keep your request under 2000 characters.",
      );

      return;
    }

    setIsSending(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("support_requests")
      .insert({
        user_id: userId,
        account_email: userEmail,
        category,
        message: trimmedMessage,
        status: "open",
        updated_at: new Date().toISOString(),
      });

    if (error) {
      setErrorMessage(error.message);
      setIsSending(false);
      return;
    }

    setCategory(supportCategories[0]);
    setMessageText("");

    setSuccessMessage(
      "Your private support request has been sent.",
    );

    setIsSending(false);
  }

  return (
    <section className="rounded-4xl border border-[#2A2A2A] bg-white p-6 text-[#111111] shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-8">
      <p className="font-era-label text-[10px] text-[#E11D48]">
        Private Support
      </p>

      <h2 className="font-era mt-3 text-3xl leading-[1.08] text-[#111111]">
        Send A Support Request
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4B4B4B]">
        Send a private request for account deletion, privacy questions, or
        technical support. Your account email is used internally and is not
        displayed publicly.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div>
          <label
            htmlFor="support-email"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Account Email
          </label>

          <input
            id="support-email"
            type="email"
            value={userEmail ?? ""}
            disabled
            className="w-full cursor-not-allowed rounded-2xl border border-[#D1D5DB] bg-[#F7F7F7] px-4 py-3.5 text-sm font-semibold text-[#777777]"
          />

          <p className="mt-2 text-xs font-semibold leading-5 text-[#777777]">
            This email stays inside the private support request.
          </p>
        </div>

        <div>
          <label
            htmlFor="support-category"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Request Type
          </label>

          <select
            id="support-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111] outline-none transition focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          >
            {supportCategories.map((supportCategory) => (
              <option
                key={supportCategory}
                value={supportCategory}
              >
                {supportCategory}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="support-message"
            className="font-era-label mb-2 block text-[10px] text-[#111111]"
          >
            Message
          </label>

          <textarea
            id="support-message"
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            placeholder="Write your request clearly..."
            minLength={10}
            maxLength={2000}
            rows={6}
            required
            className="w-full resize-y rounded-2xl border border-[#2A2A2A] bg-white px-4 py-3.5 text-sm font-semibold leading-6 text-[#111111] outline-none transition placeholder:text-[#777777] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/20"
          />

          <p className="mt-2 text-xs font-semibold leading-5 text-[#777777]">
            {messageText.length}/2000 characters
          </p>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-[#E11D48] bg-[#FFF1F3] px-4 py-3 text-sm font-bold text-[#B91C3B]">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-2xl border border-[#166534] bg-[#F0FDF4] px-4 py-3 text-sm font-bold text-[#166534]">
            {successMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSending}
          style={{
        fontSize: "10px",
        lineHeight: "1",
        fontWeight: 900,
      }}
          className="inline-flex items-center justify-center rounded-full bg-[#E11D48] px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.14em] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending ? "Sending..." : "Send Private Request"}
        </button>
      </form>
    </section>
  );
}