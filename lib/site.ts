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

  // The named human guests deal with. Referenced by the contact page, the
  // host profile, guide bylines, and the WhatsApp copy — one place, so the
  // person's name can never disagree with itself across the site.
  host: {
    name: "Chidi Okonkwo",
    firstName: "Chidi",
    role: "Founder & Host",
    languages: "English, Igbo, Pidgin",
  },

  // Response-time commitment. Quoted in visible copy AND in the WhatsApp
  // reassurance line, so it must come from one constant.
  responseTimeMinutes: 30,

  // Business hours — rendered on the contact page and emitted as
  // openingHoursSpecification in LocalBusiness schema.
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "07:00", closes: "22:00" },
    { days: ["Sunday"], opens: "09:00", closes: "18:00" },
  ],

  // Price band shown to engines/LLMs as the LocalBusiness priceRange.
  priceRange: "₦55,000–₦150,000 / night",

  // Social / third-party profiles feed schema `sameAs` and entity consistency.
  // Add real profiles as they go live.
  sameAs: [] as string[],
} as const;

/**
 * Build a wa.me deep link with a pre-filled message.
 *
 * Why this is a function and not a string the caller assembles: the phone
 * number was previously hardcoded at 19 call sites across 11 files, alongside a
 * comment in this file asking developers to keep them in sync by hand. A phone
 * number that lives in 19 places is a phone number that will eventually
 * disagree with itself — and NAP (Name/Address/Phone) consistency is one of the
 * strongest local-SEO signals there is. One function, one source of truth.
 *
 * Pre-filling the message matters commercially: a blank WhatsApp thread makes
 * the guest compose the first message, and many simply don't. A message that
 * already names the apartment converts a "hello?" into a qualified enquiry.
 */
export function whatsappUrl(message: string, phone: string = siteConfig.whatsapp): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** `tel:` href built from the E.164 number, so dialling always uses one value. */
export const telHref = `tel:${siteConfig.phoneE164}`;

/** `mailto:` href, same reasoning. */
export const mailHref = `mailto:${siteConfig.email}`;

/** Single-line NAP string for the footer / contact page / schema. */
export const fullAddress = `${siteConfig.address.street}, ${siteConfig.address.locality}, ${siteConfig.address.region}`;

/**
 * Google Maps deep links. We deliberately use the public search/directions URL
 * form rather than an embedded iframe: an embed costs an API key, adds a
 * third-party script to every listing page, and would be blocked by a strict
 * CSP. A static map image plus a "Get directions" link answers the guest's
 * actual question ("how far is this from where I need to be?") at zero
 * performance cost.
 */
export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function mapsDirectionsUrl(destination: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

/**
 * Turn a root-relative path ("/apartments") into an absolute URL. Metadata,
 * sitemap, and JSON-LD all need absolute URLs — relative ones silently break
 * canonical/OG resolution.
 */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${clean}`;
}
