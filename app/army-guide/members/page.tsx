import Link from "next/link";

const members = [
  {
    stageName: "RM",
    fullName: "Kim Namjoon",
    role: "Leader · Rapper · Songwriter",
    symbol: "RM",
    description:
      "Known for thoughtful lyricism, leadership, and a reflective creative voice shaped by art, literature, and personal growth.",
    highlights: ["Leadership", "Lyricism", "Art & culture"],
  },
  {
    stageName: "Jin",
    fullName: "Kim Seokjin",
    role: "Vocalist · Performer",
    symbol: "J",
    description:
      "Known for his expressive vocals, warm presence, humor, and emotionally resonant solo music.",
    highlights: ["Vocals", "Warm energy", "Solo releases"],
  },
  {
    stageName: "SUGA",
    fullName: "Min Yoongi",
    role: "Rapper · Producer · Songwriter",
    symbol: "S",
    description:
      "Known for introspective storytelling, sharp production, and a powerful solo identity under the name Agust D.",
    highlights: ["Production", "Rap", "Agust D"],
  },
  {
    stageName: "j-hope",
    fullName: "Jung Hoseok",
    role: "Rapper · Dancer · Performer",
    symbol: "JH",
    description:
      "Known for dynamic stage presence, precision, bright energy, and bold creative direction across music and performance.",
    highlights: ["Dance", "Performance", "Creative energy"],
  },
  {
    stageName: "Jimin",
    fullName: "Park Jimin",
    role: "Vocalist · Dancer · Performer",
    symbol: "JM",
    description:
      "Known for expressive movement, distinctive vocals, emotional performance, and an elegant stage presence.",
    highlights: ["Dance", "Vocals", "Stage expression"],
  },
  {
    stageName: "V",
    fullName: "Kim Taehyung",
    role: "Vocalist · Performer",
    symbol: "V",
    description:
      "Known for his rich vocal tone, artistic sensibility, visual storytelling, and a distinctive jazz-influenced solo style.",
    highlights: ["Vocals", "Visual artistry", "Solo style"],
  },
  {
    stageName: "Jung Kook",
    fullName: "Jeon Jungkook",
    role: "Vocalist · Performer",
    symbol: "JK",
    description:
      "Known for versatile vocals, polished performances, creative curiosity, and a wide-ranging solo sound.",
    highlights: ["Vocals", "Performance", "Versatility"],
  },
];

export default function MembersGuidePage() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <Link
          href="/army-guide"
          className="font-era-label inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#FF6C89] transition hover:text-white"
        >
          ← Back to ARMY Guide Hub
        </Link>

        <div className="relative mt-6 overflow-hidden rounded-4xl border border-[#2A2A2A] bg-linear-to-brrom-[#171717] via-[#0B0B0B] to-[#050505] px-6 py-8 shadow-2xl sm:px-8 sm:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.25),transparent_38%)]" />

          <div className="relative">
            <p className="font-era-label text-[10px] uppercase tracking-[0.28em] text-[#E11D48] sm:text-xs">
              Meet the seven
            </p>

            <h1 className="font-era-display mt-4 text-4xl uppercase tracking-tight text-white sm:text-5xl">
              BTS Member Guide
            </h1>

            <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-[#CDCDCD] sm:text-base">
              A simple introduction to the seven members of BTS. Each member
              brings a distinct voice, creative identity, and performance style
              to the group.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <article
              key={member.stageName}
              className="relative overflow-hidden rounded-[1.75rem] border border-[#2A2A2A] bg-linear-to-br from-[#131313] via-[#0B0B0B] to-[#070707] p-6 shadow-lg"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.1),transparent_42%)]" />

              <div className="relative">
                <div className="font-era flex h-12 w-12 items-center justify-center rounded-2xl border border-[#43202A] bg-[#E11D48]/10 text-sm font-black text-[#FF6C89]">
                  {member.symbol}
                </div>

                <p className="font-era-label mt-6 text-[10px] uppercase tracking-[0.2em] text-[#E11D48]">
                  {member.fullName}
                </p>

                <h2 className="font-era mt-3 text-2xl font-black text-white">
                  {member.stageName}
                </h2>

                <p className="font-era-label mt-2 text-[10px] uppercase tracking-[0.16em] text-[#A8A8A8]">
                  {member.role}
                </p>

                <p className="mt-4 text-sm font-medium leading-6 text-[#BDBDBD]">
                  {member.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {member.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="font-era-label rounded-full border border-[#333333] bg-[#111111] px-3 py-1 text-[10px] tracking-wide text-[#D7D7D7]"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-[#3A2026] bg-linear-to-r from-[#16090D] via-[#100A0C] to-[#090909] px-6 py-5 shadow-lg">
          <p className="font-era text-sm font-black text-white">
            Explore gently 💜
          </p>

          <p className="mt-2 text-sm font-medium leading-6 text-[#C8C8C8]">
            There is no single correct way to begin discovering BTS. Start with
            the songs, performances, and stories that naturally interest you.
          </p>
        </div>
      </section>
    </main>
  );
}