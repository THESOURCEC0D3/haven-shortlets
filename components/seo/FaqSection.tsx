/**
 * Visible FAQ block, rendered as native <details>/<summary> so it needs zero
 * client JavaScript and works in the initial HTML (good for crawlers + AI).
 *
 * IMPORTANT: always pass the SAME faqs array to both this component and
 * faqSchema() on the page. Google requires the FAQ rich-result content to be
 * visible on the page — schema that doesn't match visible text is a violation.
 */

import type { AreaFaq } from "@/lib/data/areas";

interface FaqSectionProps {
  faqs: AreaFaq[];
  title?: string;
  /** Heading level — pages with their own H1 should keep this an h2 (default). */
  className?: string;
}

export default function FaqSection({
  faqs,
  title = "Frequently Asked Questions",
  className = "",
}: FaqSectionProps) {
  if (!faqs.length) return null;

  return (
    <section
      className={`bg-white rounded-2xl border border-slate-200 p-6 ${className}`}
      aria-labelledby="faq-heading"
    >
      <h2
        id="faq-heading"
        className="font-display text-xl font-bold text-charcoal mb-4"
      >
        {title}
      </h2>
      <div className="flex flex-col divide-y divide-slate-100">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-3">
            <summary className="cursor-pointer list-none font-medium text-charcoal flex items-center justify-between gap-4">
              {faq.question}
              <span className="text-gold transition-transform group-open:rotate-45">
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
