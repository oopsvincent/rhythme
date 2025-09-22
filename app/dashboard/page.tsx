import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import SignOutButton from "@/components/auth/signout-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  console.log(user);
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-neutral-100 font-primary">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl max-w-md w-full">
        <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>

        <div className="mb-6 space-y-2 text-sm text-neutral-300">
          <p className="flex items-center justify-center">
            <img
              src={
                user.app_metadata.provider === "google"
                  ? user.user_metadata.picture
                  : user.user_metadata.avatar_url
              }
              className="rounded-full w-20 h-20"
              alt="profile"
            />
          </p>
          <p>
            <span className="font-medium">Name:</span>{" "}
            {user.user_metadata.full_name}
          </p>
          <p>
            <span className="font-medium">User ID:</span> {user.id}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          {user.app_metadata.provider === "github" && (
            <p>
              <span className="font-medium">Username:</span>{" "}
              {user.user_metadata.user_name}
            </p>
          )}
        </div>

        {/* Client Component handles sign-out */}
        <SignOutButton />
      </div>
    </main>
  );
}
