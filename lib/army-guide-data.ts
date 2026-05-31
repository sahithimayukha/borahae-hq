export type ArmyGuideSection = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  symbol: string;
  highlights: string[];
};

export const armyGuideSections: ArmyGuideSection[] = [
  {
    slug: "members",
    title: "BTS Member Guide",
    eyebrow: "Meet the seven",
    description:
      "A simple introduction to the BTS members, their roles, solo work, and creative identities.",
    symbol: "07",
    highlights: [
      "Member profiles",
      "Solo releases",
      "Creative highlights",
    ],
  },
  {
    slug: "discography",
    title: "Discography Guide",
    eyebrow: "Explore the music",
    description:
      "Discover BTS albums, eras, solo releases, and beginner-friendly listening paths.",
    symbol: "♪",
    highlights: [
      "Group albums",
      "Solo projects",
      "Listening paths",
    ],
  },
  {
    slug: "official-links",
    title: "Official Account Links",
    eyebrow: "Stay connected safely",
    description:
      "Find verified BTS, BIGHIT MUSIC, Weverse, and official platform links in one place.",
    symbol: "↗",
    highlights: [
      "Official accounts",
      "Trusted platforms",
      "Safe link directory",
    ],
  },
  {
    slug: "streaming",
    title: "Streaming Guide",
    eyebrow: "Support the music",
    description:
      "Learn the basics of streaming BTS releases clearly and responsibly.",
    symbol: "▶",
    highlights: [
      "Streaming basics",
      "Official platforms",
      "Helpful reminders",
    ],
  },
  {
    slug: "voting",
    title: "Voting Guide",
    eyebrow: "Participate with confidence",
    description:
      "Understand voting basics, safe practices, and how to find reliable instructions.",
    symbol: "✓",
    highlights: [
      "Voting basics",
      "Reliable sources",
      "Safety tips",
    ],
  },
  {
    slug: "concert-prep",
    title: "Concert Preparation Guide",
    eyebrow: "Prepare your concert era",
    description:
      "Use a practical checklist for ticketing, presales, livestreams, venue days, and scam awareness.",
    symbol: "✦",
    highlights: [
      "Ticketing checklist",
      "Concert-day prep",
      "Scam awareness",
    ],
  },
  {
    slug: "army-terms",
    title: "Common ARMY Terms",
    eyebrow: "Learn the language",
    description:
      "Explore beginner-friendly explanations for common BTS and ARMY vocabulary.",
    symbol: "Aa",
    highlights: [
      "Fandom terms",
      "BTS vocabulary",
      "Beginner-friendly notes",
    ],
  },
];