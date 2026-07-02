/**
 * Renders one or more JSON-LD structured-data blocks into the page as
 * <script type="application/ld+json"> tags. This is how we feed machine-
 * readable facts (prices, location, amenities, FAQs) to Google rich results
 * and to LLMs powering AI search — the single highest-leverage SEO/GEO move
 * for a real-estate site.
 *
 * Server component: the script ships in the initial HTML, so crawlers and
 * AI agents that don't run JavaScript still see it.
 */

interface JsonLdProps {
  // A single schema object or an array of them.
  data: Record<string, unknown> | Record<string, unknown>[];
}

export default function JsonLd({ data }: JsonLdProps) {
  const blocks = Array.isArray(data) ? data : [data];

  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify output is safe to inject; it can't contain a raw
          // </script> sequence because the quotes/slashes are escaped as data.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
