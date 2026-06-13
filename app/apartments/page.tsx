import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { apartments } from "@/lib/data/apartments";
import { ApartmentAvailability } from "@/lib/types";
import ApartmentsClient from "@/components/apartments/ApartmentsClient";

export const metadata: Metadata = {
  title: "Our Apartments — Haven Shortlets PH",
  description:
    "Browse premium short-let apartments in Port Harcourt. GRA and Woji locations. All apartments include 24/7 power, Wi-Fi, and air conditioning. Book direct and save up to 25%.",
};

export default async function ApartmentsPage() {
  const { data: availabilityData } = await supabase
    .from("apartments")
    .select("*");

  const availabilityMap = new Map<string, ApartmentAvailability>();
  if (availabilityData) {
    availabilityData.forEach((item: ApartmentAvailability) => {
      availabilityMap.set(item.slug, item);
    });
  }

  return (
    <ApartmentsClient
      apartments={apartments}
      availabilityMap={Object.fromEntries(availabilityMap)}
    />
  );
}
