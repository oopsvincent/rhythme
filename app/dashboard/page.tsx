// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { span } from "framer-motion/client";

export default async function DashboardPage() {
  const supabase = await createClient(); // 👈 must await

  const {
    data: { user },
  } = await supabase.auth.getUser();

    console.log(user);
    

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-neutral-100 font-primary">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl">
        <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>

        <div className="mb-6 space-y-2 text-sm text-neutral-300">
            <p className="flex items-center justify-center">
                <img src={user.app_metadata.provider === "google" ? user.user_metadata.picture : user.user_metadata.avatar_url} className="rounded-full w-25" alt="picture" />
            </p>
            <p>
                <span className="font-medium">Name:</span> {user.user_metadata.full_name}
            </p>
          <p>
            <span className="font-medium">User ID:</span> {user.id}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
            <p>
                {user.app_metadata.provider === "github" && <span className="font-medium">Username: {user.user_metadata.user_name}</span>}
            </p>

        </div>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
