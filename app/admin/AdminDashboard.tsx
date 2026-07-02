"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  Calendar,
  LogOut,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AvailabilityBadge from "@/components/apartments/AvailabilityBadge";
import { updateAvailability } from "@/lib/actions";
import { Apartment, formatPrice } from "@/lib/data/apartments";
import { ApartmentAvailability } from "@/lib/types";

interface AdminDashboardProps {
  apartments: Apartment[];
  availabilityMap: Record<string, ApartmentAvailability>;
  loadError: string | null;
}

interface UpdateState {
  loading: boolean;
  error: string | null;
}

export default function AdminDashboard({
  apartments,
  availabilityMap,
  loadError,
}: AdminDashboardProps) {
  const router = useRouter();
  const [updateStates, setUpdateStates] = useState<
    Record<string, UpdateState>
  >({});
  const [availableDates, setAvailableDates] = useState<
    Record<string, string>
  >({});

  const setLoading = (slug: string, loading: boolean, error: string | null = null) => {
    setUpdateStates((prev) => ({
      ...prev,
      [slug]: { loading, error },
    }));
  };

  const handleToggle = async (
    slug: string,
    currentlyAvailable: boolean
  ) => {
    setLoading(slug, true);

    try {
      const newAvailable = !currentlyAvailable;
      const availableFrom = newAvailable
        ? null
        : availableDates[slug] || null;

      await updateAvailability(slug, newAvailable, availableFrom);
      setLoading(slug, false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update. Please try again.";
      setLoading(slug, false, message);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin-auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const availableCount = apartments.filter((a) => {
    const availability = availabilityMap[a.slug];
    return availability?.available ?? true;
  }).length;

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-charcoal text-white flex flex-col sticky top-0 h-screen">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="font-display text-xl font-bold text-white">
            Haven Admin
          </h1>
          <p className="text-white/40 text-xs mt-0.5">
            Availability Management
          </p>
        </div>

        {/* Availability Summary */}
        <div className="px-6 py-6 border-b border-white/10">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
            Currently Available
          </p>
          <p className="font-display text-3xl font-bold text-white">
            {availableCount}
            <span className="text-white/40 text-lg font-normal">
              /{apartments.length}
            </span>
          </p>
          <p className="text-white/40 text-xs mt-1">apartments free to book</p>
        </div>

        {/* Logout — pinned to bottom */}
        <div className="mt-auto px-6 py-6 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-white/50 hover:text-white hover:bg-white/10 gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Page Heading */}
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-charcoal">
              Availability Management
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Toggle each apartment between available and booked.
            </p>
          </div>

          {/* Data Load Error — availability could not be read from the database */}
          {loadError && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Could not load live availability
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                  Showing defaults. Changes may not save until this is resolved.{" "}
                  <span className="font-mono">{loadError}</span>
                </p>
              </div>
            </div>
          )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Apartments",
              value: apartments.length,
              color: "text-charcoal",
            },
            {
              label: "Available Now",
              value: availableCount,
              color: "text-green-600",
            },
            {
              label: "Currently Booked",
              value: apartments.length - availableCount,
              color: "text-red-500",
            },
            {
              label: "Occupancy Rate",
              value: `${Math.round(
                ((apartments.length - availableCount) / apartments.length) * 100
              )}%`,
              color: "text-gold",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-slate-200 p-4"
            >
              <p className={`font-display text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Apartments List */}
        <div className="flex flex-col gap-4">
          {apartments.map((apartment) => {
            const availability = availabilityMap[apartment.slug];
            const isAvailable = availability?.available ?? true;
            const updateState = updateStates[apartment.slug];

            return (
              <div
                key={apartment.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">

                  {/* Apartment Image */}
                  <div className="relative h-40 md:h-auto md:w-48 shrink-0">
                    <Image
                      src={apartment.images[0]}
                      alt={apartment.name}
                      fill
                      className={`object-cover ${!isAvailable ? "grayscale" : ""}`}
                      sizes="192px"
                    />
                  </div>

                  {/* Apartment Info */}
                  <div className="flex flex-col md:flex-row flex-1 p-6 gap-6">

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">
                          {apartment.name}
                        </h3>
                      </div>
                      <p className="text-slate-500 text-sm mb-3">
                        {apartment.location}
                      </p>
                      <AvailabilityBadge
                        availability={availability}
                        size="sm"
                      />
                      <div className="flex gap-4 mt-3">
                        <p className="text-xs text-slate-400">
                          {formatPrice(apartment.pricePerNight)}/night
                        </p>
                        <p className="text-xs text-slate-400">
                          {apartment.bedrooms}{" "}
                          {apartment.bedrooms > 1 ? "beds" : "bed"}
                        </p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-3 md:w-64">

                      {/* Available From Date — only when marking as booked */}
                      {isAvailable && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            Available From (when booked)
                          </label>
                          <Input
                            type="date"
                            value={availableDates[apartment.slug] || ""}
                            onChange={(e) =>
                              setAvailableDates((prev) => ({
                                ...prev,
                                [apartment.slug]: e.target.value,
                              }))
                            }
                            min={new Date().toISOString().split("T")[0]}
                            className="text-sm"
                          />
                        </div>
                      )}

                      {/* Error Message */}
                      {updateState?.error && (
                        <p className="text-red-500 text-xs">
                          {updateState.error}
                        </p>
                      )}

                      {/* Toggle Button */}
                      <Button
                        onClick={() => handleToggle(apartment.slug, isAvailable)}
                        disabled={updateState?.loading}
                        className={`w-full gap-2 ${
                          isAvailable
                            ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                            : "bg-green-50 hover:bg-green-100 text-green-600 border border-green-200"
                        }`}
                        variant="ghost"
                      >
                        {updateState?.loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                          </>
                        ) : isAvailable ? (
                          <>
                            <XCircle className="w-4 h-4" />
                            Mark as Booked
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Mark as Available
                          </>
                        )}
                      </Button>

                      {/* Last Updated */}
                      {availability?.updated_at && (
                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                          <RefreshCw className="w-3 h-3" />
                          Updated{" "}
                          {new Date(
                            availability.updated_at
                          ).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      )}

                    </div>

                  </div>

                </div>
              </div>
            );
          })}
          </div>

        </div>
      </div>
    </div>
  );
}