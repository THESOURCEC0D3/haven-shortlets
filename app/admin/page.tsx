import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase-server";
import { apartments } from "@/lib/data/apartments";
import { ApartmentAvailability } from "@/lib/types";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("haven-admin-auth");

  if (!authCookie || authCookie.value !== "authenticated") {
    redirect("/admin/login");
  }

  const { data: availabilityData, error } = await supabaseServer
    .from("apartments")
    .select("*");

  if (error) {
    // Surface instead of silently defaulting every apartment to "available"
    console.error("Failed to load availability from Supabase:", error.message);
  }

  const availabilityMap = new Map<string, ApartmentAvailability>();
  if (availabilityData) {
    availabilityData.forEach((item: ApartmentAvailability) => {
      availabilityMap.set(item.slug, item);
    });
  }

  return (
    <AdminDashboard
      apartments={apartments}
      availabilityMap={Object.fromEntries(availabilityMap)}
      loadError={error?.message ?? null}
    />
  );
}
