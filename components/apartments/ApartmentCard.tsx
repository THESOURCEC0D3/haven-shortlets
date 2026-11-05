import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { bookingLabel } from "@/lib/booking-label";
import AvailabilityBadge from "@/components/apartments/AvailabilityBadge";
import {
  type Apartment,
  formatPrice,
  airbnbEquivalent,
} from "@/lib/data/apartments";
import type { AvailabilityStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ApartmentCardProps {
  apartment: Apartment;
  status: AvailabilityStatus;
  /** Renders an <h2> instead of <h3>. See the heading-level note below. */
  headingLevel?: "h2" | "h3";
}

export default function ApartmentCard({
  apartment,
  status,
  headingLevel = "h3",
}: ApartmentCardProps) {
  // HEADING LEVEL AS A PROP.
  //
  // The card used to hardcode <h3>. On /apartments and the /port-harcourt
  // pages, the page's <h1> is followed directly by these cards — so the
  // document outline jumped h1 → h3, skipping a level. Screen-reader users
  // navigating by heading lose the structure when a level is missing.
  //
  // A card cannot know its own depth, so the PAGE tells it. That is the general
  // fix for this class of bug: heading level is a property of position in the
  // document, not of the component.
  const Heading = headingLevel;

  const isBooked = status.state === "booked";

  // Message differs by state so the host receives a question they can answer in
  // one reply rather than a generic "hello".
  const whatsappMessage = isBooked
    ? `Hello Haven Shortlets, the ${apartment.name} shows as booked. Please let me know when it frees up, or suggest a similar apartment.`
    : `Hello Haven Shortlets, I am interested in the ${apartment.name} (${formatPrice(apartment.pricePerNight)}/night). Please confirm availability for my dates.`;

  const airbnbPrice = airbnbEquivalent(apartment.pricePerNight);

  return (
    <div
      className={cn(
        "group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col transition-shadow duration-300",
        isBooked ? "opacity-90" : "hover:shadow-lg",
      )}
    >
      {/* The MEDIA and TITLE are the link target, not the whole card.
          Wrapping the entire card in <a> would nest the WhatsApp button inside
          a link — invalid HTML, and a tap intending "Book" would sometimes
          navigate instead. Users expect to click a card image, so this covers
          the common intent without breaking the actions. */}
      <Link
        href={`/apartments/${apartment.slug}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-text"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={apartment.images[0]}
            alt={apartment.imageAlts?.[0] ?? apartment.name}
            fill
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100",
              isBooked && "grayscale",
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <AvailabilityBadge status={status} size="sm" />
          </div>
          {/* Price on the image: the single most-sought number on a listing
              card, previously buried three blocks down the content stack. */}
          <div className="absolute bottom-3 right-3 rounded-lg bg-charcoal/85 px-2.5 py-1.5 backdrop-blur-sm">
            <span className="font-display text-base font-bold text-white">
              {formatPrice(apartment.pricePerNight)}
            </span>
            <span className="text-xs text-white/70">/night</span>
          </div>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Heading className="font-semibold text-slate-900 text-base leading-snug mb-1">
          <Link
            href={`/apartments/${apartment.slug}`}
            className="rounded-sm hover:text-gold-text transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-text"
          >
            {apartment.name}
          </Link>
        </Heading>

        <div className="flex items-center gap-1 mb-3">
          <MapPin className="size-3.5 text-slate-500 shrink-0" aria-hidden="true" />
          <span className="text-xs text-slate-600">{apartment.location}</span>
        </div>

        {/* Stats. slate-600 rather than the previous slate-400, which measured
            2.56:1 on white — a WCAG failure applied to every card on the site. */}
        <div className="flex items-center gap-4 mb-3">
          <span className="flex items-center gap-1 text-xs text-slate-600">
            <Bed className="size-3.5 text-slate-500" aria-hidden="true" />
            {apartment.bedrooms} {apartment.bedrooms > 1 ? "beds" : "bed"}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-600">
            <Bath className="size-3.5 text-slate-500" aria-hidden="true" />
            {apartment.bathrooms} {apartment.bathrooms > 1 ? "baths" : "bath"}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-600">
            <Users className="size-3.5 text-slate-500" aria-hidden="true" />
            Sleeps {apartment.maxGuests}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">
          {apartment.shortDescription}
        </p>

        {/* PRICE COMPARISON ON THE CARD.
            The "save vs Airbnb" argument — the entire reason this business
            exists — previously appeared only on the homepage. A guest arriving
            from Google on an area page never saw it. Anchoring against the
            struck-through platform price at the point of decision is what makes
            the direct price feel like a saving rather than just a number. */}
        <div className="mb-3 mt-auto">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-xs text-slate-500 line-through">
              {formatPrice(airbnbPrice)}
            </span>
            <span className="text-xs font-semibold text-green-700">
              Save {formatPrice(airbnbPrice - apartment.pricePerNight)} booking direct
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            {formatPrice(apartment.pricePerWeek)}/week ·{" "}
            {formatPrice(apartment.pricePerMonth)}/month
          </p>
        </div>

        {/* Actions. Both use the default 44px button height — these are the two
            primary conversion controls on a touch device and were previously
            28px tall (`size="sm"`), well under the 44px both Apple and Google
            publish as the minimum comfortable target.

            Stacked, not side by side: at half width the booking button could
            not fit "Book on WhatsApp" plus its icon. Full width also gives the
            booking action the top spot, which matches its importance. */}
        <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
          <WhatsAppButton
            message={whatsappMessage}
            // Label comes from the shared rule in lib/booking-label.ts so the
            // card, detail sidebar and mobile bar always agree.
            label={bookingLabel(status.state)}
            muted={isBooked}
            className="w-full"
          />
          <Button asChild variant="onLight" className="w-full">
            <Link href={`/apartments/${apartment.slug}`}>
              View details
              <span className="sr-only"> for {apartment.name}</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
