"use client";

import { useState, useMemo } from "react";
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
import { Apartment } from "@/lib/data/apartments";
import { ApartmentAvailability } from "@/lib/types";

interface ApartmentsClientProps {
  apartments: Apartment[];
  availabilityMap: Record<string, ApartmentAvailability>;
}

const areas = [
  { value: "all", label: "All Areas" },
  { value: "gra", label: "GRA" },
  { value: "woji", label: "Woji" },
];

const bedroomOptions = [
  { value: "all", label: "Any Size" },
  { value: "1", label: "Studio / 1 Bedroom" },
  { value: "2", label: "2 Bedrooms" },
  { value: "3", label: "3 Bedrooms" },
];

const availabilityOptions = [
  { value: "all", label: "All Apartments" },
  { value: "available", label: "Available Now" },
];

export default function ApartmentsClient({
  apartments,
  availabilityMap,
}: ApartmentsClientProps) {
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedBedrooms, setSelectedBedrooms] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredApartments = useMemo(() => {
    return apartments.filter((apartment) => {
      const matchesArea =
        selectedArea === "all" || apartment.area === selectedArea;

      const matchesBedrooms =
        selectedBedrooms === "all" ||
        apartment.bedrooms === parseInt(selectedBedrooms);

      const availability = availabilityMap[apartment.slug];
      const isAvailable = availability?.available ?? true;
      const matchesAvailability =
        selectedAvailability === "all" ||
        (selectedAvailability === "available" && isAvailable);

      return matchesArea && matchesBedrooms && matchesAvailability;
    });
  }, [
    apartments,
    availabilityMap,
    selectedArea,
    selectedBedrooms,
    selectedAvailability,
  ]);

  const hasActiveFilters =
    selectedArea !== "all" ||
    selectedBedrooms !== "all" ||
    selectedAvailability !== "all";

  const clearFilters = () => {
    setSelectedArea("all");
    setSelectedBedrooms("all");
    setSelectedAvailability("all");
  };

  const availableCount = apartments.filter((a) => {
    const availability = availabilityMap[a.slug];
    return availability?.available ?? true;
  }).length;

  return (
    <div className="min-h-screen bg-ivory">
      {/* Page Header */}
      <div className="bg-charcoal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gold" />
            <span className="text-gold text-sm font-medium tracking-widest uppercase">
              Our Apartments
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Every Apartment. <span className="italic text-gold">Verified.</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl">
            {availableCount} of {apartments.length} apartments available right
            now. All prices are direct booking rates — no platform fees.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-4">
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Area" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area.value} value={area.value}>
                    {area.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedBedrooms}
              onValueChange={setSelectedBedrooms}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                {bedroomOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedAvailability}
              onValueChange={setSelectedAvailability}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                {availabilityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}

            <div className="ml-auto">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {filteredApartments.length}
                </span>{" "}
                {filteredApartments.length === 1 ? "apartment" : "apartments"}
              </p>
            </div>
          </div>

          {/* Mobile Filters Toggle */}
          <div className="flex md:hidden items-center justify-between">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">
                {filteredApartments.length}
              </span>{" "}
              apartments
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-gold text-charcoal text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  !
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Filters Dropdown */}
          {showMobileFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-slate-200 flex flex-col gap-3">
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedBedrooms}
                onValueChange={setSelectedBedrooms}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  {bedroomOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedAvailability}
                onValueChange={setSelectedAvailability}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2 text-slate-500 w-full justify-center"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredApartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApartments.map((apartment) => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                availability={availabilityMap[apartment.slug] ?? null}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🏠</div>
            <h3 className="font-display text-2xl font-bold text-charcoal mb-2">
              No apartments found
            </h3>
            <p className="text-slate-500 mb-6">
              No apartments match your current filters. Try adjusting your
              search.
            </p>
            <Button
              onClick={clearFilters}
              className="bg-gold hover:bg-gold-dark text-charcoal font-semibold"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
