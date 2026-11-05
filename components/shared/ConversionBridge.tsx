import Link from "next/link";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { siteConfig, telHref } from "@/lib/site";

/**
 * Closing call-to-action for content and landing pages.
 *
 * WHY THIS EXISTS
 *
 * The audit found a specific, expensive inconsistency: the homepage, the About
 * page and the individual guides all closed with a CTA, but every single one of
 * the eight /port-harcourt landing pages ended on an FAQ accordion with no ask
 * at all.
 *
 * Those are the highest-intent pages on the site. Someone who searches
 * "short let GRA Port Harcourt" and lands on /port-harcourt/gra has already
 * decided they want a short let in GRA — they are further down the funnel than a
 * homepage visitor. The one place the CTA pattern broke was the one place it paid
 * the most.
 *
 * The `/guides/[slug]` pages already did this correctly, so this component is
 * that proven block extracted and made reusable rather than something new.
 *
 * Two routes, not one: WhatsApp for the ready, browse for the still-deciding.
 * The label is parameterised so the ask can match the page's context — a guest on
 * the Woji page should be invited to ask about Woji, not "an apartment".
 */
export default function ConversionBridge({
  heading = "Ready to book your Port Harcourt stay?",
  subheading,
  whatsappMessage,
  browseHref = "/apartments",
  browseLabel = "Browse apartments",
}: {
  heading?: string;
  subheading?: string;
  whatsappMessage: string;
  browseHref?: string;
  browseLabel?: string;
}) {
  return (
    <section
      className="bg-charcoal rounded-2xl p-6 sm:p-8 text-center"
      aria-labelledby="conversion-bridge-heading"
    >
      <h2
        id="conversion-bridge-heading"
        className="font-display text-xl sm:text-2xl font-bold text-white mb-2"
      >
        {heading}
      </h2>
      <p className="text-white/80 text-sm sm:text-base mb-6 max-w-lg mx-auto leading-relaxed">
        {subheading ??
          `Send us your dates and we will confirm availability within ${siteConfig.responseTimeMinutes} minutes — with a written confirmation before you pay anything.`}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <WhatsAppButton message={whatsappMessage} label="Check availability" size="lg" />
        <Button asChild variant="onDark" size="lg">
          <Link href={browseHref}>{browseLabel}</Link>
        </Button>
      </div>
      <p className="text-white/75 text-xs mt-5">
        Or call{" "}
        <a
          href={telHref}
          className="text-white font-medium underline decoration-gold decoration-2 underline-offset-4"
        >
          {siteConfig.phoneDisplay}
        </a>
      </p>
    </section>
  );
}
