import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bed,
  Bath,
  Users,
  Maximize2,
  CheckCircle,
  Phone,
  Wifi,
  Zap,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import ApartmentGallery from "@/components/apartments/ApartmentGallery";
import AvailabilityBadge, {
  AvailabilityNote,
} from "@/components/apartments/AvailabilityBadge";
import ApartmentEssentials from "@/components/apartments/ApartmentEssentials";
import LocationPanel from "@/components/apartments/LocationPanel";
import SimilarApartments from "@/components/apartments/SimilarApartments";
import StickyBookingBar from "@/components/apartments/StickyBookingBar";
import HavenPromise from "@/components/shared/HavenPromise";
import {
  getApartmentBySlug,
  apartments,
  formatPrice,
  typeSlugFor,
  typeLabelFor,
  airbnbEquivalent,
} from "@/lib/data/apartments";
import { getAreaBySlug } from "@/lib/data/areas";
import { policyFaqs } from "@/lib/data/policies";
import { pageMetadata } from "@/lib/seo/metadata";
import JsonLd from "@/components/seo/JsonLd";
import FaqSection from "@/components/seo/FaqSection";
import {
  apartmentSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/seo/structured-data";
import { getAvailabilityStatuses } from "@/lib/availability";
import { bookingLabel } from "@/lib/booking-label";
import { siteConfig, telHref } from "@/lib/site";

interface ApartmentPageProps {
  params: Promise<{ slug: string }>;
}

/** Safety net under the event-based revalidation in lib/actions.ts. */
export const revalidate = 300;

export async function generateMetadata({
  params,
}: ApartmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const apartment = getApartmentBySlug(slug);

  if (!apartment) {
    return { title: "Apartment Not Found" };
  }

  return pageMetadata({
    title: apartment.name,
    description: apartment.shortDescription,
    path: `/apartments/${apartment.slug}`,
    image: apartment.images[0],
  });
}

export function generateStaticParams() {
  return apartments.map((apartment) => ({ slug: apartment.slug }));
}

/**
 * The reassurance pills shown under the stats row.
 *
 * These are now DERIVED from the apartment's own amenities rather than a
 * hardcoded module constant rendered unconditionally. The old version claimed
 * "24/7 Power / Wi-Fi / Air Conditioning" on every listing regardless of what
 * the apartment actually had — true for all six units today, but a lie waiting
 * to happen on the seventh, on the very page that promises "What You See Is
 * What You Get". Same class of bug as a duplicated phone number: a fact stored
 * in two places will eventually disagree with itself.
 */
const HIGHLIGHT_MATCHERS = [
  { icon: Zap, label: "24/7 power supply", match: /power/i },
  { icon: Wifi, label: "High-speed Wi-Fi", match: /wi-?fi|internet/i },
  { icon: Wind, label: "Air conditioning", match: /air condition/i },
];

function highlightsFor(amenities: string[]) {
  return HIGHLIGHT_MATCHERS.filter((h) =>
    amenities.some((a) => h.match.test(a)),
  );
}

export default async function ApartmentPage({ params }: ApartmentPageProps) {
  const { slug } = await params;
  const apartment = getApartmentBySlug(slug);

  if (!apartment) {
    notFound();
  }

  // One shared, error-aware read. Also gives us every other apartment's status
  // for the "similar apartments" ranking below.
  const statuses = await getAvailabilityStatuses();
  const status = statuses[apartment.slug];

  const area = getAreaBySlug(apartment.area);
  const typeSlug = typeSlugFor(apartment);
  const typeLabel = typeLabelFor(typeSlug);
  const highlights = highlightsFor(apartment.amenities);
  const airbnbPrice = airbnbEquivalent(apartment.pricePerNight);
  const weeklySaving = airbnbPrice * 7 - apartment.pricePerWeek;

  // Listing FAQs plus the shared policy FAQs. Both render as visible text AND
  // as FAQPage schema from the same source, so the two can never disagree —
  // schema that doesn't match the visible page is a Google policy violation.
  const listingFaqs = [
    {
      question: `How much is the ${apartment.name} per night?`,
      answer: `The ${apartment.name} is ${formatPrice(apartment.pricePerNight)} per night, ${formatPrice(apartment.pricePerWeek)} per week, or ${formatPrice(apartment.pricePerMonth)} per month. These are direct booking rates with no platform fees — the same apartment booked through Airbnb would cost about ${formatPrice(airbnbPrice)} per night once service fees are added.`,
    },
    {
      question: `Where is the ${apartment.name} located?`,
      answer: `It is in ${apartment.location}. ${area?.intro ?? ""}`.trim(),
    },
    {
      question: `How many people can stay in the ${apartment.name}?`,
      answer: `Up to ${apartment.maxGuests} guests. ${apartment.sleeping}`,
    },
    {
      question: `What is included in the ${apartment.name}?`,
      answer: `${apartment.amenities.slice(0, 6).join(", ")}, plus 24/7 power supply. Every Haven Shortlets apartment includes uninterrupted power, fast Wi-Fi and air conditioning as standard.`,
    },
    {
      question: "How do I book this apartment?",
      answer: `Message us on WhatsApp or call ${siteConfig.phoneDisplay} with your dates. We confirm availability and send a written booking confirmation — apartment, dates, total and cancellation terms — usually within ${siteConfig.responseTimeMinutes} minutes, before any money moves.`,
    },
  ];

  const faqs = [...listingFaqs, ...policyFaqs(apartment.minimumStayNights)];

  const bookingMessage =
    status.state === "booked"
      ? `Hello Haven Shortlets, the ${apartment.name} shows as booked. Please let me know when it frees up, or suggest a similar apartment.`
      : `Hello Haven Shortlets, I would like to book the ${apartment.name} (${formatPrice(apartment.pricePerNight)}/night). My dates are: `;

  return (
    <div className="min-h-screen bg-ivory">
      <JsonLd
        data={[
          apartmentSchema(apartment, area),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Apartments", path: "/apartments" },
            { name: apartment.name, path: `/apartments/${apartment.slug}` },
          ]),
          faqSchema(faqs),
        ]}
      />

      {/* Back Navigation. mt-16 clears the fixed navbar. */}
      <div className="bg-white border-b border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/apartments"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-charcoal transition-colors text-sm rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-text"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All apartments
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ApartmentGallery
              images={apartment.images}
              alts={apartment.imageAlts}
              title={apartment.name}
            />

            {/* Header Card.
                THE MOBILE PRICE FIX. On a phone the two-column grid collapses
                and DOM order becomes render order, so the booking sidebar used
                to appear AFTER the gallery, description, amenities, internal
                links and four FAQ accordions — roughly five screens of scrolling
                before a guest could see the price. Price is the single most
                sought fact on a listing, so a compact price block now sits in
                the header and is hidden from lg upward where the sidebar takes
                over. Same information, ordered by what the guest needs first. */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-2">
                    {apartment.name}
                  </h1>
                  <p className="text-slate-600 text-sm">{apartment.location}</p>
                </div>
                {/* Rendered once per page. It used to appear both here and in
                    the sidebar, telling the guest the same thing twice. */}
                <AvailabilityBadge status={status} size="md" />
              </div>

              <div className="lg:hidden border-t border-slate-100 pt-4 mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-charcoal">
                    {formatPrice(apartment.pricePerNight)}
                  </span>
                  <span className="text-slate-600 text-sm">/night</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  <span className="line-through">
                    {formatPrice(airbnbPrice)}
                  </span>{" "}
                  <span className="font-medium text-green-700">
                    on a platform — you save{" "}
                    {formatPrice(airbnbPrice - apartment.pricePerNight)} a night
                  </span>
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {formatPrice(apartment.pricePerWeek)}/week ·{" "}
                  {formatPrice(apartment.pricePerMonth)}/month · minimum{" "}
                  {apartment.minimumStayNights} nights
                </p>
              </div>

              {/* Stats Row */}
              <dl className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4 border-t border-slate-100">
                <Stat icon={Bed} label="Bedrooms">
                  {apartment.propertyType === "studio"
                    ? "Studio"
                    : `${apartment.bedrooms} ${apartment.bedrooms > 1 ? "bedrooms" : "bedroom"}`}
                </Stat>
                <Stat icon={Bath} label="Bathrooms">
                  {apartment.bathrooms}{" "}
                  {apartment.bathrooms > 1 ? "bathrooms" : "bathroom"}
                </Stat>
                <Stat icon={Users} label="Sleeps">
                  Up to {apartment.maxGuests} guests
                </Stat>
                <Stat icon={Maximize2} label="Size">
                  {apartment.size} sqm
                </Stat>
              </dl>

              {highlights.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                  {highlights.map((item) => (
                    <span
                      key={item.label}
                      className="flex items-center gap-2 bg-gold/15 rounded-full px-3 py-1.5"
                    >
                      <item.icon
                        className="size-3.5 text-gold-text"
                        aria-hidden="true"
                      />
                      <span className="text-xs font-medium text-charcoal">
                        {item.label}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-display text-xl font-bold text-charcoal mb-4">
                About this apartment
              </h2>
              <p className="text-slate-700 leading-relaxed">
                {apartment.description}
              </p>
            </section>

            {/* Amenities */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-display text-xl font-bold text-charcoal mb-6">
                What&apos;s included
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {apartment.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-3">
                    <CheckCircle
                      className="size-4 text-gold-text shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-slate-700">{amenity}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Check-in, sleeping, house rules, cancellation, payment — the
                block that was missing from every page on this site. */}
            <ApartmentEssentials apartment={apartment} />

            {/* Where you'll be + drive times to the places guests ask about. */}
            <LocationPanel
              location={apartment.location}
              mapQuery={apartment.mapQuery}
              nearby={apartment.nearby}
              areaName={area?.name}
              areaHref={area ? `/port-harcourt/${area.slug}` : undefined}
            />

            {/* Internal links help crawl depth and let a guest widen their
                search without leaving the funnel. */}
            {area && (
              <nav
                aria-label="Explore more"
                className="bg-white rounded-2xl border border-slate-200 p-6"
              >
                <h2 className="font-display text-xl font-bold text-charcoal mb-4">
                  Explore more in {area.name}
                </h2>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  <Link
                    href={`/port-harcourt/${area.slug}`}
                    className="text-sm text-charcoal underline decoration-gold decoration-2 underline-offset-4 hover:text-gold-text transition-colors"
                  >
                    All short-lets in {area.name}
                  </Link>
                  <Link
                    href={`/port-harcourt/${area.slug}/${typeSlug}`}
                    className="text-sm text-charcoal underline decoration-gold decoration-2 underline-offset-4 hover:text-gold-text transition-colors"
                  >
                    {typeLabel} apartments in {area.name}
                  </Link>
                  <Link
                    href={`/guides/${area.slug}-neighbourhood-guide`}
                    className="text-sm text-charcoal underline decoration-gold decoration-2 underline-offset-4 hover:text-gold-text transition-colors"
                  >
                    {area.name} neighbourhood guide
                  </Link>
                </div>
              </nav>
            )}

            <FaqSection faqs={faqs} />

            {/* Recovery path: alternatives the guest could actually book. */}
            <SimilarApartments current={apartment} statuses={statuses} />
          </div>

          {/* Right Column — Sidebar (desktop only; mobile uses the sticky bar).
              The WHOLE column is sticky, not just the price card. When only the
              price card stuck, the Haven Promise card below scrolled up into the
              same spot and slid underneath it (a sticky element is positioned,
              so it paints above normal-flow siblings).
              - self-start: grid items stretch to the row's full height by
                default, and a sticky element as tall as its container has no
                room to stick.
              - max-h + overflow-y-auto: on short laptop screens the column is
                taller than the viewport; without a cap its bottom (including
                the booking buttons) would be cut off. 6rem = top-24 offset,
                1.5rem = breathing room at the bottom. dvh, not vh, so mobile
                browser chrome is accounted for if this ever shows on tablets. */}
          <div className="hidden lg:flex flex-col gap-6 sticky top-24 self-start max-h-[calc(100dvh-7.5rem)] overflow-y-auto [scrollbar-width:thin]">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="mb-5 pb-5 border-b border-slate-100">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display text-4xl font-bold text-charcoal">
                    {formatPrice(apartment.pricePerNight)}
                  </span>
                  <span className="text-slate-600 text-sm">/night</span>
                </div>

                {/* Anchor against the platform price at the point of decision.
                    This argument previously lived only on the homepage, so a
                    guest arriving from Google never saw it where it counts. */}
                <p className="text-sm text-slate-600 mb-4">
                  <span className="line-through">
                    {formatPrice(airbnbPrice)}
                  </span>{" "}
                  <span className="font-medium text-green-700">
                    booking through a platform
                  </span>
                </p>

                <dl className="flex flex-col gap-2 tabular-nums">
                  <Row term="Weekly rate">
                    {formatPrice(apartment.pricePerWeek)}
                  </Row>
                  <Row term="Monthly rate">
                    {formatPrice(apartment.pricePerMonth)}
                  </Row>
                  <Row term="Minimum stay">
                    {apartment.minimumStayNights} nights
                  </Row>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <dt className="text-xs text-slate-600">
                      Cleaning &amp; platform fees
                    </dt>
                    <dd className="text-xs font-semibold text-green-700">₦0</dd>
                  </div>
                </dl>

                {weeklySaving > 0 && (
                  <p className="mt-3 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs font-medium text-green-800">
                    Book a week direct and keep {formatPrice(weeklySaving)}.
                  </p>
                )}
              </div>

              <div className="mb-5">
                <AvailabilityNote status={status} />
              </div>

              {/* CTAs.
                  Even when booked we lead with a WhatsApp action rather than a
                  disabled button: a dead end loses the lead entirely, whereas
                  the waitlist message captures it and invites an alternative. */}
              <div className="flex flex-col gap-3">
                <WhatsAppButton
                  message={bookingMessage}
                  label={bookingLabel(status.state)}
                  muted={status.state === "booked"}
                  size="lg"
                  className="w-full"
                />
                <Button asChild variant="onLight" size="lg" className="w-full">
                  <a href={telHref}>
                    <Phone className="size-4" aria-hidden="true" />
                    Call {siteConfig.phoneDisplay}
                  </a>
                </Button>
              </div>

              <p className="text-xs text-slate-600 text-center mt-4 leading-relaxed">
                You get a written confirmation with dates, total and cancellation
                terms{" "}
                <span className="font-medium text-charcoal">
                  before you pay anything
                </span>
                .
              </p>
            </div>

            <HavenPromise />
          </div>
        </div>
      </div>

      {/* Persistent mobile booking bar. */}
      <StickyBookingBar
        name={apartment.name}
        pricePerNight={apartment.pricePerNight}
        status={status}
        whatsappMessage={bookingMessage}
      />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-5 text-gold-text" aria-hidden={true} />
      <dt className="sr-only">{label}</dt>
      <dd className="text-slate-800 text-sm font-medium">{children}</dd>
    </div>
  );
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <dt className="text-sm text-slate-600">{term}</dt>
      <dd className="text-sm font-semibold text-charcoal">{children}</dd>
    </div>
  );
}
