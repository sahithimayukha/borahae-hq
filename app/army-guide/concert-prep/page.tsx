import Link from "next/link";

const ticketJourney = [
  {
    number: "01",
    title: "Create your Weverse account",
    description:
      "Create a Weverse account and join the BTS community. Keep your login details safe because official notices, membership details, and some presale applications are handled through Weverse.",
    actionLabel: "Open Weverse account",
    actionHref: "https://account.weverse.io/",
  },
  {
    number: "02",
    title: "Choose the correct ARMY Membership",
    description:
      "Check the membership option suitable for your country or region before purchasing. Available options may include Global, US, and Japan membership. Use the same Weverse account throughout the process.",
    actionLabel: "View ARMY Membership",
    actionHref:
      "https://shop.weverse.io/shop/USD/artists/2/sales/41599",
  },
  {
    number: "03",
    title: "Wait for the official concert notice",
    description:
      "Do not rely on screenshots or reposted instructions alone. Open the official BTS Weverse notice for your tour, city, and region because application dates, ticket vendors, and eligibility rules can differ.",
    actionLabel: "Check BTS notices",
    actionHref: "https://weverse.io/bts/notice",
  },
  {
    number: "04",
    title: "Apply for the membership presale",
    description:
      "If a membership presale is offered, apply through the method listed in the official notice before the deadline. Membership alone does not replace the presale application when an application is required.",
  },
  {
    number: "05",
    title: "Prepare your ticket-vendor account",
    description:
      "Create or update your account on the official ticketing platform named in the notice. Some presales require your ticket-vendor email to match your Weverse ID email, so read the city-specific instructions carefully.",
  },
  {
    number: "06",
    title: "Buy tickets during the correct sale window",
    description:
      "Membership presale, raffle, registration, and general-sale formats can vary. Confirm the date, time zone, vendor, and rules for the exact concert you want to attend.",
  },
];

const membershipNotes = [
  {
    title: "Membership validity",
    description:
      "ARMY Membership can currently be purchased throughout the year and remains valid for 365 days from the purchase date.",
  },
  {
    title: "Choose by region",
    description:
      "Select the membership option appropriate for your country or region. Available options may include Global, US, and Japan membership.",
  },
  {
    title: "Keep one reliable account",
    description:
      "Use the same Weverse account consistently. When a notice requires matching ticket-vendor details, check your email address before the application window closes.",
  },
  {
    title: "Membership is not a ticket",
    description:
      "Membership may provide access to an announced presale, raffle, or application process. It does not automatically reserve or guarantee a concert ticket.",
  },
];

const ticketingChecklist = [
  "Read the official notice from beginning to end.",
  "Check the concert city, venue, sale date, and local time zone.",
  "Confirm whether a separate Weverse presale application is required.",
  "Check which membership type is eligible for your city.",
  "Create your official ticket-vendor account early.",
  "Verify your name, email address, phone number, and payment method.",
  "Keep your membership number available if the notice requests it.",
  "Use a stable internet connection on ticketing day.",
  "Avoid opening unnecessary tabs or refreshing without a reason.",
  "Never purchase through an unofficial link sent by a stranger.",
];

const concertDayChecklist = [
  "Ticket or mobile-ticket access",
  "Photo identification if required",
  "Membership screen if the official notice requests it",
  "Venue rules and prohibited-item check",
  "Portable charger and charging cable",
  "Water and weather-appropriate essentials",
  "Travel route and return journey",
  "Emergency contact details",
];

const liveStreamChecklist = [
  "Purchase only through the official platform announced in the notice.",
  "Check the livestream date and your local time zone.",
  "Log in before the stream begins.",
  "Test your device, browser, speakers, and internet connection.",
  "Review whether delayed viewing or replay access is included.",
];

const safetyNotes = [
  "Open ticket links from official BTS, BIGHIT MUSIC, Weverse, or the named ticket vendor.",
  "Do not share your Weverse password, membership number, presale code, or payment details publicly.",
  "Do not assume another city's rules apply to your concert.",
  "Be cautious with resale listings, direct messages, screenshots, and shortened links.",
  "Check the latest official notice again before ticketing day because instructions can be updated.",
];

