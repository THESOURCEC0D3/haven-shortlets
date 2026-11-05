import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { pageMetadata } from "@/lib/seo/metadata";
import JsonLd from "@/components/seo/JsonLd";
import FaqSection from "@/components/seo/FaqSection";
import ConversionBridge from "@/components/shared/ConversionBridge";
import ApartmentCard from "@/components/apartments/ApartmentCard";
import {
  breadcrumbSchema,
  itemListSchema,
  faqSchema,
  formatPrice,
} from "@/lib/seo/structured-data";
import {
  getApartmentsByAreaAndType,
  getAreaTypeCombos,
  typeLabelFor,
} from "@/lib/data/apartments";
import { getAreaBySlug } from "@/lib/data/areas";
import { getAvailabilityStatuses } from "@/lib/availability";

interface TypePageProps {
  params: Promise<{ area: string; type: string }>;
}

// Only generate (area, type) combinations that actually have listings — this
// is what stops us from publishing thin, empty pages.
export function generateStaticParams() {
  return getAreaTypeCombos();
}

function buildContext(areaSlug: string, typeSlug: string) {
  const area = getAreaBySlug(areaSlug);
  const apts = getApartmentsByAreaAndType(areaSlug, typeSlug);
  if (!area || apts.length === 0) return null;

  const typeLabel = typeLabelFor(typeSlug);
  const minPrice = Math.min(...apts.map((a) => a.pricePerNight));
  const title = `${typeLabel} Short-Let Apartments in ${area.name}, Port Harcourt`;
  const intro = `${typeLabel} short-let apartments in ${area.name}, Port Harcourt start from ${formatPrice(
    minPrice,
  )} per night. ${
    apts.length === 1 ? "This apartment" : `All ${apts.length} apartments`
  } include 24/7 power, fast Wi-Fi, and air conditioning, and book direct with no Airbnb fees.`;

  return { area, apts, typeLabel, minPrice, title, intro };
}

export async function generateMetadata({
  params,
}: TypePageProps): Promise<Metadata> {
  const { area, type } = await params;
  const ctx = buildContext(area, type);
  if (!ctx) return { title: "Not Found" };

  return pageMetadata({
    title: ctx.title,
    description: ctx.intro,
    path: `/port-harcourt/${area}/${type}`,
    image: ctx.apts[0]?.images[0],
  });
}

export default async function AreaTypePage({ params }: TypePageProps) {
  const { area: areaSlug, type: typeSlug } = await params;
  const ctx = buildContext(areaSlug, typeSlug);
  if (!ctx) notFound();

  const { area, apts, typeLabel, minPrice, title, intro } = ctx;
  const statuses = await getAvailabilityStatuses();

  const faqs = [
    {
      question: `How much is a ${typeLabel.toLowerCase()} short-let in ${area.name}?`,
      answer: `${typeLabel} short-let apartments in ${area.name}, Port Harcourt start from ${formatPrice(
        minPrice,
      )} per night, with weekly and monthly rates available. Booking direct avoids the 15–25% fees Airbnb charges.`,
    },
    ...area.faqs.slice(0, 2),
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Port Harcourt", path: "/port-harcourt" },
            { name: area.name, path: `/port-harcourt/${area.slug}` },
            {
              name: `${typeLabel}`,
              path: `/port-harcourt/${area.slug}/${typeSlug}`,
            },
          ]),
          itemListSchema(apts),
          faqSchema(faqs),
        ]}
      />

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/port-harcourt/${area.slug}`}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-charcoal transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            All short-lets in {area.name}
          </Link>
        </div>
      </div>

      <div className="bg-charcoal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            {intro}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apts.map((apartment) => (
            <ApartmentCard
              key={apartment.id}
              apartment={apartment}
              status={statuses[apartment.slug]}
              headingLevel="h2"
            />
          ))}
        </div>

        <FaqSection faqs={faqs} />

        <ConversionBridge
          heading={`Ready to book a ${typeLabel.toLowerCase()} in ${area.name}?`}
          whatsappMessage={`Hello Haven Shortlets, I am looking for a ${typeLabel.toLowerCase()} short-let in ${area.name}, Port Harcourt. My dates are: `}
          browseHref={`/port-harcourt/${area.slug}`}
          browseLabel={`All ${area.name} apartments`}
        />
      </div>
    </div>
  );
}
