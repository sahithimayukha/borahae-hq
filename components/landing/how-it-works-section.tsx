import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    title: "Create your ARMY profile",
    description:
      "Choose your display name, country, ARMY since year, bias, favorite album, and favorite era.",
  },
  {
    title: "Organize your fandom life",
    description:
      "Track events, discover fan projects, and save important reminders in one calm purple HQ.",
  },
  {
    title: "Build your purple memory vault",
    description:
      "Save memories, letters, comeback moments, and personal BTS reflections in a private space.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl py-16">
      <div className="rounded-[2.5rem] border border-white/80 bg-white/70 p-8 shadow-[0_25px_80px_rgba(59,30,90,0.1)] md:p-12">
        <SectionHeading eyebrow="How it works" title="Start calm. Stay organized." />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-[1.75rem] border border-[#E8E6EF] bg-white p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B1E5A] text-sm font-bold text-white!">
                {index + 1}
              </span>

              <h3 className="mt-5 text-lg font-bold text-[#3B1E5A]">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#7A7185]">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}