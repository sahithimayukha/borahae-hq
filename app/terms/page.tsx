import { BackToBorahaeHQLink } from "@/components/app/back-to-borahaehq-link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-5 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <BackToBorahaeHQLink />

        <section className="mt-8 rounded-4xl border border-white/10 bg-[#0B0B0B] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E11D48]">
            BorahaeHQ
          </p>

          <h1 className="font-era mt-4 text-5xl leading-[1.02] text-white sm:text-6xl">
            Terms Of Use
          </h1>

          <p className="mt-5 text-sm font-semibold leading-7 text-white/65">
            Last updated: May 2026
          </p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-white/75">
            <section>
              <h2 className="text-lg font-black uppercase tracking-[0.08em] text-white">
                1. Unofficial Fan-Made Platform
              </h2>

              <p className="mt-3">
                BorahaeHQ is an unofficial fan-made platform. It is not
                affiliated with or endorsed by BIGHIT MUSIC, HYBE, or BTS. All
                trademarks, names, and media belong to their respective owners.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black uppercase tracking-[0.08em] text-white">
                2. Appropriate Use
              </h2>

              <p className="mt-3">
                Use BorahaeHQ respectfully. Do not submit unlawful, harmful,
                misleading, abusive, or spam content. Do not attempt to access
                another user&apos;s private Memory Vault or account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black uppercase tracking-[0.08em] text-white">
                3. Fan-Project Submissions
              </h2>

              <p className="mt-3">
                Submitted fan projects may be reviewed before appearing in the
                public project feed. BorahaeHQ may approve, reject, or remove a
                submission when details are unclear, outdated, misleading, or
                inappropriate.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black uppercase tracking-[0.08em] text-white">
                4. Your Content
              </h2>

              <p className="mt-3">
                You are responsible for the text, links, and images you upload.
                Only upload content that you are allowed to use. Private diary
                content should not include sensitive information that you do
                not want stored online.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black uppercase tracking-[0.08em] text-white">
                5. Availability
              </h2>

              <p className="mt-3">
                BorahaeHQ is provided as a fan-made project. Features may be
                updated, changed, paused, or removed as the platform evolves.
              </p>
            </section>

            <section>
  <h2 className="text-lg font-black uppercase tracking-[0.08em] text-white">
    8. Privacy Requests
  </h2>

  <p className="mt-3">
    A private account-support request form will be available inside BorahaeHQ
    for privacy questions and account-deletion requests. Personal contact
    details are not displayed publicly.
  </p>
</section>
          </div>
        </section>
      </div>
    </main>
  );
}