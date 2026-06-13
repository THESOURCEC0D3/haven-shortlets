import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Apartments", href: "/apartments" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const apartments = [
  { label: "Executive Suite — GRA", href: "/apartments/executive-suite-gra" },
  { label: "Deluxe Studio — GRA", href: "/apartments/deluxe-studio-gra" },
  { label: "Premium 2-Bedroom — Woji", href: "/apartments/premium-2bed-woji" },
  { label: "Classic 1-Bedroom — Woji", href: "/apartments/classic-1bed-woji" },
  { label: "Corporate Suite — GRA", href: "/apartments/corporate-suite-gra" },
  { label: "Cozy Studio — Woji", href: "/apartments/cozy-studio-woji" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-amber-500 p-1.5 rounded-md">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <div>
                <p className="font-bold text-white text-sm leading-none">
                  Haven Shortlets
                </p>
                <p className="text-xs text-slate-400 leading-none mt-0.5">
                  Port Harcourt
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Port Harcourt&apos;s premium short-let apartments. Book direct and
              save up to 25% compared to Airbnb. No platform fees. No hidden
              charges.
            </p>
            <WhatsAppButton
              phone="2348098765432"
              message="Hello, I would like to book a shortlet apartment at Haven Shortlets."
              label="Book Direct Now"
              size="sm"
            />
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Apartments */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Our Apartments
            </h3>
            <ul className="flex flex-col gap-3">
              {apartments.map((apt) => (
                <li key={apt.href}>
                  <Link
                    href={apt.href}
                    className="text-slate-400 text-sm hover:text-white transition-colors"
                  >
                    {apt.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span className="text-slate-400 text-sm leading-relaxed">
                  12 Rumuola Road, GRA Phase 1,
                  Port Harcourt, Rivers State
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href="tel:+2348098765432"
                  className="text-slate-400 text-sm hover:text-white transition-colors"
                >
                  0809 876 5432
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-green-400 shrink-0" />
                <a
                  href="https://wa.me/2348098765432"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 text-sm hover:text-white transition-colors"
                >
                  WhatsApp: 0809 876 5432
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href="mailto:bookings@havenshortlets.com"
                  className="text-slate-400 text-sm hover:text-white transition-colors"
                >
                  bookings@havenshortlets.com
                </a>
              </li>
            </ul>

            {/* Book Direct Badge */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-500 mb-2">
                Why book direct?
              </p>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">
                  ✓ Save up to 25% vs Airbnb
                </span>
                <span className="text-xs text-slate-400">
                  ✓ Instant WhatsApp confirmation
                </span>
                <span className="text-xs text-slate-400">
                  ✓ Flexible payment options
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {currentYear} Haven Shortlets PH. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs">
            12 Rumuola Road, GRA Phase 1, Port Harcourt
          </p>
        </div>
      </div>

    </footer>
  );
}