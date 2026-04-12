import PricingComponent from "@/components/landing/pricing";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Rhythmé. Start free and upgrade to Premium for unlimited enclaves, advanced analytics, and priority support.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing | Rhythmé",
    description:
      "Start free, upgrade when you're ready. Explore Rhythmé's plans and find the one that fits your productivity journey.",
    url: "/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | Rhythmé",
    description:
      "Start free, upgrade when you're ready. Explore Rhythmé's plans and find the one that fits your productivity journey.",
  },
};

const page = () => {
  return (
    <div className="mt-30">
      <PricingComponent />
    </div>
  );
};

export default page;
