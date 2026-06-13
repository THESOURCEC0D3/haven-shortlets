import { BadgePercent, MessageCircle, CheckCircle, Clock } from "lucide-react";

const savings = [
  {
    nights: 1,
    direct: 150000,
    airbnb: 178500,
  },
  {
    nights: 3,
    direct: 450000,
    airbnb: 535500,
  },
  {
    nights: 7,
    direct: 900000,
    airbnb: 1071000,
  },
];

const reasons = [
  {
    icon: BadgePercent,
    title: "No Platform Commission",
    description:
      "Airbnb charges guests a service fee of 14–16% on every booking. When you book direct, that money stays in your pocket — not a San Francisco tech company's.",
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

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function WhyBookDirect() {
  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gold" />
            <span className="text-gold text-sm font-medium tracking-widest uppercase">
              Why Book Direct
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal leading-tight mb-4">
            Keep the Money <span className="italic text-gold">Airbnb</span>{" "}
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
                <p className="text-xs text-white/50 uppercase tracking-wider">
                  Stay Length
                </p>
              </div>
              <div className="p-4 text-center border-l border-white/10">
                <p className="text-xs text-gold uppercase tracking-wider font-semibold">
                  Book Direct
                </p>
              </div>
              <div className="p-4 text-center border-l border-white/10">
                <p className="text-xs text-white/50 uppercase tracking-wider">
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
                    <p className="text-xs text-slate-400 mt-0.5">
                      Executive Suite
                    </p>
                  </div>
                  <div className="p-5 text-center border-l border-slate-100">
                    <p className="font-bold text-charcoal">
                      {formatPrice(row.direct)}
                    </p>
                    <p className="text-xs text-green-600 font-medium mt-0.5">
                      Save {formatPrice(saving)}
                    </p>
                  </div>
                  <div className="p-5 text-center border-l border-slate-100">
                    <p className="font-medium text-slate-400 line-through">
                      {formatPrice(row.airbnb)}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
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
              <p className="text-xs text-slate-500 text-center">
                Airbnb service fees estimated at 19% of base rate. Actual fees
                may vary.
              </p>
            </div>
          </div>

          {/* Big Savings Callout */}
          <div className="flex flex-col gap-6">
            <div className="bg-charcoal rounded-2xl p-8 text-white">
              <p className="text-white/60 text-sm uppercase tracking-wider mb-2">
                On a 7-night stay you save
              </p>
              <p className="font-display text-6xl font-bold text-gold mb-2">
                ₦171,000
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                That is the cost of a flight, a nice dinner for two, or two
                extra nights in the apartment — money that goes to Airbnb when
                you book through their platform.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <p className="font-semibold text-slate-900 mb-4">How it works</p>
              <div className="flex flex-col gap-4">
                {[
                  {
                    step: "01",
                    text: "Browse our apartments and pick the one you want",
                  },
                  {
                    step: "02",
                    text: "WhatsApp us your dates and we confirm availability instantly",
                  },
                  {
                    step: "03",
                    text: "Pay via transfer or Paystack and receive your booking confirmation",
                  },
                  {
                    step: "04",
                    text: "Check in on your arrival date — keys, codes, and contacts ready",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <span className="font-display text-gold font-bold text-lg shrink-0 w-8">
                      {item.step}
                    </span>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
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
                <reason.icon className="w-5 h-5 text-gold" />
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
