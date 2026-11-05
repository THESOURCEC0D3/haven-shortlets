import { Phone, MapPin, Clock } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

export default function HostProfile() {
  return (
    <section className="py-20 bg-ivory">
      <div data-reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gold" />
            <span className="text-gold-text text-sm font-medium tracking-widest uppercase">
              Your Host
            </span>
            <div className="w-8 h-0.5 bg-gold" />
          </div>
          <h2 className="font-display text-4xl font-bold text-charcoal leading-tight mb-4">
            A Real Person.{" "}
            <span className="italic text-gold-text">Not an Inbox.</span>
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Every guest at Haven Shortlets has direct access to the host — not a
            customer service bot, not a ticketing system, not a 48-hour response
            window.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-charcoal p-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center shrink-0">
                <span className="font-display text-gold font-bold text-4xl">
                  C
                </span>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-display text-2xl font-bold text-white mb-1">
                  Chidi Okonkwo
                </h3>
                <p className="text-gold text-sm font-medium mb-2">
                  Founder & Host — Haven Shortlets PH
                </p>
                <p className="text-white/75 text-sm leading-relaxed">
                  Port Harcourt native. Former oil services engineer. Full-time
                  host since 2019.
                </p>
              </div>
            </div>

            <div className="p-8">
              <p className="text-slate-600 leading-relaxed mb-6">
                I built Haven Shortlets after one too many disappointing
                short-let experiences in my own city. Every apartment in our
                portfolio has been personally inspected by me. Every policy we
                have — the 30-minute response guarantee, the refund promise, the
                power supply standard — came from something a guest complained
                about that I decided to fix permanently.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                When you stay with Haven Shortlets you have my personal WhatsApp
                number. If something is wrong I want to know immediately — not
                in a review after you leave.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    icon: MapPin,
                    label: "Based in",
                    value: "Port Harcourt, Rivers State",
                  },
                  {
                    icon: Clock,
                    label: "Response time",
                    value: "Under 30 minutes",
                  },
                  {
                    icon: Phone,
                    label: "Languages",
                    value: "English, Igbo, Pidgin",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="bg-gold/10 p-2 rounded-lg shrink-0">
                      <item.icon className="w-4 h-4 text-gold-text" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm text-slate-700 font-medium">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <WhatsAppButton
                message="Hello Chidi, I found your profile on Haven Shortlets and I would like to enquire about booking an apartment."
                label="WhatsApp Chidi Directly"
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
