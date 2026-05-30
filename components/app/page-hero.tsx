type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-4xl border border-[#2A2A2A] bg-[#0B0B0B] px-6 py-8 shadow-[0_20px_70px_rgba(0,0,0,0.42)] sm:px-8 sm:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.30),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.12),transparent_28%)]" />

      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(135deg,#fff_1px,transparent_1px)] bg-size-[18px_18px]" />

      <div className="relative z-10">
        <p className="inline-flex bg-[#E11D48] px-4 py-2 font-era text-xs tracking-[0.18em] text-white!">
          {eyebrow}
        </p>

        <h1 className="font-era mt-5 max-w-4xl text-5xl leading-[0.92] text-white! sm:text-6xl lg:text-7xl">
          {title}
        </h1>

        <p className="mt-5 max-w-2xl border-l-4 border-[#E11D48] pl-4 text-sm font-semibold leading-7 text-white/80 sm:text-base">
          {description}
        </p>
      </div>
    </section>
  );
}