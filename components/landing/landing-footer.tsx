export function LandingFooter() {
  return (
    <footer className="mx-auto max-w-7xl border-t border-[#E8E6EF] py-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row">
        <div>
          <p className="text-lg font-bold text-[#3B1E5A]">BorahaeHQ ✦</p>

          <p className="mt-2 text-sm text-[#7A7185]">
            Your ARMY life, beautifully organized.
          </p>
        </div>

        <div className="flex gap-5 text-sm font-semibold text-[#3B1E5A]">
          <a href="#">About</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </div>

      <p className="mt-8 max-w-4xl text-xs leading-6 text-[#7A7185]">
        BorahaeHQ is an unofficial fan-made platform for ARMY organization,
        events, memories, and community planning. It is not affiliated with BTS,
        BIGHIT MUSIC, HYBE, Weverse, or any official artist entity. All
        trademarks and artist names belong to their respective owners.
      </p>
    </footer>
  );
}