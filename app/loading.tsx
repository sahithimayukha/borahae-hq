export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading BorahaeHQ"
      className="fixed inset-0 z-9999 flex min-h-screen items-center justify-center bg-[#080808] px-6"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#E11D48]/25" />

          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#E11D48] border-r-[#E11D48]" />

          <div className="h-10 w-10 rounded-full bg-[#E11D48]/15 shadow-[0_0_45px_rgba(225,29,72,0.55)]" />

          <div className="absolute h-3 w-3 rounded-full bg-[#E11D48] shadow-[0_0_22px_rgba(225,29,72,0.95)]" />
        </div>

        <p className="font-era-label mt-6 text-[10px] text-[#E11D48]">
          BorahaeHQ
        </p>

        <h2 className="font-era mt-3 text-3xl leading-[1.05] text-white!">
          Loading Your ARMY Hub
        </h2>

        <p className="mt-3 max-w-xs text-sm leading-6 text-white/55">
          Gathering your calendar, projects, and memories.
        </p>

        <div className="mt-6 flex gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#E11D48]" />

          <span className="h-2 w-2 animate-pulse rounded-full bg-[#E11D48] [animation-delay:180ms]" />

          <span className="h-2 w-2 animate-pulse rounded-full bg-[#E11D48] [animation-delay:360ms]" />
        </div>
      </div>
    </div>
  );
}