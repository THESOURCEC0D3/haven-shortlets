"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase-server";
import { availabilityDependentPaths } from "@/lib/availability";
import { verifyAdminSession } from "@/lib/auth";
import { getApartmentBySlug } from "@/lib/data/apartments";
import type { BookingEnquiry } from "@/lib/types";

export async function updateAvailability(
  slug: string,
  available: boolean,
  availableFrom: string | null,
) {
  // AUTHORISE INSIDE THE ACTION.
  //
  // A Server Action is a public HTTP endpoint. Next.js generates an id for it
  // and anyone who can read your JS bundle can POST to it directly — the
  // proxy.ts redirect and the /admin page's cookie check both guard the *page*,
  // not this function. Without this line, an unauthenticated request could
  // toggle any apartment's availability while never loading /admin at all.
  //
  // This is the single most commonly missed thing about Server Actions: people
  // treat them like private functions because they look like private functions.
  const cookieStore = await cookies();
  const session = await verifyAdminSession(
    cookieStore.get("haven-admin-auth")?.value,
  );
  if (!session) {
    throw new Error("Not authorised.");
  }

  // Reject slugs that aren't ours before touching the database.
  if (!getApartmentBySlug(slug)) {
    throw new Error(`Unknown apartment: ${slug}`);
  }

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

  // Revalidate EVERY route that renders an availability badge, derived from the
  // data rather than hand-listed. See availabilityDependentPaths() for why the
  // previous four-path list was both incomplete and structurally doomed to
  // become incomplete again.
  for (const path of availabilityDependentPaths()) {
    revalidatePath(path);
  }
}

/**
 * Persist a booking enquiry, then let the caller hand off to WhatsApp.
 *
 * WHY THIS EXISTS AT ALL: every lead path on this site used to terminate in
 * WhatsApp and nothing was ever recorded. If the handoff failed — and it did
 * fail, see ContactForm — the enquiry was gone, along with any chance of
 * following up. A booking business that cannot list yesterday's enquiries has
 * no funnel, only luck.
 *
 * Failure here is deliberately NON-fatal: if the insert fails we log it and
 * return ok:false, but the form still opens WhatsApp. Losing the CRM record is
 * bad; blocking a guest from reaching the host is worse.
 */
export async function saveEnquiry(
  enquiry: BookingEnquiry,
): Promise<{ ok: boolean }> {
  try {
    const { error } = await supabaseServer.from("enquiries").insert({
      ...enquiry,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[enquiry] insert failed:", error.message);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[enquiry] insert threw:", err);
    return { ok: false };
  }
}
