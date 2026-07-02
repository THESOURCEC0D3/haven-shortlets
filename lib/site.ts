/**
 * Single source of truth for the brand's identity, contact details (NAP), and
 * canonical URL. Everything SEO/GEO reads from here so the same facts appear
 * everywhere — in metadata, JSON-LD, sitemap, and visible copy.
 *
 * "Entity consistency" (identical NAP — Name, Address, Phone — across the whole
 * web) is one of the strongest GEO levers: it lets search engines and LLMs
 * confidently associate these facts with one business and cite it.
 */

// Read the public site URL from env. Falls back to the placeholder domain so
// nothing breaks in dev or before the real domain is wired. Trailing slash is
// stripped so `${siteUrl}/path` never produces a double slash.
const rawUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://havenshortlets.ng";

export const siteUrl = rawUrl.replace(/\/$/, "");

export const siteConfig = {
  name: "Haven Shortlets PH",
  shortName: "Haven Shortlets",
  url: siteUrl,
  // Default site-wide title + description. Pages override these.
  title: "Haven Shortlets PH — Book Direct. Stay Better. Pay Less.",
  description:
    "Premium short-let apartments in Port Harcourt. Book direct and save up to 25% compared to Airbnb. GRA and Woji locations. Instant WhatsApp confirmation.",
  locale: "en_NG",

  // NAP — keep identical to what is shown in the Footer and Contact page.
  address: {
    street: "12 Rumuola Road, GRA Phase 1",
    locality: "Port Harcourt",
    region: "Rivers State",
    country: "NG",
  },
  // Approximate Port Harcourt GRA coordinates — used for LocalBusiness geo.
  geo: { latitude: 4.8156, longitude: 7.0498 },

  phoneDisplay: "0809 876 5432",
  phoneE164: "+2348098765432",
  whatsapp: "2348098765432",
  email: "bookings@havenshortlets.com",

  // Price band shown to engines/LLMs as the LocalBusiness priceRange.
  priceRange: "₦55,000–₦150,000 / night",

  // Social / third-party profiles feed schema `sameAs` and entity consistency.
  // Add real profiles as they go live.
  sameAs: [] as string[],
} as const;

/**
 * Turn a root-relative path ("/apartments") into an absolute URL. Metadata,
 * sitemap, and JSON-LD all need absolute URLs — relative ones silently break
 * canonical/OG resolution.
 */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${clean}`;
}
