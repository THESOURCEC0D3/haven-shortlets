import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

export default function AboutCTA() {
  return (
    <section className="py-20 bg-charcoal text-white">
      <div data-reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-0.5 bg-gold" />
          <span className="text-gold text-sm font-medium tracking-widest uppercase">
            Ready to Stay?
          </span>
          <div className="w-8 h-0.5 bg-gold" />
        </div>

        <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
          Experience Port Harcourt{" "}
          <span className="italic text-gold">The Right Way.</span>
        </h2>

        <p className="text-white/80 text-lg max-w-xl mx-auto mb-10">
          Browse our verified apartments and book direct. No platform fees, no
          surprises, no disappointments.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/apartments">
            <Button
              size="lg"
              className="bg-gold hover:bg-gold-dark text-charcoal font-semibold w-full sm:w-auto gap-2"
            >
              Browse Apartments
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <WhatsAppButton
            message="Hello Haven Shortlets, I would like to book an apartment. Please help me find the right one."
            label="Talk to Chidi"
            size="lg"
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </section>
  );
}
