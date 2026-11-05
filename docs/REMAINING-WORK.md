# Haven Shortlets — Remaining Work

**Written:** 30 July 2026, after implementing Phases 1–5 of the audit
**Companion doc:** [HAVEN-SHORTLETS-AUDIT.md](HAVEN-SHORTLETS-AUDIT.md) — the original 14-part audit
**Current state:** `tsc` clean · `eslint` clean · `next build` passes · 34 static pages

Every item below was verified against the codebase on the date above, not recalled
from memory. Item numbers in brackets like `[M13]` refer to the audit's Part 13
priority list so you can cross-reference the original reasoning.

---

## How to use this document

Work top to bottom. The sections are ordered by **what blocks launch**, not by
difficulty. Within each section items are independent unless a dependency is
stated.

Each item states: **what**, **why it matters commercially**, **where in the code**,
and a **rough effort**. If an item has no clear commercial reason, it should not
be in this file — delete it rather than doing it.

---

## 🔴 SECTION 1 — Blocked on you (I cannot do these)

These need assets, decisions, or external accounts. **Two of them are launch
blockers.** Nothing in Section 2 or below matters if these aren't done.

### 1.1 Photograph of Chidi — LAUNCH BLOCKER `[H9]`
**What:** One headshot of the host. Add to `siteConfig.host` as an image path and
render it in [components/about/HostProfile.tsx](../components/about/HostProfile.tsx),
replacing the letter-in-a-circle avatar.

**Why:** The About page's own headline is **"A Real Person. Not an Inbox."** and it
is illustrated with a monogram. Your highest-value persona — the diaspora guest
booking 14–21 nights from abroad — is actively running scam-detection. A face beats
every adjective on the site. The audit rated this the highest-value single asset
missing from the project.

**Effort:** 30 minutes once you have the photo.

### 1.2 Real apartment photography — LAUNCH BLOCKER `[M27]`
**What:** 15–20 real photos per unit, labelled by room. Replace the Unsplash URLs in
[lib/data/apartments.ts](../lib/data/apartments.ts) and populate the `imageAlts`
array (already wired, currently empty on all six units).

**Why:** Three apartments currently share the *identical four* Unsplash URLs, on a
site whose [WhyBookDirect](../components/home/WhyBookDirect.tsx) section promises
*"Every photo on this site was taken in the actual apartment you will stay in. No
stock images."* That single contradiction undoes more trust than the entire About
page builds. Four generic images also cannot support a ₦150,000/night decision —
Airbnb listings average 20–30.

**Also unblocks:** descriptive alt text `[L35]`. For a product sold on its
photographs, alt text *is* the product description — "Living room with grey
sectional sofa, floor-to-ceiling windows, dining area beyond", not "photo 3".

**Effort:** External (photographer). Then ~1 hour of data entry.

### 1.3 Substantiate or soften the statistics
**What:** "500+ Guests Hosted", "4.9 Average Rating", "73% return guest rate" in
[AboutHero](../components/about/AboutHero.tsx) and [OurStory](../components/about/OurStory.tsx).
Either link a verifiable source or reduce to what you can defend.

**Why:** Every trust element on this site is currently a claim *you* make about
yourself; none is checkable by a stranger. For a fraud-anxious audience,
unverifiable confidence is itself a fraud signal. Note the site's own machine layer
already declines to make the claim — we deliberately do *not* emit
`aggregateRating` in schema, because doing so without real reviews is a Google
policy violation. Close that gap in the honest direction.

**Effort:** 30 minutes, once you decide.

### 1.4 Google Business Profile + one linked review source `[M28]`
**What:** Create the profile, then add the URL to `siteConfig.sameAs` (currently an
empty array, so schema omits `sameAs` entirely).

**Why:** This is the cheapest way to convert an unverifiable claim into a verifiable
one. It also feeds local SEO and entity consistency — the `sameAs` property is how
search engines link your site to your business identity elsewhere on the web.

**Effort:** 2 hours including verification wait.

### 1.5 Replace the fake testimonials with real artefacts
**What:** [components/home/Testimonials.tsx](../components/home/Testimonials.tsx)
holds three polished, unsourced quotes under a header claiming *"Not cherry-picked
quotes."*

**Why:** Three perfect testimonials with no faces, dates or verification is what a
fake listing looks like. The audit's ladder:

```
Bad:       anonymous glowing quote
Good:      named quote with role          ← you are here
Excellent: WhatsApp screenshot, real date, face blurred, one awkward sentence
```

