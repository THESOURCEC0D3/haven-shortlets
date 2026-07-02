import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo/metadata";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/structured-data";
import { guides } from "@/lib/data/guides";

export const metadata = pageMetadata({
  title: "Port Harcourt Short-Let Guides",
  description:
    "Neighbourhood guides and diaspora booking advice for short-let apartments in Port Harcourt — GRA, Woji, and how to book safely from abroad.",
  path: "/guides",
});

export default function GuidesIndex() {
  return (
    <div className="min-h-screen bg-ivory">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
        ])}
      />

      <div className="bg-charcoal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Port Harcourt <span className="italic text-gold">Guides</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Practical, local knowledge for choosing and booking a short-let in
            Port Harcourt — written for business travellers and the diaspora.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="relative h-44 w-full">
                <Image
                  src={guide.image}
                  alt={guide.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h2 className="font-display text-lg font-bold text-charcoal mb-2 leading-snug">
                  {guide.title}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">
                  {guide.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-gold">
                  Read guide
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