export default function ConcertPreparationGuidePage() {
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
              Prepare your concert era
            </p>

            <h1 className="font-era-display mt-4 max-w-4xl text-4xl uppercase tracking-tight text-white sm:text-5xl">
              Concert Preparation Guide
            </h1>

            <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-[#CDCDCD] sm:text-base">
              From joining Weverse to preparing for ticketing day, use this
              guide as a calm starting point. Always confirm the latest rules
              through the official notice for your exact concert and city.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="https://weverse.io/bts/notice"
                target="_blank"
                rel="noreferrer"
                className="font-era-label inline-flex rounded-full border border-[#73253A] bg-[#E11D48]/15 px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#FF8CA4] transition hover:border-[#E11D48] hover:bg-[#E11D48]/25 hover:text-white"
              >
                Check official BTS notices ↗
              </a>

              <a
                href="https://shop.weverse.io/shop/USD/artists/2/sales/41599"
                target="_blank"
                rel="noreferrer"
                className="font-era-label inline-flex rounded-full border border-[#3A3A3A] bg-[#111111] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#D8D8D8] transition hover:border-[#777777] hover:text-white"
              >
                View ARMY Membership ↗
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <p className="font-era-label text-[10px] uppercase tracking-[0.25em] text-[#E11D48]">
            Ticketing path
          </p>

          <h2 className="font-era mt-3 text-2xl font-black text-white">
            How to prepare for BTS concert tickets
          </h2>

          <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[#B8B8B8]">
            Concert ticketing formats can differ by region. Follow this route,
            then read the official notice for the final city-specific steps.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {ticketJourney.map((step) => (
              <article
                key={step.number}
                className="relative overflow-hidden rounded-[1.75rem] border border-[#2A2A2A] bg-linear-to-br from-[#131313] via-[#0B0B0B] to-[#070707] p-6 shadow-lg"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.12),transparent_42%)]" />

                <div className="relative">
                  <div className="font-era flex h-11 w-11 items-center justify-center rounded-2xl border border-[#43202A] bg-[#E11D48]/10 text-sm font-black text-[#FF6C89]">
                    {step.number}
                  </div>

                  <h3 className="font-era mt-5 text-lg font-black text-white">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm font-medium leading-6 text-[#BDBDBD]">
                    {step.description}
                  </p>

                  {step.actionHref && step.actionLabel ? (
                    <a
                      href={step.actionHref}
                      target="_blank"
                      rel="noreferrer"
                      className="font-era-label mt-5 inline-flex text-[10px] uppercase tracking-[0.18em] text-[#FF7894] transition hover:text-white"
                    >
                      {step.actionLabel} ↗
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <p className="font-era-label text-[10px] uppercase tracking-[0.25em] text-[#E11D48]">
            Before purchasing
          </p>

          <h2 className="font-era mt-3 text-2xl font-black text-white">
            ARMY Membership basics
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {membershipNotes.map((note) => (
              <article
                key={note.title}
                className="rounded-[1.75rem] border border-[#2A2A2A] bg-linear-to-br from-[#131313] via-[#0B0B0B] to-[#070707] p-6 shadow-lg"
              >
                <h3 className="font-era text-lg font-black text-white">
                  {note.title}
                </h3>

                <p className="mt-3 text-sm font-medium leading-6 text-[#BDBDBD]">
                  {note.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-2">
          <ChecklistCard
            eyebrow="Before the queue opens"
            title="Ticketing-day checklist"
            items={ticketingChecklist}
          />

          <ChecklistCard
            eyebrow="At the venue"
            title="Concert-day checklist"
            items={concertDayChecklist}
          />
        </div>

        <div className="mt-6">
          <ChecklistCard
            eyebrow="Watching from home"
            title="Livestream checklist"
            items={liveStreamChecklist}
          />
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-[#5A2632] bg-linear-to-r from-[#210B12] via-[#130A0D] to-[#090909] px-6 py-6 shadow-lg">
          <p className="font-era-label text-[10px] uppercase tracking-[0.22em] text-[#FF7894]">
            Scam-awareness notes
          </p>

          <h2 className="font-era mt-3 text-xl font-black text-white">
            Protect your ticketing journey
          </h2>

          <ul className="mt-5 space-y-3">
            {safetyNotes.map((note) => (
              <li
                key={note}
                className="flex gap-3 text-sm font-medium leading-6 text-[#D0D0D0]"
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#E11D48]" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-[#3A2026] bg-linear-to-r from-[#16090D] via-[#100A0C] to-[#090909] px-6 py-5 shadow-lg">
          <p className="font-era text-sm font-black text-white">
            Always return to the official notice 💜
          </p>

          <p className="mt-2 text-sm font-medium leading-6 text-[#C8C8C8]">
            BorahaeHQ helps you prepare, but your concert-specific Weverse notice
            is the final source for eligibility, dates, vendors, time zones,
            presale applications, and venue rules.
          </p>
        </div>
      </section>
    </main>
  );
}

type ChecklistCardProps = {
  eyebrow: string;
  title: string;
  items: string[];
};

function ChecklistCard({ eyebrow, title, items }: ChecklistCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-[#2A2A2A] bg-linear-to-br from-[#131313] via-[#0B0B0B] to-[#070707] p-6 shadow-lg">
      <p className="font-era-label text-[10px] uppercase tracking-[0.22em] text-[#E11D48]">
        {eyebrow}
      </p>

      <h2 className="font-era mt-3 text-xl font-black text-white">
        {title}
      </h2>

      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm font-medium leading-6 text-[#C7C7C7]"
          >
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#E11D48]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}