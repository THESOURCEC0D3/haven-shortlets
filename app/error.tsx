"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { siteConfig, telHref } from "@/lib/site";

/**
 * Route-level error boundary.
 *
 * There was no error.tsx, so an unhandled exception in any client component
 * bubbled to Next's default error screen — a bare technical page with no
 * branding, no navigation, and no way for the guest to reach the business.
 *
 * `error.tsx` MUST be a client component: React error boundaries rely on
 * component lifecycle, which only exists on the client.
 *
 * The important product decision here: an error page for a booking business
 * should still let the guest book. Our funnel does not depend on this website
 * working — it ends in a WhatsApp conversation — so even a total front-end
 * failure should not cost the enquiry. That is worth designing for explicitly
 * rather than treating an error page as a dead end.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log so the failure is visible rather than silent. Swap for a real
    // reporter (Sentry etc.) when one is wired up.
    console.error("[app] unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
        <h1 className="font-display text-3xl font-bold text-charcoal mb-4">
          Something went wrong on our side
        </h1>
        <p className="text-slate-700 leading-relaxed mb-2">
          This is our fault, not yours. Try again — and if it keeps happening,
          message us directly. We can take your booking over WhatsApp without the
          website.
        </p>
        <p className="text-slate-600 text-sm mb-8">
          Or call{" "}
          <a
            href={telHref}
            className="font-medium text-charcoal underline decoration-gold decoration-2 underline-offset-4"
          >
            {siteConfig.phoneDisplay}
          </a>
          .
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" size="lg" onClick={reset}>
            <RefreshCw className="size-4" aria-hidden="true" />
            Try again
          </Button>
          <WhatsAppButton
            message="Hello Haven Shortlets, your website showed an error. I would like to book an apartment — could you help me directly?"
            label="Book over WhatsApp"
            size="lg"
          />
        </div>

        <p className="mt-10">
          <Link
            href="/"
            className="text-sm text-slate-700 hover:text-charcoal transition-colors"
          >
            Back to the homepage
          </Link>
        </p>

        {/* The digest is Next's stable identifier for this error instance. Shown
            because it lets a guest quote it to us; it contains no stack trace or
            sensitive detail. */}
        {error.digest && (
          <p className="mt-6 text-xs text-slate-500">
            Reference: <span className="font-mono">{error.digest}</span>
          </p>
        )}
      </div>
    </div>
  );
}
