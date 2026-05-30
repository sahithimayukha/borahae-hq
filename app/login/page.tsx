import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { PublicFooter } from "@/components/app/public-footer";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] px-6 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.24),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.10),transparent_25%)]" />

      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(135deg,#fff_1px,transparent_1px)] bg-size-[18px_18px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-xl flex-col justify-center gap-6">
        <section className="w-full overflow-hidden rounded-4xl border border-[#2A2A2A] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
          <div className="bg-[#0B0B0B] px-8 py-6">
            <Link
              href="/"
              className="font-era text-2xl tracking-[-0.01em] text-white!"
            >
              BorahaeHQ
            </Link>

            <p className="mt-3 inline-flex bg-[#E11D48] px-3 py-1 font-era text-xs tracking-[0.18em] text-white!">
              ARMY HUB
            </p>
          </div>

          <div className="p-8">
            <Link
              href="/"
              className="text-xs font-black uppercase tracking-widest text-[#111111]"
            >
              ← Back To BorahaeHQ
            </Link>

            <div className="mt-8">
              <p className="font-era text-sm tracking-[0.16em] text-[#E11D48]">
                Welcome Back
              </p>

              <h1 className="font-era mt-3 text-5xl leading-[0.92] text-[#111111]">
                Sign In To
                <span className="mt-2 block w-fit bg-[#E11D48] px-3 py-1 text-white!">
                  Your Hub
                </span>
              </h1>

              <p className="mt-4 text-sm font-medium leading-6 text-[#4B4B4B]">
                Continue organizing your ARMY calendar, fan projects, memories,
                and personal profile.
              </p>
            </div>

            <LoginForm />

            <p className="mt-6 text-center text-sm text-[#4B4B4B]">
              New to BorahaeHQ?{" "}
              <Link
                href="/signup"
                className="font-black uppercase tracking-[0.04em] text-[#E11D48]"
              >
                Create An Account
              </Link>
            </p>
          </div>
        </section>

        <PublicFooter />
      </div>
    </main>
  );
}