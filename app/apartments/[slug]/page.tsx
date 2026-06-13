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
import AvailabilityBadge from "@/components/apartments/AvailabilityBadge";
import {
  getApartmentBySlug,
  apartments,
  formatPrice,
} from "@/lib/data/apartments";
import { supabase } from "@/lib/supabase";
import { ApartmentAvailability } from "@/lib/types";

interface ApartmentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ApartmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const apartment = getApartmentBySlug(slug);

  if (!apartment) {
    return { title: "Apartment Not Found — Haven Shortlets PH" };
  }

  return {
    title: `${apartment.name} — Haven Shortlets PH`,
    description: apartment.shortDescription,
  };
}

export function generateStaticParams() {
  return apartments.map((apartment) => ({
    slug: apartment.slug,
  }));
}

const highlights = [
  { icon: Zap, label: "24/7 Power Supply" },
  { icon: Wifi, label: "High-Speed Wi-Fi" },
  { icon: Wind, label: "Air Conditioning" },
];

export default async function ApartmentPage({ params }: ApartmentPageProps) {
  const { slug } = await params;
  const apartment = getApartmentBySlug(slug);

  if (!apartment) {
    notFound();
  }

  const { data: availabilityData } = await supabase
    .from("apartments")
    .select("*")
    .eq("slug", slug)
    .single();

  const availability = availabilityData as ApartmentAvailability | null;
  const isAvailable = availability?.available ?? true;

  const whatsappMessage = `Hello Haven Shortlets, I am interested in booking the ${apartment.name}. Please confirm availability and send me the booking details.`;

  return (
    <div className="min-h-screen bg-ivory">
      {/* Back Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/apartments"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-charcoal transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Apartments
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Gallery */}
            <ApartmentGallery
              images={apartment.images}
              title={apartment.name}
            />

            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-2">
                    {apartment.name}
                  </h1>
                  <p className="text-slate-500 text-sm">{apartment.location}</p>
                </div>
                <AvailabilityBadge availability={availability} size="md" />
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-6 py-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-gold" />
                  <span className="text-slate-700 text-sm font-medium">
                    {apartment.bedrooms}{" "}
                    {apartment.bedrooms > 1 ? "Bedrooms" : "Bedroom"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-gold" />
                  <span className="text-slate-700 text-sm font-medium">
                    {apartment.bathrooms}{" "}
                    {apartment.bathrooms > 1 ? "Bathrooms" : "Bathroom"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gold" />
                  <span className="text-slate-700 text-sm font-medium">
                    Up to {apartment.maxGuests} guests
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-5 h-5 text-gold" />
                  <span className="text-slate-700 text-sm font-medium">
                    {apartment.size} sqm
                  </span>
                </div>
              </div>

              {/* Always Included */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 bg-gold/10 rounded-full px-3 py-1.5"
                  >
                    <item.icon className="w-3.5 h-3.5 text-gold" />
                    <span className="text-xs font-medium text-charcoal">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-display text-xl font-bold text-charcoal mb-4">
                About This Apartment
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {apartment.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-display text-xl font-bold text-charcoal mb-6">
                What Is Included
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {apartment.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-sm text-slate-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Price + Booking Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
              {/* Price Tiers */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-display text-4xl font-bold text-charcoal">
                    {formatPrice(apartment.pricePerNight)}
                  </span>
                  <span className="text-slate-400 text-sm">/night</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Weekly rate</span>
                    <span className="text-sm font-semibold text-charcoal">
                      {formatPrice(apartment.pricePerWeek)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Monthly rate</span>
                    <span className="text-sm font-semibold text-charcoal">
                      {formatPrice(apartment.pricePerMonth)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-400">
                      Platform fees
                    </span>
                    <span className="text-xs font-semibold text-green-600">
                      ₦0 — Book Direct
                    </span>
                  </div>
                </div>
              </div>

              {/* Availability Status */}
              <div className="mb-6">
                <AvailabilityBadge availability={availability} size="md" />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3">
                {isAvailable ? (
                  <>
                    <WhatsAppButton
                      phone="2348098765432"
                      message={whatsappMessage}
                      label="Book on WhatsApp"
                      className="w-full"
                    />
                    <a href="tel:+2348098765432">
                      <Button
                        variant="outline"
                        className="w-full gap-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300"
                      >
                        <Phone className="w-4 h-4" />
                        Call to Book
                      </Button>
                    </a>
                  </>
                ) : (
                  <>
                    <Button
                      disabled
                      className="w-full bg-slate-100 text-slate-400 cursor-not-allowed"
                    >
                      Currently Unavailable
                    </Button>
                    <WhatsAppButton
                      phone="2348098765432"
                      message={`Hello Haven Shortlets, I am interested in the ${apartment.name} but I can see it is currently booked. Please let me know when it becomes available or suggest a similar apartment.`}
                      label="Join Waitlist on WhatsApp"
                      className="w-full"
                    />
                  </>
                )}
              </div>

              {/* Trust Note */}
              <p className="text-xs text-slate-400 text-center mt-4 leading-relaxed">
                Prices shown are direct booking rates.{" "}
                <span className="text-gold font-medium">
                  No Airbnb fees. No surprises.
                </span>
              </p>
            </div>

            {/* Haven Promise Card */}
            <div className="bg-charcoal rounded-2xl p-6 text-white">
              <p className="font-display text-lg font-bold text-white mb-4">
                The Haven Promise
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "Exact apartment as advertised",
                  "24/7 power in every apartment",
                  "Response within 30 minutes",
                  "Full refund if not as described",
                ].map((promise) => (
                  <div key={promise} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-white/70 text-sm">{promise}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