Imperfection reads as authentic; polish reads as marketing. One real screenshot
outperforms three paragraphs.

**Effort:** 1 hour once you have permission from a guest.

### 1.6 Real business facts still missing
- **RC number** (company registration) — meaningful trust artefact for a diaspora
  buyer, asked for by the playbook's Part 8. Add to `siteConfig` and render in the
  footer.
- **Actual Wi-Fi speed** — the site says "high-speed"; a contractor needs to know it
  holds a Teams call. A number ("40 Mbps fibre") is worth more than the adjective.
- **Confirm the placeholder contact details** — `havenshortlets.ng`,
  `0809 876 5432`, and `bookings@havenshortlets.com` are all still placeholders, and
  the URL and email are on *different TLDs* (`.ng` vs `.com`), which is an entity
  consistency problem.

**Effort:** 30 minutes of data entry once you have the real values.

---

## 🟠 SECTION 2 — Must do before deploy

### 2.1 Set `ADMIN_SESSION_SECRET`
```bash
# .env.local and your host's env vars
ADMIN_SESSION_SECRET=<32+ random characters>
```
**Why:** [lib/auth.ts](../lib/auth.ts) falls back to `ADMIN_PASSWORD` as the HMAC
signing key if this is unset. That works, but it means rotating the admin password
invalidates every session, and a weak password becomes a weak signing key. The code
warns in dev but does not warn in production.

**Effort:** 2 minutes.

### 2.2 Create the Supabase `enquiries` table
```sql
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  enquiry_type text not null,
  check_in date,
  nights integer,
  message text,
  apartment_slug text,
  source text not null default 'contact-form'
);

-- Writes come only from the server (service-role key), reads only from the
-- admin surface. Enable RLS and add no public policy: with RLS on and no
-- permissive policy, the anon key cannot read or write this table at all.
alter table public.enquiries enable row level security;
```
**Why:** [`saveEnquiry`](../lib/actions.ts) fails soft — it logs and returns
`ok: false`, never blocking a guest from reaching WhatsApp — so the form works
today. But **no lead is being stored until this table exists**, which was the
audit's 2/10 lead-capture score. A booking business that cannot list yesterday's
enquiries has no funnel, only luck.

**Effort:** 15 minutes.

### 2.3 Point `NEXT_PUBLIC_SITE_URL` at the real domain
**Why:** Every canonical tag, the sitemap, robots.txt, OpenGraph URL and all JSON-LD
`@id` values derive from it. Currently the placeholder `https://havenshortlets.ng`.
Getting this wrong at launch means every canonical points at a domain you don't own.

**Effort:** 2 minutes.

---

## 🟡 SECTION 3 — High value, next sprint

### 3.1 Date-range availability model `[M13]` — the big one
**What:** Replace the single `available` boolean with a bookings/blocked-dates table,
so the system can answer "is this free 14–21 March?"

**Why this is the ceiling on everything else:** Your own
[ContactForm](../components/contact/ContactForm.tsx) collects a check-in date and a
night count, and every WhatsApp message says "confirm availability" — **the site is
architecturally incapable of answering the question its own UI asks.** Every
remaining conversion improvement runs into this.

It also unblocks the highest-value AI opportunity from the audit's Part 18: a
WhatsApp availability assistant. Right now a human answers "is it free on the 14th?"
dozens of times a day.

**Rough shape:**
```
bookings(id, apartment_slug, start_date, end_date, status)
→ isAvailable(slug, checkIn, nights) derived from overlap query
→ date pickers on the listing + a real availability calendar
→ admin becomes "block these dates" instead of a boolean toggle
```

**Effort:** 2–3 days. Do it before adding more units.

### 3.2 Route groups — delete `SiteChrome` `[M14]`
**What:** Move routes into `app/(site)/` and `app/(admin)/`, give each its own
`layout.tsx`, delete [components/layout/SiteChrome.tsx](../components/layout/SiteChrome.tsx).
URLs do not change — a parenthesised segment is invisible in the URL.

**Why:** `SiteChrome` is `"use client"` solely to run
`if (pathname.startsWith("/admin"))` — a runtime check for something the router
resolves at build time. Because of it, `Navbar` **and `Footer`** are pulled into the
client bundle on every page. Footer is 179 lines of completely static markup being
shipped twice: once as HTML, once as JavaScript to hydrate it.

The audit called this the highest-value architectural refactor available.

