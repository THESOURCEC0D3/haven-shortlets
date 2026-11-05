/**
 * Single source of truth for reading availability and for knowing which URLs
 * depend on it.
 *
 * Two defects lived here before:
 *
 * 1. THE HELPER WAS BYPASSED. `getAvailabilityMap()` existed, but
 *    /apartments, ApartmentsPreview and /admin each hand-rolled the same
 *    query-and-build-a-Map loop. Three copies of one piece of logic — the
 *    abstraction was written and then not adopted, which is what happens when
 *    a helper is extracted after its first callers already exist.
 *
 * 2. THE FETCH SWALLOWED ERRORS. `const { data } = await supabase...`
 *    discarded `error`, so a failed query was indistinguishable from an empty
 *    table — and the callers' `?? true` then reported every apartment as
 *    bookable. We now surface `ok` so the UI can render "unknown" honestly.
 */

import { supabase } from "@/lib/supabase";
import type { ApartmentAvailability, AvailabilityStatus } from "@/lib/types";
import { apartments, getAreaTypeCombos } from "@/lib/data/apartments";
import { areas } from "@/lib/data/areas";

export interface AvailabilityLookup {
  /** false when the query itself failed — every apartment becomes "unknown". */
  ok: boolean;
  rows: Record<string, ApartmentAvailability>;
}

export async function getAvailabilityLookup(): Promise<AvailabilityLookup> {
  const { data, error } = await supabase.from("apartments").select("*");

  if (error || !data) {
    // Log so a real failure is visible in server logs rather than silently
    // degrading into a wrong answer on a customer-facing page.
    if (error) {
      console.error("[availability] Supabase read failed:", error.message);
    }
    return { ok: false, rows: {} };
  }

  const rows: Record<string, ApartmentAvailability> = {};
  for (const row of data as ApartmentAvailability[]) {
    rows[row.slug] = row;
  }
  return { ok: true, rows };
}

/**
 * Turn a raw row (or its absence) into the three-state status the UI renders.
 *
 * The `lookupOk` argument is what makes "unknown" possible: without it, a
 * missing row and a broken database look identical to the caller.
 */
export function resolveAvailability(
  row: ApartmentAvailability | undefined | null,
  lookupOk: boolean,
): AvailabilityStatus {
  if (!lookupOk || !row) {
    // Either the database is unreachable, or this apartment's slug has no
    // matching row — which happens when a slug is renamed in
    // lib/data/apartments.ts and the Supabase row orphans. The join key is an
    // unenforced string with no foreign key, so this is a real failure mode,
    // not a hypothetical one.
    return { state: "unknown", availableFrom: null, updatedAt: null };
  }

  return {
    state: row.available ? "available" : "booked",
    availableFrom: row.available_from,
    updatedAt: row.updated_at,
  };
}

/** Resolve every known apartment in one pass. Used by all listing surfaces. */
export async function getAvailabilityStatuses(): Promise<
  Record<string, AvailabilityStatus>
> {
  const { ok, rows } = await getAvailabilityLookup();
  const out: Record<string, AvailabilityStatus> = {};
  for (const apartment of apartments) {
    out[apartment.slug] = resolveAvailability(rows[apartment.slug], ok);
  }
  return out;
}

/** How many apartments are bookable right now — powers honest scarcity copy. */
export function countAvailable(
  statuses: Record<string, AvailabilityStatus>,
): number {
  return Object.values(statuses).filter((s) => s.state === "available").length;
}

/**
 * EVERY route whose rendered HTML contains an availability badge.
 *
 * This is the fix for the stale-availability defect. The admin action used to
 * revalidate four hardcoded paths — "/", "/apartments", "/apartments/[slug]"
 * and "/admin" — and silently missed all eight /port-harcourt landing pages,
 * which also render availability and which are the pages the entire
 * programmatic-SEO strategy exists to rank. A guest arriving from Google saw a
 * green "Available — Book Now" badge on an apartment booked weeks earlier.
 *
 * The important part is not that the list is now complete. It is that the list
 * is DERIVED from the same data that generates the routes, so it cannot drift.
 * A hand-maintained list of paths always rots — this one already had, inside a
 * single release cycle. Add an area to areas.ts and this covers its pages
 * automatically.
 *
 * (The idiomatic Next 16 answer is `use cache` + `cacheTag` + `revalidateTag`,
 * which attaches invalidation to the DATA rather than to routes. That requires
 * opting the whole app into Cache Components via `cacheComponents: true`, which
 * changes rendering behaviour app-wide — a deliberate migration, not a bug fix.
 * `unstable_cache` is explicitly deprecated in favour of it, so we do not reach
 * for that either. When you adopt Cache Components this collapses to a single
 * `revalidateTag("availability")` call.)
 */
export function availabilityDependentPaths(): string[] {
  return [
    "/", // ApartmentsPreview renders featured cards
    "/apartments", // full listing
    "/port-harcourt", // city hub renders every card
    "/admin", // the dashboard itself
    ...apartments.map((a) => `/apartments/${a.slug}`),
    ...areas.map((area) => `/port-harcourt/${area.slug}`),
    ...getAreaTypeCombos().map(
      ({ area, type }) => `/port-harcourt/${area}/${type}`,
    ),
  ];
}
