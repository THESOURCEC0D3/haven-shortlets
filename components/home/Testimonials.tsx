import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Engr. Chukwudi Okafor",
    role: "Senior Engineer, Shell Nigeria",
    location: "GRA Phase 3 Stay",
    quote:
      "I have used Airbnb for every Port Harcourt rotation for three years. A colleague recommended Haven Shortlets and the difference was immediate. Same quality apartment, no service fee, and when I messaged at 11pm about the generator I got a response in ten minutes. I will not go back to Airbnb for PH stays.",
    nights: 14,
    apartment: "Executive Suite — GRA Phase 3",
  },
  {
    id: 2,
    name: "Mrs. Adaeze Nwosu-Williams",
    role: "UK-based Diaspora — London",
    location: "Corporate Suite Stay",
    quote:
      "Coming home to Port Harcourt after four years I was nervous about booking accommodation. Every Airbnb listing I looked at had reviews complaining about misleading photos or power cuts. A friend sent me Haven Shortlets and from the first WhatsApp message I knew this was different. The apartment was exactly what the photos showed. Exactly.",
    nights: 21,
    apartment: "Corporate Suite — GRA Phase 1",
  },
  {
    id: 3,
    name: "Mr. Femi Adeyinka",
    role: "Business Owner, Lagos",
    location: "Premium 2-Bedroom Stay",
    quote:
      "I travel to Port Harcourt for business every month. Haven Shortlets has become my default. The monthly rate is genuinely cheaper than what hotels charge, the Wi-Fi actually works, and I always have power. That last point alone is worth everything in Port Harcourt.",
    nights: 7,
    apartment: "Premium 2-Bedroom — Woji",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gold" />
            <span className="text-gold text-sm font-medium tracking-widest uppercase">
              Guest Experiences
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal leading-tight mb-4">
            What Our Guests <span className="italic text-gold">Actually</span>{" "}
            Say
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Not cherry-picked quotes. Real feedback from guests who compared us
            to Airbnb and chose to come back.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`rounded-2xl p-8 flex flex-col ${
                index === 1
                  ? "bg-charcoal text-white lg:scale-105 lg:shadow-2xl"
                  : "bg-white border border-slate-200"
              }`}
            >
              {/* Quote Icon */}
              <Quote
                className={`w-8 h-8 mb-6 ${
                  index === 1 ? "text-gold" : "text-gold/40"
                }`}
              />

              {/* Quote Text */}
              <p
                className={`text-sm leading-relaxed flex-1 mb-8 ${
                  index === 1 ? "text-white/80" : "text-slate-600"
                }`}
              >
                {testimonial.quote}
              </p>

              {/* Stay Details */}
              <div
                className={`text-xs mb-6 px-3 py-2 rounded-lg w-fit ${
                  index === 1
                    ? "bg-white/10 text-white/60"
                    : "bg-ivory text-slate-500"
                }`}
              >
                {testimonial.nights} nights · {testimonial.apartment}
              </div>

              {/* Author */}
              <div
                className={`flex items-center gap-3 pt-4 border-t ${
                  index === 1 ? "border-white/10" : "border-slate-100"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    index === 1
                      ? "bg-gold text-charcoal"
                      : "bg-charcoal text-white"
                  }`}
                >
                  <span className="font-display font-bold text-sm">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p
                    className={`font-semibold text-sm ${
                      index === 1 ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {testimonial.name}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${
                      index === 1 ? "text-white/50" : "text-slate-400"
                    }`}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
