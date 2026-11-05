"use client";

import { useMemo, useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApartmentCard from "@/components/apartments/ApartmentCard";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import type { Apartment } from "@/lib/data/apartments";
import type { AvailabilityStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ApartmentsClientProps {
  apartments: Apartment[];
  statuses: Record<string, AvailabilityStatus>;
  availableNow: number;
}

const areaOptions = [
  { value: "all", label: "All areas" },
  { value: "gra", label: "GRA" },
  { value: "woji", label: "Woji" },
];

const typeOptions = [
  { value: "all", label: "Any size" },
  { value: "studio", label: "Studio" },
  { value: "1", label: "1 bedroom" },
  { value: "2", label: "2 bedrooms" },
  { value: "3", label: "3 bedrooms" },
];

const availabilityOptions = [
  { value: "all", label: "All apartments" },
  { value: "available", label: "Available now" },
];

const sortOptions = [
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "guests-desc", label: "Sleeps most" },
];

export default function ApartmentsClient({
  apartments,
  statuses,
  availableNow,
}: ApartmentsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  /**
   * FILTER STATE LIVES IN THE URL, NOT IN useState.
   *
   * Previously each filter was a `useState`, so the filtered view had no
   * address. Consequences that cost real bookings:
   *   - A couple planning a trip together could not share "GRA, 2 bedrooms" —
   *     the recipient landed on the unfiltered list. That is an extremely
   *     common journey for exactly this product.
   *   - The browser back button did not undo a filter.
   *   - Filtering then refreshing lost the selection.
   *
   * Reading from searchParams makes the URL the single source of truth, so the
   * view becomes shareable, bookmarkable and back-button-correct for free.
   */
  const selectedArea = searchParams.get("area") ?? "all";
  const selectedType = searchParams.get("type") ?? "all";
  const selectedAvailability = searchParams.get("status") ?? "all";
  const selectedSort = searchParams.get("sort") ?? "price-asc";

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      // Omit defaults so a pristine listing keeps a clean /apartments URL.
      // ?area=all&type=all is noise, and it would also create a second URL
      // serving identical content — a duplicate-content signal.
      if (value === "all" || (key === "sort" && value === "price-asc")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const query = params.toString();
      // scroll:false keeps the guest where they are — re-filtering should not
      // throw them back to the top of the page.
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams],
  );

  const clearFilters = useCallback(() => {
    startTransition(() => router.replace(pathname, { scroll: false }));
  }, [pathname, router]);

  const filtered = useMemo(() => {
    const matches = apartments.filter((apartment) => {
      if (selectedArea !== "all" && apartment.area !== selectedArea)
        return false;

      if (selectedType !== "all") {
        if (selectedType === "studio") {
          if (apartment.propertyType !== "studio") return false;
        } else if (
          apartment.propertyType === "studio" ||
          apartment.bedrooms !== Number(selectedType)
        ) {
          return false;
        }
      }

      if (selectedAvailability === "available") {
        // Deliberately strict: only genuinely-available apartments pass. An
        // "unknown" status must NOT appear under a filter that promises
        // "Available now" — that would be the old fail-open bug in a new hat.
        if (statuses[apartment.slug]?.state !== "available") return false;
      }

      return true;
    });

    const sorted = [...matches];
    if (selectedSort === "price-desc") {
      sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (selectedSort === "guests-desc") {
      sorted.sort((a, b) => b.maxGuests - a.maxGuests);
    } else {
      // Default price ascending. The old order was the raw data order
      // (150k, 75k, 100k, 65k, 120k, 55k) — effectively random, which makes a
      // price-sensitive guest work to compare.
      sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
    }
    return sorted;
  }, [
    apartments,
    statuses,
    selectedArea,
    selectedType,
    selectedAvailability,
    selectedSort,
  ]);

  const hasActiveFilters =
    selectedArea !== "all" ||
    selectedType !== "all" ||
    selectedAvailability !== "all";

  return (
    <div className="min-h-screen bg-ivory">
      {/* Page Header. pt-28 clears the fixed navbar. */}
      <div className="bg-charcoal text-white pt-28 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gold" aria-hidden="true" />
            <span className="text-gold text-sm font-medium tracking-widest uppercase">
              Our Apartments
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Every Apartment. <span className="italic text-gold">Verified.</span>
          </h1>
          {/* HONEST SCARCITY.
              This count is computed from live data, not invented. Real scarcity
              stated plainly outperforms fake urgency ("8 people are viewing!"),
              and on a site whose entire pitch is honesty a fabricated counter
              would undermine the brand it is meant to serve. */}
          <p className="text-white/80 text-lg max-w-xl">
            <strong className="text-white">
              {availableNow} of {apartments.length}
            </strong>{" "}
            apartments are free to book right now. All prices are direct booking
            rates — no platform fees, no cleaning fees.
          </p>
        </div>
      </div>

      {/* Filter Bar — top-16 matches the h-16 navbar. */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="hidden md:flex items-center gap-3">
            <FilterSelect
              label="Area"
              value={selectedArea}
              options={areaOptions}
              onChange={(v) => setParam("area", v)}
            />
            <FilterSelect
              label="Size"
              value={selectedType}
              options={typeOptions}
              onChange={(v) => setParam("type", v)}
            />
            <FilterSelect
              label="Availability"
              value={selectedAvailability}
              options={availabilityOptions}
              onChange={(v) => setParam("status", v)}
            />
            <FilterSelect
              label="Sort by"
              value={selectedSort}
              options={sortOptions}
              onChange={(v) => setParam("sort", v)}
            />

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2 text-slate-600 hover:text-slate-900"
              >
                <X className="size-4" aria-hidden="true" />
                Clear filters
              </Button>
            )}

            {/* aria-live so screen-reader users hear the result count change
                after filtering. Without it the update is silent. */}
            <p
              className="ml-auto text-sm text-slate-600"
              aria-live="polite"
              aria-atomic="true"
            >
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filtered.length}
              </span>{" "}
              {filtered.length === 1 ? "apartment" : "apartments"}
            </p>
          </div>

          {/* Mobile Filters Toggle */}
          <div className="flex md:hidden items-center justify-between gap-3">
            <p className="text-sm text-slate-700" aria-live="polite">
              <span className="font-semibold text-slate-900">
                {filtered.length}
              </span>{" "}
              {filtered.length === 1 ? "apartment" : "apartments"}
            </p>
            <Button
              variant="onLight"
              size="sm"
              onClick={() => setShowMobileFilters((open) => !open)}
              aria-expanded={showMobileFilters}
              aria-controls="mobile-filters"
              className="gap-2"
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              Filters
              {hasActiveFilters && (
                <span className="grid size-5 place-items-center rounded-full bg-gold text-charcoal text-xs font-bold">
                  <span className="sr-only">Filters active</span>!
                </span>
              )}
            </Button>
          </div>

          {showMobileFilters && (
            <div
              id="mobile-filters"
              className="md:hidden mt-3 pt-3 border-t border-slate-200 flex flex-col gap-3"
            >
              <FilterSelect
                label="Area"
                value={selectedArea}
                options={areaOptions}
                onChange={(v) => setParam("area", v)}
                fullWidth
              />
              <FilterSelect
                label="Size"
                value={selectedType}
                options={typeOptions}
                onChange={(v) => setParam("type", v)}
                fullWidth
              />
              <FilterSelect
                label="Availability"
                value={selectedAvailability}
                options={availabilityOptions}
                onChange={(v) => setParam("status", v)}
                fullWidth
              />
              <FilterSelect
                label="Sort by"
                value={selectedSort}
                options={sortOptions}
                onChange={(v) => setParam("sort", v)}
                fullWidth
              />
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2 text-slate-600 w-full justify-center"
                >
                  <X className="size-4" aria-hidden="true" />
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length > 0 ? (
          <div
            className={cn(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity",
              isPending && "opacity-70",
            )}
          >
            {filtered.map((apartment) => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                status={statuses[apartment.slug]}
                // The page <h1> sits directly above these cards, so they must
                // be h2 — an h1 → h3 jump breaks heading navigation.
                headingLevel="h2"
              />
            ))}
          </div>
        ) : (
          /* EMPTY STATE THAT STILL CONVERTS.
             The old version offered only "Clear Filters" — a dead end that
             assumes the guest wanted something we have. A guest who filtered to
             "3 bedrooms in Woji" has told us exactly what they want; the most
             valuable response is to put them in touch, not to reset the form. */
          <div className="mx-auto max-w-md text-center py-20">
            <h2 className="font-display text-2xl font-bold text-charcoal mb-2">
              Nothing matches those filters
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              We only operate six apartments, so some combinations have nothing
              in them. Tell us what you need and we will say honestly whether we
              can help — or point you to someone who can.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <WhatsAppButton
                message="Hello Haven Shortlets, I could not find an apartment matching what I need on your website. Could you help me find something?"
                label="Tell us what you need"
              />
              <Button variant="onLight" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Labelled select.
 *
 * The visible label is associated with the Radix trigger via `id` + `htmlFor`.
 * The old filter bar had bare `placeholder` text and no labels at all, so a
 * screen-reader user heard "combobox" three times with no indication of what
 * each one filtered.
 */
function FilterSelect({
  label,
  value,
  options,
  onChange,
  fullWidth,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  fullWidth?: boolean;
}) {
  const id = `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className={fullWidth ? "w-full" : undefined}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className={fullWidth ? "w-full" : "w-44"}>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
