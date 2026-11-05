import { Phone } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { bookingLabel } from "@/lib/booking-label";
import { formatPrice } from "@/lib/data/apartments";
import { telHref } from "@/lib/site";
import type { AvailabilityStatus } from "@/lib/types";

/**
 * Persistent booking bar, mobile only.
 *
 * THE PROBLEM IT SOLVES
 *
 * On a phone the listing page's two-column grid collapses to one column, and
 * because DOM order is render order the booking sidebar rendered AFTER the
 * gallery, the description, every amenity, the internal links and four FAQ
 * accordions. A guest had to scroll roughly five screens before they could see
 * what the apartment cost or how to book it — on the device that is the majority
 * of traffic for a Nigerian shortlet business.
 *
 * Every OTA (Airbnb, Booking.com) pins price + action to the bottom of the
 * viewport on mobile for exactly this reason: the two facts a guest needs at
 * every moment are "what does it cost" and "how do I ask about it".
 *
 * WHY THIS IS A SERVER COMPONENT
 *
 * It needs no scroll listener and no state — `fixed bottom-0` plus `md:hidden`
 * is pure CSS. Reaching for `useState` + a scroll handler here would ship
 * JavaScript to do a job the style sheet already does, and would risk layout
 * shift on hydration. If a behaviour can be expressed in CSS, it should be.
 */
export default function StickyBookingBar({
  name,
  pricePerNight,
  status,
  whatsappMessage,
}: {
  name: string;
  pricePerNight: number;
  status: AvailabilityStatus;
  whatsappMessage: string;
}) {
  const label = bookingLabel(status.state);

  return (
    <>
      {/* Spacer so the bar never covers the last of the page content. Without
          it, the final element sits permanently behind the bar and can't be
          read or tapped. */}
      <div className="h-20 md:hidden" aria-hidden="true" />

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 md:hidden [padding-bottom:calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="font-display text-lg font-bold text-charcoal leading-none">
              {formatPrice(pricePerNight)}
              <span className="text-xs font-normal text-slate-600">/night</span>
            </p>
            <p className="text-xs text-green-700 font-medium mt-0.5">
              No platform fees
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <a
              href={telHref}
              aria-label={`Call about the ${name}`}
              className="grid size-11 shrink-0 place-items-center rounded-lg border border-charcoal text-charcoal transition-colors hover:bg-charcoal hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-text"
            >
              <Phone className="size-4" aria-hidden="true" />
            </a>
            <WhatsAppButton
              message={whatsappMessage}
              label={label}
              muted={status.state === "booked"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