**Effort:** ~2 hours including a build verification.

### 3.3 Map + drive times on the two area pages `[M16, partial]`
**What:** [LocationPanel](../components/apartments/LocationPanel.tsx) exists and is
used on listing pages only. Add it (or an area-level variant) to
[app/port-harcourt/[area]/page.tsx](../app/port-harcourt/%5Barea%5D/page.tsx).

**Why:** An area page is *entirely about a place* and currently shows no map and no
distances. Your own copy claims GRA is "20–30 minutes from the airport" and Woji
"borders Trans-Amadi" — claims a map makes credible instantly and a paragraph never
will. This is the one page type where location context is unambiguously the point.

**Effort:** 1 hour (component already exists; needs area-level `nearby` data in
[lib/data/areas.ts](../lib/data/areas.ts)).

### 3.4 Make `/port-harcourt` a hub, not a second catalogue
**What:** It currently renders all six apartments — identical inventory to
`/apartments`. Reduce it to area intros, a GRA-vs-Woji comparison, a map, and 2–3
representative units per area with strong links onward.

**Why:** Two "browse everything" pages is an IA smell. A guest who lands here from
Google, then clicks "Stays" in the nav, sees the same six apartments and learns
nothing. Let `/apartments` own the full inventory.

**Effort:** 2 hours.

### 3.5 Attribute the guides to Chidi + add dates `[M26]`
**What:** Add `author` and `datePublished`/`dateModified` to the `Guide` type,
render a byline with the photo from 1.1, and emit both in `articleSchema`.

**Why:** The diaspora guide is literally advice about not being scammed, published
anonymously. You have a named, credentialed host — Port Harcourt native, former oil
services engineer, hosting since 2019. Attributing it converts anonymous SEO content
into first-hand local expertise, which is exactly what Google's E-E-A-T framework
rewards **and** what a nervous reader needs. Google's Article rich results also want
both dates.

**Depends on:** 1.1 (photo) for full effect; the byline text alone can ship now.

**Effort:** 1 hour.

### 3.6 Unique content on the type pages `[L48]`
**What:** [app/port-harcourt/[area]/[type]/page.tsx](../app/port-harcourt/%5Barea%5D/%5Btype%5D/page.tsx)
still does `...area.faqs.slice(0, 2)` (line 81), so the identical two Q&A pairs — and
the identical `FAQPage` JSON-LD — appear on the area page **and all its type
children**. For GRA that is the same text on four URLs.

**Why:** You correctly guarded against *empty* pages with `getAreaTypeCombos()`. The
remaining risk is **near-duplication**, which is the harder problem and the one that
actually gets programmatic SEO penalised. Duplicated FAQ markup across URLs is
specifically discouraged by Google's structured-data guidance.

