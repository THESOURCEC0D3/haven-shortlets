import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

const contactDetails = [
  {
    icon: MapPin,
    label: "Office Address",
    value: "12 Rumuola Road, GRA Phase 1, Port Harcourt, Rivers State",
    href: null,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "0809 876 5432",
    href: "tel:+2348098765432",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "0809 876 5432",
    href: "https://wa.me/2348098765432",
  },
  {
    icon: Mail,
    label: "Email",
    value: "bookings@havenshortlets.com",
    href: "mailto:bookings@havenshortlets.com",
  },
  {
    icon: Clock,
    label: "Response Hours",
    value: "Mon — Sat: 7am — 10pm\nSunday: 9am — 6pm",
    href: null,
  },
];

export default function ContactInfo() {
  return (
    <div className="flex flex-col gap-6">

      {/* Contact Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-display text-lg font-bold text-charcoal mb-6">
          Contact Details
        </h3>
        <div className="flex flex-col gap-5">
          {contactDetails.map((detail) => (
            <div key={detail.label} className="flex items-start gap-3">
              <div className="bg-gold/10 p-2 rounded-lg shrink-0">
                <detail.icon className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-0.5">
                  {detail.label}
                </p>
                {detail.href ? (
                  <a
                    href={detail.href}
                    target={
                      detail.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      detail.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-sm text-slate-700 hover:text-gold transition-colors"
                  >
                    {detail.value}
                  </a>
                ) : (
                  <p className="text-sm text-slate-700 whitespace-pre-line">
                    {detail.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-slate-100">
          <WhatsAppButton
            phone="2348098765432"
            message="Hello Haven Shortlets, I would like to enquire about booking an apartment."
            label="WhatsApp Us Now"
            className="w-full"
          />
        </div>
      </div>

      {/* Response Promise */}
      <div className="bg-charcoal rounded-2xl p-6 text-white">
        <h3 className="font-display text-lg font-bold text-white mb-2">
          Our Response Promise
        </h3>
        <p className="text-white/50 text-sm leading-relaxed mb-4">
          We take response time seriously. Here is what to expect.
        </p>
        <div className="flex flex-col gap-2">
          {[
            "WhatsApp — within 30 minutes",
            "Phone calls — answered immediately",
            "Email — within 4 hours",
            "After hours — by 8am next morning",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
              <span className="text-sm text-white/70">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Book Direct Reminder */}
      <div className="bg-gold/10 border border-gold/20 rounded-2xl p-6">
        <h3 className="font-semibold text-charcoal mb-2">
          Remember — Book Direct
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Booking directly through this site saves you the 15–25% Airbnb
          service fee. Message us on WhatsApp and the saving is yours.
        </p>
      </div>

    </div>
  );
}