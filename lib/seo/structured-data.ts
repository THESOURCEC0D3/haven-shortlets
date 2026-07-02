/**
 * JSON-LD (schema.org) builders. Each function returns a plain object that
 * <JsonLd> renders into the page. Splitting these out keeps the page files
 * clean and guarantees every page describes the SAME business the same way.
 *
 * Why this matters:
 *  - Google uses these to build rich results (price, ratings, breadcrumbs, FAQ
 *    accordions) and to understand the entities on the page.
 *  - LLM-powered search (ChatGPT, Perplexity, AI Overviews) parses these
 *    machine-readable facts far more reliably than prose, which makes the
 *    business more likely to be cited.
 */

import { siteConfig, absoluteUrl } from "@/lib/site";
import type { Apartment } from "@/lib/data/apartments";
import { formatPrice } from "@/lib/data/apartments";
import type { Area, AreaFaq } from "@/lib/data/areas";

const ORG_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

/** The business itself. A LodgingBusiness is the most specific fit for a
 *  short-let operator and unlocks local + lodging rich results. */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": ORG_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    telephone: siteConfig.phoneE164,
    email: siteConfig.email,
    priceRange: siteConfig.priceRange,
    image: absoluteUrl("/opengraph-image"),
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    areaServed: [
      { "@type": "City", name: "Port Harcourt" },
      { "@type": "Place", name: "GRA, Port Harcourt" },
      { "@type": "Place", name: "Woji, Port Harcourt" },
    ],
    ...(siteConfig.sameAs.length ? { sameAs: siteConfig.sameAs } : {}),
  };
}

/** The website entity + a SearchAction so engines know where the site search
 *  lives (the apartments listing acts as search/browse). */
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/apartments`,
      "query-input": "required name=search_term_string",
    },
  };
}

/** A single apartment as a bookable Accommodation + Offer. This is the listing
 *  rich-result win: price, size, rooms, amenities, availability — all explicit. */
export function apartmentSchema(apartment: Apartment, area?: Area) {
  const url = absoluteUrl(`/apartments/${apartment.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Apartment",
    "@id": `${url}#accommodation`,
    name: apartment.name,
    description: apartment.description,
    url,
    image: apartment.images,
    numberOfBedrooms: apartment.bedrooms,
    numberOfBathroomsTotal: apartment.bathrooms,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: apartment.maxGuests,
      unitText: "guests",
    },
    floorSize: {
      "@type": "QuantitativeValue",
      value: apartment.size,
      unitCode: "MTK", // square metres
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: apartment.location,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    ...(area
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: area.geo.latitude,
            longitude: area.geo.longitude,
          },
        }
      : {}),
    amenityFeature: apartment.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    // Nightly price as an Offer. priceValidUntil keeps the offer "fresh"
    // without needing a real date API at build time.
    offers: {
      "@type": "Offer",
      price: apartment.pricePerNight,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      url,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: apartment.pricePerNight,
        priceCurrency: "NGN",
        unitText: "per night",
      },
    },
    provider: { "@id": ORG_ID },
  };
}

/** Breadcrumb trail. Powers the breadcrumb rich result and helps engines
 *  understand site hierarchy. Pass items in order (root first). */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** A list of apartments (for listing / area pages). Helps engines see the set
 *  of offerings and can yield carousel-style results. */
export function itemListSchema(apartments: Apartment[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: apartments.map((apartment, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/apartments/${apartment.slug}`),
      name: apartment.name,
    })),
  };
}

/** FAQ schema — the strongest GEO lever. LLMs lift concise question→answer
 *  pairs directly, and Google can render an FAQ accordion. Keep answers
 *  self-contained and factual. */
export function faqSchema(faqs: AreaFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** An informational article (neighbourhood / diaspora guides). */
export function articleSchema(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.path),
    ...(opts.image ? { image: opts.image } : {}),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

// Re-export a tiny helper so pages can format prices in copy + schema the same
// way without importing from two places.
export { formatPrice };
