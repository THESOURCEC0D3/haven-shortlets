import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import HostProfile from "@/components/about/HostProfile";
import AboutCTA from "@/components/about/AboutCTA";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Learn about Haven Shortlets PH — Port Harcourt's most trusted short-let operator. Premium apartments in GRA and Woji. Book direct and save up to 25% vs Airbnb.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <OurStory />
      <WhyChooseUs />
      <HostProfile />
      <AboutCTA />
    </div>
  );
}
