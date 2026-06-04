import RhythmeLanding from "@/components/landing/landing-page";
import { getUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <RhythmeLanding user={user} />;
}

