import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

const guarantees = [
  "Exact apartment as advertised — no bait and switch",
  "24/7 power supply in every apartment",
  "Response within 30 minutes on WhatsApp",
  "Full refund if apartment does not match description",
];

export default function CTABanner() {
  return (
    <section className="relative py-24 overflow-hidden">

      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600"
        alt="Premium Haven Shortlets apartment"
        fill
        className="object-cover"
        sizes="100vw"
      />

      {/* Overlay — dark on the left to keep the heading/text legible,
          lighter on the right so the apartment image reads through */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/40" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — CTA */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-0.5 bg-gold" />
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Book Your Stay
              </span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Your Port Harcourt{" "}
              <span className="italic text-gold">Home Away</span>{" "}
              From Home.
            </h2>

            <p className="text-white/60 text-lg leading-relaxed mb-10">
              Premium apartments. Honest pricing. Human hosts. Book direct
              today and experience Port Harcourt accommodation the way it
              should be — no surprises, no hidden fees, no disappointments.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
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
                phone="2348098765432"
                message="Hello Haven Shortlets, I am ready to book. Please confirm apartment availability and send me the booking details."
                label="Book on WhatsApp"
                size="lg"
                className="w-full sm:w-auto"
              />
            </div>

            {/* Direct Call */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-full">
                <Phone className="w-4 h-4 text-gold" />
              </div>
              <p className="text-white/50 text-sm">
                Prefer to call?{" "}
                <a
                  href="tel:+2348098765432"
                  className="text-white font-semibold hover:text-gold transition-colors"
                >
                  0809 876 5432
                </a>
              </p>
            </div>
          </div>

          {/* Right — Guarantees */}
          <div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">

              <p className="font-display text-xl font-bold text-white mb-2">
                The Haven Promise
              </p>
              <p className="text-white/50 text-sm mb-8">
                Every booking at Haven Shortlets comes with these
                guarantees — no exceptions.
              </p>

              <div className="flex flex-col gap-5">
                {guarantees.map((guarantee, index) => (
                  <div
                    key={guarantee}
                    className="flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
                      <span className="font-display text-gold text-xs font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed pt-1">
                      {guarantee}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}