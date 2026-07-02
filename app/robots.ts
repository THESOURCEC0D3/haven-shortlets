/**
 * Generates /robots.txt. Tells crawlers what they may access and where the
 * sitemap is.
 *
 * Deliberate GEO choice: we EXPLICITLY allow the major AI crawlers (GPTBot,
 * OAI-SearchBot, ChatGPT-User, PerplexityBot, Google-Extended). Allowing them
 * is what makes the site eligible to be read and cited by ChatGPT, Perplexity,
 * and Google's AI features. If a client ever wants to opt out of AI training,
 * this is the single place to disallow them.
 *
 * /admin and /api are blocked from all crawlers — they're private and have no
 * SEO value.
 */

import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/api"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      // Listed separately so the intent to allow AI crawlers is explicit and
      // easy to flip later.
      { userAgent: AI_CRAWLERS, allow: "/", disallow },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
