import {
  MessageCircle,
  CalendarCheck,
  CreditCard,
  KeyRound,
} from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Browse & Choose",
    description:
      "Browse our verified apartments, check real-time availability, and pick the one that suits your stay. Every apartment shows the actual photos, real amenities, and transparent pricing — no surprises.",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "WhatsApp Your Dates",
    description:
      "Send us a WhatsApp message with your preferred apartment, check-in date, and number of nights. We confirm availability and send you the booking details within 30 minutes.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Pay & Confirm",
    description:
      "Pay securely via bank transfer or Paystack. Once payment is confirmed we send your booking confirmation, check-in instructions, and the host's direct contact — all via WhatsApp.",
  },
  {
    number: "04",
    icon: KeyRound,
    title: "Check In & Enjoy",
    description:
      "Arrive at your apartment and check in. Everything is ready — keys or door codes, Wi-Fi details, emergency contacts, and local recommendations. Your host is one WhatsApp message away throughout your stay.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-charcoal text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gold" />
            <span className="text-gold text-sm font-medium tracking-widest uppercase">
              The Process
            </span>
            <div className="w-8 h-0.5 bg-gold" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Book in <span className="italic text-gold">Four Steps.</span> Check
            In Today.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            No complicated forms, no waiting for approval, no surprises. Just a
            simple WhatsApp conversation and your apartment is secured.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line — desktop only */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%_-_16px)] w-8 h-0.5 bg-gold/30 z-10" />
              )}

              {/* Step Card */}
              <div className="flex flex-col gap-4">
                {/* Icon + Number */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-gold" />
                    </div>
                    <span className="absolute -top-2 -right-2 font-display text-xs font-bold text-charcoal bg-gold w-5 h-5 rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <span className="font-display text-4xl font-bold text-white/10">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-semibold text-white text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-8 py-6">
            <div className="text-center sm:text-left">
              <p className="font-semibold text-white">
                Ready to book your stay?
              </p>
              <p className="text-white/50 text-sm">
                WhatsApp us now and we confirm within 30 minutes.
              </p>
            </div>
            <WhatsAppButton
              phone="2348098765432"
              message="Hello Haven Shortlets, I would like to book an apartment. Please confirm availability and send me the booking details."
              label="Start Booking Now"
              size="lg"
              className="shrink-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
