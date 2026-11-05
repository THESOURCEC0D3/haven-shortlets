import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site";
import {
  localBusinessSchema,
  webSiteSchema,
} from "@/lib/seo/structured-data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  // metadataBase makes every relative canonical/OG URL on every page resolve
  // to an absolute production URL. Without it those tags silently break.
  metadataBase: new URL(siteConfig.url),
  // `template` appends the brand to every page's own title; `default` is the
  // homepage title and the fallback.
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "short let Port Harcourt",
    "short-let apartments Port Harcourt",
    "serviced apartments GRA Port Harcourt",
    "short let GRA",
    "short let Woji",
    "apartments for rent Port Harcourt",
    "Airbnb alternative Port Harcourt",
    "book direct short let Nigeria",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  // Explicit crawl directives. We WANT to be indexed and we allow large
  // snippets/previews so AI search engines can quote richer chunks.
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The font variables go on <html>, not <body>. globals.css applies
    // `font-sans` to <html>, and a CSS custom property is only visible to an
    // element and its descendants — declaring it on <body> would leave the
    // <html> rule resolving an out-of-scope variable and silently falling back
    // to the system font stack.
    //
    // lang is "en-NG": it matches the en_NG OpenGraph locale and the
    // Intl.NumberFormat("en-NG") currency formatting, and it tells screen
    // readers to use Nigerian English pronunciation.
    <html lang="en-NG" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        {/* Keyboard users would otherwise tab through the whole navbar on every
            page before reaching content. First focusable element on the page. */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {/* Site-wide structured data: who we are + the website entity. Rendered
            on every page so the business identity is unambiguous everywhere. */}
        <JsonLd data={[localBusinessSchema(), webSiteSchema()]} />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
