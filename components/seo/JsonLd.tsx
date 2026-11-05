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
          // The previous comment here claimed JSON.stringify made this safe
          // because "the quotes/slashes are escaped as data". That is FALSE:
          // JSON.stringify does not escape the forward slash, so a value
          // containing `</script>` would close this tag and execute whatever
          // followed. The code happened to be safe only because every value was
          // a compile-time constant we authored — the moment any of it comes
          // from Supabase, a CMS, or a guest review, it is stored XSS.
          //
          // `<` is a valid JSON escape for `<`. Parsers read it identically
          // to a literal `<`, so schema validity is unaffected, but it can no
          // longer terminate the script element. Escaping at the boundary is
          // safer than trusting every future caller to sanitise its input.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(block).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
