/**
 * Helper for building per-page Next.js Metadata consistently.
 *
 * The two things every page must get right and usually forgets:
 *  1. A self-referencing canonical URL (`alternates.canonical`) — tells Google
 *     which URL is the "real" one and prevents duplicate-content dilution
 *     across query strings, trailing slashes, etc.
 *  2. OpenGraph + Twitter tags — control how the link looks when shared on
 *     WhatsApp, X, Facebook, iMessage, Slack. Critical for a WhatsApp-first
 *     booking business.
 *
 * `metadataBase` is set once in the root layout, so `path` here can be a plain
 * root-relative string and Next resolves it to an absolute URL for us.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

interface PageMetaOptions {
  title: string;
  description: string;
  /** Root-relative path, e.g. "/apartments". Becomes the canonical URL. */
  path: string;
  /** Absolute image URL for social cards. Falls back to the site OG image. */
  image?: string;
  /** Set true for pages that should not be indexed (e.g. admin). */
  noindex?: boolean;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  noindex,
}: PageMetaOptions): Metadata {
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
