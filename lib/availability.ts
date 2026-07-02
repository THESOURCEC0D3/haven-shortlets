/**
 * Fetches the live availability rows from Supabase and returns them keyed by
 * apartment slug. Shared by every page that renders apartment cards (listing
 * + all programmatic landing pages) so the lookup logic lives in one place.
 */

import { supabase } from "@/lib/supabase";
import type { ApartmentAvailability } from "@/lib/types";

export async function getAvailabilityMap(): Promise<
  Record<string, ApartmentAvailability>
> {
  const { data } = await supabase.from("apartments").select("*");
  const map: Record<string, ApartmentAvailability> = {};
  if (data) {
    for (const row of data as ApartmentAvailability[]) {
      map[row.slug] = row;
    }
  }
  return map;
}
