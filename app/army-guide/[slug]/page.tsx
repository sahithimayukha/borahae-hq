import Link from "next/link";
import { notFound } from "next/navigation";

type GuideCard = {
  title: string;
  description: string;
  tags?: string[];
};

type ResourceLink = {
  label: string;
  href: string;
};

type GuidePage = {
  eyebrow: string;
  title: string;
  introduction: string;
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  cards: GuideCard[];
  resources?: ResourceLink[];
  safetyEyebrow: string;
  safetyTitle: string;
  safetyItems: string[];
  footerTitle: string;
  footerText: string;
};

const guidePages: Record<string, GuidePage> = {
  streaming: {
    eyebrow: "Support the music",
    title: "Streaming Guide",
    introduction:
      "Enjoy BTS music through official platforms while keeping the experience natural, responsible, and easy to understand. Streaming should feel like listening, not like completing a stressful assignment.",
    sectionEyebrow: "A calm starting point",
    sectionTitle: "Streaming basics",
    sectionDescription:
      "Use official platforms, explore the music at your own pace, and check official notices whenever a release has special viewing or livestream information.",
    cards: [
      {
        title: "Choose an official platform",
        description:
          "Listen through a legitimate music platform such as Spotify or Apple Music. For videos and performances, begin with official BTS channels.",
        tags: ["Official platforms", "Music", "Video"],
      },
      {
        title: "Listen naturally",
        description:
          "Choose songs and albums you genuinely want to hear. Let the music play normally and enjoy different eras without turning listening into a rigid routine.",
        tags: ["Natural listening", "Enjoy the music", "Explore eras"],
      },
      {
        title: "Use playlists thoughtfully",
        description:
          "Mix BTS songs with music you genuinely enjoy. Avoid repetitive behavior that feels automated or unnatural.",
        tags: ["Playlists", "Variety", "Responsible support"],
      },
      {
        title: "Watch official videos",
        description:
          "For music videos, performances, and behind-the-scenes content, use official BTS channels such as BANGTANTV.",
        tags: ["BANGTANTV", "Music videos", "Performances"],
      },
      {
        title: "Check release notices",
        description:
          "For comeback schedules, premieres, livestreams, or special events, return to official BTS and Weverse notices for the latest instructions.",
        tags: ["Comebacks", "Livestreams", "Official notices"],
      },
      {
        title: "Keep it enjoyable",
        description:
          "There is no need to pressure yourself. Supporting BTS can include listening, sharing a song, exploring lyrics, or simply enjoying an album quietly.",
        tags: ["No pressure", "Personal pace", "ARMY journey"],
      },
    ],
    resources: [
      {
        label: "Official BTS Discography",
        href: "https://ibighit.com/en/bts/discography/",
      },
      {
        label: "BTS on Spotify",
        href: "https://open.spotify.com/artist/3Nrfpe0tUJi4K4DXYWgMUX",
      },
      {
        label: "BTS on Apple Music",
        href: "https://music.apple.com/us/artist/bts/883131348",
      },
      {
        label: "BANGTANTV on YouTube",
        href: "https://www.youtube.com/channel/UCLkAepWjdylmXSltofFvsYQ",
      },
      {
        label: "BTS Weverse LIVE",
        href: "https://weverse.io/bts/live",
      },
    ],
    safetyEyebrow: "Helpful reminders",
    safetyTitle: "Stream responsibly",
    safetyItems: [
      "Use official music and video platforms.",
      "Avoid automated tools, bots, or suspicious third-party services.",
      "Do not share account passwords or payment details.",
      "Check official notices for livestream dates, ticket access, and replay information.",
      "Enjoy the music at a pace that feels comfortable for you.",
    ],
    footerTitle: "Let the music lead the way 💜",
    footerText:
      "Begin with one song, one album, or one performance. There is no single correct route through BTS discography.",
  },

  voting: {
    eyebrow: "Participate with confidence",
    title: "Voting Guide",
    introduction:
      "Voting events can differ by award show, region, platform, and season. Use this page as a safety-first checklist, then confirm the current rules through the official organizer and trusted BTS notices.",
    sectionEyebrow: "Before casting a vote",
    sectionTitle: "Voting basics",
    sectionDescription:
      "Avoid relying on old screenshots or forwarded instructions. Voting periods and platform rules can change, so confirm the current event before taking action.",
    cards: [
      {
        title: "Confirm the award or event",
        description:
          "Check the full name of the award show, poll, or event. Make sure the voting period is currently active and relevant to BTS.",
        tags: ["Award name", "Active period", "Eligibility"],
      },
      {
        title: "Find the official organizer",
        description:
          "Open the official website, app, or account for the award organizer. Do not rely only on screenshots or reposted instructions.",
        tags: ["Official organizer", "Verified source", "Safe links"],
      },
      {
        title: "Check the deadline and timezone",
        description:
          "Confirm the closing date and timezone before voting. A deadline may occur earlier or later than expected in your local time.",
        tags: ["Deadline", "Timezone", "Plan ahead"],
      },
      {
        title: "Read the voting rules",
        description:
          "Check whether voting requires an account, an app, a daily limit, a specific region, or another eligibility condition.",
        tags: ["Rules", "Daily limits", "Account setup"],
      },
      {
        title: "Protect your accounts",
        description:
          "Never share login details, verification codes, passwords, or payment information with strangers offering to vote on your behalf.",
        tags: ["Privacy", "Account safety", "Avoid scams"],
      },
      {
        title: "Keep voting healthy",
        description:
          "Participate only when you feel comfortable. Supporting BTS should not require stress, financial pressure, or unsafe behavior.",
        tags: ["No pressure", "Healthy support", "Personal choice"],
      },
    ],
    resources: [
      {
        label: "Check BTS Weverse Notices",
        href: "https://weverse.io/bts/notice",
      },
      {
        label: "Visit BTS Official on X",
        href: "https://x.com/bts_bighit",
      },
    ],
    safetyEyebrow: "Safety checklist",
    safetyTitle: "Pause before following a voting link",
    safetyItems: [
      "Check the account handle and website carefully.",
      "Confirm the event through the official organizer.",
      "Avoid shortened or suspicious links sent through direct messages.",
      "Do not share passwords, verification codes, or payment details.",
      "Do not assume instructions from an older award season still apply.",
      "Leave any process that feels unsafe, unclear, or financially pressuring.",
    ],
    footerTitle: "Vote with care 💜",
    footerText:
      "BorahaeHQ provides a preparation guide, not live voting instructions. For every active event, confirm the latest rules through the official organizer.",
  },

  "army-terms": {
    eyebrow: "Learn the language",
    title: "Common ARMY Terms",
    introduction:
      "A beginner-friendly glossary for words you may encounter while exploring BTS music, performances, fandom conversations, and official announcements.",
    sectionEyebrow: "A small ARMY dictionary",
    sectionTitle: "Useful terms to know",
    sectionDescription:
      "You do not need to memorize everything at once. Return whenever a new word appears in a post, performance, or conversation.",
    cards: [
      {
        title: "ARMY",
        description:
          "The name of BTS fandom. It is commonly written in uppercase letters.",
      },
      {
        title: "OT7",
        description:
          "A phrase used when referring to or supporting all seven BTS members together.",
      },
      {
        title: "Bias",
        description:
          "A member you feel especially drawn to. Many fans also use the phrase bias wrecker for another member who frequently captures their attention.",
      },
      {
        title: "Comeback",
        description:
          "A new music-release period that may include teasers, performances, promotions, interviews, and other activities.",
      },
      {
        title: "Era",
        description:
          "A distinct period connected to an album, song, visual concept, tour, or chapter of BTS history.",
      },
      {
        title: "Fanchant",
        description:
          "A coordinated audience chant used during certain songs or live performances.",
      },
      {
        title: "ARMY Bomb",
        description:
          "The official BTS light stick used by fans during concerts and selected events.",
      },
      {
        title: "Weverse",
        description:
          "A platform used for artist communities, posts, media, livestreams, and official BTS notices.",
      },
      {
        title: "Presale",
        description:
          "An earlier ticket-sale period that may be available to eligible users before a general sale.",
      },
      {
        title: "General sale",
        description:
          "A ticket-sale period that opens more broadly after any announced presale or registration stage.",
      },
      {
        title: "Maknae",
        description:
          "A Korean term commonly used for the youngest member of a group.",
      },
      {
        title: "Hyung line",
        description:
          "A casual phrase often used when referring to the older members of the group.",
      },
      {
        title: "Rap line",
        description:
          "A phrase commonly used when referring to RM, SUGA, and j-hope as the group's rap-focused members.",
      },
      {
        title: "Vocal line",
        description:
          "A phrase commonly used when referring to Jin, Jimin, V, and Jung Kook as the group's vocal-focused members.",
      },
      {
        title: "Selca",
        description:
          "A term commonly used for a selfie or self-taken photograph.",
      },
      {
        title: "Purple you",
        description:
          "A phrase associated with affection, trust, and lasting support within BTS and ARMY conversations.",
      },
      {
        title: "FESTA",
        description:
          "An anniversary period connected to BTS debut celebrations and special content or events.",
      },
      {
        title: "Livestream",
        description:
          "A live online broadcast. Always check the official notice for access, timing, and replay details.",
      },
    ],
    safetyEyebrow: "A gentle note",
    safetyTitle: "There is no entrance exam",
    safetyItems: [
      "You do not need to memorize every term immediately.",
      "It is normal to discover meanings gradually.",
      "Different fans may use casual phrases slightly differently.",
      "For ticketing, membership, and event rules, rely on official notices rather than informal definitions.",
    ],
    footerTitle: "Learn at your own pace 💜",
    footerText:
      "Your ARMY journey can unfold slowly. One song, one word, and one story at a time is enough.",
  },
};

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = guidePages[slug];

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <Link
          href="/army-guide"
          className="font-era-label inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#FF6C89] transition hover:text-white"
        >
          ← Back to ARMY Guide Hub
        </Link>

        <div className="relative mt-6 overflow-hidden rounded-4xlrder border-[#2A2A2A] bg-linear-to-br from-[#171717] via-[#0B0B0B] to-[#050505] px-6 py-8 shadow-2xl sm:px-8 sm:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.3),transparent_38%)]" />

          <div className="relative">
            <p className="font-era-label text-[10px] uppercase tracking-[0.28em] text-[#E11D48] sm:text-xs">
              {page.eyebrow}
            </p>

            <h1 className="font-era-display mt-4 max-w-4xl text-4xl uppercase tracking-tight text-white sm:text-5xl">
              {page.title}
            </h1>

            <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-[#CDCDCD] sm:text-base">
              {page.introduction}
            </p>

            {page.resources ? (
              <div className="mt-7 flex flex-wrap gap-3">
                {page.resources.map((resource) => (
                  <a
                    key={resource.label}
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-era-label inline-flex rounded-full border border-[#73253A] bg-[#E11D48]/15 px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#FF8CA4] transition hover:border-[#E11D48] hover:bg-[#E11D48]/25 hover:text-white"
                  >
                    {resource.label} ↗
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-10">
          <p className="font-era-label text-[10px] uppercase tracking-[0.25em] text-[#E11D48]">
            {page.sectionEyebrow}
          </p>

          <h2 className="font-era mt-3 text-2xl font-black text-white">
            {page.sectionTitle}
          </h2>

          <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[#B8B8B8]">
            {page.sectionDescription}
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {page.cards.map((card) => (
              <article
                key={card.title}
                className="relative overflow-hidden rounded-[1.75rem] border border-[#2A2A2A] bg-linear-to-br from-[#131313] via-[#0B0B0B] to-[#070707] p-6 shadow-lg"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.12),transparent_42%)]" />

                <div className="relative">
                  <h3 className="font-era text-lg font-black text-white">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-sm font-medium leading-6 text-[#BDBDBD]">
                    {card.description}
                  </p>

                  {card.tags ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-era-label rounded-full border border-[#333333] bg-[#111111] px-3 py-1 text-[10px] tracking-wide text-[#D7D7D7]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-[1.75rem] border border-[#5A2632] bg-linear-to-r from-[#210B12] via-[#130A0D] to-[#090909] px-6 py-6 shadow-lg">
          <p className="font-era-label text-[10px] uppercase tracking-[0.22em] text-[#FF7894]">
            {page.safetyEyebrow}
          </p>

          <h2 className="font-era mt-3 text-xl font-black text-white">
            {page.safetyTitle}
          </h2>

          <ul className="mt-5 space-y-3">
            {page.safetyItems.map((item) => (
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
            {page.footerTitle}
          </p>

          <p className="mt-2 text-sm font-medium leading-6 text-[#C8C8C8]">
            {page.footerText}
          </p>
        </div>
      </section>
    </main>
  );
}