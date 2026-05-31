import Link from "next/link";

const officialLinks = [
  {
    category: "Official BTS profile",
    title: "BTS on BIGHIT MUSIC",
    description:
      "Start here for the official BTS profile and group information published by BIGHIT MUSIC.",
    href: "https://ibighit.com/en/bts/profile/",
    symbol: "B",
    priority: true,
  },
  {
    category: "Announcements",
    title: "BTS Weverse Notices",
    description:
      "Check official notices for concerts, ticketing, livestreams, releases, membership updates, and important schedules.",
    href: "https://weverse.io/bts/notice",
    symbol: "!",
    priority: true,
  },
  {
    category: "Community",
    title: "BTS Weverse Community",
    description:
      "Visit the official BTS Weverse community for artist posts, media, live content, notices, and fan activity.",
    href: "https://weverse.io/bts/feed",
    symbol: "W",
    priority: true,
  },
  {
    category: "Music catalog",
    title: "Official BTS Discography",
    description:
      "Explore BTS releases and album pages through the official BIGHIT MUSIC discography.",
    href: "https://ibighit.com/en/bts/discography/",
    symbol: "♪",
  },
  {
    category: "Video",
    title: "BANGTANTV",
    description:
      "Watch official BTS videos, performances, behind-the-scenes content, and channel updates on YouTube.",
    href: "https://www.youtube.com/@BTS",
    symbol: "▶",
  },
  {
    category: "Social updates",
    title: "BTS Official on X",
    description:
      "Follow the official BTS update account for release posts, promotional updates, and announcements.",
    href: "https://x.com/bts_bighit",
    symbol: "X",
  },
  {
    category: "Visual updates",
    title: "BTS Official on Instagram",
    description:
      "Explore the official BTS Instagram page for visual updates, campaign posts, and release content.",
    href: "https://www.instagram.com/bts.bighitofficial/",
    symbol: "◎",
  },
  {
    category: "Label updates",
    title: "BIGHIT MUSIC",
    description:
      "Visit the official label website for BIGHIT MUSIC information and artist pages.",
    href: "https://ibighit.com/",
    symbol: "BH",
  },
];

const safetyChecks = [
  "Open concert and ticketing links from an official Weverse notice whenever possible.",
  "Check the account handle carefully before trusting a repost or direct message.",
  "Avoid unofficial shortened links for membership registration or ticket purchases.",
  "Never share your password, payment details, presale code, or membership information publicly.",
  "Return to the official notice board when information appears unclear or contradictory.",
];

export default function OfficialLinksGuidePage() {
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
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.3),transparent_38%)]" />

          <div className="relative">
            <p className="font-era-label text-[10px] uppercase tracking-[0.28em] text-[#E11D48] sm:text-xs">
              Stay connected safely
            </p>

            <h1 className="font-era-display mt-4 max-w-4xl text-4xl uppercase tracking-tight text-white sm:text-5xl">
              Official Account Links
            </h1>

            <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-[#CDCDCD] sm:text-base">
              Keep the reliable doors in one place. Use these links for BTS
              information, official notices, music, video content, and account
              updates without wandering through uncertain reposts.
            </p>

            <div className="font-era-label mt-7 inline-flex rounded-full border border-[#73253A] bg-[#E11D48]/15 px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#FF8CA4]">
              Official-resource directory
            </div>
          </div>
        </div>

        <div className="mt-10">
          <p className="font-era-label text-[10px] uppercase tracking-[0.25em] text-[#E11D48]">
            Trusted doors
          </p>

          <h2 className="font-era mt-3 text-2xl font-black text-white">
            BTS official resources
          </h2>

          <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[#B8B8B8]">
            For time-sensitive information such as ticketing and livestream
            access, begin with the official Weverse notice board.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {officialLinks.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={`group relative overflow-hidden rounded-[1.75rem] border p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[#E11D48]/80 hover:shadow-[0_20px_50px_rgba(225,29,72,0.12)] ${
                  item.priority
                    ? "border-[#6F2B3B] bg-linear-to-br from-[#240D14] via-[#12090C] to-[#070707]"
                    : "border-[#2A2A2A] bg-linear-to-br from-[#131313] via-[#0B0B0B] to-[#070707]"
                }`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.14),transparent_42%)]" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="font-era flex h-12 w-12 items-center justify-center rounded-2xl border border-[#43202A] bg-[#E11D48]/10 text-sm font-black text-[#FF6C89]">
                      {item.symbol}
                    </div>

                    <span className="text-lg text-[#E11D48] transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                      ↗
                    </span>
                  </div>

                  <p className="font-era-label mt-6 text-[10px] uppercase tracking-[0.2em] text-[#E11D48]">
                    {item.category}
                  </p>

                  <h3 className="font-era mt-3 text-xl font-black text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm font-medium leading-6 text-[#BDBDBD]">
                    {item.description}
                  </p>

                  {item.priority ? (
                    <span className="font-era-label mt-5 inline-flex rounded-full border border-[#5A2632] bg-[#E11D48]/10 px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-[#FF8CA4]">
                      Recommended starting point
                    </span>
                  ) : null}
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-[1.75rem] border border-[#5A2632] bg-linear-to-r from-[#210B12] via-[#130A0D] to-[#090909] px-6 py-6 shadow-lg">
          <p className="font-era-label text-[10px] uppercase tracking-[0.22em] text-[#FF7894]">
            Link-safety checklist
          </p>

          <h2 className="font-era mt-3 text-xl font-black text-white">
            Check before you click
          </h2>

          <ul className="mt-5 space-y-3">
            {safetyChecks.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm font-medium leading-6 text-[#D0D0D0]"
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#E11D48]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-[#3A2026] bg-linear-to-r from-[#16090D] via-[#100A0C] to-[#090909] px-6 py-5 shadow-lg">
          <p className="font-era text-sm font-black text-white">
            Bookmark the notice board 💜
          </p>

          <p className="mt-2 text-sm font-medium leading-6 text-[#C8C8C8]">
            When an announcement is urgent, exciting, or confusing, begin with
            the official BTS Weverse notice board before relying on reposted
            instructions.
          </p>
        </div>
      </section>
    </main>
  );
}