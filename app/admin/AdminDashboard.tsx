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
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AvailabilityBadge from "@/components/apartments/AvailabilityBadge";
import { updateAvailability } from "@/lib/actions";
import { type Apartment, formatPrice } from "@/lib/data/apartments";
import type { AvailabilityStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AdminDashboardProps {
  apartments: Apartment[];
  statuses: Record<string, AvailabilityStatus>;
  loadError: string | null;
}

interface UpdateState {
  loading: boolean;
  error: string | null;
}

/** Local YYYY-MM-DD, avoiding the UTC shift of toISOString() near midnight. */
function todayLocalISO(): string {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().split("T")[0];
}

export default function AdminDashboard({
  apartments,
  statuses,
  loadError,
}: AdminDashboardProps) {
  const router = useRouter();
  const [updateStates, setUpdateStates] = useState<Record<string, UpdateState>>(
    {},
  );
  const [availableDates, setAvailableDates] = useState<Record<string, string>>(
    () => {
      // Seed from existing data so an already-booked apartment shows its
      // current return date instead of an empty field.
      const seed: Record<string, string> = {};
      for (const [slug, status] of Object.entries(statuses)) {
        if (status.availableFrom) seed[slug] = status.availableFrom;
      }
      return seed;
    },
  );
  const [confirming, setConfirming] = useState<string | null>(null);

  const setLoading = (
    slug: string,
    loading: boolean,
    error: string | null = null,
  ) => {
    setUpdateStates((prev) => ({ ...prev, [slug]: { loading, error } }));
  };

  const applyChange = async (
    slug: string,
    nextAvailable: boolean,
    availableFrom: string | null,
  ) => {
    setLoading(slug, true);
    setConfirming(null);
    try {
      await updateAvailability(slug, nextAvailable, availableFrom);
      setLoading(slug, false);
      router.refresh();
    } catch (error) {
      setLoading(
        slug,
        false,
        error instanceof Error
          ? error.message
          : "Failed to update. Please try again.",
      );
    }
  };

  const availableCount = apartments.filter(
    (a) => statuses[a.slug]?.state === "available",
  ).length;
  const bookedCount = apartments.filter(
    (a) => statuses[a.slug]?.state === "booked",
  ).length;
  const unknownCount = apartments.length - availableCount - bookedCount;

  const occupancy =
    apartments.length > 0
      ? Math.round((bookedCount / apartments.length) * 100)
      : 0;

  return (
    // RESPONSIVE SHELL.
    //
    // This was `flex min-h-screen` with a fixed `w-64` sidebar and no
    // responsive hiding — on a 360px phone the sidebar consumed 256px and left
    // ~104px for the content. Consider who uses this page: a host standing
    // inside an apartment with a phone, marking it booked. The one screen whose
    // primary device is definitely a phone was the one screen with no mobile
    // layout. Internal tools get designed on the developer's monitor and used
    // on the operator's phone.
    //
    // Now: a stacked header on mobile, the sidebar only from lg upwards.
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Mobile header */}
      <header className="lg:hidden bg-charcoal text-white px-4 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-lg font-bold">Haven Admin</h1>
          <p className="text-white/70 text-xs">
            {availableCount} of {apartments.length} free to book
          </p>
        </div>
        <LogoutButton />
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-charcoal text-white flex-col sticky top-0 h-screen">
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="font-display text-xl font-bold text-white">
            Haven Admin
          </h1>
          <p className="text-white/70 text-xs mt-0.5">Availability management</p>
        </div>

        <div className="px-6 py-6 border-b border-white/10">
          <p className="text-white/70 text-xs uppercase tracking-wider mb-2">
            Currently available
          </p>
          <p className="font-display text-3xl font-bold text-white">
            {availableCount}
            <span className="text-white/70 text-lg font-normal">
              /{apartments.length}
            </span>
          </p>
          <p className="text-white/70 text-xs mt-1">apartments free to book</p>
        </div>

        <div className="mt-auto px-6 py-6 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-charcoal">
              Availability management
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Toggle each apartment between available and booked. Changes go live
              on every page within seconds.
            </p>
          </div>

          {loadError && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <XCircle
                className="size-5 text-red-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Could not load live availability
                </p>
                <p className="text-xs text-red-700 mt-0.5">
                  Guests are seeing &ldquo;Check availability&rdquo; rather than a
                  possibly-wrong status. Changes may not save until this is
                  resolved. <span className="font-mono">{loadError}</span>
                </p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <StatCard label="Total apartments" value={apartments.length} />
            <StatCard
              label="Available now"
              value={availableCount}
              tone="text-green-700"
            />
            <StatCard
              label="Currently booked"
              value={bookedCount}
              tone="text-slate-700"
            />
            <StatCard
              label="Occupancy"
              value={`${occupancy}%`}
              tone="text-gold-text"
            />
          </div>

          {unknownCount > 0 && (
            <p className="mb-6 flex items-center gap-2 text-sm text-slate-700">
              <AlertTriangle
                className="size-4 text-gold-text shrink-0"
                aria-hidden="true"
              />
              {unknownCount} apartment{unknownCount === 1 ? "" : "s"} have no
              availability row — check the slug matches Supabase.
            </p>
          )}

          {/* Apartment list */}
          <div className="flex flex-col gap-4">
            {apartments.map((apartment) => {
              const status = statuses[apartment.slug];
              const isAvailable = status?.state === "available";
              const updateState = updateStates[apartment.slug];
              const dateValue = availableDates[apartment.slug] ?? "";
              const isConfirming = confirming === apartment.slug;

              return (
                <div
                  key={apartment.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-40 sm:h-auto sm:w-40 shrink-0">
                      <Image
                        src={apartment.images[0]}
                        alt=""
                        fill
                        className={cn(
                          "object-cover",
                          !isAvailable && "grayscale",
                        )}
                        sizes="160px"
                      />
                    </div>

                    <div className="flex flex-col lg:flex-row flex-1 p-4 sm:p-6 gap-4 lg:gap-6">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900">
                          {apartment.name}
                        </h3>
                        <p className="text-slate-600 text-sm mb-3">
                          {apartment.location}
                        </p>
                        {status && (
                          <AvailabilityBadge status={status} size="sm" />
                        )}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                          <p className="text-xs text-slate-600">
                            {formatPrice(apartment.pricePerNight)}/night
                          </p>
                          <p className="text-xs text-slate-600">
                            {apartment.bedrooms}{" "}
                            {apartment.bedrooms > 1 ? "beds" : "bed"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 lg:w-72">
                        {/* THE DATE FIELD IS ALWAYS AVAILABLE.
                            It used to render only when `isAvailable`, so to
                            change the return date on an already-booked
                            apartment you had to first mark it Available —
                            which immediately published a booked apartment as
                            bookable — then mark it booked again. A routine
                            admin task briefly told guests something false. */}
                        <div className="flex flex-col gap-1.5">
                          <label
                            htmlFor={`date-${apartment.slug}`}
                            className="text-xs text-slate-700 font-medium flex items-center gap-1.5"
                          >
                            <Calendar className="size-3.5" aria-hidden="true" />
                            Free again from (optional)
                          </label>
                          <Input
                            id={`date-${apartment.slug}`}
                            type="date"
                            value={dateValue}
                            onChange={(e) =>
                              setAvailableDates((prev) => ({
                                ...prev,
                                [apartment.slug]: e.target.value,
                              }))
                            }
                            min={todayLocalISO()}
                            className="text-sm"
                          />
                          {!isAvailable && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={updateState?.loading}
                              onClick={() =>
                                applyChange(
                                  apartment.slug,
                                  false,
                                  dateValue || null,
                                )
                              }
                              className="justify-start text-xs text-slate-700"
                            >
                              Save this date
                            </Button>
                          )}
                        </div>

                        {updateState?.error && (
                          <p
                            className="text-red-700 text-xs"
                            role="alert"
                          >
                            {updateState.error}
                          </p>
                        )}

                        {/* CONFIRMATION STEP.
                            This is the single most business-critical action on
                            the site and it previously fired on one tap with no
                            confirmation and no undo. One mis-tap on a phone
                            published a booked apartment as available. */}
                        {isConfirming ? (
                          <div className="rounded-lg border border-slate-300 bg-slate-50 p-3">
                            <p className="text-xs text-slate-800 mb-3">
                              {isAvailable
                                ? "Mark as booked? Guests will no longer be able to book it."
                                : "Mark as available? This publishes it as bookable on every page."}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={isAvailable ? "destructive" : "primary"}
                                onClick={() =>
                                  applyChange(
                                    apartment.slug,
                                    !isAvailable,
                                    !isAvailable ? null : dateValue || null,
                                  )
                                }
                              >
                                Yes, {isAvailable ? "mark booked" : "publish"}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setConfirming(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            onClick={() => setConfirming(apartment.slug)}
                            disabled={updateState?.loading}
                            variant={isAvailable ? "destructive" : "primary"}
                            className="w-full"
                          >
                            {updateState?.loading ? (
                              <>
                                <Loader2
                                  className="size-4 animate-spin"
                                  aria-hidden="true"
                                />
                                Updating…
                              </>
                            ) : isAvailable ? (
                              <>
                                <XCircle className="size-4" aria-hidden="true" />
                                Mark as booked
                              </>
                            ) : (
                              <>
                                <CheckCircle
                                  className="size-4"
                                  aria-hidden="true"
                                />
                                Mark as available
                              </>
                            )}
                          </Button>
                        )}

                        {status?.updatedAt && (
                          <p className="text-xs text-slate-600 flex items-center gap-1.5">
                            <RefreshCw className="size-3" aria-hidden="true" />
                            Updated{" "}
                            {new Date(status.updatedAt).toLocaleDateString(
                              "en-NG",
                              { day: "numeric", month: "short", year: "numeric" },
                            )}
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
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone = "text-charcoal",
}: {
  label: string;
  value: number | string;
  tone?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className={cn("font-display text-2xl lg:text-3xl font-bold", tone)}>
        {value}
      </p>
      <p className="text-slate-600 text-xs mt-1">{label}</p>
    </div>
  );
}

function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        await fetch("/api/admin-auth", { method: "DELETE" });
        router.push("/admin/login");
      }}
      className="text-white/80 hover:text-white hover:bg-white/10 gap-2"
    >
      <LogOut className="size-4" aria-hidden="true" />
      Log out
    </Button>
  );
}
