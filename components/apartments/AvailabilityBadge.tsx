import { Check, CalendarClock, HelpCircle } from "lucide-react";
import type { AvailabilityStatus } from "@/lib/types";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
  size?: "sm" | "md";
  className?: string;
}

const sizeClasses = {
  sm: "text-xs px-2 py-1 gap-1.5",
  md: "text-sm px-3 py-1.5 gap-2",
} as const;

/**
 * Availability status pill.
 *
 * Two changes beyond the three-state refactor:
 *
 * 1. AN ICON PER STATE, not colour alone. The old badge distinguished
 *    available from booked with green vs red — the single most common
 *    colour-blindness axis. WCAG 1.4.1 (Use of Colour) requires that colour is
 *    never the ONLY channel carrying meaning. The text did differ, which
 *    already saved it, but a shape makes the distinction instant for everyone
 *    and survives a greyscale screenshot.
 * 2. `motion-reduce:animate-none` on the pulse dot. globals.css now has a
 *    global reduced-motion net, but stating it locally documents the intent at
 *    the point of use.
 */
export default function AvailabilityBadge({
  status,
  size = "md",
  className,
}: AvailabilityBadgeProps) {
  const base =
    "inline-flex items-center font-medium rounded-full border whitespace-nowrap";

  if (status.state === "available") {
    return (
      <span
        className={cn(
          base,
          "bg-green-100 text-green-800 border-green-300",
          sizeClasses[size],
          className,
        )}
      >
        <span className="relative grid size-2 shrink-0 place-items-center">
          <span className="absolute size-2 rounded-full bg-green-600 animate-ping motion-reduce:animate-none" />
          <span className="size-2 rounded-full bg-green-600" />
        </span>
        Available now
      </span>
    );
  }

  if (status.state === "booked") {
    return (
      <span
        className={cn(
          base,
          "bg-slate-100 text-slate-700 border-slate-300",
          sizeClasses[size],
          className,
        )}
      >
        <CalendarClock className="size-3.5 shrink-0" aria-hidden="true" />
        {status.availableFrom
          ? `Booked — free from ${formatAvailableFrom(status.availableFrom)}`
          : "Currently booked"}
      </span>
    );
  }

  // "unknown" — the database is unreachable or this slug has no row.
  //
  // The old code rendered "Available — Book Now" here, because `?? true` treated
  // "no information" as "yes". That sent guests to WhatsApp about apartments
  // that were already booked. This wording is honest AND still converts: the
  // guest's next action is the same message to the same host.
  return (
    <span
      className={cn(
        base,
        "bg-gold/15 text-gold-text border-gold/40",
        sizeClasses[size],
        className,
      )}
    >
      <HelpCircle className="size-3.5 shrink-0" aria-hidden="true" />
      Check availability
    </span>
  );
}

/**
 * Small companion used in the booking sidebar, where there is room for a
 * sentence rather than a pill.
 */
export function AvailabilityNote({ status }: { status: AvailabilityStatus }) {
  if (status.state === "available") {
    return (
      <p className="flex items-start gap-2 text-sm text-green-800">
        <Check className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>Free to book on your dates — confirm in one message.</span>
      </p>
    );
  }
  if (status.state === "booked") {
    return (
      <p className="flex items-start gap-2 text-sm text-slate-600">
        <CalendarClock className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          {status.availableFrom
            ? `This apartment is booked until ${formatAvailableFrom(status.availableFrom)}. Join the waitlist or ask about a similar apartment.`
            : "This apartment is currently booked. Ask us when it frees up, or about a similar apartment."}
        </span>
      </p>
    );
  }
  return (
    <p className="flex items-start gap-2 text-sm text-slate-600">
      <HelpCircle className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
      <span>
        We could not load live availability just now. Message us with your dates
        and we will confirm within {siteConfig.responseTimeMinutes} minutes.
      </span>
    </p>
  );
}

function formatAvailableFrom(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "soon";
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
