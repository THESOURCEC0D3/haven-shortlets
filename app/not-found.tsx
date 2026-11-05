import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { getFeaturedApartments, formatPrice } from "@/lib/data/apartments";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * Branded 404.
 *
 * There was no not-found.tsx at all, yet `notFound()` is called in three route
 * files — so guests DID hit this and got Next.js's unstyled default: no
 * branding, no navigation, no way back.
 *
 * That matters more here than on most sites because this business's links travel
 * through WhatsApp, where URLs get truncated, wrapped and retyped. A guest
 * forwarded a broken listing link lands on a blank error page and reasonably
 * concludes the business is defunct.
 *
 * So this page does not apologise and stop — it recovers the visit by offering
 * the three things the guest was probably looking for and a way to just ask.
 */
export default function NotFound() {
  const featured = getFeaturedApartments().slice(0, 3);

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
        <p className="text-gold-text text-sm font-medium tracking-widest uppercase mb-4">
          404
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4">
          That page has moved or never existed
        </h1>
        <p className="text-slate-700 leading-relaxed mb-8">
          Links shared over WhatsApp sometimes get cut short. Our apartments are
          all still here — and if you were looking for a specific one, just ask
          and we will send you the link.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
          <Button asChild variant="primary" size="lg">
            <Link href="/apartments">
              <Search className="size-4" aria-hidden="true" />
              Browse all apartments
            </Link>
          </Button>
          <WhatsAppButton
            message="Hello Haven Shortlets, I followed a link to your website that did not work. Could you send me the right one?"
            label="Ask us for the link"
            size="lg"
          />
        </div>

        <h2 className="font-display text-xl font-bold text-charcoal mb-5">
          Popular apartments
        </h2>
        <ul className="flex flex-col gap-3 text-left">
          {featured.map((apartment) => (
            <li key={apartment.slug}>
              <Link
                href={`/apartments/${apartment.slug}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-text"
              >
                <span>
                  <span className="block font-medium text-charcoal">
                    {apartment.name}
                  </span>
                  <span className="block text-sm text-slate-600">
                    {apartment.location}
                  </span>
                </span>
                <span className="shrink-0 font-display font-bold text-charcoal tabular-nums">
                  {formatPrice(apartment.pricePerNight)}
                  <span className="text-xs font-normal text-slate-600">
                    /night
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-charcoal transition-colors"
          >
            <Home className="size-4" aria-hidden="true" />
            Back to the homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
