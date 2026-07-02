"use server";

import { supabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function updateAvailability(
  slug: string,
  available: boolean,
  availableFrom: string | null,
) {
  const { error } = await supabaseServer
    .from("apartments")
    .update({
      available,
      available_from: availableFrom,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) {
    throw new Error(`Failed to update availability: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/apartments");
  revalidatePath(`/apartments/${slug}`);
  revalidatePath("/admin");
}
