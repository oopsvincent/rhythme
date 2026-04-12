import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import './loading.css';
import './styles/not-found.css'
import './styles/pwa-install.css'
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { ColorThemeProvider } from "@/contexts/theme-context";
import { QueryProvider } from "@/components/query-provider";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { OfflineIndicator } from "@/components/offline-indicator";
import { AppleSplashScreens } from "@/components/apple-splash-screens";
import { PwaRegistry } from "@/components/pwa-registry";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://rhythme.amplecen.com";

/**
 * JSON-LD structured data for rich search results.
 * Provides WebApplication + Organization schema to Google.
 */
function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${BASE_URL}/#app`,
        name: "Rhythmé",
        url: BASE_URL,
        description:
          "Premium productivity OS — align tasks, habits, journaling, focus, and goals in one experience.",
        applicationCategory: "ProductivityApplication",
        operatingSystem: "Web, Android, iOS",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          description: "Free tier with premium upgrade available",
        },
        creator: {
          "@type": "Organization",
          "@id": `${BASE_URL}/#org`,
        },
        screenshot: `${BASE_URL}/OG-Rhythme.jpg`,
        featureList:
          "Habit Tracking, Focus Timer, Journaling, Goal Planning, Mood Awareness, Weekly Reviews",
        browserRequirements: "Requires JavaScript. Requires a modern browser.",
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#org`,
        name: "Amplecen",
        url: BASE_URL,
        logo: `${BASE_URL}/icons/icon-512x512.png`,
        sameAs: [
          "https://twitter.com/oopsvincent",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          email: "rhythmeauth@gmail.com",
          contactType: "customer support",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "Rhythmé",
        publisher: { "@id": `${BASE_URL}/#org` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${BASE_URL}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}


const clashDisplay = localFont({
  src: [
    {
      path: "../public/fonts/ClashDisplay-Variable.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Variable.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Variable.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Variable.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Variable.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Variable.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Variable.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Variable.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Variable.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Variable.ttf",
      weight: "100",
      style: "normal",
    },
  ],
  variable: "--font-clash-display",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
// });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // ── Core ────────────────────────────────────────────────────
  title: {
    default: "Rhythmé – The Productivity Ecosystem",
    template: "%s | Rhythmé",
  },
  description:
    "The premium productivity OS — align your tasks, habits, journaling, focus sessions, and goals in one unified experience. Start free.",
  keywords: [
    "productivity app",
    "habit tracker",
    "journaling app",
    "focus timer",
    "goal planner",
    "weekly review",
    "mood tracker",
    "personal productivity",
    "productivity OS",
    "rhythmé",
    "amplecen",
    "task manager",
    "pomodoro timer",
    "self improvement",
  ],
  authors: [
    { name: "Amplecen", url: BASE_URL },
  ],
  creator: "Amplecen",
  publisher: "Amplecen",
  applicationName: "Rhythmé",
  category: "Productivity",

  // ── URL resolution ─────────────────────────────────────────
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },

  // ── Crawling directives ────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Open Graph ─────────────────────────────────────────────
  openGraph: {
    title: "Rhythmé – The Productivity Ecosystem",
    description:
      "Align your life with habits, journaling, focus, and goals — all in one premium experience.",
    url: BASE_URL,
    siteName: "Rhythmé",
    images: [
      {
        url: "/OG-Rhythme.jpg",
        width: 1200,
        height: 630,
        alt: "Rhythmé – Premium Productivity OS",
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // ── Twitter / X ────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Rhythmé – The Productivity Ecosystem",
    description:
      "Align your life with habits, journaling, focus, and goals — all in one premium experience.",
    images: [
      {
        url: "/OG-Rhythme.jpg",
        width: 1200,
        height: 630,
        alt: "Rhythmé App Preview",
      },
    ],
    creator: "@oopsvincent",
    site: "@oopsvincent",
  },

  // ── Icons ──────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // ── Search engine verification (replace with real tokens) ─
  // verification: {
  //   google: "YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN",
  //   yandex: "YOUR_YANDEX_TOKEN",
  //   other: {
  //     "msvalidate.01": "YOUR_BING_WEBMASTER_TOKEN",
  //   },
  // },

  // ── Misc ───────────────────────────────────────────────────
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <AppleSplashScreens />
        <JsonLd />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${playfairDisplay.variable} ${inter.variable} ${clashDisplay.variable} antialiased selection:bg-accent/50 selection:text-accent-foreground`}
      >
        <PwaRegistry />
        <QueryProvider>
          <ColorThemeProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <OfflineIndicator />
              <Toaster richColors position="bottom-right" />
              <PwaInstallPrompt />
              <div className="absolute top-2 right-2 z-[100]">
                {/* <ModeToggle /> */}
              </div>
            </ThemeProvider>
          </ColorThemeProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
