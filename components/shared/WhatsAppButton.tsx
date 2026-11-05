import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig, whatsappUrl } from "@/lib/site";

interface WhatsAppButtonProps {
  /**
   * The pre-filled message. REQUIRED and deliberately not defaulted — a generic
   * message ("I'd like to book an apartment") produces a lead the host must
   * spend four messages qualifying, whereas one naming the specific apartment
   * is answerable immediately. Making this required forces the caller to think
   * about what the guest is actually asking at that point in the funnel.
   */
  message: string;
  label?: string;
  size?: "default" | "sm" | "lg";
  /** Override only for a non-default number (e.g. a second host line). */
  phone?: string;
  className?: string;
}

/**
 * The site's primary conversion control.
 *
 * Three things were wrong with the previous version:
 *
 * 1. It accepted a `variant` prop that could not do anything — the hardcoded
 *    `bg-green-500 text-white` always won, because classes were appended by
 *    template interpolation rather than merged. A prop that silently does
 *    nothing is worse than no prop: someone uses it, sees no effect, and loses
 *    an hour. It is gone.
 * 2. Classes were concatenated instead of passed through `cn()`/tailwind-merge,
 *    so a caller could not override anything.
 * 3. `phone` was required and passed the same hardcoded string 11 times.
 *
 * Colour now comes from the `whatsapp` button variant (green-700), because
 * white-on-green-500 measured 2.28:1 — unreadable in sunlight on a phone,
 * which is precisely where this button gets tapped.
 */
export default function WhatsAppButton({
  message,
  label = "WhatsApp Us",
  size = "default",
  phone = siteConfig.whatsapp,
  className,
}: WhatsAppButtonProps) {
  return (
    <Button asChild variant="whatsapp" size={size} className={cn(className)}>
      <a
        href={whatsappUrl(message, phone)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* aria-hidden: the icon is decorative — the label already says what
            this does, so announcing the icon would duplicate it. */}
        <MessageCircle className="size-4" aria-hidden="true" />
        {label}
        {/* Opening a new tab without warning disorients screen-reader users.
            sr-only text is the standard zero-visual-cost fix. */}
        <span className="sr-only"> (opens WhatsApp)</span>
      </a>
    </Button>
  );
}
