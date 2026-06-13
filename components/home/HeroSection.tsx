import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Shield, Zap, BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

const trustPills = [
  { icon: BadgePercent, text: "Save up to 25% vs Airbnb" },
  { icon: Zap, text: "Instant WhatsApp confirmation" },
  { icon: Shield, text: "Verified — no surprises" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Full-Bleed Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600"
        alt="Premium shortlet apartment interior in Port Harcourt"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Dark Overlay — horizontal gradient anchors the text side, vertical
          layer adds a baseline darkening so white text stays legible over
          any bright spot in the image */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/80 to-charcoal/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/20 to-charcoal/30" />

      {/* Content */}
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-20 py-24">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-gold" />
            <span className="text-gold text-sm font-medium tracking-widest uppercase">
              Port Harcourt
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
            The Shortlet You Can Actually{" "}
            <span className="text-gold italic">trust</span>{" "}
            <br className="hidden md:block" />
            in Port Harcourt.
          </h1>

          {/* Subheadline */}
          <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-4">
            Premium short-let apartments in GRA and Woji. Skip the Airbnb fees —
            book directly and keep the savings.
          </p>

          {/* Signature Price Element */}
          <div className="flex items-baseline gap-2 mb-10">
            <span className="font-display text-gold text-4xl md:text-5xl font-bold">
              ₦55,000
            </span>
            <span className="text-white/50 text-lg font-sans">/night</span>
            <span className="text-white/40 text-sm ml-2">— starting price</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
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
              message="Hello Haven Shortlets, I would like to book an apartment. Please confirm availability."
              label="Book on WhatsApp"
              size="lg"
              className="w-full sm:w-auto"
            />
          </div>

          {/* Trust Pills */}
          <div className="flex flex-wrap gap-3">
            {trustPills.map((pill) => (
              <div
                key={pill.text}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2"
              >
                <pill.icon className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="text-white/80 text-xs font-medium">
                  {pill.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ivory to-transparent" /> */}
    </section>
  );
}
