import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import {
  siteConfig,
  telHref,
  mailHref,
  fullAddress,
  whatsappUrl,
  mapsSearchUrl,
} from "@/lib/site";

/**
 * Every value derives from siteConfig.
 *
 * This block is the canonical NAP (Name / Address / Phone) display, and it must
 * match the LocalBusiness JSON-LD byte for byte — search engines treat a
 * mismatch between the visible contact details and the structured data as two
 * different businesses, which splits and dilutes local ranking signals.
 *
 * The opening hours are now formatted FROM siteConfig.openingHours, the same
 * array that feeds openingHoursSpecification in the schema. Previously the
 * visible text said "Mon — Sat: 7am — 10pm" while the schema said nothing at
 * all; now they cannot disagree.
 */
function formatHours(): string {
  return siteConfig.openingHours
    .map((slot) => {
      const days =
        slot.days.length > 1
          ? `${slot.days[0].slice(0, 3)} — ${slot.days[slot.days.length - 1].slice(0, 3)}`
          : slot.days[0];
      return `${days}: ${slot.opens} — ${slot.closes}`;
    })
    .join("\n");
}

const contactDetails = [
  {
    icon: MapPin,
    label: "Office address",
    value: fullAddress,
    href: mapsSearchUrl(`${fullAddress}, Nigeria`),
  },
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.phoneDisplay,
    href: telHref,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: siteConfig.phoneDisplay,
    href: whatsappUrl(
      "Hello Haven Shortlets, I would like to enquire about booking an apartment.",
    ),
  },
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: mailHref,
  },
  {
    icon: Clock,
    label: "Response hours",
    value: formatHours(),
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
                <detail.icon className="w-4 h-4 text-gold-text" />
              </div>
              <div>
                <p className="text-xs text-slate-600 uppercase tracking-wider font-medium mb-0.5">
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
                    className="text-sm text-slate-700 hover:text-gold-text transition-colors"
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
        <p className="text-white/75 text-sm leading-relaxed mb-4">
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