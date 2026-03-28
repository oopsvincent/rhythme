// app/(auth)/layout.tsx  (SERVER COMPONENT)
// Auth gating (redirecting logged-in users) is handled entirely by middleware
// (lib/supabase/proxy.ts). No need to call getUser() here again.
import { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <main>{children}</main>;
}
