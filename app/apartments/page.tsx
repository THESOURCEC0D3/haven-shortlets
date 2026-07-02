import { supabase } from "@/lib/supabase";
import { apartments } from "@/lib/data/apartments";
import { ApartmentAvailability } from "@/lib/types";
import ApartmentsClient from "@/components/apartments/ApartmentsClient";
import { pageMetadata } from "@/lib/seo/metadata";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/structured-data";

export const metadata = pageMetadata({
  title: "Our Apartments",
  description:
    "Browse premium short-let apartments in Port Harcourt. GRA and Woji locations. All apartments include 24/7 power, Wi-Fi, and air conditioning. Book direct and save up to 25%.",
  path: "/apartments",
});

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
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Apartments", path: "/apartments" },
          ]),
          itemListSchema(apartments),
        ]}
      />
      <ApartmentsClient
        apartments={apartments}
        availabilityMap={Object.fromEntries(availabilityMap)}
      />
    </>
  );
}
