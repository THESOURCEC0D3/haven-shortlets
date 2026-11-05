import type { AvailabilityStatus } from "@/lib/types";

// Kept out of lib/availability.ts on purpose: that module imports the Supabase
// client, and ApartmentCard renders inside a client component. Importing the
// label from there would ship the Supabase SDK to the browser for one string.

/**
 * The booking button's label for each availability state — ONE rule for the
 * card, the detail sidebar and the mobile bar. These used to be hardcoded per
 * component and had already drifted ("Check dates" vs "Check availability").
 *
 * - available → we KNOW it's free, so say "Book". "Check availability" here
 *   contradicted the green "Available" badge sitting right above it.
 *   "on WhatsApp" stays because the button opens a chat, not a checkout.
 * - unknown   → the database couldn't answer, so asking is honest.
 * - booked    → keep the lead: other dates or a similar unit may suit them.
 *
 * `short` exists for ONE place: the mobile booking bar on phones under 400px,
 * where the price, call button and full label cannot share a single row.
 * Everywhere else uses the full label.
 */
export function bookingLabel(
  state: AvailabilityStatus["state"],
  { short = false }: { short?: boolean } = {},
): string {
  switch (state) {
    case "available":
      return short ? "Book" : "Book on WhatsApp";
    case "booked":
      return short ? "Ask us" : "Ask about dates";
    case "unknown":
      return short ? "Check dates" : "Check availability";
  }
}
