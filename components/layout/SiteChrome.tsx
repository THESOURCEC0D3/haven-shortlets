"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/shared/ScrollReveal";

/**
 * Wraps the public-facing site chrome (Navbar + Footer) around page content.
 * Admin routes render their own shell, so we skip the public chrome there —
 * otherwise the site Navbar stacks on top of the admin dashboard header.
 */
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <ScrollReveal />
      {/* id is the skip-link target. tabIndex={-1} lets the browser move focus
          here programmatically when the skip link is activated — without it,
          focus stays on the link in some browsers and the skip does nothing. */}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
