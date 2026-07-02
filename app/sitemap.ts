/**
 * Generates /sitemap.xml — the map crawlers use to discover every indexable
 * URL on the site. We list static pages, every apartment detail page, every
 * programmatic /port-harcourt landing page, and every guide.
 *
 * `priority` and `changeFrequency` are hints (engines mostly ignore them now),
 * but `images` on listing entries feeds Google Image search — a real win for a
 * visual product like apartments.
 *
 * NOTE: we intentionally do NOT include /admin or /api here; they're blocked
 * in robots.ts and have no public value.
 */

import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { apartments, getAreaTypeCombos } from "@/lib/data/apartments";
import { areas } from "@/lib/data/areas";
import { guides } from "@/lib/data/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: absoluteUrl("/apartments"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/port-harcourt"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/guides"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Apartment detail pages — include the listing images for image-sitemap.
  const apartmentPages: MetadataRoute.Sitemap = apartments.map((a) => ({
    url: absoluteUrl(`/apartments/${a.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
    images: a.images,
  }));

  // Area hubs, e.g. /port-harcourt/gra
  const areaPages: MetadataRoute.Sitemap = areas.map((area) => ({
    url: absoluteUrl(`/port-harcourt/${area.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Area × type long-tail pages, e.g. /port-harcourt/gra/2-bedroom
  const typePages: MetadataRoute.Sitemap = getAreaTypeCombos().map(
    ({ area, type }) => ({
      url: absoluteUrl(`/port-harcourt/${area}/${type}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: absoluteUrl(`/guides/${g.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...apartmentPages,
    ...areaPages,
    ...typePages,
    ...guidePages,
  ];
}
