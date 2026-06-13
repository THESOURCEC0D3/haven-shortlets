import HeroSection from "@/components/home/HeroSection";
import WhyBookDirect from "@/components/home/WhyBookDirect";
import ApartmentsPreview from "@/components/home/ApartmentsPreview";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";

export default async function HomePage() {
  return (
    <div>
      <HeroSection />
      <WhyBookDirect />
      <ApartmentsPreview />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
    </div>
  );
}
