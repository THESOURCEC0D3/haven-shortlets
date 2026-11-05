import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",

        // ---- Brand variants -------------------------------------------------
        // These existed already, but as raw className strings copy-pasted into
        // ~15 call sites. Naming them here means the brand button is defined in
        // ONE place: change the primary action colour once and every button
        // follows. Copy-pasted styling is how a design system drifts.
        //
        // `primary` — the main site action (gold on charcoal text, 9.06:1 AAA).
        primary:
          "bg-gold text-charcoal font-semibold hover:bg-gold-dark focus-visible:ring-gold/50",
        // `whatsapp` — the booking channel. Semantic colour, not the accent.
        // green-700 rather than green-500: white-on-green-500 measures 2.28:1
        // and is unreadable in sunlight, which is where this gets tapped.
        whatsapp:
          "bg-whatsapp text-white hover:bg-whatsapp-dark focus-visible:ring-whatsapp/50",
        // `onDark` — outline button sitting on a charcoal/photo ground.
        onDark:
          "border-white/40 text-white hover:bg-white/10 hover:border-white focus-visible:ring-white/50",
        // `onLight` — outline button on white/ivory.
        onLight:
          "border-charcoal text-charcoal hover:bg-charcoal hover:text-white",
        // `muted` — a still-clickable action we want to de-emphasise (e.g.
        // "Ask about dates" on a booked apartment). Looks greyed out without
        // being `disabled`: a disabled button ends the conversation, this one
        // keeps the lead. slate-700 on slate-200 is ~8:1, so it stays legible.
        muted:
          "bg-slate-200 text-slate-700 hover:bg-slate-300 focus-visible:ring-slate-400/50",
      },
      size: {
        // TOUCH-TARGET SCALE (re-tuned from the shadcn "radix-nova" default).
        //
        // The upstream scale is h-8/h-7/h-9 (32/28/36px) — dimensions for a
        // desktop application, where the pointer is a 1px mouse cursor. This is
        // a mobile-first booking site where the pointer is a thumb, so the
        // whole scale shifts up to Apple's and Google's published 44px minimum.
        // Bumping it here fixes every button on the site at once rather than
        // patching call sites one by one.
        default:
          "h-11 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-[min(var(--radius-md),12px)] px-3 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-6 text-base has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-11",
        "icon-xs":
          "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-9 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
