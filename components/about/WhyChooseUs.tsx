import { CheckCircle, X } from "lucide-react";

const comparisons = [
  {
    point: "Apartment exactly matches photos",
    haven: true,
    others: false,
  },
  {
    point: "24/7 uninterrupted power supply guaranteed",
    haven: true,
    others: false,
  },
  {
    point: "Named host with direct WhatsApp access",
    haven: true,
    others: false,
  },
  {
    point: "No platform service fees",
    haven: true,
    others: false,
  },
  {
    point: "Response within 30 minutes",
    haven: true,
    others: false,
  },
  {
    point: "Full refund if apartment not as described",
    haven: true,
    others: false,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gold" />
            <span className="text-gold text-sm font-medium tracking-widest uppercase">
              The Haven Difference
            </span>
            <div className="w-8 h-0.5 bg-gold" />
          </div>
          <h2 className="font-display text-4xl font-bold text-charcoal leading-tight mb-4">
            Why Guests Choose <span className="italic text-gold">Haven</span>{" "}
            Over Everyone Else
          </h2>
          <p className="text-slate-600 leading-relaxed">
            We built our entire operation around the things that matter most to
            guests in Port Harcourt — power, honesty, and a host who actually
            picks up the phone.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden max-w-3xl mx-auto shadow-sm">
          <div className="grid grid-cols-3 bg-charcoal text-white">
            <div className="p-4">
              <p className="text-xs text-white/40 uppercase tracking-wider">
                What We Guarantee
              </p>
            </div>
            <div className="p-4 text-center border-l border-white/10">
              <p className="text-xs text-gold uppercase tracking-wider font-semibold">
                Haven Shortlets
              </p>
            </div>
            <div className="p-4 text-center border-l border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-wider">
                Most Others
              </p>
            </div>
          </div>

          {comparisons.map((row, index) => (
            <div
              key={row.point}
              className={`grid grid-cols-3 border-t border-slate-100 ${
                index % 2 === 0 ? "bg-white" : "bg-ivory"
              }`}
            >
              <div className="p-4">
                <p className="text-sm text-slate-700">{row.point}</p>
              </div>
              <div className="p-4 flex items-center justify-center border-l border-slate-100">
                {row.haven ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div className="p-4 flex items-center justify-center border-l border-slate-100">
                {row.others ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
