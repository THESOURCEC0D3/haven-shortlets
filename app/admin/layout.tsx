import type { Metadata } from "next";

// The admin area is private and password-gated. We block it from indexing here
// (covers the login client component too) in addition to the Disallow in
// robots.ts — defence in depth so it never leaks into search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
