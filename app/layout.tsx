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
  title: "Rhythmé",
  description:
    "The Productivity Ecosystem – align your habits, focus, and goals in one unified experience.",
  keywords: [
    "productivity",
    "habits",
    "journaling",
    "focus",
    "goals",
    "ecosystem",
    "rhythmé",
  ],
  authors: [{ name: "Rhythmé" }],
  creator: "Amplecen",
  publisher: "Amplecen",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rhythme.amplecen.com"),
  openGraph: {
    title: "Rhythmé – The Productivity Ecosystem",
    description:
      "Align your life with habits, journaling, focus, and goals — all in one place.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://rhythme.amplecen.com",
    siteName: "Rhythmé",
    images: [
      {
        url: "/OG-Rhythme.jpg",
        width: 1200,
        height: 630,
        alt: "Rhythmé App Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rhythmé – The Productivity Ecosystem",
    description:
      "Align your life with habits, journaling, focus, and goals — all in one place.",
    images: ["/OG-Rhythme.jpg"],
    creator: "@oopsvincent",
  },
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
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
