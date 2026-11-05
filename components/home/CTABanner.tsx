import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import HavenPromise from "@/components/shared/HavenPromise";
import { siteConfig, telHref } from "@/lib/site";

export default function CTABanner() {
  return (
    <section className="relative py-24 overflow-hidden">

      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600"
        // Decorative background: the heading beside it already conveys the meaning,
        // so alt="" keeps a screen reader from announcing a redundant description.
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />

      {/* Overlay — dark on the left to keep the heading/text legible,
          lighter on the right so the apartment image reads through */}
      <div className="absolute inset-0 bg-linear-to-r from-charcoal/90 via-charcoal/70 to-charcoal/40" />

      {/* Content */}
      <div data-reveal className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

            <p className="text-white/80 text-lg leading-relaxed mb-10">
              Premium apartments. Honest pricing. Human hosts. Book direct
              today and experience Port Harcourt accommodation the way it
              should be — no surprises, no hidden fees, no disappointments.
            </p>

            {/* CTA Buttons.
                `variant="primary"` replaces the copy-pasted
                "bg-gold hover:bg-gold-dark text-charcoal font-semibold" string
                that appeared in six files. And `<Button asChild>` wrapping the
                <Link> replaces <Link><Button> — the old nesting produced an
                anchor inside a button, which is invalid HTML and loses the
                button's own semantics and focus behaviour. */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button asChild variant="primary" size="lg" className="w-full sm:w-auto">
                <Link href="/apartments">
                  Browse apartments
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <WhatsAppButton
                message="Hello Haven Shortlets, I am ready to book. Please confirm availability and send me the booking details. My dates are: "
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
              <p className="text-white/75 text-sm">
                Prefer to call?{" "}
                <a
                  href={telHref}
                  className="text-white font-semibold hover:text-gold transition-colors"
                >
                  {siteConfig.phoneDisplay}
                </a>
              </p>
            </div>
          </div>

          {/* Right — Guarantees.
              These four promises were hardcoded HERE and again on every
              apartment page. They are the site's core trust claims, and two
              independent copies were free to drift apart — the worst possible
              thing to duplicate on a trust-led brand. Now one component, one
              source, and the response-time figure comes from siteConfig so it
              cannot contradict the navbar, the FAQs or the WhatsApp copy. */}
          <HavenPromise
            variant="dark"
            className="bg-white/5 backdrop-blur-sm border border-white/10"
          />

        </div>
      </div>

    </section>
  );
}