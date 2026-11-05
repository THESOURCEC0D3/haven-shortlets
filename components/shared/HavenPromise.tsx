import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/**
 * The four booking guarantees.
 *
 * WHY THIS IS A COMPONENT AND NOT PROSE IN TWO PLACES
 *
 * These four promises were hardcoded separately in CTABanner and on the
 * apartment detail page. They are the site's core trust claims, and two
 * independent copies were free to drift apart — which is the worst possible
 * thing to duplicate on a trust-led brand. If the refund window changes and
 * only one copy is updated, the site contradicts itself about its own guarantee,
 * and a guest who spots that has every reason to doubt the rest.
 *
 * The response-time figure comes from siteConfig, so the number quoted here can
 * never disagree with the number quoted in the navbar, the FAQs, or the
 * WhatsApp reassurance copy.
 */
const promises = [
  "The exact apartment you see here — no bait and switch",
  "24/7 uninterrupted power in every apartment",
  `A reply from a named human within ${siteConfig.responseTimeMinutes} minutes`,
  "Full refund if the apartment is not as described",
];

export default function HavenPromise({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const isDark = variant === "dark";
  return (
    <section
      className={cn(
        "rounded-2xl p-6",
        isDark ? "bg-charcoal text-white" : "bg-white border border-slate-200",
        className,
      )}
      aria-labelledby="haven-promise-heading"
    >
      <h2
        id="haven-promise-heading"
        className={cn(
          "font-display text-lg font-bold mb-4",
          isDark ? "text-white" : "text-charcoal",
        )}
      >
        The Haven Promise
      </h2>
      <ul className="flex flex-col gap-3">
        {promises.map((promise) => (
          <li key={promise} className="flex items-start gap-3">
            <CheckCircle
              className="size-4 text-gold shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span
              className={cn(
                "text-sm leading-relaxed",
                // white/70 measured 9.1:1 but reads washed out at this size;
                // /85 keeps it comfortably AAA and more legible.
                isDark ? "text-white/85" : "text-slate-700",
              )}
            >
              {promise}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
