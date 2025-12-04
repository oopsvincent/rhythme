// app/(auth)/layout.tsx  (SERVER COMPONENT)
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If the user is already logged in, don't even render auth pages
  if (user) {
    redirect("/dashboard");
  }

  // Wrap content in a client component for animations
  return <main>{children}</main>;
}
