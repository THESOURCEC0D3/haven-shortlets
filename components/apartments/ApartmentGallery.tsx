"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApartmentGalleryProps {
  images: string[];
  /** Per-image descriptions. Falls back to a numbered label if absent. */
  alts?: string[];
  title: string;
}

/**
 * Apartment gallery with an accessible full-screen viewer.
 *
 * WHAT WAS WRONG BEFORE — this component failed nearly every requirement for a
 * modal, and one of them at WCAG Level A:
 *
 *   - No Escape handler        → a keyboard user could open the lightbox and had
 *                                NO way out. That is WCAG 2.1.2 "No Keyboard
 *                                Trap", a Level A failure — the lowest bar the
 *                                standard sets.
 *   - No focus trap            → Tab moved to links behind the overlay.
 *   - No focus restore         → closing dumped focus on <body>.
 *   - No role="dialog"         → never announced as a dialog.
 *   - No arrow-key navigation  → effectively mouse-only.
 *   - No body scroll lock      → the page scrolled under the overlay.
 *   - <div onClick> main image → not focusable, not keyboard-activatable.
 *   - Icon-only buttons        → announced as "button", with no name.
 *   - alt="… photo 3"          → tells a blind guest nothing about the room.
 *
 * A modal is one of the hardest widgets in web UI precisely because of that
 * list. The general lesson: never hand-roll one — this project already had Radix
 * Dialog installed via components/ui/sheet, which handles all of it.
 *
 * Here I keep the bespoke visual design (it fits the brand) but implement the
 * dialog semantics properly, so the work a primitive does for you is visible.
 */
export default function ApartmentGallery({
  images,
  alts,
  title,
}: ApartmentGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Remembers what had focus before the dialog opened, so we can put it back.
  const triggerRef = useRef<HTMLElement | null>(null);

  const altFor = (index: number) =>
    alts?.[index] ?? `${title} — photograph ${index + 1} of ${images.length}`;

  const goPrevious = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  const openViewer = () => {
    triggerRef.current = document.activeElement as HTMLElement;
    setViewerOpen(true);
  };

  const closeViewer = useCallback(() => {
    setViewerOpen(false);
    // Restore focus to whatever opened the dialog. Without this focus falls to
    // <body> and a keyboard user must tab from the top of the page again.
    triggerRef.current?.focus();
  }, []);

  // Move focus into the dialog when it opens.
  useEffect(() => {
    if (viewerOpen) closeButtonRef.current?.focus();
  }, [viewerOpen]);

  // Lock background scroll while open, restoring the previous value rather than
  // assuming it was "visible".
  useEffect(() => {
    if (!viewerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [viewerOpen]);

  // Keyboard: Escape closes, arrows navigate, Tab is trapped inside.
  useEffect(() => {
    if (!viewerOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeViewer();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
        return;
      }
      if (event.key !== "Tab") return;

      // FOCUS TRAP. Collect the focusable elements inside the dialog and wrap
      // Tab / Shift+Tab around them, so focus can never reach the page behind.
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [viewerOpen, closeViewer, goPrevious, goNext]);

  return (
    <>
      <div className="bg-charcoal rounded-2xl overflow-hidden">
        <div className="relative h-72 md:h-125 w-full">
          <Image
            src={images[activeIndex]}
            alt={altFor(activeIndex)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 66vw"
            priority
          />

          {/* A real <button>, not a <div onClick>. Focusable and operable by
              keyboard and screen reader for free. */}
          <button
            type="button"
            onClick={openViewer}
            aria-label={`View all ${images.length} photographs of the ${title} full screen`}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-charcoal/80 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <Expand className="size-3.5" aria-hidden="true" />
            View all {images.length} photos
          </button>

          {images.length > 1 && (
            <>
              <GalleryArrow
                direction="previous"
                onClick={goPrevious}
                title={title}
              />
              <GalleryArrow direction="next" onClick={goNext} title={title} />
            </>
          )}
        </div>

        {images.length > 1 && (
          <div
            className="flex gap-2 p-3 overflow-x-auto bg-charcoal"
            role="tablist"
            aria-label={`${title} photographs`}
          >
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                role="tab"
                // aria-selected communicates the active thumbnail. Previously
                // the active state was border colour alone, which is invisible
                // to a screen reader.
                aria-selected={index === activeIndex}
                aria-label={`Show photograph ${index + 1}: ${altFor(index)}`}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative h-16 w-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none",
                  index === activeIndex
                    ? "border-gold opacity-100"
                    : "border-transparent opacity-60 hover:opacity-90",
                )}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen viewer */}
      {viewerOpen && (
        <div
          ref={dialogRef}
          // role + aria-modal make assistive tech treat this as a dialog and
          // ignore the page behind it.
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — photograph ${activeIndex + 1} of ${images.length}`}
          className="fixed inset-0 z-60 flex items-center justify-center bg-charcoal/95"
          // Backdrop click closes, but only when the backdrop itself is the
          // target — a drag ending outside the image shouldn't close it.
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeViewer();
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeViewer}
            aria-label="Close photo viewer"
            className="absolute top-4 right-4 grid size-11 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <X className="size-6" aria-hidden="true" />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={goPrevious}
              aria-label="Previous photograph"
              className="absolute left-2 sm:left-4 grid size-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <ChevronLeft className="size-6" aria-hidden="true" />
            </button>
          )}

          <div className="relative mx-14 sm:mx-20 h-[70vh] w-full max-w-5xl">
            <Image
              src={images[activeIndex]}
              alt={altFor(activeIndex)}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={goNext}
              aria-label="Next photograph"
              className="absolute right-2 sm:right-4 grid size-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <ChevronRight className="size-6" aria-hidden="true" />
            </button>
          )}

          {/* aria-live so the position is announced as you arrow through. */}
          <p
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/80 tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {activeIndex + 1} of {images.length}
          </p>

          <p className="sr-only">
            Use the left and right arrow keys to move between photographs, or
            press Escape to close.
          </p>
        </div>
      )}
    </>
  );
}

function GalleryArrow({
  direction,
  onClick,
  title,
}: {
  direction: "previous" | "next";
  onClick: () => void;
  title: string;
}) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      // The previous version rendered an icon and nothing else, so screen
      // readers announced only "button".
      aria-label={`${direction === "previous" ? "Previous" : "Next"} photograph of the ${title}`}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-charcoal/60 text-white transition-colors hover:bg-charcoal/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        direction === "previous" ? "left-3" : "right-3",
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}
