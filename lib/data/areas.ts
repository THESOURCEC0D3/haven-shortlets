/**
 * Neighbourhood (area) metadata that powers the programmatic landing pages
 * under /port-harcourt/[area]. Keeping this data-driven means one template
 * renders every area, and adding a new neighbourhood is a data edit — not a
 * new page. Each record carries the GEO essentials: a short direct-answer
 * intro (the chunk an LLM lifts), factual blurbs, and area-specific FAQs.
 */

export interface AreaFaq {
  question: string;
  answer: string;
}

export interface Area {
  slug: "gra" | "woji";
  name: string; // Short name, e.g. "GRA"
  fullName: string; // e.g. "Government Reserved Area (GRA)"
  // 40–60 word self-contained answer placed at the top of the page. This is
  // the "extractable answer" GEO lever — written so an LLM can quote it whole.
  intro: string;
  // Longer descriptive paragraph for human readers + factual density.
  description: string;
  // Approx coordinates for the area (LocalBusiness/Place geo).
  geo: { latitude: number; longitude: number };
  faqs: AreaFaq[];
}

export const areas: Area[] = [
  {
    slug: "gra",
    name: "GRA",
    fullName: "Government Reserved Area (GRA)",
    intro:
      "Short-let apartments in GRA, Port Harcourt range from ₦75,000 to ₦150,000 per night. GRA is the city's most prestigious neighbourhood — quiet, secure, and central — making it the first choice for oil-and-gas executives, expatriates, and diaspora visitors who want premium serviced apartments with 24/7 power.",
    description:
      "GRA (Government Reserved Area) spans Phases 1 to 5 and is Port Harcourt's oldest highbrow district. It sits minutes from Peter Odili Road, the airport corridor, major banks, and the city's best restaurants. Apartments here command a premium for their security, calm tree-lined streets, and reliable infrastructure. Haven Shortlets operates serviced apartments across GRA Phase 1, 2, and 3 — all with uninterrupted power, fibre Wi-Fi, and air conditioning.",
    geo: { latitude: 4.8156, longitude: 7.0498 },
    faqs: [
      {
        question: "How much does a short-let apartment in GRA cost per night?",
        answer:
          "Short-let apartments in GRA, Port Harcourt range from ₦75,000 per night for a studio to ₦150,000 per night for a three-bedroom executive suite. Weekly and monthly rates offer further savings, and booking direct with Haven Shortlets avoids the 15–25% platform fees charged by Airbnb.",
      },
      {
        question: "Is GRA a safe area to stay in Port Harcourt?",
        answer:
          "Yes. GRA is widely regarded as the safest and most secure residential area in Port Harcourt, with gated estates, private security, and CCTV. It is the preferred base for expatriates, corporate guests, and diaspora returnees.",
      },
      {
        question: "What is GRA close to?",
        answer:
          "GRA is central to Peter Odili Road, major banks, corporate offices, and top restaurants, and is a short drive from Port Harcourt International Airport. Most guests reach the business district and the airport corridor within 20–30 minutes.",
      },
    ],
  },
  {
    slug: "woji",
    name: "Woji",
    fullName: "Woji",
    intro:
      "Short-let apartments in Woji, Port Harcourt range from ₦55,000 to ₦100,000 per night — noticeably more affordable than GRA. Woji sits midway between Trans-Amadi and GRA, making it a practical, well-priced base for business travellers, contractors, and small families who want quality without the premium-corridor price tag.",
    description:
      "Woji is a fast-developing residential corridor between Trans-Amadi (Port Harcourt's industrial heart) and GRA. It offers newer estates, good road access, and lower rates than GRA while keeping the essentials guests care about: 24/7 power, secure parking, and fast internet. Haven Shortlets runs studios and one- and two-bedroom apartments across quiet, gated Woji estates — ideal for contractors on rotation and value-conscious corporate guests.",
    geo: { latitude: 4.8472, longitude: 7.0608 },
    faqs: [
      {
        question: "How much does a short-let apartment in Woji cost per night?",
        answer:
          "Short-let apartments in Woji, Port Harcourt range from ₦55,000 per night for a studio to ₦100,000 per night for a two-bedroom apartment — typically 20–35% cheaper than comparable GRA units while still including 24/7 power and Wi-Fi.",
      },
      {
        question: "Is Woji a good area for business travellers?",
        answer:
          "Yes. Woji sits between Trans-Amadi's industrial zone and GRA, so it offers short commutes to both while costing less than GRA. It is popular with contractors on rotation and corporate guests who want reliable power and parking at a sensible rate.",
      },
      {
        question: "What's the difference between staying in Woji and GRA?",
        answer:
          "GRA is the premium, central, highbrow choice with the highest prices; Woji is the value choice — newer estates, lower nightly rates, and easy access to the Trans-Amadi industrial area. Both Haven Shortlets corridors include 24/7 power, Wi-Fi, and secure parking.",
      },
    ],
  },
];

export const getAreaBySlug = (slug: string): Area | undefined =>
  areas.find((a) => a.slug === slug);
