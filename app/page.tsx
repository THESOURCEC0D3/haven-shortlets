import HeroSection from "@/components/home/HeroSection";
import WhyBookDirect from "@/components/home/WhyBookDirect";
import ApartmentsPreview from "@/components/home/ApartmentsPreview";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";
import FaqSection from "@/components/seo/FaqSection";
import JsonLd from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/seo/structured-data";

// Home FAQs — the most-visited page is the best place to surface the high-
// intent, extractable answers AI search engines reward.
const faqs = [
  {
    question: "How much does a short-let apartment cost in Port Harcourt?",
    answer:
      "Short-let apartments in Port Harcourt range from ₦55,000 to ₦150,000 per night. Woji studios start around ₦55,000, while GRA executive suites reach ₦150,000. Weekly and monthly rates reduce the per-night cost.",
  },
  {
    question: "How is booking direct cheaper than Airbnb?",
    answer:
      "Booking direct with Haven Shortlets removes the 15–25% service fees Airbnb adds at checkout, so you pay less for the same apartment. Confirmation is by WhatsApp, usually within 30 minutes.",
  },
  {
    question: "Do the apartments have 24/7 power?",
    answer:
      "Yes. Every Haven Shortlets apartment in GRA and Woji includes 24/7 uninterrupted power supply, fast Wi-Fi, and air conditioning as standard.",
  },
  {
    question: "Where in Port Harcourt are the apartments?",
    answer:
      "Apartments are in two prime areas: GRA — the central, premium neighbourhood — and Woji, the better-value corridor near Trans-Amadi. Both are secure and gated.",
  },
];

export default async function HomePage() {
  return (
    <div>
      <JsonLd data={faqSchema(faqs)} />
      <HeroSection />
      <WhyBookDirect />
      <ApartmentsPreview />
      <HowItWorks />
      <Testimonials />
      <section className="bg-ivory py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FaqSection faqs={faqs} />
        </div>
      </section>
      <CTABanner />
    </div>
  );
}
