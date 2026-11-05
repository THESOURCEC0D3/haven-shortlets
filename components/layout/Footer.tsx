import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import BrandMark from "@/components/layout/BrandMark";
import {
  siteConfig,
  telHref,
  mailHref,
  fullAddress,
  whatsappUrl,
  mapsSearchUrl,
} from "@/lib/site";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Apartments", href: "/apartments" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Location + guide links instead of one link per apartment. These point crawlers
// (and users) at the programmatic landing pages and content that target the
// high-intent local searches — and they spread internal link equity to them.
const exploreLinks = [
  { label: "Short-lets in Port Harcourt", href: "/port-harcourt" },
  { label: "Short-lets in GRA", href: "/port-harcourt/gra" },
  { label: "Short-lets in Woji", href: "/port-harcourt/woji" },
  { label: "GRA neighbourhood guide", href: "/guides/gra-neighbourhood-guide" },
  { label: "Woji neighbourhood guide", href: "/guides/woji-neighbourhood-guide" },
  { label: "Diaspora booking guide", href: "/guides/diaspora-short-let-guide" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — Brand */}
          <div className="lg:col-span-1">
            <BrandMark onDark className="mb-4" />
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Port Harcourt&apos;s premium short-let apartments. Book direct and
              save up to 25% compared to Airbnb. No platform fees. No hidden
              charges.
            </p>
            <WhatsAppButton
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
                    className="text-slate-300 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Explore by location + guides */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="flex flex-col gap-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
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
              {/* Every value below now comes from siteConfig. The address, phone
                  and email shown here MUST match the LocalBusiness JSON-LD
                  exactly — search engines treat a mismatch as two different
                  businesses, which dilutes local ranking. Previously kept in
                  sync by a code comment; now it is structurally impossible for
                  them to diverge. */}
              <li className="flex items-start gap-3">
                <MapPin className="size-4 text-gold mt-0.5 shrink-0" aria-hidden="true" />
                <a
                  href={mapsSearchUrl(`${fullAddress}, Nigeria`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 text-sm leading-relaxed hover:text-white transition-colors"
                >
                  {fullAddress}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-gold shrink-0" aria-hidden="true" />
                <a
                  href={telHref}
                  className="text-slate-300 text-sm hover:text-white transition-colors"
                >
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="size-4 text-green-400 shrink-0" aria-hidden="true" />
                <a
                  href={whatsappUrl(
                    "Hello Haven Shortlets, I would like to enquire about booking an apartment.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 text-sm hover:text-white transition-colors"
                >
                  WhatsApp: {siteConfig.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-gold shrink-0" aria-hidden="true" />
                <a
                  href={mailHref}
                  className="text-slate-300 text-sm hover:text-white transition-colors"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>

            {/* Book Direct Badge */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-400 mb-2">
                Why book direct?
              </p>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-300">
                  ✓ Save up to 25% vs Airbnb
                </span>
                <span className="text-xs text-slate-300">
                  ✓ Instant WhatsApp confirmation
                </span>
                <span className="text-xs text-slate-300">
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
          <p className="text-slate-400 text-xs">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
            {/* Legal pages. A site collecting name, phone and email needs a
                privacy notice — Nigeria's NDPA 2023 applies, and diaspora
                visitors arrive with GDPR expectations. Their absence is also a
                trust signal in its own right: real businesses have terms. */}
            <Link href="/policies" className="text-slate-400 hover:text-white transition-colors">
              Booking terms &amp; policies
            </Link>
            <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
              Privacy
            </Link>
            <span className="text-slate-400">{fullAddress}</span>
          </div>
        </div>
      </div>

    </footer>
  );
}