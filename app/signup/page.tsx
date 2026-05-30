import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.24),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.10),transparent_25%)]" />

      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(135deg,#fff_1px,transparent_1px)] [background-size:18px_18px]" />

      <section className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-[#2A2A2A] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        <div className="bg-[#0B0B0B] px-8 py-6">
          <Link
            href="/"
            className="font-era text-2xl tracking-[-0.01em] !text-white"
          >
            BorahaeHQ
          </Link>

          <p className="mt-3 inline-flex bg-[#E11D48] px-3 py-1 font-era text-xs tracking-[0.18em] !text-white">
            ARIRANG ERA HUB
          </p>
        </div>

        <div className="p-8">
          <Link
            href="/"
            className="text-xs font-black uppercase tracking-[0.1em] text-[#111111]"
          >
            ← Back to BorahaeHQ
          </Link>

          <div className="mt-8">
            <p className="font-era text-sm tracking-[0.16em] text-[#E11D48]">
              Join the hub
            </p>

            <h1 className="font-era mt-3 text-5xl leading-[0.92] text-[#111111]">
              Create your
              <span className="mt-2 block w-fit bg-[#E11D48] px-3 py-1 !text-white">
                ARMY HQ
              </span>
            </h1>

            <p className="mt-4 text-sm font-medium leading-6 text-[#4B4B4B]">
              Create your BorahaeHQ account for events, fan projects, memories,
              and your personal ARMY journey.
            </p>
          </div>

          <SignupForm />

          <p className="mt-6 text-center text-sm text-[#4B4B4B]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-black uppercase tracking-[0.04em] text-[#E11D48]"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-6 border-t border-[#2A2A2A] pt-5 text-xs leading-5 text-[#4B4B4B]">
            BorahaeHQ is an unofficial fan-made platform and is not affiliated
            with BTS, BIGHIT MUSIC, HYBE, Weverse, or any official artist
            entity.
          </p>
        </div>
      </section>
    </main>
  );
}