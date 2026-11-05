import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The wordmark + monogram, used in the navbar and the footer.
 *
 * Extracted for two reasons:
 *
 * 1. It was duplicated, and the two copies had already drifted — both used
 *    `bg-amber-500` for the monogram, which is NOT the brand gold token. The
 *    logo was a different colour from every other gold element on the site.
 *    That is exactly how a design system rots: not from carelessness, but
 *    because a hardcoded value in two files has no single place to correct.
 * 2. `onDark` exists because the navbar sits on a transparent hero at the top
 *    of the page and turns solid on scroll, so the wordmark must legibly flip
 *    between grounds. Passing a boolean beats duplicating the whole block.
 */
export default function BrandMark({
  onDark = false,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        className="grid size-8 shrink-0 place-items-center rounded-md bg-gold font-display text-sm font-bold text-charcoal"
        aria-hidden="true"
      >
        H
      </span>
      <span className="flex flex-col">
        <span
          className={cn(
            "text-sm font-bold leading-none transition-colors",
            onDark ? "text-white" : "text-charcoal",
          )}
        >
          {siteConfig.shortName}
        </span>
        <span
          className={cn(
            "mt-0.5 text-xs leading-none transition-colors",
            onDark ? "text-gold" : "text-slate-500",
          )}
        >
          {siteConfig.address.locality}
        </span>
      </span>
    </span>
  );
}
