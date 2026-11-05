import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase-server";
import { apartments } from "@/lib/data/apartments";
import { resolveAvailability } from "@/lib/availability";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/auth";
import type { ApartmentAvailability, AvailabilityStatus } from "@/lib/types";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();

  // Verifies the HMAC signature and expiry rather than string-comparing against
  // the constant "authenticated", which anyone could type into devtools.
  const session = await verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!session) {
    redirect("/admin/login");
  }

  const { data, error } = await supabaseServer.from("apartments").select("*");

  if (error) {
    console.error("Failed to load availability from Supabase:", error.message);
  }

  const rows: Record<string, ApartmentAvailability> = {};
  for (const row of (data ?? []) as ApartmentAvailability[]) {
    rows[row.slug] = row;
  }

  // Same resolver the public site uses, so the admin sees exactly the state a
  // guest would see. Previously the admin used `?? true` independently, which
  // meant the two surfaces could disagree about the same apartment.
  const statuses: Record<string, AvailabilityStatus> = {};
  for (const apartment of apartments) {
    statuses[apartment.slug] = resolveAvailability(
      rows[apartment.slug],
      !error,
    );
  }

  return (
    <AdminDashboard
      apartments={apartments}
      statuses={statuses}
      loadError={error?.message ?? null}
    />
  );
}
