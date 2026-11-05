/**
 * Booking policies: check-in, house rules, cancellation, payment.
 *
 * WHY THIS FILE EXISTS
 *
 * The audit found ZERO occurrences sitewide of check-in times, check-out times,
 * house rules, minimum stay, or a cancellation policy. Meanwhile the diaspora
 * guide (lib/data/guides.ts) advises nervous readers to demand exactly those
 * things from an operator before paying:
 *
 *   "Confirm 24/7 power ... the exact address, and the cancellation terms."
 *
 * So the site published a checklist it then failed. A guest who reads that
 * guide, feels understood, and clicks through to a listing finds none of the
 * four things they were just told to insist on. Content that raises the bar the
 * product fails to clear hands the visitor a reason to distrust you.
 *
 * Commercially, cancellation terms are the single largest booking objection for
 * a stay paid by bank transfer to a stranger. Stating them plainly does not
 * "give away" anything — a guest who cannot find your terms assumes the worst
 * possible version of them.
 *
 * Kept as data, not prose in a component, so the same facts feed the listing
 * page, the /policies page, the FAQ blocks, and the JSON-LD without any chance
 * of the four copies disagreeing.
 */

export interface PolicyGroup {
  title: string;
  items: string[];
}

export const checkInPolicy = {
  checkInFrom: "14:00",
  checkOutBy: "11:00",
  earlyCheckIn:
    "Early check-in and late check-out are usually possible when the apartment is free either side of your stay — ask on WhatsApp and we will confirm before you arrive, not after.",
  arrival:
    "We meet you at the apartment with the keys or send a door code the morning of arrival. You will have the host's direct number before you travel.",
  lateArrival:
    "Flights into Port Harcourt are frequently delayed. Late-night arrivals are fine at no extra charge — just tell us your flight number and we will track it.",
  airportPickup:
    "Airport pickup can be arranged for ₦15,000 each way in a private car. Optional, and quoted before you commit.",
} as const;

export const cancellationPolicy = {
  headline: "Free cancellation up to 7 days before check-in.",
  tiers: [
    {
      window: "More than 7 days before check-in",
      outcome: "Full refund of everything you have paid, no questions asked.",
    },
    {
      window: "3–7 days before check-in",
      outcome:
        "50% refund, or move your dates once at no charge within the next 3 months.",
    },
    {
      window: "Less than 3 days before check-in",
      outcome:
        "No refund, but we will always try to re-let the apartment — if we do, we refund you in full.",
    },
  ],
  ourSide:
    "If we ever cancel on you — a maintenance failure, a power problem we cannot fix — you get a full refund plus we pay the difference for comparable accommodation. That is the one guarantee an OTA cannot make you.",
  notAsDescribed:
    "If the apartment is not as described when you arrive, tell us within 2 hours of check-in and you get a full refund and help finding somewhere else the same day.",
} as const;

export const paymentPolicy = {
  deposit:
    "50% to confirm the booking, the balance on or before check-in. For stays of 7 nights or fewer you may pay in full up front if you prefer.",
  methods: [
    "Bank transfer to the registered Haven Shortlets business account",
    "Paystack (card, transfer, USSD)",
    "Cash on arrival for the balance",
  ],
  security:
    "You receive a written confirmation stating the apartment, the exact dates, the total, and the cancellation terms BEFORE any money moves. If anyone ever asks you to pay without that, it is not us.",
  noHiddenFees:
    "The nightly rate is the rate. No cleaning fee, no service fee, no platform fee, no booking fee.",
  caution:
    "We never ask for payment to a personal account, and we never pressure guests into paying quickly. If a message claiming to be us does either, stop and call the number on this website.",
} as const;

export const houseRules: PolicyGroup[] = [
  {
    title: "Guests & visitors",
    items: [
      "Only the guests named on your booking may stay overnight.",
      "Daytime visitors are welcome. Please tell us if numbers change so estate security can expect them.",
      "No parties or events. These are residential estates with neighbours.",
    ],
  },
  {
    title: "Smoking & pets",
    items: [
      "No smoking indoors. Balconies and outdoor areas are fine.",
      "No pets, as our estates do not permit them.",
    ],
  },
  {
    title: "Noise & neighbours",
    items: [
      "Quiet between 10pm and 7am.",
      "Estate gates are manned 24/7; you will be issued with access details on arrival.",
    ],
  },
  {
    title: "The apartment",
    items: [
      "Please report anything broken immediately — we would rather fix it during your stay than discover it after.",
      "Cooking is welcome; the kitchen is fully equipped.",
      "Housekeeping is available on request. For stays over 7 nights it is included weekly.",
    ],
  },
];

/**
 * FAQ pairs generated from the policies above.
 *
 * Deliberately derived rather than hand-written: these answers appear both as
 * visible FAQ text and inside FAQPage JSON-LD, and Google treats schema that
 * does not match the visible page as a violation. Generating both from one
 * source makes that mismatch impossible.
 */
export function policyFaqs(minimumStayNights?: number) {
  return [
    {
      question: "What are the check-in and check-out times?",
      answer: `Check-in is from ${checkInPolicy.checkInFrom} and check-out is by ${checkInPolicy.checkOutBy}. Early check-in and late check-out are usually possible when the apartment is free either side of your stay — ask before you travel and we will confirm.`,
    },
    {
      question: "What is your cancellation policy?",
      answer: `${cancellationPolicy.headline} Between 3 and 7 days before check-in you receive a 50% refund or one free date change. Inside 3 days there is no refund, but if we manage to re-let the apartment we refund you in full. If we ever cancel on you, you get a full refund plus the difference for comparable accommodation.`,
    },
    {
      question: "How do I pay, and is it safe?",
      answer: `${paymentPolicy.deposit} We accept bank transfer to the registered business account, Paystack, or cash for the balance. ${paymentPolicy.security}`,
    },
    {
      question: "Are there any extra fees?",
      answer: `No. ${paymentPolicy.noHiddenFees} Booking direct also avoids the 15–25% service fee Airbnb adds at checkout.`,
    },
    ...(minimumStayNights
      ? [
          {
            question: "What is the minimum stay?",
            answer: `${minimumStayNights} ${minimumStayNights === 1 ? "night" : "nights"}. For stays of a month or longer ask about our monthly rate, which is significantly cheaper per night.`,
          },
        ]
      : []),
    {
      question: "What are the house rules?",
      answer:
        "Only the guests named on your booking may stay overnight, no parties or events, no smoking indoors, no pets, and quiet between 10pm and 7am. Daytime visitors and cooking are both welcome.",
    },
  ];
}
