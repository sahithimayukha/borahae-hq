type ArirangPageHeroProps = {
  eyebrow: string;
  title: string;
  accentTitle: string;
  description: string;
  backgroundImage: string;
};

export function ArirangPageHero({
  eyebrow,
  title,
  accentTitle,
  description,
  backgroundImage,
}: ArirangPageHeroProps) {
  return (
    <section
      className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-[#2A2A2A] bg-[#050505] bg-cover bg-center bg-no-repeat shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      <div className="absolute inset-0 bg-black/45" />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.72)_48%,rgba(0,0,0,0.20)_100%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.34),transparent_35%)]" />

      <div className="relative z-10 flex min-h-[360px] items-end p-6 sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="inline-flex bg-[#E11D48] px-4 py-2 font-era text-xs tracking-[0.16em] !text-white">
            {eyebrow}
          </p>

          <h1 className="font-era mt-5 text-5xl leading-[0.9] !text-white sm:text-6xl lg:text-7xl">
            {title}

            <span className="mt-3 block w-fit bg-[#E11D48] px-4 py-2 !text-white">
              {accentTitle}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm font-semibold leading-7 text-white/85 sm:text-base">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}