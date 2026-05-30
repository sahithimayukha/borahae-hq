import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const features = [
  {
    title: "ARMY Calendar",
    description:
      "Track anniversaries, comeback reminders, fan events, birthdays, and community moments in one organized calendar.",
  },
  {
    title: "Fan Projects",
    description:
      "Discover charity drives, birthday cafés, watch parties, streaming events, and global ARMY projects.",
  },
  {
    title: "Memory Vault",
    description:
      "Save your BTS journey, favorite moments, concert memories, letters, and personal reflections privately.",
  },
  {
    title: "Personal Dashboard",
    description:
      "See daily ARMY tasks, upcoming events, saved projects, and memory prompts in one peaceful home screen.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl py-16">
      <SectionHeading
        eyebrow="Features"
        title="Everything your purple HQ needs."
      />

      <div className="mt-10 grid gap-5 md:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title}>
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4EDFF] text-[#3B1E5A]">
              ✦
            </div>

            <h3 className="text-lg font-bold text-[#3B1E5A]">
              {feature.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#7A7185]">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}