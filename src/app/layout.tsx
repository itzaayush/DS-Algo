import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "@xyflow/react/dist/style.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AppProviders } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "AlgoQuest — Learn DSA & Competitive Programming, visually",
    template: "%s · AlgoQuest",
  },
  description:
    "A visual, pattern-led way to go from zero to hero in data structures, algorithms, and competitive programming — with interactive algorithm traces, animated flowcharts, and a Three.js adventure.",
  applicationName: "AlgoQuest",
  keywords: [
    "DSA",
    "algorithms",
    "data structures",
    "competitive programming",
    "LeetCode",
    "Codeforces",
    "visual learning",
  ],
};

export const viewport: Viewport = {
  themeColor: "#080b12",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppProviders>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
