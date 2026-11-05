import { MapPin, Car, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mapsDirectionsUrl } from "@/lib/site";
import type { NearbyPlace } from "@/lib/data/apartments";

/**
 * Location panel: drive times to the places guests actually ask about, plus a
 * link into Google Maps.
 *
 * WHY NOT AN EMBEDDED MAP
 *
 * An iframe embed needs a billed Google Maps API key, adds a third-party script
 * and several hundred KB to a listing page, and hurts LCP on the mobile 4G
 * connections that dominate this audience. It also would not answer the question
 * the guest is really asking.
 *
 * That question is never "show me a map". It is "how long will it take me to get
 * to Trans-Amadi / the airport / the office every morning?" A drive-time list
 * answers it directly and in one glance; a map makes the guest work it out.
 * The Maps link is there for anyone who does want to see the pin.
 *
 * The site's own area guides already made these proximity claims in prose
 * ("20–30 minutes from the airport") while no listing page ever showed them —
 * so this also closes a gap between what the content promised and what the
 * product delivered.
 */
export default function LocationPanel({
  location,
  mapQuery,
  nearby,
  areaName,
  areaHref,
}: {
  location: string;
  mapQuery: string;
  nearby: NearbyPlace[];
  areaName?: string;
  areaHref?: string;
}) {
  return (
    <section
      className="bg-white rounded-2xl border border-slate-200 p-6"
      aria-labelledby="location-heading"
    >
      <h2
        id="location-heading"
        className="font-display text-xl font-bold text-charcoal mb-2"
      >
        Where you&apos;ll be
      </h2>
      <p className="flex items-center gap-1.5 text-sm text-slate-700 mb-5">
        <MapPin className="size-4 text-gold-text shrink-0" aria-hidden="true" />
        {location}
      </p>

      {/* Exact street address is deliberately withheld until booking — standard
          practice for shortlets, and it protects the current guest's privacy.
          Saying so explicitly stops it reading like an omission, which is how a
          fraud-anxious guest would otherwise interpret it. */}
      <p className="text-xs text-slate-600 mb-5 leading-relaxed">
        The exact address and gate access details are sent with your booking
        confirmation — standard practice to protect the privacy of guests
        currently staying.
      </p>

      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
        Typical drive times
      </h3>
      <ul className="flex flex-col gap-2 mb-6">
        {nearby.map((place) => (
          <li
            key={place.name}
            className="flex items-baseline justify-between gap-4 border-b border-slate-100 pb-2 last:border-0"
          >
            <span className="text-sm text-slate-700">{place.name}</span>
            {/* tabular-nums so the numbers align in a column rather than
                jittering with digit width. */}
            <span className="flex items-center gap-1.5 text-sm font-medium text-charcoal tabular-nums shrink-0">
              <Car className="size-3.5 text-slate-500" aria-hidden="true" />
              {place.minutes} min
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-600 mb-5">
        Drive times are typical off-peak estimates. Port Harcourt traffic can add
        15–20 minutes at rush hour.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild variant="onLight" size="sm">
          <a
            href={mapsDirectionsUrl(mapQuery)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            View area on Google Maps
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Button>
        {areaName && areaHref && (
          <Button asChild variant="ghost" size="sm">
            <a href={areaHref}>More short-lets in {areaName}</a>
          </Button>
        )}
      </div>
    </section>
  );
}