**Fix:** Two paragraphs of type-specific substance ("a 3-bedroom in GRA fits a
corporate delegation of six, or a family visiting for a wedding"), typical stay
length, price versus the next size down — plus FAQs written per type rather than
inherited.

**Effort:** 2 hours (mostly copywriting).

### 3.7 Move `HostProfile` above `WhyChooseUs` on /about
**What:** One-line reorder in [app/about/page.tsx](../app/about/page.tsx).

**Why:** The page currently argues *company → comparison → person*. But your
differentiator **is** the person — "A Real Person. Not an Inbox." is the thesis and
the comparison table is supporting evidence. Right now the strongest asset sits
fourth.

**Effort:** 5 minutes.

### 3.8 Update the About timeline
**What:** [components/about/OurStory.tsx](../components/about/OurStory.tsx)
milestones end at "2024 — Direct Booking Platform". It is 2026.

**Why:** A history that stops two years ago suggests a business that stopped two
years ago.

**Effort:** 15 minutes.

---

## 🟢 SECTION 4 — Worth doing, not urgent

### 4.1 Add `eslint-plugin-tailwindcss`
**Why this is first in this section:** it is the fix for the *class of bug* that
caused the original font failure. Tailwind fails silently by design — an unknown
utility is not an error, it is nothing:

```
Typo in TypeScript → build fails.     Found in 2 seconds.
Typo in Tailwind   → class vanishes.  Found in 6 months, from a client.
```

51 dead `font-display` classes shipped for months because nothing told anyone. This
plugin turns an unknown class into a lint error. **The senior move is not "be more
careful" — it is making carelessness impossible.**

The Next.js lint rules already caught two of my own mistakes during implementation
(a `setState`-in-effect and two non-canonical classes), which is exactly the point.

**Effort:** 30 minutes.

### 4.2 Extract `SectionHeader` `[L31, partial]`
**What:** The eyebrow + heading + description block (`w-8 h-0.5 bg-gold` + uppercase
tracked label) is copy-pasted in **15 files**. `HavenPromise` and `ConversionBridge`
are already extracted; this is the remaining one.

**Why:** Not just tidiness — it is the last piece of the design system that exists
only in a developer's head and gets re-typed each time. A design system is a set of
*constraints that make the wrong thing hard*, not a set of tokens.

**Effort:** 1 hour.

### 4.3 Generate Supabase types `[L43]`
```bash
npx supabase gen types typescript --project-id <id> > lib/database.types.ts
```
**Why:** `ApartmentAvailability` and `BookingEnquiry` in
[lib/types.ts](../lib/types.ts) are hand-written. At two tables that is fine; the
moment the schema and the type disagree you get a runtime bug the compiler cannot
see. Do this when you add the bookings table (3.1).

**Effort:** 30 minutes.

### 4.4 Tests for the pure functions `[L42]`
**What:** `getAreaTypeCombos()`, `typeSlugFor()`, `airbnbEquivalent()`,
`resolveAvailability()`, `formatPrice()`.

**Why:** These are pure functions with real branching logic and they encode business
rules — `resolveAvailability` in particular decides whether a guest is told the
truth. Ten minutes each, and they are the cheapest tests in the codebase.

**Effort:** 1 hour.

### 4.5 `placeholder="blur"` on images `[L36]`
**Why:** Real perceived-performance win on the mobile 4G connections that dominate
this audience. Needs a blur data URL per image — do it with the real photography
(1.2), not before.

**Effort:** 1 hour, after 1.2.

### 4.6 Prune unused CSS `[L37]`
**What:** All `--sidebar-*` and `--chart-1..5` tokens are referenced **zero** times.
`tw-animate-css` is imported wholesale. A full dark-mode block exists for a site with
no dark-mode toggle.

**Why:** ~40% of the CSS variables in a 77.7KB stylesheet are never used. Not fatal
(it gzips well), but it is boilerplate that was never pruned.

**Effort:** 1 hour. Verify with a build diff.

### 4.7 Scoped Radix imports
**What:** `import { Slot } from "radix-ui"` → `@radix-ui/react-slot` in
[components/ui/button.tsx](../components/ui/button.tsx) and
[badge.tsx](../components/ui/badge.tsx).

**Why:** Tree-shaking should handle the umbrella package, but scoped packages are the
safer default and make the dependency explicit.

**Effort:** 15 minutes.

### 4.8 CI: typecheck + lint + build on push
**Why:** Everything in this document is only true until someone pushes. A three-line
GitHub Action makes the checks I ran manually run automatically.

**Effort:** 30 minutes.

---

## 🔵 SECTION 5 — Growth features (only after 3.1)

Ordered by the audit's assessment of business value, not difficulty.

| # | Feature | Why | Effort |
|---|---|---|---|
| 5.1 | **WhatsApp availability assistant** `[Playbook 18.1]` | Highest-value AI opportunity. The funnel ends in a human answering "is it free on the 14th?" all day. **Requires 3.1.** | 3–5 days |
| 5.2 | **Lead magnet on the diaspora guide** `[L41]` | You already own a genuinely useful document sitting on a public URL earning nothing. Offer it as a PDF for an email address and you build a list of your highest-value persona. | 3 hours |
| 5.3 | **Corporate / long-stay page** `[L39]` | `ContactForm` already offers "Corporate / long-stay enquiry" and **there is no page for it to lead to** — the enquiry type exists, the offer doesn't. Contractors and executives are your highest-LTV and lowest-price-sensitivity segments, and nothing addresses procurement (invoices, corporate rates, repeat accounts). | 4 hours |
| 5.4 | **Stay-cost calculator** `[L40]` | The shortlet equivalent of the playbook's mortgage calculator. Nights × rate, with the weekly/monthly break-even shown — answers "when does the weekly rate beat nightly?" | 3 hours |
| 5.5 | **Video walkthroughs** `[L50]` | Highest-impact trust asset for the diaspora persona after a photo. Your own guide tells readers to "ask for a live video walkthrough" — publishing one pre-empts the request. | External |
| 5.6 | **Follow-up automation** `[Playbook 18.3]` | Most enquiries don't convert on first contact and nothing follows up. 24h/72h WhatsApp nudges. **Requires 2.2.** | 1 day |
| 5.7 | Saved apartments / favourites | Low value at six units. Revisit at ~15. | — |
| 5.8 | CMS for content | Crossover is ~20–30 listings, or the first time a non-developer must edit prose. **Not yet** — TS arrays currently give you type safety, git history and zero latency. | — |

---

## ⚫ SECTION 6 — Post-launch only

### 6.1 301 redirect for the changed type URLs
**What:** Add to `next.config.ts`:
```ts
async redirects() {
  return [
    { source: "/port-harcourt/gra/1-bedroom", destination: "/port-harcourt/gra/studio", permanent: true },
  ];
}
```
**Why:** I changed `typeSlugFor()` so studios get their own slug — previously a studio
and a 1-bedroom both produced `1-bedroom`, which collapsed them together and left
"studio short let Port Harcourt" uncontested (three of six units are studios). That
means `/port-harcourt/gra/1-bedroom` **no longer exists**.

Safe to skip right now because the site is pre-launch on a placeholder domain and
nothing links to the old URL. **The moment you launch, this becomes mandatory** — a
404 on a previously-indexed URL loses the ranking rather than transferring it.

**Do this only if you launch before changing the slug logic again.**

---

## Appendix — Already done (do not redo)

Recorded so you don't spend time re-fixing solved problems. All verified via
`tsc`, `eslint`, `next build`, and inspection of the built HTML/CSS.

**Verified defects fixed:** font tokens (`--font-sans` was self-referential,
`--font-display` never declared, variables moved to `<html>` for scope) · stale
availability on 8 SEO pages (derived path list + 5m ISR) · admin auth (signed HMAC
session, expiry inside the signed payload, constant-time compare, rate limit,
`sameSite: strict`, **plus authorisation inside the Server Action** — a Server Action
is a public endpoint) · contact form popup failure (synchronous `window.open`, lead
persistence, real fallback link, honest wording) · gallery keyboard trap (WCAG 2.1.2
Level A — Escape, focus trap, focus restore, `role="dialog"`, arrow keys, scroll lock)
· `JsonLd` XSS escape (`<` → `<`; the old safety comment's stated mechanism was
false) · `FaqSection` duplicate DOM id → `useId()`.

**Contrast, measured not guessed:** WhatsApp button 2.28:1 → 5.02:1 · new
`gold-text` token 1.95:1 → 6.13:1 (gold is a *dark-surface* accent; the rule is
documented in `globals.css`) · slate-400 body text 2.56:1 → 7.58:1 · white/40 →
white/75. `text-gold` was corrected **line by line**, because 12 occurrences sit on
charcoal panels where it is already AAA.

**Fail-closed availability:** three-state `available | booked | unknown`. Confirmed
working during a real Supabase outage in the build — the page rendered 8×
"Check availability" where the old `?? true` would have baked in
"Available — Book Now".

**Mobile:** sticky booking bar (a Server Component — `fixed bottom-0 md:hidden` is
pure CSS) · price hoisted above the fold on the listing · navbar CTA no longer
`hidden md:flex` · 44px touch-target scale across every button at once.

**Booking journey:** `lib/data/policies.ts` → check-in/out, house rules, cancellation
tiers, payment terms, minimum stay · `/policies` and `/privacy` pages ·
`openingHoursSpecification` + `checkinTime`/`checkoutTime` in schema · sleeping
arrangements · drive times to landmarks · studio as a distinct property type.

**Conversion:** homepage reordered (product before argument) · duplicated four-step
process cut, replaced with "what protects you before you pay" · similar apartments ·
`ConversionBridge` on all 8 landing pages · comparison table now admits one genuine
weakness · URL-based filters (shareable) · honest empty state that captures the lead.

**Engineering:** 19 hardcoded phone numbers → 0 · `formatPrice` and Haven Promise
deduplicated · savings table derived from one rate and one multiplier ·
`not-found.tsx` + `error.tsx` · skip link · global `prefers-reduced-motion` ·
`lang="en-NG"` · heading levels fixed (`h1→h3` skips on three route types) · brand
button variants replacing ~15 copy-pasted class strings · `BrandMark` (the logo was
`amber-500`, not the brand gold) · `tsbuildinfo` gitignored.

---

*Sections 1 and 2 are the launch gate. Everything else can wait.*
