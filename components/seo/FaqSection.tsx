/**
 * Visible FAQ block, rendered as native <details>/<summary> so it needs zero
 * client JavaScript and works in the initial HTML (good for crawlers + AI).
 *
 * IMPORTANT: always pass the SAME faqs array to both this component and
 * faqSchema() on the page. Google requires the FAQ rich-result content to be
 * visible on the page — schema that doesn't match visible text is a violation.
 */

import { useId } from "react";
import type { AreaFaq } from "@/lib/data/areas";
import { cn } from "@/lib/utils";

interface FaqSectionProps {
  faqs: AreaFaq[];
  title?: string;
  className?: string;
}

export default function FaqSection({
  faqs,
  title = "Frequently Asked Questions",
  className,
}: FaqSectionProps) {
  // The heading id was previously the hardcoded string "faq-heading", and
  // aria-labelledby pointed at it. That works only while exactly one FaqSection
  // exists per page; a second instance produces DUPLICATE DOM ids — invalid
  // HTML, and screen readers resolve the association unpredictably. Now that
  // apartment pages carry both a policies FAQ and a listing FAQ, that second
  // instance is real. useId() gives a guaranteed-unique, SSR-stable id.
  const headingId = useId();

  if (!faqs.length) return null;

  return (
    <section
      className={cn(
        "bg-white rounded-2xl border border-slate-200 p-6",
        className,
      )}
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        className="font-display text-xl font-bold text-charcoal mb-4"
      >
        {title}
      </h2>
      <div className="flex flex-col divide-y divide-slate-100">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-3">
            <summary className="cursor-pointer list-none font-medium text-charcoal flex items-center justify-between gap-4 rounded-sm py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-text">
              {faq.question}
              {/* aria-hidden: the +/× is a visual affordance. <details> already
                  exposes expanded/collapsed state to assistive tech natively,
                  so announcing "plus" would be noise. */}
              <span
                className="text-gold-text transition-transform group-open:rotate-45 shrink-0"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
