import type { Metadata, Viewport } from "next";
import {
  Space_Grotesk,
  Playfair_Display,
  JetBrains_Mono,
  Inter,
} from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";
import { UIProvider } from "@/components/providers/UIProvider";

// ── Fonts: self-hosted, preloaded, subsetted via next/font ──────────────────
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

// ── SEO Metadata ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://neerajsaini.dev"),
  title: {
    default: "Neeraj Saini — Founder & Builder",
    template: "%s | Neeraj Saini",
  },
  description:
    "CS Student & Founder from Bengaluru building CollabKaro, Cortex, and Gigzy. Focused on product systems, marketplace design, and backend engineering.",
  keywords: [
    "Neeraj Saini",
    "Founder",
    "CollabKaro",
    "Bengaluru",
    "CS Student",
    "Builder",
    "Product",
    "Backend Engineer",
  ],
  authors: [{ name: "Neeraj Saini", url: "https://neerajsaini.dev" }],
  creator: "Neeraj Saini",
  openGraph: {
    title: "Neeraj Saini — Founder & Builder",
    description:
      "Building CollabKaro, Cortex, and Gigzy. Founder. CS Student. Based in Bengaluru.",
    url: "https://neerajsaini.dev",
    siteName: "Neeraj Saini",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neeraj Saini — Founder & Builder",
    description:
      "Building products, systems, and leverage from Bengaluru.",
    creator: "@neerajsaini",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://neerajsaini.dev",
  },
};

// ── Viewport ─────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ── JSON-LD Structured Data ──────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Neeraj Saini",
  url: "https://neerajsaini.dev",
  jobTitle: "Founder & Builder",
  description:
    "CS Student & Founder from Bengaluru building creator-economy and edtech platforms.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressCountry: "IN",
  },
  sameAs: [
    "https://github.com/62fpsgaming-hue",
    "https://www.linkedin.com/in/neeraj-saini-464318232/",
  ],
  knowsAbout: [
    "Product Strategy",
    "Marketplace Design",
    "Backend Engineering",
    "Creator Economy",
  ],
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
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <UIProvider>
          <LenisProvider>{children}</LenisProvider>
        </UIProvider>
      </body>
    </html>
  );
}
