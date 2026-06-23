import type { Metadata } from "next";
import { getUser } from "@/app/actions/auth";
import { isCurrentUserPremium } from "@/app/actions/subscription";
import { ClaimPremiumClient } from "./claim-client";

export const metadata: Metadata = {
  title: "Claim 1-Month Free Premium | Rhythmé",
  description:
    "Claim one month of Rhythmé Premium for free. Try our advanced features like AI/ML analytics, unlimited habits, mood correlation, and focus presets to optimize your routines.",
  alternates: { canonical: "/claim-premium" },
  openGraph: {
    title: "Claim 1-Month Free Premium | Rhythmé",
    description:
      "Unlock 30 days of Rhythmé Premium. Try our AI/ML predictive habit scoring, unlimited enclaves, and deep wellness insights for free.",
    url: "/claim-premium",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claim 1-Month Free Premium | Rhythmé",
    description:
      "Unlock 30 days of Rhythmé Premium. Try our AI/ML predictive habit scoring, unlimited enclaves, and deep wellness insights for free.",
  },
};

export default async function ClaimPremiumPage() {
  const user = await getUser();
  const isPremium = user ? await isCurrentUserPremium() : false;

  return (
    <div className="mt-20">
      <ClaimPremiumClient user={user} initialIsPremium={isPremium} />
    </div>
  );
}
