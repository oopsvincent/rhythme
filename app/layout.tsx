import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rhythmé",
  description: "The Productivity Ecosystem – align your habits, focus, and goals in one unified experience.",
  keywords: ["productivity", "habits", "journaling", "focus", "goals", "ecosystem", "rhythmé"],
  authors: [{ name: "Rhythmé Team", url: "https://yourdomain.com" }],
  creator: "Rhythmé",
  publisher: "Rhythmé",
  metadataBase: new URL("https://rhythme-gamma.vercel.app"),
  openGraph: {
    title: "Rhythmé – The Productivity Ecosystem",
    description: "Align your life with habits, journaling, focus, and goals — all in one place.",
    url: "https://yourdomain.com",
    siteName: "Rhythmé",
    images: [
      {
        url: "/preview.png",
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
    description: "Align your life with habits, journaling, focus, and goals — all in one place.",
    images: ["/preview.png"],
    creator: "@oopsvincent",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#0f172a",
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}