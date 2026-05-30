import { BackToBorahaeHQLink } from "@/components/app/back-to-borahaehq-link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-5 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <BackToBorahaeHQLink />

        <section className="mt-8 rounded-4xl border border-white/10 bg-[#0B0B0B] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E11D48]">
            BorahaeHQ
          </p>

          <h1 className="font-era mt-4 text-5xl leading-[1.02] text-white sm:text-6xl">
            Privacy Policy
          </h1>

          <p className="mt-5 text-sm font-semibold leading-7 text-white/65">
            Last updated: May 2026
          </p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-white/75">
            <section>
              <h2 className="text-lg font-black uppercase tracking-[0.08em] text-white">
                1. About BorahaeHQ
              </h2>

              <p className="mt-3">
                BorahaeHQ is an unofficial fan-made platform designed to help
                ARMY organize calendar events, discover fan projects, save
                private visual-diary memories, and maintain a personal ARMY
                profile.
              </p>

              <p className="mt-3">
                BorahaeHQ is not affiliated with or endorsed by BIGHIT MUSIC,
                HYBE, or BTS.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black uppercase tracking-[0.08em] text-white">
                2. Information We Store
              </h2>

              <p className="mt-3">
                Depending on the features you use, BorahaeHQ may store your
                account email, profile details, calendar entries, fan-project
                submissions, private diary text, and optional images uploaded
                to your Memory Vault.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black uppercase tracking-[0.08em] text-white">
                3. Why We Use This Information
              </h2>

              <p className="mt-3">
                We use this information only to provide the app features you
                choose to use, such as signing in, saving your profile,
                organizing events, reviewing fan-project submissions, and
                displaying your private Memory Vault entries.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black uppercase tracking-[0.08em] text-white">
                4. Private Memory Vault Images
              </h2>

              <p className="mt-3">
                Images uploaded to your Memory Vault are stored privately.
                BorahaeHQ uses temporary secure links when displaying those
                images inside your signed-in account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black uppercase tracking-[0.08em] text-white">
                5. Third-Party Services
              </h2>

              <p className="mt-3">
                BorahaeHQ uses Supabase for authentication, database storage,
                and private image storage. The app is deployed through Vercel.
                These services may process technical information required to
                operate the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black uppercase tracking-[0.08em] text-white">
                6. Your Choices
              </h2>

              <p className="mt-3">
                You may update your profile, edit or delete your calendar
                entries, remove your private diary entries, and delete pending
                fan-project submissions from inside the app.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black uppercase tracking-[0.08em] text-white">
                7. Data Retention
              </h2>

              <p className="mt-3">
                Information is kept while your account and saved content remain
                active. You may remove supported content using the controls
                inside the app. For account-deletion requests, contact the
                address below.
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