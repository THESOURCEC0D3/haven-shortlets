import Link from "next/link";
import { MapPin } from "lucide-react";
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
import { apartments, getApartmentsByArea } from "@/lib/data/apartments";
import { areas } from "@/lib/data/areas";
import { getAvailabilityStatuses } from "@/lib/availability";

export const metadata = pageMetadata({
  title: "Short-Let Apartments in Port Harcourt",
  description:
    "Premium short-let and serviced apartments in Port Harcourt — GRA and Woji. ₦55,000–₦150,000 per night with 24/7 power, Wi-Fi, and air conditioning. Book direct and save up to 25% vs Airbnb.",
  path: "/port-harcourt",
});

// City-level direct-answer intro — the chunk an LLM can lift whole.
const intro =
  "Short-let apartments in Port Harcourt range from ₦55,000 to ₦150,000 per night. The two prime areas are GRA — the central, premium, highbrow choice — and Woji, the better-value corridor near Trans-Amadi. Every Haven Shortlets apartment includes 24/7 power, fast Wi-Fi, and air conditioning, and booking direct saves up to 25% versus Airbnb.";

const faqs = [
  {
    question: "How much does a short-let apartment cost in Port Harcourt?",
    answer:
      "Short-let apartments in Port Harcourt cost ₦55,000–₦150,000 per night. Woji studios start around ₦55,000; GRA executive suites reach ₦150,000. Weekly and monthly rates lower the per-night cost.",
  },
  {
    question: "Which is the best area for a short stay in Port Harcourt?",
    answer:
      "GRA is best for a central, premium, secure base near banks, restaurants, and the airport. Woji is best for value, with rates 20–35% lower while keeping 24/7 power and good city access.",
  },
  {
    question: "Is it cheaper to book direct than on Airbnb?",
    answer:
      "Yes. Booking direct with Haven Shortlets avoids the 15–25% service fees Airbnb adds at checkout, so the same apartment costs you noticeably less.",
  },
];

export default async function PortHarcourtHub() {
  const statuses = await getAvailabilityStatuses();

  return (
    <div className="min-h-screen bg-ivory">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Port Harcourt", path: "/port-harcourt" },
          ]),
          itemListSchema(apartments),
          faqSchema(faqs),
        ]}
      />

      {/* Hero / direct answer */}
      <div className="bg-charcoal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Short-Let Apartments in{" "}
            <span className="italic text-gold">Port Harcourt</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            {intro}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-12">
        {/* Area sections */}
        {areas.map((area) => {
          const areaApts = getApartmentsByArea(area.slug);
          return (
            <section key={area.slug}>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-gold-text" />
                <h2 className="font-display text-2xl font-bold text-charcoal">
                  Short-Lets in {area.name}
                </h2>
              </div>
              <p className="text-slate-600 max-w-3xl mb-4 leading-relaxed">
                {area.intro}
              </p>
              <Link
                href={`/port-harcourt/${area.slug}`}
                className="text-sm text-charcoal underline decoration-gold underline-offset-4 hover:text-gold transition-colors"
              >
                View all {area.name} apartments →
              </Link>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {areaApts.map((apartment) => (
                  <ApartmentCard
                    key={apartment.id}
                    apartment={apartment}
                    status={statuses[apartment.slug]}
                  />
                ))}
              </div>
            </section>
          );
        })}

        <FaqSection faqs={faqs} />

        <ConversionBridge
          heading="Ready to book your Port Harcourt stay?"
          whatsappMessage="Hello Haven Shortlets, I am looking for a short-let apartment in Port Harcourt. My dates are: "
        />
      </div>
    </div>
  );
}
