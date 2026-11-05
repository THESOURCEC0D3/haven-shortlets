/** Raw shape of a row in the Supabase `apartments` availability table. */
export interface ApartmentAvailability {
  id: string;
  slug: string;
  available: boolean;
  available_from: string | null;
  updated_at: string;
}

/**
 * Resolved availability, as the UI should reason about it.
 *
 * WHY THREE STATES AND NOT A BOOLEAN
 *
 * The old code did `availability?.available ?? true` in seven places. Read that
 * out loud: "if we have no idea whether this apartment is free, tell the guest
 * it's free." That is failing OPEN, and for a booking business it is the
 * expensive direction to fail:
 *
 *   Supabase down / slug renamed / row missing
 *     → every apartment shows "Available — Book Now"
 *     → guests WhatsApp about apartments that are already booked
 *     → the host looks incompetent at the exact moment of highest intent.
 *
 * Failing CLOSED with `?? false` would be a lie in the other direction
 * ("Booked" when it may be free), which loses bookings outright.
 *
 * The correct answer is a third state. "unknown" renders an honest
 * "Check availability" prompt with a WhatsApp CTA — so the guest is never
 * misled, and crucially THE LEAD IS STILL CAPTURED. We lose nothing and we
 * stop lying.
 *
 * The general rule: default to the state where being wrong is cheapest.
 */
export type AvailabilityState = "available" | "booked" | "unknown";

export interface AvailabilityStatus {
  state: AvailabilityState;
  /** ISO date this apartment frees up again, when known and currently booked. */
  availableFrom: string | null;
  /** When the host last touched this row — used for a freshness hint. */
  updatedAt: string | null;
}

/** Shape of a booking enquiry captured from the contact form. */
export interface BookingEnquiry {
  name: string;
  phone: string;
  email: string | null;
  enquiry_type: string;
  check_in: string | null;
  nights: number | null;
  message: string | null;
  apartment_slug: string | null;
  source: string;
}
