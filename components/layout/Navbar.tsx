"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Apartments", href: "/apartments" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll(); // sync on mount in case the page loads already scrolled
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // An open mobile menu needs a readable backdrop even at the very top.
  const solid = scrolled || isMenuOpen;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        solid
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-amber-500 p-1.5 rounded-md">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <div>
              <p
                className={`font-bold text-sm leading-none transition-colors ${
                  solid ? "text-slate-900" : "text-white"
                }`}
              >
                Haven Shortlets
              </p>
              <p
                className={`text-xs leading-none mt-0.5 transition-colors ${
                  solid ? "text-slate-500" : "text-gold"
                }`}
              >
                Port Harcourt
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  solid
                    ? "text-slate-600 hover:text-amber-500"
                    : "text-gold hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <WhatsAppButton
              phone="2348098765432"
              message="Hello, I would like to book a shortlet apartment at Haven Shortlets Port Harcourt."
              label="Book Now"
              size="sm"
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden p-2 rounded-md transition-colors ${
              solid
                ? "text-slate-600 hover:bg-slate-100"
                : "text-gold hover:bg-white/10"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 hover:text-amber-500"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <WhatsAppButton
            phone="2348098765432"
            message="Hello, I would like to book a shortlet apartment at Haven Shortlets Port Harcourt."
            label="Book Now"
            size="sm"
          />
        </div>
      )}
    </nav>
  );
}
