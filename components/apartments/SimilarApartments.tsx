import ApartmentCard from "@/components/apartments/ApartmentCard";
import { apartments, type Apartment } from "@/lib/data/apartments";
import type { AvailabilityStatus } from "@/lib/types";

/**
 * "Other apartments you could book" — the recovery path for a dead end.
 *
 * WHY THIS MATTERS COMMERCIALLY
 *
 * A booked listing used to terminate in a disabled button and a waitlist CTA.
 * The waitlist was good thinking, but it asked the guest to wait — and a guest
 * with fixed travel dates cannot wait. They leave and book elsewhere.
 *
 * Basic e-commerce principle: a product page that cannot fulfil the order should
 * always offer alternatives. Here it is stronger than usual, because the
 * alternatives are ours — the guest's need (a place in Port Harcourt on those
 * dates) is still one we can meet with a different unit.
 *
 * RANKING LOGIC: prefer apartments that are actually available, then those in
 * the same area (a guest who chose GRA usually has a reason), then closest in
 * price. Showing a booked alternative first would repeat the original problem.
 */
export default function SimilarApartments({
  current,
  statuses,
  limit = 3,
}: {
  current: Apartment;
  statuses: Record<string, AvailabilityStatus>;
  limit?: number;
}) {
  const candidates = apartments
    .filter((a) => a.slug !== current.slug)
    .map((a) => {
      const state = statuses[a.slug]?.state ?? "unknown";
      return {
        apartment: a,
        // Lower score sorts first.
        score:
          (state === "available" ? 0 : state === "unknown" ? 1 : 2) * 1_000_000 +
          (a.area === current.area ? 0 : 100_000) +
          Math.abs(a.pricePerNight - current.pricePerNight),
      };
    })
    .sort((x, y) => x.score - y.score)
    .slice(0, limit);

  if (candidates.length === 0) return null;

  return (
    <section
      className="bg-white rounded-2xl border border-slate-200 p-6"
      aria-labelledby="similar-heading"
    >
      <h2
        id="similar-heading"
        className="font-display text-xl font-bold text-charcoal mb-1"
      >
        Other apartments you could book
      </h2>
      <p className="text-sm text-slate-600 mb-5">
        Same standards — 24/7 power, fast Wi-Fi, air conditioning, no platform
        fees.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {candidates.map(({ apartment }) => (
          <ApartmentCard
            key={apartment.id}
            apartment={apartment}
            status={statuses[apartment.slug]}
            // Nested under this section's <h2>, so the cards are h3.
            headingLevel="h3"
          />
        ))}
      </div>
    </section>
  );
}
