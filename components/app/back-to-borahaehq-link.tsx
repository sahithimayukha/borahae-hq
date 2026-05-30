import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function BackToBorahaeHQLink() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const destination = user ? "/dashboard" : "/";

  return (
    <Link
      href={destination}
      className="inline-flex text-sm font-black uppercase tracking-[0.12em] text-[#E11D48] transition hover:text-[#C5163D]"
    >
      ← Back To BorahaeHQ
    </Link>
  );
}