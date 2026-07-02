/**
 * Long-form content (Layer 5 of SEO + a GEO feed): neighbourhood guides and a
 * diaspora buying guide. These rank for informational queries ("living in GRA
 * Port Harcourt", "short let tips diaspora") and give LLMs factual, citable
 * prose — the kind of mentions that build entity authority.
 *
 * Data-driven so one template (app/guides/[slug]/page.tsx) renders them all.
 * Each guide leads with a direct-answer intro (GEO: the extractable chunk),
 * then question-style section headings, then FAQs.
 */

import type { AreaFaq } from "@/lib/data/areas";

export interface GuideSection {
  heading: string;
  body: string;
}

export interface Guide {
  slug: string;
  title: string; // <h1> + <title>
  description: string; // meta description + OG
  // 40–60 word self-contained answer at the top of the page.
  intro: string;
  image: string;
  sections: GuideSection[];
  faqs: AreaFaq[];
}

export const guides: Guide[] = [
  {
    slug: "gra-neighbourhood-guide",
    title: "Living in GRA, Port Harcourt: A Short-Stay Neighbourhood Guide",
    description:
      "Everything you need to know about staying in GRA, Port Harcourt — safety, costs, what's nearby, and who it suits. The definitive short-stay guide to Port Harcourt's premium neighbourhood.",
    intro:
      "GRA (Government Reserved Area) is Port Harcourt's most prestigious and secure neighbourhood, spanning Phases 1 to 5. Short-let apartments here cost ₦75,000–₦150,000 per night and suit executives, expatriates, and diaspora visitors who want premium serviced apartments with 24/7 power, close to banks, restaurants, and the airport corridor.",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
    sections: [
      {
        heading: "Why stay in GRA?",
        body: "GRA is the benchmark for safe, comfortable living in Port Harcourt. Its phases are gated and quiet, with mature trees, wide roads, and a concentration of the city's best restaurants, banks, and corporate offices along Peter Odili Road and Aba Road. For business visitors and diaspora returnees, it removes the two biggest friction points of a Port Harcourt stay: security worries and unreliable power.",
      },
      {
        heading: "How much does it cost?",
        body: "Expect ₦75,000 per night for a quality studio and ₦120,000–₦150,000 for a two- or three-bedroom executive suite. Weekly and monthly rates bring the per-night cost down significantly. Booking direct with an operator like Haven Shortlets avoids the 15–25% service fees Airbnb adds at checkout.",
      },
      {
        heading: "What's nearby?",
        body: "GRA puts you within a 20–30 minute drive of Port Harcourt International Airport, the Trans-Amadi industrial area, and the main business district. Genesis, Cilantro, and a range of well-regarded restaurants are minutes away, as are major bank branches and supermarkets.",
      },
      {
        heading: "Who is it best for?",
        body: "GRA suits oil-and-gas executives, expatriates on assignment, corporate delegations, and diaspora visitors home for weddings, funerals, or property matters — anyone who values security, calm, and a central base over the lowest possible price.",
      },
    ],
    faqs: [
      {
        question: "Is GRA Port Harcourt expensive?",
        answer:
          "GRA is the most expensive neighbourhood in Port Harcourt for short stays, with apartments from ₦75,000 to ₦150,000 per night. You pay a premium for security, central location, and reliable infrastructure.",
      },
      {
        question: "Which is better for a short stay, GRA or Woji?",
        answer:
          "Choose GRA for prestige, central location, and the best restaurants; choose Woji to save 20–35% while keeping 24/7 power and good access to the Trans-Amadi industrial area. Both are secure, gated options.",
      },
    ],
  },
  {
    slug: "woji-neighbourhood-guide",
    title: "Staying in Woji, Port Harcourt: The Value Neighbourhood Guide",
    description:
      "A practical guide to short stays in Woji, Port Harcourt — costs, location, and who it suits. The smart-value alternative to GRA for business travellers and families.",
    intro:
      "Woji is a fast-growing residential corridor between Trans-Amadi and GRA, offering short-let apartments from ₦55,000–₦100,000 per night — typically 20–35% cheaper than GRA. It suits business travellers, contractors on rotation, and small families who want reliable power, secure parking, and short commutes without the premium-corridor price.",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
    sections: [
      {
        heading: "Why stay in Woji?",
        body: "Woji sits midway between the Trans-Amadi industrial area and GRA, so it offers short commutes to both at a meaningfully lower price than GRA. Its newer estates are gated and quiet, and the essentials guests actually care about — uninterrupted power, fast Wi-Fi, secure parking — are standard in good short-lets.",
      },
      {
        heading: "How much does it cost?",
        body: "Studios start around ₦55,000 per night and two-bedroom apartments reach about ₦100,000 — roughly 20–35% below comparable GRA units. For contractors on multi-week rotations, Woji's monthly rates are among the best value in Port Harcourt.",
      },
      {
        heading: "Who is it best for?",
        body: "Woji is ideal for business travellers and contractors working around Trans-Amadi, value-conscious corporate guests, and small families who want space and reliability without paying GRA prices.",
      },
    ],
    faqs: [
      {
        question: "Is Woji a safe area in Port Harcourt?",
        answer:
          "Yes. Woji's residential estates are gated and quiet, and reputable short-let apartments include secure parking and CCTV. It is a popular, practical base for business travellers.",
      },
      {
        question: "How far is Woji from Trans-Amadi?",
        answer:
          "Woji borders the Trans-Amadi industrial area, so commutes are short — typically 10–20 minutes — which is why it's favoured by contractors and corporate guests working there.",
      },
    ],
  },
  {
    slug: "diaspora-short-let-guide",
    title: "The Diaspora Guide to Booking a Short-Let in Port Harcourt",
    description:
      "How Nigerians abroad can safely book a short-let apartment in Port Harcourt — avoiding scams, choosing an area, paying securely, and what to verify before you travel.",
    intro:
      "If you're booking a Port Harcourt short-let from abroad, the safest approach is to book direct with a verified operator, confirm the exact apartment over a video call, and pay in a way that's traceable. Expect ₦55,000–₦150,000 per night depending on area, with GRA at the top end and Woji offering better value.",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
    sections: [
      {
        heading: "How do I avoid short-let scams from abroad?",
        body: "Book with an established operator that has a consistent name, address, and phone number across its website and channels. Ask for a live video walkthrough of the specific apartment, not stock photos. Be wary of prices far below the ₦55,000–₦150,000 market range and of anyone insisting on full payment to a personal account with no booking confirmation.",
      },
      {
        heading: "Which area should I choose?",
        body: "Choose GRA if you want the safest, most central base near banks, restaurants, and the airport, and you're comfortable with premium rates. Choose Woji to save 20–35% while keeping 24/7 power and good access across the city. For family visits and events, a two- or three-bedroom in GRA is the usual pick.",
      },
      {
        heading: "How should I pay securely?",
        body: "Use a traceable payment with a clear booking confirmation that states the apartment, dates, and total. A reputable operator will confirm your booking in writing (WhatsApp is standard in Port Harcourt) within minutes and won't pressure you into untraceable transfers.",
      },
      {
        heading: "What should I verify before I travel?",
        body: "Confirm 24/7 power (ask whether it's grid plus generator/inverter), Wi-Fi speed, airport pickup, the exact address, and the cancellation terms. Verify the operator's identity and that the apartment you saw is the one you're booking.",
      },
    ],
    faqs: [
      {
        question: "Is it safe to book a Port Harcourt apartment from abroad?",
        answer:
          "Yes, if you book with a verified operator, confirm the specific apartment on a live video call, and pay in a traceable way with a written booking confirmation. Avoid deals far below the ₦55,000–₦150,000 market range.",
      },
      {
        question: "How much should a Port Harcourt short-let cost per night?",
        answer:
          "Expect ₦55,000–₦100,000 per night in Woji and ₦75,000–₦150,000 in GRA. Booking direct rather than through Airbnb avoids 15–25% in platform fees.",
      },
    ],
  },
];

export const getGuideBySlug = (slug: string): Guide | undefined =>
  guides.find((g) => g.slug === slug);
