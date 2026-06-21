import type { Metadata } from "next";
import {
  Space_Grotesk,
  Playfair_Display,
  JetBrains_Mono,
  Inter,
} from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";
import { UIProvider } from "@/components/providers/UIProvider";

// Perf #5: next/font/google — self-hosted, preloaded, subset, no render-blocking @import
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neeraj Saini — Founder OS",
  description:
    "Building products, systems, and leverage. CS Student & Founder from Bengaluru building CollabKaro, Cognita, and InTrip.",
  openGraph: {
    title: "Neeraj Saini — Founder OS",
    description: "A founder in progress. Building in public.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neeraj Saini — Founder OS",
    description: "Building products, systems, and leverage.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <body style={{ background: "#000", margin: 0, padding: 0, overflowX: "hidden" }}>
        <UIProvider>
          <LenisProvider>{children}</LenisProvider>
        </UIProvider>
      </body>
    </html>
  );
}
