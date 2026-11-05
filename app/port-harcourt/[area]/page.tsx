import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";
import JsonLd from "@/components/seo/JsonLd";
import FaqSection from "@/components/seo/FaqSection";
import ConversionBridge from "@/components/shared/ConversionBridge";
import ApartmentCard from "@/components/apartments/ApartmentCard";
import {
  breadcrumbSchema,
  itemListSchema,
  faqSchema,
} from "@/lib/seo/structured-data";
import {
  getApartmentsByArea,
  typeSlugFor,
  typeLabelFor,
} from "@/lib/data/apartments";
import { areas, getAreaBySlug } from "@/lib/data/areas";
import { getAvailabilityStatuses } from "@/lib/availability";

interface AreaPageProps {
  params: Promise<{ area: string }>;
}

// Pre-render one static page per known area at build time.
export function generateStaticParams() {
  return areas.map((area) => ({ area: area.slug }));
}

export async function generateMetadata({
  params,
}: AreaPageProps): Promise<Metadata> {
  const { area: areaSlug } = await params;
  const area = getAreaBySlug(areaSlug);
  if (!area) return { title: "Area Not Found" };

  return pageMetadata({
    title: `Short-Let Apartments in ${area.name}, Port Harcourt`,
    description: area.intro,
    path: `/port-harcourt/${area.slug}`,
  });
}

export default async function AreaPage({ params }: AreaPageProps) {
  const { area: areaSlug } = await params;
  const area = getAreaBySlug(areaSlug);
  if (!area) notFound();

  const areaApts = getApartmentsByArea(area.slug);
  const statuses = await getAvailabilityStatuses();

  // Distinct property types present in this area, for internal links to the
  // narrower long-tail pages.
  const typeSlugs = Array.from(new Set(areaApts.map(typeSlugFor))).sort();

  return (
    <div className="min-h-screen bg-ivory">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Port Harcourt", path: "/port-harcourt" },
            { name: area.name, path: `/port-harcourt/${area.slug}` },
          ]),
          itemListSchema(areaApts),
          faqSchema(area.faqs),
        ]}
      />

      <div className="bg-charcoal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Short-Let Apartments in{" "}
            <span className="italic text-gold">{area.name}</span>, Port Harcourt
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            {area.intro}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
        {/* Type filter links (internal linking to long-tail pages) */}
        {typeSlugs.length > 1 && (
          <div className="flex flex-wrap gap-3">
            {typeSlugs.map((t) => (
              <Link
                key={t}
                href={`/port-harcourt/${area.slug}/${t}`}
                className="rounded-full border border-slate-300 px-4 py-1.5 text-sm text-charcoal hover:border-gold hover:text-gold transition-colors"
              >
                {typeLabelFor(t)} in {area.name}
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areaApts.map((apartment) => (
            <ApartmentCard
              key={apartment.id}
              apartment={apartment}
              status={statuses[apartment.slug]}
              headingLevel="h2"
            />
          ))}
        </div>

        {/* About the area (factual density for SEO + GEO) */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-display text-xl font-bold text-charcoal mb-3">
            About {area.fullName}
          </h2>
          <p className="text-slate-600 leading-relaxed">{area.description}</p>
        </section>

        <FaqSection faqs={area.faqs} />

        <ConversionBridge
          heading={`Ready to book in ${area.name}?`}
          whatsappMessage={`Hello Haven Shortlets, I am looking for a short-let apartment in ${area.name}, Port Harcourt. My dates are: `}
          browseHref="/apartments"
          browseLabel="Compare all apartments"
        />
      </div>
    </div>
  );
}
