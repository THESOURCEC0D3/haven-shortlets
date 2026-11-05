import { CheckCircle, X } from "lucide-react";

/**
 * THE DAMAGING ADMISSION.
 *
 * This table used to be six rows, Haven ✅ six times, "Most Others" ❌ six times.
 * A 6–0 scoreline reads as marketing rather than information, and the audience
 * here — senior professionals comparing us against Airbnb — discounts the whole
 * table on sight. Nothing is 6–0.
 *
 * So one row now goes the other way, and it is deliberately the weakness the
 * guest has ALREADY noticed: we have no instant online booking. Naming it costs
 * us nothing (it is obvious the moment they look for a "Book" button) and buys
 * credibility for the five rows that matter.
 *
 * This is a well-documented persuasion effect: a single honest negative makes
 * surrounding positives believable, because it proves the source is describing
 * reality rather than selling. On a brand whose entire pitch is honesty, the
 * strawman version was actively off-message.
 */
const comparisons = [
  {
    point: "Apartment exactly matches the photos",
    haven: true,
    others: false,
    note: null,
  },
  {
    point: "24/7 uninterrupted power guaranteed",
    haven: true,
    others: false,
    note: null,
  },
  {
    point: "Named host with direct WhatsApp access",
    haven: true,
    others: false,
    note: null,
  },
  {
    point: "No platform service fees",
    haven: true,
    others: false,
    note: null,
  },
  {
    point: "Instant online booking, 24/7",
    haven: false,
    others: true,
    note: "We confirm by WhatsApp instead — usually within 30 minutes, and you get a written confirmation before you pay.",
  },
  {
    point: "Full refund if not as described",
    haven: true,
    others: false,
    note: null,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div data-reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gold" />
            <span className="text-gold-text text-sm font-medium tracking-widest uppercase">
              The Haven Difference
            </span>
            <div className="w-8 h-0.5 bg-gold" />
          </div>
          <h2 className="font-display text-4xl font-bold text-charcoal leading-tight mb-4">
            Why Guests Choose <span className="italic text-gold-text">Haven</span>{" "}
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
              <p className="text-xs text-white/75 uppercase tracking-wider">
                What We Guarantee
              </p>
            </div>
            <div className="p-4 text-center border-l border-white/10">
              <p className="text-xs text-gold uppercase tracking-wider font-semibold">
                Haven Shortlets
              </p>
            </div>
            <div className="p-4 text-center border-l border-white/10">
              <p className="text-xs text-white/75 uppercase tracking-wider">
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
                {/* The honest caveat on the one row we lose. Without it the
                    admission looks like a shortcoming; with it, it reads as a
                    deliberate trade-off we have thought about. */}
                {row.note && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {row.note}
                  </p>
                )}
              </div>
              {/* The icons carry meaning, so they need accessible names.
                  Previously they were bare <CheckCircle>/<X> — a screen-reader
                  user heard the row label and then silence, with no way to know
                  which column said yes. sr-only text per cell fixes that, and
                  green-600 replaces green-500 for contrast (3.3:1 → 4.5:1). */}
              <div className="p-4 flex items-center justify-center border-l border-slate-100">
                {row.haven ? (
                  <>
                    <CheckCircle
                      className="w-5 h-5 text-green-600"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Haven Shortlets: yes</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-slate-500" aria-hidden="true" />
                    <span className="sr-only">Haven Shortlets: no</span>
                  </>
                )}
              </div>
              <div className="p-4 flex items-center justify-center border-l border-slate-100">
                {row.others ? (
                  <>
                    <CheckCircle
                      className="w-5 h-5 text-green-600"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Most others: yes</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-slate-500" aria-hidden="true" />
                    <span className="sr-only">Most others: no</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
