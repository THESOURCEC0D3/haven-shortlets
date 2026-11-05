import {
  Clock,
  LogOut,
  BedDouble,
  CalendarRange,
  ShieldCheck,
  Wallet,
  Ban,
  PlaneLanding,
} from "lucide-react";
import type { Apartment } from "@/lib/data/apartments";
import {
  checkInPolicy,
  cancellationPolicy,
  paymentPolicy,
  houseRules,
} from "@/lib/data/policies";

/**
 * "The essentials" — check-in, sleeping, stay length, rules, cancellation, pay.
 *
 * WHY THIS BLOCK EXISTS
 *
 * The audit found that not one page on this site stated check-in times, check-out
 * times, house rules, a minimum stay, or a cancellation policy. For a shortlet
 * these are not nice-to-haves; they are the standard furniture of every listing
 * a guest has ever seen, and their absence is conspicuous.
 *
 * The commercial argument is sharper than "completeness". Cancellation terms are
 * the single biggest objection for a stay paid by bank transfer to someone you
 * have never met. A guest who cannot find your terms does not assume they are
 * generous — they assume the worst possible version and leave. Stating them
 * plainly converts an unknown risk into a known, acceptable one.
 *
 * And this site had a specific credibility problem: its own diaspora guide told
 * readers to demand exactly these facts before paying. Publishing that checklist
 * while failing it handed the visitor a reason to distrust us.
 */
export default function ApartmentEssentials({
  apartment,
}: {
  apartment: Apartment;
}) {
  return (
    <section
      id="essentials"
      className="bg-white rounded-2xl border border-slate-200 p-6"
      aria-labelledby="essentials-heading"
    >
      <h2
        id="essentials-heading"
        className="font-display text-xl font-bold text-charcoal mb-5"
      >
        The essentials
      </h2>

      {/* Arrival + sleeping — the facts guests check before anything else. */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Fact icon={Clock} term="Check-in">
          From {checkInPolicy.checkInFrom}
        </Fact>
        <Fact icon={LogOut} term="Check-out">
          By {checkInPolicy.checkOutBy}
        </Fact>
        <Fact icon={CalendarRange} term="Minimum stay">
          {apartment.minimumStayNights}{" "}
          {apartment.minimumStayNights === 1 ? "night" : "nights"}
        </Fact>
        <Fact icon={BedDouble} term="Sleeping">
          {apartment.sleeping}
        </Fact>
      </dl>

      <div className="rounded-xl bg-ivory border border-slate-200 p-4 mb-6">
        <p className="text-sm text-slate-700 leading-relaxed">
          <PlaneLanding
            className="inline size-4 text-gold-text mr-1.5 -mt-0.5"
            aria-hidden="true"
          />
          {checkInPolicy.lateArrival}
        </p>
      </div>

      {/* Cancellation — headline first, then the tiers. */}
      <div className="mb-6">
        <h3 className="font-semibold text-charcoal mb-1 flex items-center gap-2">
          <ShieldCheck className="size-4 text-gold-text" aria-hidden="true" />
          Cancellation
        </h3>
        <p className="text-sm font-medium text-green-800 mb-3">
          {cancellationPolicy.headline}
        </p>
        <ul className="flex flex-col gap-2 mb-3">
          {cancellationPolicy.tiers.map((tier) => (
            <li
              key={tier.window}
              className="text-sm text-slate-700 flex flex-col sm:flex-row sm:gap-2"
            >
              <span className="font-medium text-charcoal sm:w-56 shrink-0">
                {tier.window}
              </span>
              <span>{tier.outcome}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-slate-700 leading-relaxed">
          {cancellationPolicy.ourSide}
        </p>
      </div>

      {/* Payment — including the anti-scam guidance, which is a trust asset in
          its own right for a diaspora audience. */}
      <div className="mb-6">
        <h3 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
          <Wallet className="size-4 text-gold-text" aria-hidden="true" />
          Paying for your stay
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed mb-2">
          {paymentPolicy.deposit} {paymentPolicy.noHiddenFees}
        </p>
        <p className="text-sm text-slate-700 leading-relaxed mb-3">
          {paymentPolicy.security}
        </p>
        <div className="rounded-xl border border-gold/40 bg-gold/10 p-3">
          <p className="text-sm text-charcoal leading-relaxed">
            <Ban
              className="inline size-4 text-gold-text mr-1.5 -mt-0.5"
              aria-hidden="true"
            />
            {paymentPolicy.caution}
          </p>
        </div>
      </div>

      {/* House rules */}
      <div>
        <h3 className="font-semibold text-charcoal mb-3">House rules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {houseRules.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                {group.title}
              </p>
              <ul className="flex flex-col gap-1">
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
      </div>
    </section>
  );
}

/**
 * A definition-list row. `<dl>`/`<dt>`/`<dd>` rather than divs: these ARE
 * term/definition pairs, and the semantics let a screen reader announce
 * "Check-in, from 14:00" as one associated unit rather than two loose strings.
 */
function Fact({
  icon: Icon,
  term,
  children,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  term: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gold/15">
        <Icon className="size-4 text-gold-text" aria-hidden={true} />
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          {term}
        </dt>
        <dd className="text-sm text-slate-800 leading-relaxed mt-0.5">
          {children}
        </dd>
      </div>
    </div>
  );
}
