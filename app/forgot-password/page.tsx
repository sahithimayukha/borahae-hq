import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-5 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.20),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.10),transparent_30%)]" />

      <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(135deg,#fff_1px,transparent_1px)] bg-size-[18px_18px]" />

      <div className="relative z-10 flex w-full justify-center">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}