import { Suspense } from "react";
import { apartments } from "@/lib/data/apartments";
import { getAvailabilityStatuses, countAvailable } from "@/lib/availability";
import ApartmentsClient from "@/components/apartments/ApartmentsClient";
import { pageMetadata } from "@/lib/seo/metadata";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/structured-data";

export const metadata = pageMetadata({
  title: "Our Apartments",
  description:
    "Browse premium short-let apartments in Port Harcourt. GRA and Woji locations. All apartments include 24/7 power, Wi-Fi, and air conditioning. Book direct and save up to 25%.",
  path: "/apartments",
});

/**
 * Time-based safety net under the event-based invalidation in lib/actions.ts.
 *
 * The admin toggle now revalidates every availability-dependent path explicitly,
 * so in the normal case this page updates within seconds. This adds defence in
 * depth: if a revalidation ever fails silently — a deploy mid-write, a platform
 * hiccup — the page is at most 5 minutes stale rather than stale until the next
 * deploy. The page is still statically served either way, so TTFB is unaffected.
 */
export const revalidate = 300;

export default async function ApartmentsPage() {
  // One call, shared helper, error-aware. Previously this page hand-rolled its
  // own Supabase query and discarded the `error` field entirely.
  const statuses = await getAvailabilityStatuses();
  const availableNow = countAvailable(statuses);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Apartments", path: "/apartments" },
          ]),
          itemListSchema(apartments),
        ]}
      />
      {/* SUSPENSE IS REQUIRED HERE, and the reason is worth understanding.
       *
       * ApartmentsClient reads filter state from `useSearchParams()`. Search
       * params are a REQUEST-time value — they cannot be known when a page is
       * prerendered at build time. So Next.js needs a boundary it can render
       * without them and fill in on the client once the URL is known.
       *
       * Without this wrapper the build fails outright:
       *   "useSearchParams() should be wrapped in a suspense boundary"
       *
       * The important consequence: only the subtree inside the boundary waits
       * for the client. Everything outside it — the JSON-LD above, the layout,
       * the navbar — still ships as static HTML, so crawlers and LLM readers
       * see the page content immediately. Putting the boundary as tight as
       * possible around the client-dependent part is what preserves that.
       *
       * This is the trade for moving filters into the URL (shareable,
       * back-button-correct links). Worth it, but not free — and the framework
       * is right to make it explicit rather than silently degrading the page to
       * client-side rendering.
       */}
      <Suspense fallback={<ApartmentsSkeleton />}>
        <ApartmentsClient
          apartments={apartments}
          statuses={statuses}
          availableNow={availableNow}
        />
      </Suspense>
    </>
  );
}

/**
 * Fallback shown for the instant before search params resolve.
 *
 * Deliberately mirrors the real layout's dimensions (dark header band, filter
 * bar, three-column card grid) rather than being a spinner. A skeleton that
 * matches the final geometry means no layout shift when the real content
 * swaps in — a spinner of a different size would cause exactly the CLS the
 * rest of this page is careful to avoid.
 */
function ApartmentsSkeleton() {
  return (
    <div className="min-h-screen bg-ivory" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading apartments…</span>
      <div className="bg-charcoal pt-28 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-40 rounded bg-white/20 mb-5" />
          <div className="h-10 w-80 max-w-full rounded bg-white/20 mb-4" />
          <div className="h-5 w-64 max-w-full rounded bg-white/10" />
        </div>
      </div>
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-3">
          <div className="h-11 w-44 rounded-lg bg-slate-100" />
          <div className="h-11 w-44 rounded-lg bg-slate-100" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
            >
              <div className="h-52 w-full bg-slate-100" />
              <div className="p-4 flex flex-col gap-3">
                <div className="h-4 w-3/4 rounded bg-slate-100" />
                <div className="h-3 w-1/2 rounded bg-slate-100" />
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-11 w-full rounded-lg bg-slate-100 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
