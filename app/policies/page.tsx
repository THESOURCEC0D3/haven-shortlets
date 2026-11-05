import Link from "next/link";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import JsonLd from "@/components/seo/JsonLd";
import FaqSection from "@/components/seo/FaqSection";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/structured-data";
import {
  checkInPolicy,
  cancellationPolicy,
  paymentPolicy,
  houseRules,
  policyFaqs,
} from "@/lib/data/policies";
import { siteConfig, telHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Booking Terms, House Rules & Cancellation Policy",
  description:
    "Haven Shortlets booking terms: check-in from 14:00, check-out by 11:00, free cancellation up to 7 days before arrival, 50% deposit, no hidden fees. Full house rules and payment terms.",
  path: "/policies",
});

/**
 * One canonical page for every booking term.
 *
 * WHY A DEDICATED PAGE AS WELL AS THE LISTING BLOCK
 *
 * The essentials appear on each apartment page because that is where a guest is
 * deciding. But there are three reasons to also have a single addressable page:
 *
 *  1. TRUST. "Real businesses have terms." A footer link to a proper policies
 *     page is itself a trust signal for a guest who is worried about being
 *     scammed — and it is something a fake operator will not bother to build.
 *  2. SEO/GEO. "Haven Shortlets cancellation policy" is a real query from a
 *     guest already considering booking. It also gives an LLM one clean,
 *     citable page for the facts rather than making it infer them from a listing.
 *  3. LINKABILITY. The host can paste one URL into a WhatsApp conversation
 *     instead of retyping the terms every time — which is exactly the sort of
 *     small operational win that decides whether a policy is actually honoured.
 */
export default function PoliciesPage() {
  const faqs = policyFaqs();

  return (
    <div className="min-h-screen bg-ivory">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Booking terms & policies", path: "/policies" },
          ]),
          faqSchema(faqs),
        ]}
      />

      <div className="bg-charcoal text-white pt-28 pb-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gold" aria-hidden="true" />
            <span className="text-gold text-sm font-medium tracking-widest uppercase">
              Booking terms
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Everything you should know{" "}
            <span className="italic text-gold">before you pay</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            No small print, no surprises on arrival. If anything here is unclear,
            ask us before you book — we would rather answer a question than
            resolve a complaint.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8">
        {/* Arrival */}
        <Panel title="Check-in and check-out" id="check-in">
          <dl className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Check-in from
              </dt>
              <dd className="font-display text-2xl font-bold text-charcoal">
                {checkInPolicy.checkInFrom}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Check-out by
              </dt>
              <dd className="font-display text-2xl font-bold text-charcoal">
                {checkInPolicy.checkOutBy}
              </dd>
            </div>
          </dl>
          <Para>{checkInPolicy.earlyCheckIn}</Para>
          <Para>{checkInPolicy.arrival}</Para>
          <Para>{checkInPolicy.lateArrival}</Para>
          <Para>{checkInPolicy.airportPickup}</Para>
        </Panel>

        {/* Cancellation */}
        <Panel title="Cancellation and changes" id="cancellation">
          <p className="text-base font-semibold text-green-800 mb-4">
            {cancellationPolicy.headline}
          </p>
          <div className="overflow-x-auto mb-5">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Refund entitlement by cancellation notice period
              </caption>
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th scope="col" className="pb-2 pr-4 font-semibold text-charcoal">
                    If you cancel
                  </th>
                  <th scope="col" className="pb-2 font-semibold text-charcoal">
                    What you get
                  </th>
                </tr>
              </thead>
              <tbody>
                {cancellationPolicy.tiers.map((tier) => (
                  <tr key={tier.window} className="border-b border-slate-100">
                    <th
                      scope="row"
                      className="py-3 pr-4 align-top font-medium text-charcoal text-left"
                    >
                      {tier.window}
                    </th>
                    <td className="py-3 align-top text-slate-700">
                      {tier.outcome}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Para>{cancellationPolicy.ourSide}</Para>
          <Para>{cancellationPolicy.notAsDescribed}</Para>
        </Panel>

        {/* Payment */}
        <Panel title="Paying for your stay" id="payment">
          <Para>{paymentPolicy.deposit}</Para>
          <p className="text-sm font-medium text-charcoal mb-2">
            We accept
          </p>
          <ul className="flex flex-col gap-1.5 mb-5">
            {paymentPolicy.methods.map((method) => (
              <li key={method} className="text-sm text-slate-700">
                {method}
              </li>
            ))}
          </ul>
          <Para>{paymentPolicy.noHiddenFees}</Para>
          <Para>{paymentPolicy.security}</Para>
          <div className="rounded-xl border border-gold/40 bg-gold/10 p-4">
            <p className="text-sm font-semibold text-charcoal mb-1">
              How to tell it is really us
            </p>
            <p className="text-sm text-charcoal leading-relaxed">
              {paymentPolicy.caution}
            </p>
          </div>
        </Panel>

        {/* House rules */}
        <Panel title="House rules" id="house-rules">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {houseRules.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-charcoal mb-2">
                  {group.title}
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-slate-700 leading-relaxed"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Panel>

        <FaqSection faqs={faqs} title="Common questions about our terms" />

        {/* Conversion bridge. Even a policy page should offer the next step —
            a guest who reads the terms and is satisfied is a guest ready to
            book, and making them navigate back to find a button loses some. */}
        <div className="bg-charcoal rounded-2xl p-6 sm:p-8 text-center">
          <h2 className="font-display text-xl font-bold text-white mb-2">
            Happy with the terms?
          </h2>
          <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
            Message {siteConfig.host.firstName} with your dates and you will have
            a written confirmation — apartment, dates, total, cancellation terms —
            within {siteConfig.responseTimeMinutes} minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <WhatsAppButton
              message="Hello Haven Shortlets, I have read your booking terms and would like to book. My dates are: "
              label="Book on WhatsApp"
              size="lg"
            />
            <Button asChild variant="onDark" size="lg">
              <Link href="/apartments">Browse apartments</Link>
            </Button>
          </div>
          <p className="text-white/75 text-xs mt-5">
            Or call{" "}
            <a href={telHref} className="text-white font-medium underline">
              {siteConfig.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8"
      aria-labelledby={`${id}-heading`}
    >
      <h2
        id={`${id}-heading`}
        className="font-display text-xl font-bold text-charcoal mb-5"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-slate-700 leading-relaxed mb-4 last:mb-0">
      {children}
    </p>
  );
}
