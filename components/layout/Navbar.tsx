"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import BrandMark from "@/components/layout/BrandMark";
import { cn } from "@/lib/utils";
import { telHref } from "@/lib/site";

// "Stays" replaces the old "Apartments" label and gains the two area pages as
// children. The /port-harcourt tree — eight programmatic landing pages built
// specifically to capture local search — previously had NO link from the navbar,
// only from the footer. That cost twice over: a guest who arrived on
// /port-harcourt/gra from Google had no way to explore the tree, and navbar
// links are the strongest internal links a site has, so none of that link
// equity reached the pages we most want ranked.
const navLinks = [
  { label: "Stays", href: "/apartments" },
  { label: "GRA", href: "/port-harcourt/gra" },
  { label: "Woji", href: "/port-harcourt/woji" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const NAV_BOOKING_MESSAGE =
  "Hello Haven Shortlets, I would like to book a short-let apartment in Port Harcourt. Please send me what is available.";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll(); // sync on mount in case the page loads already scrolled
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // NOTE: the menu is closed in each link's onClick, NOT in an effect on
  // `pathname`. I tried the effect version first and the React lint rule
  // rejected it — correctly. Calling setState synchronously in an effect body
  // triggers a second render pass for something that is really just a reaction
  // to a user event, and the event handler already knows the menu should close.
  // "You might not need an effect" applies exactly here: an effect that mirrors
  // a user action is a render cycle you are paying for nothing.

  // Escape closes the menu — the expected behaviour for any expanded overlay,
  // and the only keyboard-accessible way out other than tabbing through it.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  // An open mobile menu needs a readable backdrop even at the very top.
  const solid = scrolled || isMenuOpen;

  return (
    <nav
      aria-label="Main"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        solid
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link
            href="/"
            className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            aria-label="Haven Shortlets Port Harcourt — home"
          >
            <BrandMark onDark={!solid} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  // aria-current tells a screen reader which page you are on.
                  // Previously the active page was not indicated at all — not
                  // visually, not semantically.
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "text-sm font-medium transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
                    solid
                      ? "text-slate-700 hover:text-gold-text"
                      : "text-white/90 hover:text-gold",
                    isActive &&
                      (solid
                        ? "text-gold-text underline decoration-gold decoration-2 underline-offset-8"
                        : "text-gold underline decoration-gold decoration-2 underline-offset-8"),
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions.
              The WhatsApp CTA used to be wrapped in `hidden md:flex`, which
              removed the site's single most valuable button from every screen
              under 768px — on a WhatsApp-first business whose traffic is
              overwhelmingly mobile. It is now visible at ALL widths; only the
              label shortens on small screens to protect the layout. */}
          <div className="flex items-center gap-2">
            <a
              href={telHref}
              aria-label="Call Haven Shortlets"
              className={cn(
                "hidden sm:grid size-11 place-items-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                solid
                  ? "text-slate-700 hover:bg-slate-100"
                  : "text-white hover:bg-white/10",
              )}
            >
              <Phone className="size-4" aria-hidden="true" />
            </a>

            <WhatsAppButton
              message={NAV_BOOKING_MESSAGE}
              label="Book"
              size="sm"
              className="lg:hidden"
            />
            <WhatsAppButton
              message={NAV_BOOKING_MESSAGE}
              label="Book on WhatsApp"
              size="sm"
              className="hidden lg:inline-flex"
            />

            {/* Mobile Menu Toggle.
                Was an icon-only <button> with no accessible name, no
                aria-expanded and no aria-controls — announced simply as
                "button", with no indication of what it does or its state. */}
            <button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className={cn(
                "lg:hidden grid size-11 place-items-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                solid
                  ? "text-slate-700 hover:bg-slate-100"
                  : "text-white hover:bg-white/10",
              )}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-slate-200 bg-white px-4 py-2 flex flex-col"
        >
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setIsMenuOpen(false)}
                // min-h-12 (48px) rather than a bare text link: these are thumb
                // targets on a phone, and a 20px-tall text link is a mis-tap
                // waiting to happen.
                className={cn(
                  "flex min-h-12 items-center border-b border-slate-100 text-sm font-medium transition-colors last:border-0",
                  isActive
                    ? "text-gold-text font-semibold"
                    : "text-slate-700 hover:text-gold-text",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href={telHref}
            onClick={() => setIsMenuOpen(false)}
            className="flex min-h-12 items-center gap-2 text-sm font-medium text-slate-700 hover:text-gold-text"
          >
            <Phone className="size-4" aria-hidden="true" />
            Call us
          </a>
        </div>
      )}
    </nav>
  );
}
