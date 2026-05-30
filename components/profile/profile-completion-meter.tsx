import Link from "next/link";
import type { Profile } from "@/types/database";

type ProfileCompletionMeterProps = {
  profile: Profile | null;
  fallbackDisplayName: string;
  compact?: boolean;
  showEditLink?: boolean;
};

type ProfileDetail = {
  label: string;
  isComplete: boolean;
};

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function getProfileDetails(
  profile: Profile | null,
  fallbackDisplayName: string,
): ProfileDetail[] {
  return [
    {
      label: "Display name",
      isComplete: hasText(profile?.display_name) || hasText(fallbackDisplayName),
    },
    {
      label: "Country",
      isComplete: hasText(profile?.country),
    },
    {
      label: "ARMY since year",
      isComplete: Boolean(profile?.army_since),
    },
    {
      label: "Bias",
      isComplete: hasText(profile?.bias),
    },
    {
      label: "Favorite album",
      isComplete: hasText(profile?.favorite_album),
    },
    {
      label: "Favorite song",
      isComplete: hasText(profile?.favorite_song),
    },
    {
      label: "Favorite era",
      isComplete: hasText(profile?.favorite_era),
    },
    {
      label: "Favorite quote",
      isComplete: hasText(profile?.favorite_quote),
    },
  ];
}

function getCompletionMessage(percentage: number) {
  if (percentage === 100) {
    return "Your ARMY profile is complete. Every detail is neatly filed inside your HQ.";
  }

  if (percentage >= 75) {
    return "Your profile is almost complete. Add the final details to finish your ARMY archive.";
  }

  if (percentage >= 40) {
    return "Your ARMY identity is taking shape. Add a few more details to make it feel personal.";
  }

  return "Your profile is waiting for more details. Start filling your personal ARMY archive.";
}

export function ProfileCompletionMeter({
  profile,
  fallbackDisplayName,
  compact = false,
  showEditLink = true,
}: ProfileCompletionMeterProps) {
  const profileDetails = getProfileDetails(profile, fallbackDisplayName);

  const completedDetailCount = profileDetails.filter(
    (detail) => detail.isComplete,
  ).length;

  const totalDetailCount = profileDetails.length;

  const completionPercentage = Math.round(
    (completedDetailCount / totalDetailCount) * 100,
  );

  const circleRadius = 52;
  const circleCircumference = 2 * Math.PI * circleRadius;

  const progressOffset =
    circleCircumference -
    (completionPercentage / 100) * circleCircumference;

  return (
    <section className="relative overflow-hidden rounded-4xlrder border-[#2A2A2A] bg-[#0B0B0B] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.42)] sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.26),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.10),transparent_28%)]" />

      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(135deg,#fff_1px,transparent_1px)] bg-size-[18px_18px]" />

      <div className="relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-era-label text-[10px] text-[#E11D48]">
              ARMY Profile Progress
            </p>

            <h2 className="font-era-display mt-4 max-w-4xl text-5xl text-white! sm:text-6xl">
              Complete Your
              <span className="mt-3 block w-fit bg-[#E11D48] px-4 py-2 text-white!">
                ARMY Identity.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl border-l-4 border-[#E11D48] pl-4 text-sm font-semibold leading-7 text-white/75">
              {getCompletionMessage(completionPercentage)}
            </p>

            <p className="mt-5 text-sm font-bold text-white/75">
              {completedDetailCount} of {totalDetailCount} profile details
              completed.
            </p>

            {showEditLink ? (
              <Link
                href="/profile"
                className="font-era-label mt-6 inline-flex rounded-full bg-[#E11D48] px-6 py-3.5 text-[10px] text-white! transition hover:-translate-y-0.5 hover:bg-[#C5163D]"
              >
                Edit My Profile
              </Link>
            ) : null}
          </div>

          <div className="flex flex-col items-center gap-3">
            <div
              className="relative h-40 w-40"
              role="img"
              aria-label={`${completionPercentage}% of ARMY profile details completed`}
            >
              <svg
                viewBox="0 0 128 128"
                className="h-full w-full -rotate-90"
                aria-hidden="true"
              >
                <circle
                  cx="64"
                  cy="64"
                  r={circleRadius}
                  fill="none"
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="12"
                />

                <circle
                  cx="64"
                  cy="64"
                  r={circleRadius}
                  fill="none"
                  stroke="#E11D48"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={progressOffset}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-black text-white!">
                  {completionPercentage}%
                </p>

                <p className="font-era-label mt-1 text-[8px] text-[#E11D48]">
                  Complete
                </p>
              </div>
            </div>
          </div>
        </div>

        {!compact ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {profileDetails.map((detail) => (
              <div
                key={detail.label}
                className={`rounded-2xl border p-4 ${
                  detail.isComplete
                    ? "border-[#166534] bg-[#F0FDF4]"
                    : "border-white/15 bg-black/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                      detail.isComplete
                        ? "bg-[#166534] text-white!"
                        : "border border-[#E11D48] bg-transparent text-[#E11D48]"
                    }`}
                  >
                    {detail.isComplete ? "✓" : ""}
                  </span>

                  <p
                    className={`text-sm font-bold ${
                      detail.isComplete ? "text-[#166534]" : "text-white!"
                    }`}
                  >
                    {detail.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}