import Link from "next/link";

const eras = [
  {
    title: "ARIRANG",
    type: "5th Studio Album",
    year: "2026",
    description:
      "Begin with BTS in their newest chapter. Explore the reunion era before travelling backwards through the group's musical story.",
    tags: ["Newest era", "Group return", "Start here"],
    featured: true,
  },
  {
    title: "Proof",
    type: "Anthology Album",
    year: "2022",
    description:
      "A useful entry point for new listeners. This anthology gathers defining songs from across BTS history alongside new tracks.",
    tags: ["Career overview", "Beginner-friendly", "Anthology"],
  },
  {
    title: "BE",
    type: "Album",
    year: "2020",
    description:
      "A reflective and comforting chapter shaped by uncertainty, connection, and the small emotions of everyday life.",
    tags: ["Comfort", "Reflection", "Warm listening"],
  },
  {
    title: "MAP OF THE SOUL : 7",
    type: "Studio Album",
    year: "2020",
    description:
      "A layered exploration of identity, growth, shadow, and the seven members' shared journey.",
    tags: ["Identity", "Growth", "Performance"],
  },
  {
    title: "LOVE YOURSELF 結 'Answer'",
    type: "Repackage Album",
    year: "2018",
    description:
      "A central BTS chapter about self-love, emotional complexity, and the journey toward accepting yourself.",
    tags: ["Self-love", "Emotional arc", "Essential era"],
  },
  {
    title: "WINGS",
    type: "Studio Album",
    year: "2016",
    description:
      "A dramatic, artistic era exploring temptation, coming of age, and individual storytelling.",
    tags: ["Artistic era", "Coming of age", "Solo tracks"],
  },
  {
    title: "The Most Beautiful Moment in Life: Young Forever",
    type: "Compilation Album",
    year: "2016",
    description:
      "A youth-focused chapter balancing uncertainty, ambition, friendship, and the fragile beauty of growing up.",
    tags: ["Youth", "Nostalgia", "Emotional storytelling"],
  },
  {
    title: "Dark & Wild",
    type: "Studio Album",
    year: "2014",
    description:
      "Explore a sharper early BTS sound with youthful intensity, hip-hop roots, and energetic performances.",
    tags: ["Early era", "Hip-hop roots", "High energy"],
  },
  {
    title: "2 COOL 4 SKOOL",
    type: "Debut Single Album",
    year: "2013",
    description:
      "Return to the beginning and discover the debut-era voice that introduced BTS to the world.",
    tags: ["Debut", "Origins", "Start from 2013"],
  },
];

const listeningPaths = [
  {
    title: "New to BTS",
    symbol: "01",
    description:
      "Start with Proof for a broad introduction, then explore ARIRANG and follow the eras that catch your attention.",
  },
  {
    title: "Emotional Storytelling",
    symbol: "02",
    description:
      "Explore The Most Beautiful Moment in Life, LOVE YOURSELF, BE, and the songs that feel quietly personal.",
  },
  {
    title: "Performance Energy",
    symbol: "03",
    description:
      "Move through Dark & Wild, WINGS, MAP OF THE SOUL : 7, and performance-focused tracks across different eras.",
  },
  {
    title: "Journey from the Beginning",
    symbol: "04",
    description:
      "Begin with 2 COOL 4 SKOOL and travel forward chronologically to watch the sound and storytelling evolve.",
  },
];

