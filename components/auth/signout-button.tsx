"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const router = useRouter();

  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut({});
    router.push("/login");
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
    >
      Sign out
    </button>
  );
}
