import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/theme-button";

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

// const playfairDisplay = Playfair_Display({
//   variable: "--font-playfair-display",
//   subsets: ["latin"],
// });

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
  authors: [{ name: "Rhythmé Team", url: "https://yourdomain.com" }],
  creator: "Rhythmé",
  publisher: "Rhythmé",
  metadataBase: new URL("https://rhythme-gamma.vercel.app"),
  openGraph: {
    title: "Rhythmé – The Productivity Ecosystem",
    description:
      "Align your life with habits, journaling, focus, and goals — all in one place.",
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
    description:
      "Align your life with habits, journaling, focus, and goals — all in one place.",
    images: ["/preview.png"],
    creator: "@oopsvincent",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  //   themeColor: "#0f172a",

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${clashDisplay.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
                    <div className="absolute top-2 right-2 z-[100]">
            <ModeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}