export default function DiscographyGuidePage() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <Link
          href="/army-guide"
          className="font-era-label inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#FF6C89] transition hover:text-white"
        >
          ← Back to ARMY Guide Hub
        </Link>

        <div className="relative mt-6 overflow-hidden rounded-4xl border border-[#2A2A2A] bg-linear-to-br from-[#171717] via-[#0B0B0B] to-[#050505] px-6 py-8 shadow-2xl sm:px-8 sm:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.28),transparent_38%)]" />

          <div className="relative">
            <p className="font-era-label text-[10px] uppercase tracking-[0.28em] text-[#E11D48] sm:text-xs">
              Explore the music
            </p>

            <h1 className="font-era-display mt-4 text-4xl uppercase tracking-tight text-white sm:text-5xl">
              Discography Guide
            </h1>

            <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-[#CDCDCD] sm:text-base">
              BTS discography is a long corridor of eras, emotions, and evolving
              ideas. Use this page as a gentle listening map rather than a
              checklist you need to complete all at once.
            </p>

            <a
              href="https://ibighit.com/en/bts/discography/"
              target="_blank"
              rel="noreferrer"
              className="font-era-label mt-7 inline-flex rounded-full border border-[#73253A] bg-[#E11D48]/15 px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#FF8CA4] transition hover:border-[#E11D48] hover:bg-[#E11D48]/25 hover:text-white"
            >
              View official discography ↗
            </a>
          </div>
        </div>

        <div className="mt-10">
          <p className="font-era-label text-[10px] uppercase tracking-[0.25em] text-[#E11D48]">
            A guided era map
          </p>

          <h2 className="font-era mt-3 text-2xl font-black text-white">
            Key chapters to explore
          </h2>

          <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[#B8B8B8]">
            This is a curated starting point, not the complete catalog. Visit
            the official discography for the full updated release list.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {eras.map((era) => (
              <article
                key={era.title}
                className={`relative overflow-hidden rounded-[1.75rem] border p-6 shadow-lg ${
                  era.featured
                    ? "border-[#8E2D45] bg-linear-to-br from-[#260D14] via-[#12090C] to-[#070707]"
                    : "border-[#2A2A2A] bg-linear-to-br from-[#131313] via-[#0B0B0B] to-[#070707]"
                }`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.14),transparent_42%)]" />

                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-era-label rounded-full border border-[#4C232D] bg-[#E11D48]/10 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#FF7C97]">
                      {era.year}
                    </span>

                    {era.featured ? (
                      <span className="font-era-label text-[9px] uppercase tracking-[0.18em] text-[#FF7894]">
                        Newest chapter
                      </span>
                    ) : null}
                  </div>

                  <p className="font-era-label mt-6 text-[10px] uppercase tracking-[0.18em] text-[#E11D48]">
                    {era.type}
                  </p>

                  <h3 className="font-era mt-3 text-xl font-black leading-7 text-white">
                    {era.title}
                  </h3>

                  <p className="mt-4 text-sm font-medium leading-6 text-[#BDBDBD]">
                    {era.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {era.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-era-label rounded-full border border-[#333333] bg-[#111111] px-3 py-1 text-[10px] tracking-wide text-[#D7D7D7]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <p className="font-era-label text-[10px] uppercase tracking-[0.25em] text-[#E11D48]">
            Choose your route
          </p>

          <h2 className="font-era mt-3 text-2xl font-black text-white">
            Beginner listening paths
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {listeningPaths.map((path) => (
              <article
                key={path.title}
                className="rounded-[1.75rem] border border-[#2A2A2A] bg-linear-to-br from-[#131313] via-[#0B0B0B] to-[#070707] p-6 shadow-lg"
              >
                <div className="font-era flex h-11 w-11 items-center justify-center rounded-2xl border border-[#43202A] bg-[#E11D48]/10 text-sm font-black text-[#FF6C89]">
                  {path.symbol}
                </div>

                <h3 className="font-era mt-5 text-lg font-black text-white">
                  {path.title}
                </h3>

                <p className="mt-3 text-sm font-medium leading-6 text-[#BDBDBD]">
                  {path.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-[#3A2026] bg-linear-to-r from-[#16090D] via-[#100A0C] to-[#090909] px-6 py-5 shadow-lg">
          <p className="font-era text-sm font-black text-white">
            Listen at your own pace 💜
          </p>

          <p className="mt-2 text-sm font-medium leading-6 text-[#C8C8C8]">
            BTS discography is not homework. Let one song lead naturally into
            another era, performance, lyric translation, or album story.
          </p>
        </div>
      </section>
    </main>
  );
}