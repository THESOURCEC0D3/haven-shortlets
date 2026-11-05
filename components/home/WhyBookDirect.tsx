import Link from "next/link";
import {
  BadgePercent,
  MessageCircle,
  CheckCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import {
  formatPrice,
  getApartmentBySlug,
  airbnbEquivalent,
  AIRBNB_FEE_MULTIPLIER,
} from "@/lib/data/apartments";

/**
 * The savings table, DERIVED rather than hardcoded.
 *
 * These figures were previously three hardcoded pairs (150000/178500 etc.), and
 * `formatPrice` was reimplemented at the bottom of this file — a second copy of
 * the one in lib/data/apartments.ts.
 *
 * Both are the same class of problem: a FACT stored in two places. The nightly
 * rate lives in lib/data/apartments.ts, and the Airbnb multiplier now lives
 * beside it as AIRBNB_FEE_MULTIPLIER. If the Executive Suite's price ever
 * changes, this table used to keep quoting the old one — so the homepage would
 * contradict the listing page about the site's central claim. A savings argument
 * that disagrees with itself across two pages is worse than no argument.
 *
 * Now the numbers, the listing cards, and the sidebar comparison all come from
 * one rate and one multiplier.
 */
const FLAGSHIP = getApartmentBySlug("executive-suite-gra")!;

const savings = [1, 3, 7].map((nights) => {
  const direct =
    nights === 7 ? FLAGSHIP.pricePerWeek : FLAGSHIP.pricePerNight * nights;
  return {
    nights,
    direct,
    airbnb: airbnbEquivalent(FLAGSHIP.pricePerNight) * nights,
  };
});

const weeklySaving =
  airbnbEquivalent(FLAGSHIP.pricePerNight) * 7 - FLAGSHIP.pricePerWeek;

const FEE_PERCENT = Math.round((AIRBNB_FEE_MULTIPLIER - 1) * 100);

const reasons = [
  {
    icon: BadgePercent,
    title: "No Platform Commission",
    description:
      // Tone fix: the original ended "— not a San Francisco tech company's."
      // It was the only sneering line on an otherwise composed site, and the
      // buyer here is a senior professional who wants a straight answer, not a
      // villain. The argument is stronger without the sneer.
      "Airbnb charges guests a service fee of 14–16% on every booking. Book direct and that money stays with you instead.",
  },
  {
    icon: MessageCircle,
    title: "Direct WhatsApp Access",
    description:
      "No chatbots, no ticket systems, no 48-hour response windows. Message us on WhatsApp and get a human response within 30 minutes during business hours.",
  },
  {
    icon: CheckCircle,
    title: "What You See Is What You Get",
    description:
      "Every photo on this site was taken in the actual apartment you will stay in. No stock images, no misleading angles, no bait-and-switch on arrival.",
  },
  {
    icon: Clock,
    title: "Flexible Payment Options",
    description:
      "Pay via bank transfer, Paystack, or cash on arrival. We work around you — not around a platform's rigid payment rules.",
  },
];

export default function WhyBookDirect() {
  return (
    <section className="py-20 bg-ivory">
      <div data-reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gold" />
            <span className="text-gold-text text-sm font-medium tracking-widest uppercase">
              Why Book Direct
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal leading-tight mb-4">
            Keep the Money <span className="italic text-gold-text">Airbnb</span>{" "}
            Would Have Charged You
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Every booking through Airbnb costs you a service fee you never see
            coming. Book direct and that money is yours. Here is exactly what
            you save on our Executive Suite.
          </p>
        </div>

        {/* Savings Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-start">
          {/* Comparison Table */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-charcoal text-white">
              <div className="p-4">
                <p className="text-xs text-white/75 uppercase tracking-wider">
                  Stay Length
                </p>
              </div>
              <div className="p-4 text-center border-l border-white/10">
                <p className="text-xs text-gold uppercase tracking-wider font-semibold">
                  Book Direct
                </p>
              </div>
              <div className="p-4 text-center border-l border-white/10">
                <p className="text-xs text-white/75 uppercase tracking-wider">
                  Via Airbnb
                </p>
              </div>
            </div>

            {/* Rows */}
            {savings.map((row, index) => {
              const saving = row.airbnb - row.direct;
              return (
                <div
                  key={row.nights}
                  className={`grid grid-cols-3 border-t border-slate-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-ivory"
                  }`}
                >
                  <div className="p-5">
                    <p className="font-semibold text-slate-900">
                      {row.nights === 1 ? "1 Night" : `${row.nights} Nights`}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Executive Suite
                    </p>
                  </div>
                  <div className="p-5 text-center border-l border-slate-100">
                    <p className="font-bold text-charcoal">
                      {formatPrice(row.direct)}
                    </p>
                    <p className="text-xs text-green-700 font-medium mt-0.5">
                      Save {formatPrice(saving)}
                    </p>
                  </div>
                  <div className="p-5 text-center border-l border-slate-100">
                    <p className="font-medium text-slate-600 line-through">
                      {formatPrice(row.airbnb)}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      +
                      {Math.round(
                        ((row.airbnb - row.direct) / row.direct) * 100,
                      )}
                      % fee
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Footer */}
            <div className="p-5 bg-charcoal/5 border-t border-slate-200">
              <p className="text-xs text-slate-600 text-center">
                Airbnb service fees estimated at {FEE_PERCENT}% of the base rate.
                Actual platform fees vary.
              </p>
            </div>
          </div>

          {/* Big Savings Callout */}
          <div className="flex flex-col gap-6">
            <div className="bg-charcoal rounded-2xl p-8 text-white">
              <p className="text-white/80 text-sm uppercase tracking-wider mb-2">
                On a 7-night stay you save
              </p>
              <p className="font-display text-6xl font-bold text-gold mb-2">
                {formatPrice(weeklySaving)}
              </p>
              <p className="text-white/80 text-sm leading-relaxed">
                That is the cost of a flight, a nice dinner for two, or two
                extra nights in the apartment — money that goes to Airbnb when
                you book through their platform.
              </p>
            </div>

            {/* This slot used to hold a four-step "How it works" list that was
                a VERBATIM DUPLICATE of the HowItWorks section further down the
                same page — the homepage explained the booking process twice,
                about 40% of the page apart. A reader who scrolls learns nothing
                the second time, and repetition reads as padding on a site whose
                whole pitch is honesty.

                What replaces it closes a real gap the duplicate was hiding:
                nothing on the site explained what protects a guest between
                sending money and getting the keys. For someone transferring
                ₦900,000 to a stranger in another country, that is THE question,
                and it was unanswered. */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <p className="font-semibold text-slate-900 mb-1">
                What protects you before you pay
              </p>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                Booking direct means you deal with a named person, not a support
                queue. Here is what that gets you.
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  {
                    title: "Written confirmation before any money moves",
                    text: "Apartment, exact dates, total, and cancellation terms in writing — before you transfer anything.",
                  },
                  {
                    title: "50% deposit, not the full amount",
                    text: "You pay half to hold it and the balance on or before check-in. You are never fully exposed up front.",
                  },
                  {
                    title: "Free cancellation up to 7 days out",
                    text: "Plans change. Cancel a week ahead and you get everything back, no questions.",
                  },
                  {
                    title: "Full refund if it is not as described",
                    text: "Tell us within 2 hours of check-in and you get your money back plus help finding somewhere else that day.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <ShieldCheck
                      className="size-4 text-gold-text shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium text-charcoal">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed mt-0.5">
                        {item.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="/policies"
                className="mt-5 inline-block text-sm font-medium text-charcoal underline decoration-gold decoration-2 underline-offset-4 hover:text-gold-text transition-colors"
              >
                Read the full booking terms
              </Link>
            </div>
          </div>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:border-gold/50 hover:shadow-md transition-all duration-300"
            >
              <div className="bg-gold/10 p-3 rounded-lg w-fit mb-4">
                <reason.icon className="w-5 h-5 text-gold-text" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">
                {reason.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
