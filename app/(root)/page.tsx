import RhythmeLanding from "@/components/landing/landing-page";
import { getUser } from "@/app/actions/auth";
import { RedirectToDashboard } from "@/components/auth/redirect-to-dashboard";

export default async function Home() {
  const user = await getUser();

  if (user) {
    return <RedirectToDashboard />;
  }

  return <RhythmeLanding user={user} />;
}

