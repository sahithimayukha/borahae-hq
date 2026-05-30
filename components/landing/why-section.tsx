const highlights = [
  "Built for organization",
  "Made for memories",
  "Designed for global ARMY",
  "Unofficial and fan-made",
];

export function WhySection() {
  return (
    <section className="mx-auto max-w-7xl py-16">
      <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <h2 className="font-display text-4xl font-semibold text-[#3B1E5A] md:text-5xl">
          A calmer home for your ARMY journey.
        </h2>

        <div>
          <p className="text-lg leading-8 text-[#7A7185]">
            ARMY life moves fast across social platforms, event posts, fanbase
            updates, comeback goals, and personal memories. BorahaeHQ brings
            everything into one organized, beautiful space so you can plan,
            remember, support, and celebrate without the chaos.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {highlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#C9A7FF] bg-white/70 px-4 py-2 text-sm font-semibold text-[#3B1E5A]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}