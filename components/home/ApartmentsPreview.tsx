import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApartmentCard from "@/components/apartments/ApartmentCard";
import { getFeaturedApartments } from "@/lib/data/apartments";
import { supabase } from "@/lib/supabase";
import { ApartmentAvailability } from "@/lib/types";

const featuredApartments = getFeaturedApartments();

export default async function ApartmentsPreview() {
  const { data: availabilityData } = await supabase
    .from("apartments")
    .select("*");

  const availabilityMap = new Map<string, ApartmentAvailability>();
  if (availabilityData) {
    availabilityData.forEach((item: ApartmentAvailability) => {
      availabilityMap.set(item.slug, item);
    });
  }

  return (
    <section className="py-20 bg-ivory-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-gold" />
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Our Apartments
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal leading-tight">
              Every Apartment.{" "}
              <span className="italic text-gold">Verified.</span>
            </h2>
          </div>
          <Link href="/apartments" className="shrink-0 hidden md:block">
            <Button
              variant="outline"
              className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white gap-2 transition-all duration-300"
            >
              View All Apartments
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Apartments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredApartments.map((apartment) => (
            <ApartmentCard
              key={apartment.id}
              apartment={apartment}
              availability={availabilityMap.get(apartment.slug) ?? null}
            />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="md:hidden text-center">
          <Link href="/apartments">
            <Button
              variant="outline"
              className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white gap-2"
            >
              View All Apartments
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Bottom Note */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-center text-slate-500 text-sm">
            All apartments include 24/7 power supply, high-speed Wi-Fi, and air
            conditioning. Prices shown are direct booking rates —
            <span className="text-gold font-medium">
              {" "}
              no platform fees added.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
