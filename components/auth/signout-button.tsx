"use client";

import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut({});
    // Redirect back to the local login page
    window.location.href = "/login";
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

