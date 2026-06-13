import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Users, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import AvailabilityBadge from "@/components/apartments/AvailabilityBadge";
import { Apartment, formatPrice } from "@/lib/data/apartments";
import { ApartmentAvailability } from "@/lib/types";

interface ApartmentCardProps {
  apartment: Apartment;
  availability: ApartmentAvailability | null;
}

export default function ApartmentCard({
  apartment,
  availability,
}: ApartmentCardProps) {
  const isAvailable = availability?.available ?? true;

  const whatsappMessage = `Hello Haven Shortlets, I am interested in booking the ${apartment.name}. Please confirm availability and provide booking details.`;

  return (
    <div
      className={`bg-white rounded-xl border overflow-hidden flex flex-col transition-shadow duration-300 ${
        isAvailable
          ? "border-slate-200 hover:shadow-lg"
          : "border-slate-200 opacity-75"
      }`}
    >
      {/* Image */}
      <div className="relative h-52 w-full">
        <Image
          src={apartment.images[0]}
          alt={apartment.name}
          fill
          className={`object-cover ${!isAvailable ? "grayscale" : ""}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <AvailabilityBadge availability={availability} size="sm" />
        </div>
        {!isAvailable && <div className="absolute inset-0 bg-slate-900/20" />}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name */}
        <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1 line-clamp-1">
          {apartment.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500">{apartment.location}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-600">
              {apartment.bedrooms} {apartment.bedrooms > 1 ? "beds" : "bed"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-600">
              {apartment.bathrooms} {apartment.bathrooms > 1 ? "baths" : "bath"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-600">
              Up to {apartment.maxGuests}
            </span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
          {apartment.shortDescription}
        </p>

        {/* Price */}
        <div className="mb-3 mt-auto">
          <p className="text-lg font-bold text-slate-900">
            {formatPrice(apartment.pricePerNight)}
            <span className="text-sm font-normal text-slate-500">/night</span>
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {formatPrice(apartment.pricePerWeek)}/week ·{" "}
            {formatPrice(apartment.pricePerMonth)}/month
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-slate-100">
          <Link href={`/apartments/${apartment.slug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs">
              View Details
            </Button>
          </Link>
          {isAvailable ? (
            <WhatsAppButton
              phone="2348098765432"
              message={whatsappMessage}
              label="Book Now"
              size="sm"
              className="flex-1 text-xs"
            />
          ) : (
            <Button
              size="sm"
              disabled
              className="flex-1 text-xs bg-slate-100 text-slate-400 cursor-not-allowed"
            >
              Unavailable
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
