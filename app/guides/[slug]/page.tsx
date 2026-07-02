import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo/metadata";
import JsonLd from "@/components/seo/JsonLd";
import FaqSection from "@/components/seo/FaqSection";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/seo/structured-data";
import { guides, getGuideBySlug } from "@/lib/data/guides";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found" };

  return pageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    image: guide.image,
  });
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <div className="min-h-screen bg-ivory">
      <JsonLd
        data={[
          articleSchema({
            title: guide.title,
            description: guide.description,
            path: `/guides/${guide.slug}`,
            image: guide.image,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.title, path: `/guides/${guide.slug}` },
          ]),
          faqSchema(guide.faqs),
        ]}
      />

      {/* Hero image + title */}
      <div className="relative h-64 md:h-80 w-full">
        <Image
          src={guide.image}
          alt={guide.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
              {guide.title}
            </h1>
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8">
        {/* Direct-answer intro — the extractable chunk for AI search */}
        <p className="text-lg text-slate-700 leading-relaxed font-medium border-l-4 border-gold pl-4">
          {guide.intro}
        </p>

        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-2xl font-bold text-charcoal mb-3">
              {section.heading}
            </h2>
            <p className="text-slate-600 leading-relaxed">{section.body}</p>
          </section>
        ))}

        <FaqSection faqs={guide.faqs} />

        {/* Conversion bridge from content to listings */}
        <div className="bg-charcoal rounded-2xl p-6 text-white text-center">
          <p className="font-display text-xl font-bold mb-3">
            Ready to book your Port Harcourt stay?
          </p>
          <Link
            href="/apartments"
            className="inline-block bg-gold text-charcoal font-semibold rounded-full px-6 py-2.5 hover:bg-gold-dark transition-colors"
          >
            Browse apartments
          </Link>
        </div>
      </article>
    </div>
  );
}
