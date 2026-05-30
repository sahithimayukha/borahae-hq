import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="w-full rounded-3xl border border-white/10 bg-[#0B0B0B] px-5 py-4 text-center shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
      <p className="text-xs font-semibold leading-5 text-white/55">
        BorahaeHQ is an unofficial fan-made platform and is not affiliated with
        or endorsed by BIGHIT MUSIC, HYBE, or BTS. All trademarks, names, and
        media belong to their respective owners.
      </p>

      <div className="mt-3 flex flex-wrap justify-center gap-4">
        <Link
          href="/privacy"
          className="text-[10px] font-black uppercase tracking-[0.12em] text-[#E11D48] transition hover:text-[#C5163D]"
        >
          Privacy Policy
        </Link>

        <Link
          href="/terms"
          className="text-[10px] font-black uppercase tracking-[0.12em] text-[#E11D48] transition hover:text-[#C5163D]"
        >
          Terms Of Use
        </Link>
      </div>
    </footer>
  );
}