import { Metadata } from "next";
import { BetaPage } from "@/components/beta";

export const metadata: Metadata = {
  title: "Join the Beta | Rhythmé",
  description: "Be the first to experience Rhythmé - your personal direction system. One goal, one step at a time. Get early access to the future of personal productivity.",
  keywords: [
    "rhythmé",
    "beta",
    "productivity",
    "goals",
    "habits",
    "focus",
    "direction",
    "personal growth",
    "early access"
  ],
  authors: [{ name: "Rhythmé Team", url: "https://rhythme-gamma.vercel.app" }],
  creator: "Rhythmé",
  publisher: "Rhythmé",
  openGraph: {
    title: "Join the Rhythmé Beta",
    description: "Finally know where to start. Be the first to experience the future of personal productivity. One goal, one step at a time.",
    url: "https://rhythme-gamma.vercel.app/beta",
    siteName: "Rhythmé",
    images: [
      {
        url: "/beta-og.png",
        width: 1200,
        height: 630,
        alt: "Join the Rhythmé Beta - Personal Direction System",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the Rhythmé Beta",
    description: "Finally know where to start. Be the first to experience the future of personal productivity.",
    images: ["/beta-og.png"],
    creator: "@oopsvincent",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function BetaRoute() {
  return <BetaPage />;
}
