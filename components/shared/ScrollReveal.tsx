"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Fades in every `[data-reveal]` element as it scrolls into view.
 *
 * Why one observer instead of a <Reveal> wrapper component per section:
 * sections stay server components and only gain an HTML attribute. A wrapper
 * would force a client boundary around each section and ship extra JS for
 * what is, in the end, toggling one attribute.
 *
 * Renders nothing. Mounted once in SiteChrome so it covers every public page.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  // Re-run on route change: client-side navigation swaps the page content
  // without remounting this component, so the new page's sections would
  // otherwise never be observed.
  useEffect(() => {
    // Reduced-motion users never get `reveal-ready`, so the CSS never hides
    // anything — content is just there, no fade, no delay.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"),
    );

    // Anything already on screen is marked revealed BEFORE the hiding class
    // goes on. On a first load the server-rendered HTML is already visible;
    // hiding it and fading it back in would read as a flicker, not polish.
    const viewportHeight = window.innerHeight;
    for (const el of targets) {
      if (el.getBoundingClientRect().top < viewportHeight) {
        el.dataset.revealed = "";
      }
    }

    document.documentElement.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "";
          // Reveal once. Re-hiding on scroll-up makes a page feel restless.
          observer.unobserve(entry.target);
        }
      },
      // Fire once the element's top crosses a line 10% above the bottom of
      // the screen, so the motion happens where the eye is rather than
      // half-hidden at the bottom edge. threshold 0 (not e.g. 0.1) because a
      // percentage of a very tall section can exceed the viewport — on a
      // phone it would never fire and the section would stay invisible.
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );

    for (const el of targets) {
      if (!("revealed" in el.dataset)) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
