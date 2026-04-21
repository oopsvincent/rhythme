"use client";

import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut({});
    // Full page redirect so the cleared cookie is visible to the new domain
    window.location.href =
      process.env.NEXT_PUBLIC_ACCOUNTS_URL || "https://accounts.amplecen.com";
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

