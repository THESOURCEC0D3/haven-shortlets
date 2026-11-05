# Haven Shortlets PH — Full Website Audit

**Audited:** 29 July 2026
**Codebase:** `haven-shortlets` @ `36b5774` · Next.js 16.2.9 · React 19.2.4 · TypeScript 5 (strict) · Tailwind v4 · Supabase
**Scope:** 6,456 lines of source across 30 components, 12 route templates, 31 prerendered pages
**Method:** Full source read, production build, compiled-CSS inspection, computed WCAG contrast ratios, measured bundle payload

**Website type:** Shortlet / hospitality (not traditional real estate sales). Evidence: `pricePerNight`/`Week`/`Month`, `maxGuests`, an availability state machine, `LodgingBusiness` schema, WhatsApp-first booking. Audited against shortlet/hospitality standards; traditional-sales features (mortgage calculators, agent rosters, payment plans) are scored **N/A** with shortlet equivalents proposed instead.

---

## Contents

1. [Executive summary](#0-executive-summary)
2. [Part 1 — Project architecture](#part-1--project-architecture)
3. [Part 2 — Page audit](#part-2--page-audit)
4. [Part 3 — Section audit](#part-3--section-audit)
5. [Part 4 — Component audit](#part-4--component-audit)
6. [Part 5 — User journey](#part-5--user-journey)
7. [Part 6 — UX & accessibility](#part-6--ux--accessibility-audit)
8. [Part 7 — Conversion audit](#part-7--conversion-audit)
9. [Part 8 — Playbook comparison](#part-8--real-estate-playbook-comparison)
10. [Part 9 — Frontend engineering](#part-9--frontend-engineering-review)
11. [Part 10 — Performance](#part-10--performance-review)
12. [Part 11 — Design system](#part-11--design-system-review)
13. [Part 12 — Final scorecard](#part-12--final-scorecard)
14. [Part 13 — Priority improvements](#part-13--priority-improvements)
15. [Part 14 — Principles to carry forward](#part-14--principles-to-carry-forward)

---

## 0. Executive summary

This is a **well-architected project with four verified defects that make parts of it not work at all.** The structure, SEO engineering and content strategy are at a genuinely senior level. The failures are all in *verification*, not in *decisions* — and every one is fixable in under two days.

### The four launch blockers

| # | Defect | Verified how | Business impact |
|---|---|---|---|
| 1 | **Neither font renders anywhere.** Inter + Playfair are downloaded, preloaded, and used by no CSS rule. | Production CSS contains `--font-sans: var(--font-sans)` (self-referential → invalid). `.font-display` is **never generated**, despite 51 usages in 24 files. | Entire typographic brand identity is absent. 85KB of preloaded fonts wasted on every page. |
| 2 | **Availability is permanently stale on the 8 SEO landing pages.** | Build shows `/port-harcourt/*` as `●SSG`. `lib/actions.ts:580-583` revalidates `/`, `/apartments`, `/apartments/[slug]`, `/admin` — no `/port-harcourt` path. | A guest arrives from Google, sees "Available — Book Now" on a flat booked weeks ago, WhatsApps, gets rejected. |
| 3 | **The contact form can report success while discarding the lead.** | `ContactForm.tsx:671` calls `window.open` inside a 1s `setTimeout`, outside the user-gesture window. Popup blockers (iOS Safari especially) block it; `setStatus("success")` has already run. | Warm leads destroyed silently; the guest believes they contacted you. |
| 4 | **The admin panel is forgeable from browser devtools.** | `api/admin-auth/route.ts:16` sets the cookie to the literal constant `"authenticated"`; `proxy.ts:9` compares against the same constant. | Anyone can toggle availability on every apartment. |

Plus: `bg-ivory-dark` is an undefined token (that homepage section has no background), and the WhatsApp button — the site's primary conversion control — fails contrast at **2.28:1**.

### Overall

| Category | Score |
|---|---|
| SEO | **9/10** — best category |
| Information architecture | 7/10 |
| Frontend engineering | 7/10 |
| Code quality / maintainability | 7/10 |
| UX | 6/10 |
| Performance | 6/10 |
| Scalability | 6/10 |
| Visual design | 5/10 |
| Conversion optimisation | 5/10 |
| Shortlet best practices | 4/10 |
| Accessibility | **3/10** |
| **Client readiness** | **5/10 — not shippable** |

The distance from 5/10 to ~8/10 is roughly **two days of work**. That is unusual: most 5/10 projects are 5/10 *structurally*. This one is 5/10 because four correct decisions were never checked.

### The three patterns underneath everything

1. **Built desktop-first for a mobile-first audience.** Mobile Book button hidden; listing price below the FAQ; no sticky CTA; 28px tap targets; admin sidebar doesn't collapse. For a Nigerian WhatsApp-first shortlet, mobile is not a breakpoint — it is the product.
2. **Trust is asserted, never evidenced.** "Verified", "4.9 rating", "500+ guests", "A Real Person" — illustrated by a letter in a circle. Every trust claim is a statement; none is checkable. For a fraud-anxious audience, unverifiable confidence is itself a fraud signal.
3. **Content promises what the product doesn't deliver.** The diaspora guide tells readers to demand cancellation terms, an exact address, and proof the apartment is real. The listings provide none of the three.

---

# PART 1 — PROJECT ARCHITECTURE

## 1.1 Stack

```
next 16.2.9 (App Router, Turbopack) · react 19.2.4 · typescript 5 strict
tailwindcss 4 (CSS-first @theme) · shadcn/ui "radix-nova" · radix-ui 1.5
@supabase/supabase-js 2.108 · lucide-react 1.18
```

**Why App Router matters here:** the business model is "be findable in Google and AI search, then convert to WhatsApp." The HTML must contain prices, locations and FAQs *before JavaScript runs*, because crawler render budget is finite and LLM crawlers largely don't execute JS. RSC lets you write React and ship pure HTML. **A client-side SPA would have been fatal. This is the most consequential decision in the project and it is correct.**

**`strict: true` as a design tool:** `Apartment["area"]` is `"gra" | "woji"` — a literal union, not `string`. The compiler refuses a third area until it's deliberately added, and every filter over areas becomes checkable.

**OKLCH colour:** perceptually uniform lightness, so `gold` (L 0.79) and `gold-dark` (L 0.70) are genuinely in tune. Ahead of most production codebases.

## 1.2 Folder structure — five layers

```
app/            routing only
components/
  home/ about/ contact/   page-specific sections
  apartments/             domain components (reused across 6 routes)
  layout/ seo/ shared/    chrome, machine output, cross-cutting
  ui/                     shadcn primitives (vendored)
lib/
  data/                   static content
  seo/                    metadata + schema builders
```

Organised by **change frequency** — files that change together sit together. At 30 components the blast radius of any edit is predictable from the tree alone. The refinement available: `components/home/` is genuinely page-specific and belongs at `app/(site)/_components/`.

## 1.3 Routing — real build output

| Route | Mode | Instances |
|---|---|---|
| `/`, `/about`, `/apartments`, `/contact`, `/guides`, `/port-harcourt` | ○ Static | 1 each |
| `/apartments/[slug]` | ● SSG | 6 |
| `/guides/[slug]` | ● SSG | 3 |
| `/port-harcourt/[area]` | ● SSG | 2 |
| `/port-harcourt/[area]/[type]` | ● SSG | 5 |
| `/admin` | ƒ Dynamic | — |
| `/api/admin-auth` | ƒ Dynamic | — |
| `/admin/login`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image` | ○ Static | 4 |

**31 pages prerendered.** Almost every performance, SEO and correctness conclusion flows from this table.

`/apartments` shows ○ Static *despite* calling Supabase because Next treats a Supabase call as ordinary data fetching, not a dynamic signal. Only `cookies()`, `headers()`, `searchParams` force dynamic — which is why `/admin` alone is `ƒ`.

### Programmatic SEO design

```
/port-harcourt → /port-harcourt/[area] → /port-harcourt/[area]/[type]
```

Three URL levels, two data files, one template each. The detail that separates this from amateur programmatic SEO is `getAreaTypeCombos()` (`lib/data/apartments.ts:275`): it generates **only combinations that have listings**. The naive version publishes `/woji/3-bedroom` with zero results — thin content that drags down your good pages. You avoided the classic self-own.

**Gap:** `typeSlugFor` derives type from bedroom count only, so studios and 1-beds both become `1-bedroom`. `/port-harcourt/woji/studio` is a real query you don't compete for. Data-model gap, not routing.

### `proxy.ts` — a Next 16 breaking change handled correctly

Next 16 renamed `middleware.ts` → `proxy.ts` and the export `middleware` → `proxy`. Confirmed against the docs shipped in `node_modules`. Most tutorials still say `middleware.ts`. **Reading the actual docs is worth more than any single piece of code here.**

The docs also warn that Proxy is for *optimistic* checks only, not authorisation. Your architecture complies — `proxy.ts` does the cheap redirect, `app/admin/page.tsx:9` re-checks server-side. The flaw is the token, not the layering.

## 1.4 Layouts

- **`app/layout.tsx`** — `<html lang="en">`, font variables, global metadata, site-wide JSON-LD. Putting `localBusinessSchema()` in the root means **all 31 pages declare the same business identically** — entity consistency, deliberate and correct.
- **`app/admin/layout.tsx`** — 16 lines whose whole job is `robots: { index: false }`, cascading to the client login page which can't export metadata itself. Combined with `robots.ts`, that's defence in depth: robots.txt asks crawlers not to fetch; the meta tag says don't index if they do.

## 1.5 Server vs Client boundary

Seven client components, every one justified: `SiteChrome` (usePathname), `Navbar` (scroll state), `ApartmentsClient` (filters), `ApartmentGallery` (lightbox), `ContactForm`, `AdminDashboard`, `admin/login`.

The `*Client` naming is a real idiom: route file stays a Server Component so it can `await` data and export `metadata`; a `*Client` child owns interactivity.

### The architectural flaw

`app/layout.tsx:80` wraps everything in `<SiteChrome>`, a client component whose entire purpose is:

```tsx
if (pathname?.startsWith("/admin")) return <>{children}</>;
```

A **runtime `if` solving a problem the router solves at build time.** Costs:
1. `Navbar` **and `Footer`** enter the client bundle on every page. Footer is 179 lines of static markup with zero interactivity, now shipped twice — once as HTML, once as JS to hydrate it.
2. Every public page pays for a check that exists only for `/admin`.
3. Fragile — a future `/dashboard` requires editing a string.

**Fix — route groups:**
```
app/(site)/…    → layout renders Navbar + Footer
app/(admin)/…   → bare shell
```
URLs unchanged. `SiteChrome` deleted. `Footer` returns to zero-JS. **~20 minutes; highest-value architectural refactor available.**

## 1.6 Data flow — two sources

**Source A — `lib/data/*.ts`** (530 lines of TS arrays). At six apartments this is *correct*, not a hack: type safety, git history on every price change, zero latency, code review on content edits. A CMS adds a round-trip, an API key and a bill to serve content that changes twice a year. Crossover is ~20–30 listings, or the moment a non-developer must edit prose.

**Source B — Supabase**, one table, five columns, availability only.

**The split is the smart part:** *content* (slow-changing, needs git, needs SEO stability) separated from *state* (fast-changing, needs a non-technical owner with a phone). Different requirements, different homes.

### Two flaws at the seam

**Flaw 1 — the join key is an unenforced string.** `apartment.slug` ↔ `row.slug`. No foreign key, no constraint, no test. Rename a slug and the row orphans silently.

**Flaw 2 — the system fails open.** `availability?.available ?? true` appears **7 times**. In English: *"if we have no idea whether this is free, tell the guest it's free."*

**Rule: default to the state where being wrong is cheapest.**

| | Fail-open (current) | Fail-closed |
|---|---|---|
| DB down | Everything "available" → guests book booked flats | "Message us to check" → **you still get the lead** |

Correct fix is not `?? false` (a lie in the other direction) but a **third state** — `available | booked | unknown` — where `unknown` renders "Message us to check availability" with a WhatsApp CTA.

Note the asymmetry already in the code: `app/admin/page.tsx:20` surfaces load errors and `AdminDashboard.tsx:153` renders a proper banner. **The owner gets the truth; the guest gets a comfortable fiction.** You already built the honest path once.

## 1.7 State management

No state library, correctly. State decomposes cleanly: server state → `await` in RSC; URL state → route params; local UI → `useState`; mutations → Server Actions. Most "global state" in old React apps was server data with no better home; RSC gives it one.

**Gap:** filter state is `useState`, not URL. A couple planning a trip cannot share a filtered view — a real, common lost conversion.

## 1.8 Rendering & caching — defect #2

`/port-harcourt/*` are `●SSG`, render live availability badges, and `lib/actions.ts` revalidates **no `/port-harcourt` path**. The pages built specifically to capture high-intent search keep showing a green pulsing "Available — Book Now" until the next deploy.

**Adequate fix** — enumerate the paths. Works, and the same bug recurs the next time a route reads availability.

**Correct fix** — tag the data:
```ts
// availability.ts — wrap the query in unstable_cache with tags: ["availability"]
// actions.ts
revalidateTag("availability");
```

**Principle: invalidate the data, not the pages.** Path lists require a human to maintain and always drift. Yours drifted inside one release cycle. Add `export const revalidate = 300` as a safety net underneath.

## 1.9 SEO/GEO layer — the best code in the repo

- **`pageMetadata()`** makes it *impossible* to ship a page without a self-referencing canonical, because canonical derives from a required argument. **Don't document a rule — make it structurally unavoidable.**
- **`structured-data.ts`** takes the same objects the UI renders, so schema price cannot drift from displayed price. `@id` cross-referencing (`ORG_ID`, `WEBSITE_ID`) builds **one entity graph** rather than 31 unrelated business mentions.
- **`FaqSection`** uses native `<details>`/`<summary>`: zero JS, keyboard-accessible free, in the initial HTML, and Google's "FAQ content must be visible" rule satisfied by construction.
- **`robots.ts`** names GPTBot, OAI-SearchBot, PerplexityBot, Google-Extended explicitly. Functionally identical to `*`, but it makes the intent legible and reversible. **Code that documents a decision is a senior habit.**

### The inconsistency

`lib/site.ts` is the declared single source of truth. It is imported by **six files, all in the SEO layer. Zero UI components import it.** Meanwhile the phone number is hardcoded **19 times across 11 files**.

And `site.ts:35` says: `// NAP — keep identical to what is shown in the Footer and Contact page.`

**A comment is doing the job a variable should do.** Two parallel truths — `siteConfig` for machines, hardcoded strings for humans. When the number changes, schema and buttons disagree, damaging the exact NAP consistency `site.ts` exists to protect. A crack is already visible: `siteConfig.url` is `.ng`, `siteConfig.email` is `.com`.

**Rule: if you write a comment telling a future developer to keep two things in sync, you have found a missing abstraction.**

## 1.10 Design tokens — defect #1

`globals.css` declares four brand tokens in OKLCH. Three things break:

**(a)** `--font-sans: var(--font-sans)` — a variable defined as itself. Invalid at computed-value time, so `font-family` falls back to Tailwind's system stack. **Inter never applies.**

**(b)** `@theme` declares `--font-sans` and `--font-heading` but never `--font-display`. Tailwind v4 generates font utilities only from `--font-*` keys, so **`.font-display` is never generated.** Confirmed absent from the production CSS bundle. It appears **51 times across 24 files** — on every heading and every price. **Playfair is downloaded, preloaded, and never used.**

**(c)** `bg-ivory-dark` (`ApartmentsPreview.tsx:361`) — undefined token, no background.

**Root cause: Tailwind fails silently by design.** An unknown class isn't an error, it's nothing.

```
Typo in TypeScript → build fails.     Found in 2 seconds.
Typo in Tailwind   → class vanishes.  Found in 6 months, from a client.
```

Your project has excellent type discipline and no style discipline — because one language tells you when you're wrong and the other doesn't.

**Three defences:** `eslint-plugin-tailwindcss` (unknown classes become lint errors) · `tailwindcss-intellisense` (greys out unknown classes as you type) · **look at the page** — Playfair is a high-contrast serif and Inter is a geometric sans; they are unmistakably different.

**Fix — four lines:**
```css
--font-sans:        var(--font-inter);
--font-display:     var(--font-playfair);
--color-ivory-dark: oklch(0.95 0.010 85);
--color-gold-text:  oklch(0.50 0.11 72);   /* accessible gold on light — see Part 6 */
```

## 1.11 Types, naming, duplication

**Types:** `lib/types.ts` holds only the Supabase row shape; `Apartment`/`Area`/`Guide` live beside their data. Correct — a catch-all `types.ts` becomes an import magnet. The distinction between **domain types and persistence types** is real architecture: it lets the DB schema change without touching the content model.

**Naming:** `PascalCase.tsx` components, kebab-case everything else, `getXBySlug` family, `*Client` suffix. Predictable enough that you can guess the API without opening the file.

**Duplication — all of it is *facts*, not behaviour:**

| Duplicated | Count | Risk |
|---|---|---|
| Phone number | 19 across 11 files | NAP drift, schema/UI disagreement |
| `getAvailabilityMap()` reimplemented | 3 | Helper written then not adopted |
| `formatPrice` | 2 | Currency format can diverge |
| Haven Promise (4 guarantees) | 2 | Trust claims free to drift |

Duplicated *behaviour* gets caught by tests. Duplicated *facts* rot invisibly — each copy stays individually correct and only the set becomes wrong.

## 1.12 Scalability

| Dimension | Now | Breaks at |
|---|---|---|
| Apartments / areas / guides in TS | 6 / 2 / 3 | ~25 / ~15 / ~15 |
| **Availability model** | 1 boolean | **Already broken** |
| Routes | 31 static | ~500 |
| Images | Unsplash stock | **Already broken** |

**The boolean answers "is this free today?" A guest asks "is it free March 14–21?"** — and `ContactForm` collects a check-in date and night count. The site is architecturally incapable of answering the question its own UI asks. Defensible as a v1 for a WhatsApp-first operator, but it is the ceiling on this architecture.

**Images:** three apartments share the *identical four Unsplash URLs* while `WhyBookDirect.tsx:147` promises *"Every photo on this site was taken in the actual apartment you will stay in. No stock images."* The site's central trust claim is contradicted by the site itself.

## 1.13 Architecture scorecard

| Dimension | Score |
|---|---|
| Folder structure | 9/10 |
| Routing design | 9/10 |
| SEO architecture | 9/10 |
| Naming | 9/10 |
| Type safety | 8/10 |
| Server/Client boundary | 6/10 |
| Data architecture | 7/10 |
| Code reuse | 6/10 |
| Scalability | 6/10 |
| **Rendering & caching** | **4/10** |
| **Security** | **4/10** |
| **Design tokens** | **3/10** |
| **Overall** | **7/10** |

---

# PART 2 — PAGE AUDIT

## 2.0 Missing from every page

| Missing | Verified | Why it matters |
|---|---|---|
| Check-in / check-out times | 0 hits sitewide | Top-5 guest question |
| **Cancellation policy** | 0 — see below | **#1 booking objection** |
| House rules (smoking, pets, visitors, min. stay) | 0 hits | Standard shortlet block |
| Map / location pin | 0 hits | "Where is it relative to the airport?" |

The **only** occurrence of "cancel" in the codebase is `lib/data/guides.ts:131`, where you advise diaspora readers to demand *"the exact address, and the cancellation terms"* from an operator. **You published the checklist your own site fails.** A guest reads that guide, feels understood, clicks a listing, and finds none of the four things you told them to demand.

Also absent: **`not-found.tsx`, `error.tsx`, `loading.tsx`, privacy policy, terms.**

## 2.1 `/` — Homepage — **6/10**

**Order:** Hero → WhyBookDirect (227 lines) → ApartmentsPreview → HowItWorks → Testimonials → FAQ → CTABanner

**Strength — the positioning is sharp.** "Book direct, skip the Airbnb fee" is a real wedge with a number attached, verifiable against the visitor's own Airbnb checkout. Most competitors lead with "luxury apartments in Port Harcourt" — a claim with no edge.

**The `₦55,000 /night — starting price` element** pre-qualifies traffic: budget shoppers leave (good) and the rest arrive anchored. Deliberate funnel design.

### Weakness 1 — two co-equal primary CTAs
Both `size="lg"`, both solid fills, same width behaviour. Neither is subordinate, so the page asks for a decision before giving anything to decide with.

**Counterintuitive resolution:** the instinct is "WhatsApp is the conversion, make it primary." Wrong here. A hero WhatsApp click sends the generic *"I would like to book an apartment"* — no apartment, no dates, no budget; four messages to qualify. A listing-card click sends *"…booking the Executive Suite — GRA Phase 3."* **The same button in a different place produces a lead worth several times more.** Make Browse solid gold, WhatsApp an outline.

### Weakness 2 — the booking process is explained twice
`WhyBookDirect.tsx:280-309` renders a card titled "How it works" with four steps; two sections later `HowItWorks.tsx` (138 lines) gives the same four steps. Delete the card.

### Weakness 3 — argument before product
`WhyBookDirect` is the largest section and is 100% argument, 0% product. Nobody cares they'd save ₦171,000 until they want the apartment.

**Recommended order:** Hero → ApartmentsPreview → WhyBookDirect (trimmed) → Testimonials → HowItWorks → FAQ → CTABanner.

### Weakness 4 — the mobile Book button is hidden
`Navbar.tsx:115` wraps the WhatsApp CTA in `hidden md:flex`. **Below 768px the persistent Book button does not exist.** For a WhatsApp-first Nigerian business, mobile is the traffic. Highest-ROI fix on the site: a sticky bottom bar (`fixed bottom-0 md:hidden`) with price anchor + "Book on WhatsApp." ~1 hour.

### Weakness 5 — testimonials read like advertising
Three 50–90 word quotes, all articulate, all naming Airbnb, all on-message. No photos, dates, verification or ratings. The header claims *"Not cherry-picked quotes."*

Your diaspora guide says the reader's primary fear is being scammed. That reader is running scam detection, and **unverifiable praise that is suspiciously well-written is a positive scam signal.**

```
Bad:       anonymous glowing quote
Good:      named quote with role  ← you are here
Excellent: WhatsApp screenshot, real date, face blurred, one awkward sentence
```

Same problem with "4.9 Average Rating" and "500+ Guests Hosted." Note you correctly did *not* put `aggregateRating` in schema (a policy violation without real reviews) — so the machine layer declines the claim the human layer makes.

**Missing:** location/map section · date-availability entry point · credentials row (RC number, Paystack logo).

## 2.2 `/apartments` — **6/10**

**Strengths:** *"{availableCount} of {apartments.length} apartments available right now"* is **honest scarcity computed from real data** — urgency you can defend. Empty state (`ApartmentsClient.tsx:1094`) is properly built with a recovery action. Sticky filter bar at `top-16` correctly clears the `h-16` navbar.

**Weaknesses:** no date filter (the one filter a shortlet needs) · no price filter or sort across a 3× price range · card order arbitrary (150k, 75k, 100k, 65k, 120k, 55k) · filter state not in URL, so a filtered view can't be shared · "Verified" claimed without definition · 🏠 emoji is off-brand for a premium positioning.

**Worth asking:** at six units, does a three-filter bar earn its cost in client JS, sticky vertical space and state? A two-tab GRA/Woji split might serve users better today.

## 2.3 `/apartments/[slug]` — **7/10 desktop, 4/10 mobile**

**Strengths — several genuinely senior:**

1. **The unavailable state captures the lead.** Disabled Book button *plus* "Join Waitlist on WhatsApp" with a **different** pre-filled message: *"…I can see it is currently booked. Please let me know when it becomes available or suggest a similar apartment."* A dead end converted into a lead with a built-in upsell. **The best conversion thinking in the project.**
2. Sticky booking card (`sticky top-24`) matching OTA convention.
3. Three price tiers simultaneously — a contractor sees their monthly price without arithmetic.
4. "Platform fees — ₦0" placed inside the price block, where price anxiety peaks.
5. FAQs generated from apartment data, so FAQ price cannot drift from sidebar price.

### Critical weakness — on mobile the price is below the FAQ

`grid grid-cols-1 lg:grid-cols-3` means DOM order is render order on every phone:

> gallery → name & stats → full description → all amenities → "Explore more" → **four FAQ accordions** → *then* price and Book button.

**~5 screens before a guest sees what it costs.** Price is the #1 thing a guest looks for. **The most expensive single defect in this audit.**

Fix both: hoist a compact price strip under the gallery (`order-first lg:order-none`), **and** add a sticky mobile bottom bar.

### Weakness — hardcoded "always included" highlights
`page.tsx:62` declares a module constant (24/7 Power, Wi-Fi, AC) rendered unconditionally regardless of that apartment's `amenities`. True for all six today; the day you add a unit without AC, the page claims it has AC — on the page promising "What You See Is What You Get." Derive it.

### Missing blocks

| Missing | Guest question | Severity |
|---|---|---|
| Cancellation policy | "What if my trip moves?" | **Highest** |
| Check-in / check-out | "My flight lands 6am" | High |
| House rules | "Can my sister stay? Can I smoke?" | High |
| Payment terms / deposit | "How much up front?" | High |
| Map | "How far to Trans-Amadi?" | High |
| Reviews for *this* unit | "Has anyone stayed here?" | High |
| Similar apartments | (recovery when booked) | Medium |
| Sleeping arrangement | "6 guests — how many beds?" | Medium |
| Minimum stay | "Can I book one night?" | Medium |

**Only 4 photos per apartment**, three listings sharing identical URLs. Airbnb averages 20–30, labelled by room. Four generic images cannot support a ₦150,000/night decision.

**Minor:** `AvailabilityBadge` renders twice.

## 2.4 `/port-harcourt` — **6/10**

**Strengths:** direct-answer intro written for LLM extraction, per-area sections, FAQ, full schema.

**Weaknesses:**
1. **Duplicates `/apartments`** — both render all six units. Two "browse everything" pages is an IA smell. Make this a *hub*: area intros, GRA-vs-Woji comparison, a map, 2–3 representative units, strong links onward.
2. **The whole `/port-harcourt` tree is absent from the navbar.** Eight programmatic landing pages reachable only from the footer or Google. **UX cost:** arrivals can't explore the tree. **SEO cost:** navbar links are the strongest internal links you own, and none point at the pages you most want ranked. Fix: make "Apartments" a dropdown, or rename to "Stays" with GRA/Woji beneath.
3. **Ends on the FAQ with no CTA.** Your highest-intent landing page finishes with no ask.
4. Stale availability (defect #2) bites hardest here.

## 2.5 `/port-harcourt/[area]` — **6/10**

Area-specific intro, type-filter pills to long-tail children, factual "About" block, area FAQs. Good internal-linking design.

**No map** — and this is the one page type where a map is unambiguously right; the whole page is about *a place*. Your copy claims "20–30 minutes from the airport"; a map makes that credible instantly. Also: no bottom CTA, not in nav, stale availability.

## 2.6 `/port-harcourt/[area]/[type]` — **5/10**

Thinnest pages on the site. `/port-harcourt/gra/3-bedroom` = back-link + H1 + one paragraph + **one card** + three FAQs.

**The specific SEO risk:** `page.tsx:80` composes FAQs as one generated question plus `area.faqs.slice(0, 2)`. For GRA the identical two Q&As — and the identical `FAQPage` JSON-LD — appear on the area page **and all three type children**: same text on four URLs. Combined with intros differing only by a bedroom count and price, these sit close to the duplicate-content line, and duplicated FAQ markup across URLs is specifically discouraged by Google.

You guarded against *empty* pages. The remaining risk is **near-duplication**, which is the harder problem and the one that actually gets programmatic SEO penalised.

**Fix:** type-specific substance ("a 3-bedroom in GRA fits a corporate delegation of six or a family visiting for a wedding"), typical stay length, price versus the 2-bed. Unique FAQs per type.

## 2.7 `/guides` — **7/10**
Clean index. No CTA to apartments; no author attribution.

## 2.8 `/guides/[slug]` — **8/10 — best content page**

The direct-answer intro with the gold left-border does double duty: visually it signals "summary," structurally it's the chunk an LLM lifts whole. Form following function.

`page.tsx:100` ends with a **conversion bridge** — "Ready to book your Port Harcourt stay? → Browse apartments." **The only content page on the site that converts.** Every `/port-harcourt` page should copy this block.

**Biggest miss — no author byline.** You have a named, credentialed host: Chidi Okonkwo, Port Harcourt native, former oil services engineer, hosting since 2019. The diaspora guide is advice about not being scammed. Attributing it — with a photo — converts anonymous SEO content into first-hand local expertise. That is exactly what E-E-A-T rewards **and** what a nervous reader needs. You own the asset and aren't using it.

Also: no `datePublished`/`dateModified` in Article schema; bridge offers no WhatsApp option; no related-guides links.

## 2.9 `/about` — **6/10**

**Strength — the writing is genuinely good.** `OurStory.tsx:100`:

> "In 2019 our founder flew into Port Harcourt for a two-week work rotation. The apartment he booked on a popular platform looked nothing like the photos. The generator ran for four hours a day. The host stopped responding after check-in."

Specific, concrete, and **it is the exact pain the target customer has**. The founder story doubles as a problem statement. Keep every word. `HostProfile` adds languages — English, Igbo, Pidgin — a sharp local trust signal a template would never include.

**Weakness 1 — the page contradicts its own thesis.** The headline is **"A Real Person. Not an Inbox."** The visual is a letter "C" in a circle. **There is no photograph of Chidi anywhere on the site.** For an audience whose primary fear is fake operators, a face is worth more than the four paragraphs above it. **The highest-value single asset missing from this project.**

**Weakness 2 — the comparison table is a strawman.** Six rows, Haven ✅ six times, "Most Others" ❌ six times. A 6–0 scoreline reads as marketing and sophisticated buyers discount it.

**Lose one row on purpose:**
> Instant online booking · Airbnb ✅ · Haven ❌ — *we confirm by WhatsApp, usually within 30 minutes*

Naming a genuine disadvantage makes the other five credible, and it costs nothing because the weakness is already obvious to anyone comparing you to Airbnb.

**Also:** unverifiable stats (500+, 4.9, 73%) · timeline stops at 2024 (it is 2026) · no RC number · no office photo or map · `/about` is the only content page with no breadcrumb JSON-LD.

**Recommendation:** move `HostProfile` above `WhyChooseUs`. Your differentiator *is* the person; the table is supporting evidence.

## 2.10 `/contact` — **5/10**

**Strengths:** required vs optional marked; genuinely useful enquiry segmentation (booking / availability / corporate / diaspora / other — real customer types); date and nights fields; proper success state; `min` on the date input. The core idea — compose the form into a WhatsApp message and hand off — is right for a one-person operation: no backend, no deliverability problem, lead lands where the host works.

### Critical weakness — the success screen can lie

`ContactForm.tsx:671`:
```tsx
setTimeout(() => {
  setStatus("success");
  window.open(`https://wa.me/...?text=${whatsappMessage}`, "_blank");
}, 1000);
```

Browsers permit `window.open` only while a user gesture is still active. Deferring it into a **1-second `setTimeout`** puts it outside that window; popup blockers — iOS Safari especially, a large share of diaspora traffic — will block it.

When they do, `setStatus("success")` has already run. The visitor sees a green tick and **"Message Sent."** Nothing was sent, and **you have no record they existed** — every field is discarded client-side.

Three compounding failures: a warm lead destroyed; the user *told it succeeded* so they don't retry and later conclude you ignore enquiries; the recovery copy gives the number as **plain text**, not a `tel:` or `wa.me` link.

**The `setTimeout` exists only to show a spinner for one second — fake latency, faking work that isn't happening.**

**Fixes:** (1) delete the `setTimeout`, open WhatsApp synchronously inside the click handler; (2) render the success state with a real clickable `wa.me` link as the primary element; (3) persist the lead to Supabase before handing off.

**Also:** no map · opening hours shown in copy but absent from `openingHoursSpecification` schema · the Enquiry Type `<label>` has no `htmlFor` and the Radix trigger no `id`, so screen-reader users hit an unlabelled required combobox — the only field on the form not wired correctly · no privacy policy while collecting name/phone/email (NDPA 2023; GDPR expectations from UK/EU visitors).

## 2.11–2.12 `/admin/login` and `/admin` — **5/10**

**Strengths:** clean single-purpose UI; password reveal; disabled submit until input; stat cards; data-load error banner; per-row loading and error state; grayscale thumbnails for booked units; `min` = today; service-role key correctly confined to the server.

**Weaknesses:**
1. **Constant-string auth** (defect #4). `httpOnly` stops JS reading the cookie; it does not stop a person typing it into the devtools cookie editor.
2. **No rate limiting** on `/api/admin-auth` — unlimited guesses against one shared password.
3. **The date field disappears exactly when needed.** `AdminDashboard.tsx:252` renders "Available From" only `{isAvailable && …}`. To edit a booked unit's return date you must first mark it **Available** — publishing a booked apartment as bookable — then re-mark it booked. **A routine task briefly publishes false availability.**
4. **No confirmation, no undo** on the most business-critical action on the site.
5. **Broken on mobile.** `<aside className="w-64 shrink-0 …">` with no responsive hiding. On a 360px phone the sidebar eats 256px, leaving ~104px. **The one page whose primary device is definitely a phone — a host standing in an apartment — is the one page with no mobile layout.**

## 2.13 Missing: `/not-found`

`notFound()` is called in three route files, so visitors *will* hit Next's unstyled default — no branding, no navigation, no way back. This matters more here because **your links travel through WhatsApp**, where URLs get truncated and retyped. A guest forwarded a broken link concludes the business is defunct. A branded 404 offering available apartments is ~30 lines.

---

# PART 3 — SECTION AUDIT

## 3.1 Homepage sections

| # | Section | Verdict |
|---|---|---|
| 1 | HeroSection | KEEP, fix CTA weight |
| 2 | WhyBookDirect | **SPLIT + MOVE to 3** |
| 3 | ApartmentsPreview | **MOVE to 2** |
| 4 | HowItWorks | KEEP, absorb the duplicate |
| 5 | Testimonials | MOVE to 4, rebuild credibility |
| 6 | FAQ | KEEP in place |
| 7 | CTABanner | KEEP |
| — | Location / map | **ADD** |
| — | Sticky mobile CTA | **ADD** |

**§1 Hero — KEEP.** Answers "am I in the right place" in under two seconds. The signature price element pre-qualifies traffic.

**§2 WhyBookDirect — SPLIT.** (a) savings table + (b) ₦171,000 callout **KEEP** — the strongest persuasion asset on the site, and the disclosed-estimate footnote (*"fees estimated at 19%, actual may vary"*) is the right instinct: a disclosed estimate is credible, an undisclosed one is a liability. (c) 4-step list **CUT** (duplicate). (d) reasons grid **KEEP**, but cut *"not a San Francisco tech company's"* — the only sneering line on an otherwise composed site, aimed at a buyer who doesn't want a villain.

**§3 ApartmentsPreview → position 2.** The closing note generalising from three cards to the whole portfolio is well placed. Keep it (its gold text fails contrast — Part 6).

**§4 HowItWorks — KEEP at 4.** Exists to answer an anxiety, not to inform: WhatsApp booking is *not* the pattern guests know from Airbnb, and unfamiliar mechanics create hesitation. **Missing:** nothing says what protects a guest between transfer and check-in. One line — *"You get a written confirmation with the apartment, dates and total before you pay"* — closes the biggest gap in the funnel.

**§5 Testimonials → position 4.** Social proof belongs adjacent to the claim it substantiates.

**§6 FAQ — KEEP.** Objection handling immediately before the final ask is textbook; the four questions are the four real ones. **Best-placed section on the page.**

**§7 CTABanner — KEEP.** Three routes (Browse / WhatsApp / phone) + Haven Promise. But the Promise is hardcoded here *and* on every listing — four trust guarantees free to drift.

**ADD a location section.** No page ever shows *where* PH accommodation is. Two cards (GRA: central, premium, 25 min to airport · Woji: value, 15 min to Trans-Amadi) with a static map would answer a top-three question **and** finally link `/port-harcourt/*` from above the footer.

## 3.2 About sections

AboutHero KEEP (substantiate or drop the stat badges) · OurStory KEEP · WhyChooseUs KEEP structure, lose one row · **HostProfile MOVE UP above WhyChooseUs** · AboutCTA KEEP · **ADD credentials** (RC number, payment methods, verifiable review link).

## 3.3 Apartment detail sections

Desktop order is correct and matches OTA convention. Three changes:
1. **ADD "The essentials"** after Amenities: check-in/out, house rules, minimum stay, cancellation, payment terms.
2. **ADD "Similar apartments"** before FAQ.
3. **MOVE the price above the fold on mobile.**

## 3.4 Section-level patterns

**Pattern A — every section is a "band."** Full-bleed colour block, `max-w-7xl` inner container, eyebrow + heading + body. Genuinely good: creates rhythm, trivially reorderable, copy-paste-safe. Most junior sites have five different container widths.

**Pattern B — the eyebrow is copy-pasted 14 times** instead of `<SectionHeader eyebrow title />`.

**Pattern C — one section, one CTA... except where it matters.** Home, About and guides all close with a CTA. **Every `/port-harcourt` page ends on a FAQ with no ask** — the one place the pattern breaks is the one place it pays.

---

# PART 4 — COMPONENT AUDIT

| Component | Imports | Client? | Verdict |
|---|---|---|---|
| `WhatsAppButton` | **11** | No | Highest reuse; dead `variant` prop |
| `JsonLd` | 8 | No | Excellent |
| `FaqSection` | 5 | No | Excellent; latent duplicate-ID bug |
| `ApartmentCard` | 4 | No | Best-designed component here |
| `AvailabilityBadge` | 3 | No | Good; fails open |
| `ApartmentGallery` | 1 | Yes | **Accessibility failures** |
| `ApartmentsClient` | 1 | Yes | State not in URL |
| `SiteChrome` | 1 | Yes | **Should not exist** |
| `ContactForm` | 1 | Yes | Silent-failure bug |
| Home/About/Contact sections | 1 each | No | Fragments, not components |

## 4.1 `WhatsAppButton` — most-used, with a dead prop

```tsx
<Button asChild variant={variant} size={size}
  className={`bg-green-500 hover:bg-green-600 text-white ${className}`}>
```

**The `variant` prop cannot do anything** — `bg-green-500 text-white` overrides whatever it produces, and because classes are appended raw (not merged via `cn`), the later class wins. Exposing an option that has no effect is worse than not exposing it.

Also: `phone` is required and passed identically 11 times (should default from `siteConfig.whatsapp`) · doesn't use `cn()`, so caller classes can't override · `mr-2` on the icon fights the parent's `gap-1.5` · opens a new tab with no screen-reader warning.

**Fixed version:**
```tsx
export default function WhatsAppButton({
  phone = siteConfig.whatsapp, message, label = "WhatsApp Us", size, className,
}: Props) {
  return (
    <Button asChild size={size}
      className={cn("bg-[--color-whatsapp] hover:bg-[--color-whatsapp-dark] text-white", className)}>
      <a href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
         target="_blank" rel="noopener noreferrer">
        <MessageCircle className="size-4" />{label}
        <span className="sr-only"> (opens WhatsApp)</span>
      </a>
    </Button>
  );
}
```

## 4.2 `ApartmentCard` — best-designed

Two required props, no optional sprawl. `availability: ApartmentAvailability | null` — **nullable rather than optional**, forcing every caller to handle the missing case. A deliberate, senior API choice. Handles the unavailable state three ways (grayscale, scrim, disabled button), drives its own WhatsApp message, ships zero JS.

**Issues:** the whole card isn't a link (wrap media + title only — a nested link would swallow the WhatsApp button) · fails open · `line-clamp-1` truncates long names · 28px tap targets on the two primary conversion actions · **no price context** — a struck-through "was ₦178,500 on Airbnb" would carry the site's whole thesis into the card, where the savings argument currently never appears.

## 4.3 `FaqSection` — excellent, one latent bug

Native `<details>`: zero JS, keyboard-accessible free, in initial HTML, Google's visibility rule satisfied structurally.

**Latent bug:** `id="faq-heading"` is hardcoded and referenced by `aria-labelledby`. Two `FaqSection`s on one page produce **duplicate DOM IDs** — invalid HTML, unpredictable screen-reader association. Use `useId()`.

**Dead prop:** JSDoc documents a heading-level parameter that was never built; the comment sits above `className`.

## 4.4 `ApartmentGallery` — the accessibility problem child

| Issue | Consequence |
|---|---|
| Arrow buttons have no accessible name | Announced as "button" |
| No `role="dialog"` / `aria-modal` | Not announced as a dialog |
| **No Escape handler** | **Keyboard users cannot close it** |
| No focus trap | Tab escapes behind the overlay |
| No focus restore | Focus lost to `<body>` |
| No arrow-key navigation | Mouse-only in practice |
| No body scroll lock | Background scrolls under overlay |
| Main image is `<div onClick>` | Not focusable or keyboard-activatable |
| Thumbnails lack `aria-current` | Active state visual only |
| `alt="{title} — photo 3"` | Tells a blind user nothing |

**A keyboard-only user can open this lightbox and become trapped.** WCAG 2.1.2 (No Keyboard Trap) is **Level A** — the lowest bar there is. **Most serious accessibility defect in the project.**

**You already have `components/ui/sheet` and Radix Dialog installed**, both of which solve all ten rows. This is exactly where a primitive earns its keep.

## 4.5 `AvailabilityBadge`
Clean API. `animate-pulse` on "Available" smartly draws the eye to the one dynamic fact. **Issues:** fails open · red/green is the most common colour-blindness axis (text differs, which saves it; an icon would make it explicit) · **no `motion-reduce:` variant — and there is not a single `motion-reduce:` or `prefers-reduced-motion` rule in 6,456 lines.**

## 4.6 The section "components" aren't components

`HeroSection`, `WhyBookDirect`, `Testimonials`, `OurStory`, `HostProfile`, `ContactHero`, `AboutCTA` take **no props**. They are page fragments extracted for file length — a legitimate technique, but with a cost: all their content is hardcoded, so a client cannot change a testimonial without a developer and a deploy.

**A component takes props; a fragment takes none. Fragments are fine for layout, dangerous for content.** Every fragment above holds *business content* — testimonials, guarantees, the founder story, milestones — that will need to change without you.

## 4.7 `components/ui/*`

shadcn "radix-nova". Radix underneath means `Select` and `Sheet` bring correct focus management and ARIA free. `cva` variants with `data-slot`/`data-variant` is a modern, sound pattern.

**Consequential mismatch:** this style's sizing is *compact* — `default: h-8` (32px), `sm: h-7` (28px), `lg: h-9` (36px). Desktop-application dimensions on a mobile-first consumer booking site. **Even your largest button is below the 44px both Apple and Google publish.**

`Badge` is installed and imported **zero times**.

---

# PART 5 — USER JOURNEY

## 5.1 Chidera — the Airbnb defector (highest volume)

| Stage | Thought | Trust |
|---|---|---|
| Lands | "₦55,000 — cheaper than Airbnb already" | 5/10 |
| Savings table | "₦171,000 on a week? Let me check my basket" | **8/10** |
| Scrolls | "They explained the booking steps twice" | 7/10 |
| Testimonials | "These are... very well written" | 5/10 |
| Wants to book | *mobile: no visible Book button* | 5/10 |
| Listing | "Nice. What does it cost?" *— 5 screens of scrolling* | 4/10 |
| Finds price | "Is it free on the 14th?" *— no way to ask* | 4/10 |

**Converts on desktop, leaks badly on mobile.** The savings table wins the argument by section two and the site then makes acting on it hard.

## 5.2 Mrs Okonjo — the diaspora returnee (highest value, most fragile)

Running fraud-detection on every pixel:

| Signal sought | Delivered | |
|---|---|---|
| A real face | Letter "C" in a circle | ❌ **Alarm** |
| Verifiable reviews | 3 unsourced quotes, unlinked "4.9" | ❌ **Alarm** |
| Exact address | "GRA Phase 3" — a district | ❌ |
| Map | None | ❌ |
| Cancellation terms | None — *and your own guide told her to demand them* | ❌ **Alarm** |
| Company registration | None | ❌ |
| Unique photos | Stock; three listings share identical images | ❌ **Alarm** |
| Named host, local languages | Chidi; English/Igbo/Pidgin | ✅ |
| Guide addressing her exact fear | Excellent | ✅ |

**She reads the guide, feels understood, clicks a listing, and the listing fails the guide's own checklist.** She books a Radisson at 3× the price, because a chain cannot be a scam.

**The most expensive drop-off on the site** — highest basket value (14–21 nights), highest emotional stakes, and she is *actively looking for a reason to trust you*. The fix is not engineering: **one photograph, one Google review link, one cancellation paragraph, one map pin.**

## 5.3 Tunde — contractor on rotation (highest lifetime value)

Monthly rate ✅ · Trans-Amadi proximity ✅ · power ✅ · Wi-Fi speed ⚠️ (no number; he needs to know it holds a Teams call) · invoice ❌ · corporate billing ❌ · repeat-booking path ❌.

**Converts once, then leaves the website forever** — he'll WhatsApp Chidi directly for rotations 2–6. Fine for revenue, but it means the site is purely acquisition. `ContactForm` offers a "Corporate / long-stay enquiry" option and **there is no corporate page for it to lead to** — the enquiry type exists, the offer doesn't.

## 5.4 Mr Adeyemi — executive / expat

Airport pickup ⚠️ (listed as an amenity, never explained or priced) · invoice ❌ · workspace ✅ · scam confidence ⚠️.

**The "save 25%" thesis is irrelevant to him** — his company doesn't care about ₦28,000. The entire homepage argues a point this persona doesn't need, and nothing addresses procurement. **Your highest-margin, lowest-price-sensitivity segment is served by a homepage optimised for the price-sensitive one.**

## 5.5–5.6 Browser and returner

Browser: lands from a guide, hits the conversion bridge ✅ — **works because of the one pattern the `/port-harcourt` pages lack.**
Returner: on mobile, hamburger → menu → Book Now. **Three taps for the site's most valuable user.**

## Summary

| Persona | Converts? | Blocker |
|---|---|---|
| Airbnb defector | Desktop ✅ / Mobile ⚠️ | Hidden CTA, buried price |
| **Diaspora returnee** | ❌ | **Unverifiable trust, missing policies** |
| Contractor | ✅ once | No corporate/repeat path |
| Executive | ⚠️ | Wrong argument, no procurement |
| Browser | ✅ | — |
| Returner | ⚠️ | 3 taps to book |

**The site converts the persona it was designed for and loses the two highest-value ones.**

---

# PART 6 — UX & ACCESSIBILITY AUDIT

## 6.1 Colour contrast — computed from your OKLCH tokens

```
charcoal → rgb(20,25,30)     gold → rgb(224,179,89)
gold-dark → rgb(202,147,62)  ivory → rgb(251,248,242)
```

| Pair | Ratio | WCAG | Used for |
|---|---|---|---|
| gold on charcoal | **9.06:1** | AAA ✅ | eyebrows, prices, accents |
| charcoal on gold | **9.06:1** | AAA ✅ | primary button |
| white/70 on charcoal | 9.10:1 | AAA ✅ | hero subhead |
| slate-600 on white | 7.58:1 | AAA ✅ | body copy |
| white/60 on charcoal | 6.99:1 | AA ✅ | body on dark |
| white/50 on charcoal | 5.24:1 | AA ✅ | step copy |
| slate-500 on white | 4.76:1 | AA ✅ | card body |
| green-700 on green-100 | 4.57:1 | AA ✅ | Available badge |
| red-600 on red-50 | 4.41:1 | AA-lg | Booked badge |
| white/40 on charcoal | 3.82:1 | **FAIL** at `text-xs` | admin sublabels |
| **white on green-500** | **2.28:1** | **FAIL** | **THE WHATSAPP BUTTON** |
| **slate-400 on white** | **2.56:1** | **FAIL** | card meta, weekly/monthly prices |
| **gold on white** | **1.95:1** | **FAIL** | "no platform fees", "Read guide" |
| **gold on ivory** | **1.84:1** | **FAIL** | gold text on light sections |
| white/20 on charcoal | 1.89:1 | **FAIL** | login footer |

### Most important finding in this section

**Your primary conversion button fails at 2.28:1.** Every "Book on WhatsApp", "Book Now", "Talk to Chidi" and "WhatsApp Us Now" — the entire revenue path — is hard to read with reduced contrast sensitivity and unreadable in sunlight on a phone. Your users are in Port Harcourt, outdoors, on phones.

**Fix:** `green-700` (#15803d) with white gives **5.9:1** and still reads unmistakably as WhatsApp green.

### The systemic insight

**Gold is a dark-surface accent.** 9.06:1 on charcoal; 1.95:1 on white. The palette was designed for the dark bands and reused on light ones by habit. You need a fifth token:

```css
--color-gold:      oklch(0.79 0.12 83);  /* dark surfaces only */
--color-gold-text: oklch(0.50 0.11 72);  /* ≈4.6:1 on white */
```

Rule: **`text-gold` on charcoal, `text-gold-text` on white/ivory.**

`slate-400 on white` (2.56:1) is the most *widespread* failure — weekly/monthly prices on every card, all meta, every caption. Move to `slate-500`.

## 6.2 Keyboard

| Test | Result |
|---|---|
| Skip link | ❌ absent — 6+ nav stops on every page |
| Focus on shadcn buttons | ✅ |
| Focus on hand-rolled buttons | ❌ gallery, lightbox, mobile toggle, password toggle |
| **Lightbox: Escape closes** | ❌ |
| **Lightbox: focus trapped** | ❌ |
| Lightbox: focus restored | ❌ |
| Main gallery image activatable | ❌ `<div onClick>` |
| Mobile menu `aria-expanded` | ❌ |
| Radix Select | ✅ |
| FAQ `<details>` | ✅ |
| Form fields labelled | ⚠️ all but `enquiryType` |

## 6.3 Screen reader

- **Landmarks:** `<main>`, `<nav>`, `<footer>` ✅. Admin has none.
- **Heading order broken on three route types.** `/apartments`, `/port-harcourt/[area]`, `/port-harcourt/[area]/[type]` all go **h1 → h3** (page title, then `ApartmentCard`'s `<h3>`), skipping h2. Heading-level navigation loses structure.
- **Icon-only buttons with no name:** gallery prev/next, lightbox close, mobile menu toggle, password reveal.
- **`alt` text uninformative.** For a *visual product*, alt text is the product description: "Living room with grey sectional sofa, floor-to-ceiling windows, dining area beyond" — not "photo 3".
- **Decorative images not marked** — `CTABanner` background should be `alt=""`.
- **`lang="en"`** should be `en-NG` to match `en_NG` locale and `Intl.NumberFormat("en-NG")`.

## 6.4 Touch targets

| Element | Height | vs 44px |
|---|---|---|
| Card "View Details" / "Book Now" | **28px** | ❌ |
| Default button | 32px | ❌ |
| Largest button | 36px | ❌ |
| Gallery arrows / mobile toggle | ~36px | ❌ |
| Password reveal | ~16px | ❌ severe |

**Not one interactive element meets 44×44.** They pass WCAG 2.5.8 (24px, AA), so this is a conversion failure rather than a legal one. Root cause is a stack decision: **you inherited a design system built for desktop applications and didn't re-tune it.** Override the `size` scale once in `button.tsx` (`default: h-11`, `sm: h-9`, `lg: h-12`) and every button is fixed at once.

## 6.5 Responsive

**Desktop ≥1024px:** strong — sensible max-widths, good grid rhythm, sticky sidebar.
**Tablet 768–1023px:** weakest. The detail grid collapses at `lg`, so an iPad gets the *mobile* single-column layout with desktop type — price falls below the FAQ there too.
**Mobile <768px:** hidden Book button, buried price, no sticky CTA, small targets, broken admin.
**Zoom:** `sticky top-16` assumes a 64px navbar; at 200% zoom they overlap. WCAG 1.4.4.

## 6.6 States

✅ Empty (well built) · ✅ Form loading · ✅ Admin per-row loading · ✅ Admin load error · ✅ Admin mutation error
❌ 404 · ❌ `error.tsx` · ❌ image-load fallback · ❌ **public Supabase failure silently claims "Available"**

**The admin surface handles failure honestly and the guest surface hides it.** You already know how to do this.

## 6.7 Motion

Tasteful and restrained. But **zero `motion-reduce:` variants and no `prefers-reduced-motion` query anywhere.** Tailwind makes it one prefix.

## 6.8 UX scorecard

| Area | Score | | Area | Score |
|---|---|---|---|---|
| Navigation & IA | 6/10 | | Gallery | 4/10 |
| Visual hierarchy | 7/10 | | **Mobile UX** | **4/10** |
| **Typography** | **3/10** | | Tablet UX | 5/10 |
| Spacing & rhythm | 8/10 | | Desktop UX | 8/10 |
| Colour system | 5/10 | | Empty/error states | 7/10 |
| Consistency | 8/10 | | **Keyboard** | **3/10** |
| Forms | 6/10 | | **Screen reader** | **4/10** |
| Buttons | 5/10 | | **WCAG 2.1 AA** | **Fails** |
| Filtering | 5/10 | | | 2.1.2(A), 1.4.3, 1.4.11, 4.1.2 |

---

# PART 7 — CONVERSION AUDIT

## 7.1 Architecture

```
Traffic → Browse → Listing → WhatsApp (pre-filled) → Human close → Transfer/Paystack
```

**Right model for six units and one host.** Online booking would need real-time inventory, a gateway, cancellation logic and refunds — months of work to replace a conversation that already converts. This is a strategic decision, not a shortcut.

**The pre-filled messages are the smartest mechanic on the site:**
```
Bad:       wa.me/234… with no text — guest must compose; many don't
Good:      "Hello, I'd like to book an apartment."
Excellent: "…I am interested in booking the Executive Suite — GRA Phase 3.
            Please confirm availability and provide booking details."
```
It **transfers effort from the customer to the code** — the core principle of friction reduction.

## 7.2 Friction inventory

| Friction | Cost |
|---|---|
| No Book button on mobile | **Critical** |
| Price below FAQ on mobile | **Critical** |
| Contact form can fail silently | **Critical** |
| No date availability | **Critical** |
| No cancellation policy | High |
| No check-in/out times | High |
| No map | High |
| Two co-equal hero CTAs | High |
| Unverifiable social proof | High |
| No host photo | High |
| No CTA on 8 SEO landing pages | High |
| WhatsApp button fails contrast | Medium |
| 28px tap targets | Medium |
| Filters not shareable | Medium |
| No similar-apartment recovery | Medium |
| Stale availability on SEO pages | Medium |

## 7.3 Trust: present vs missing

**Present (all claims *you* make):** named host + bio · languages · response-time promise · Haven Promise · refund guarantee · comparison table · honest live availability count · disclosed fee-estimate footnote · NAP in footer

**Missing (all *third-party verifiable*):** host photograph · reviews · Google Business Profile · RC number · office photo · map · payment logos · cancellation policy · terms · privacy policy · real photography · social profiles (`sameAs: []` is empty)

**The imbalance is the finding**, and it's why the diaspora persona doesn't convert.

## 7.4 Urgency

You have **genuine** scarcity — six units, real availability — and use it once. Ethical amplifications from data you already store:
- *"1 of 2 three-bedroom apartments in GRA is available."*
- Site-wide when supply tightens: *"Only 2 apartments free this week."*
- On a booked listing: *"Available again from 12 Aug"* (you store `available_from` and only show it inside the badge).

**Do not** add countdown timers or "8 people viewing." Fake urgency on a site whose pitch is honesty destroys the brand. **Real scarcity, stated plainly, outperforms fake scarcity** — and you're one of the rare businesses that has it.

## 7.5 Microcopy

**Strong:** "The Shortlet You Can Actually *trust*" · "Every Apartment. Verified." · "A Real Person. Not an Inbox." · "Platform fees — ₦0" · **"Small but perfectly formed — everything works and nothing is broken."** (best sentence on the site — converts a weakness into a promise of reliability).

**Weak:** "not a San Francisco tech company's" (sneering) · "Not cherry-picked quotes" (unprovable claim that invites doubt) · **"Book Now" on a card that opens a chat** — it doesn't book anything. **"Check availability"** sets an accurate expectation, and accurate expectations stop the funnel leaking at the handoff.

## 7.6 The lead-capture gap

**Every lead path terminates in WhatsApp and none is recorded.** Form blocked → nothing. Chat abandoned → nothing. No email list, no CRM, no recovery, no way to remarket to the 95% who don't convert first visit.

**Two cheap fixes:**
1. **Persist every submission to Supabase before handing off** (~30 min). You have the client and the table pattern.
2. **One lead magnet.** *"The Diaspora Guide to Booking a Short-Let in Port Harcourt"* is a genuinely useful document on a public URL earning nothing. Offer it as a PDF for an email address and you build a list of exactly the highest-value persona.

## 7.7 Conversion scorecard

| Element | Score | | Element | Score |
|---|---|---|---|---|
| Pre-filled messages | 9/10 | | Objection handling | 5/10 |
| WhatsApp integration | 8/10 | | Trust signals | 4/10 |
| CTA placement (desktop) | 7/10 | | Social proof | 3/10 |
| Microcopy | 7/10 | | **CTA placement (mobile)** | **3/10** |
| Urgency (underused) | 6/10 | | **Form reliability** | **3/10** |
| Form design | 6/10 | | **Lead capture** | **2/10** |
| | | | **Overall** | **5/10** |

---

# PART 8 — REAL ESTATE PLAYBOOK COMPARISON

✅ follows · 🟡 partial · ❌ does not · **N/A** = traditional-sales item with no shortlet equivalent (per the adaptation instruction: *"do not recommend features that only make sense for traditional property sales"*). Where a shortlet equivalent exists, it is scored instead — noted inline.

## Playbook 1 — Business Analysis
Business type ✅ (rental/property-management operator, clear in 2s) · model ✅ (direct-booking, Airbnb-fee arbitrage) · revenue ✅ · primary services ✅ · **secondary services 🟡** (airport pickup + housekeeping listed as amenities, never explained or priced) · target audience ✅ (named explicitly) · **journey 🟡** (one path; no corporate or repeat) · **primary conversion goal ✅** (WhatsApp, unambiguous) · **site supports it 🟡** (desktop yes; mobile hides the button)

## Playbook 2 — Brand Strategy
Who they are ✅ · who they serve ✅ · **why different ✅** (savings table with real numbers — strongest asset) · personality ✅ · messaging ✅ · **tone 🟡** (one sneering line) · value proposition ✅ (quantified, not asserted) · **visual brand ❌** (both fonts fail to render; logo uses `amber-500`, not brand gold) · **memorable 🟡** (verbally yes, visually no)

## Playbook 3 — Information Architecture
Home ✅ About ✅ Properties ✅ Contact ✅ FAQs ✅ Blog/Resources ✅ · Services 🟡 · Projects **N/A** · Agents **N/A** → host profile ✅
**Navigation 🟡** (5 clear items; 8 SEO pages absent) · hierarchy ✅ · **grouping 🟡** (`/apartments` and `/port-harcourt` duplicate) · **flow 🟡** (guides convert, landing pages dead-end) · **missing pages ❌** (404, privacy, terms, corporate, house rules)

## Playbook 4 — Homepage
Hero ✅ Headline ✅ Subheadline ✅ Images ✅ Benefits ✅ Previews ✅ Process ✅ FAQ ✅ Final CTA ✅ Footer ✅ · CTA hierarchy 🟡 · Trust 🟡 · Testimonials 🟡 · **Order 🟡** · **Unnecessary ❌** (process twice) · **Missing ❌** (map, sticky mobile CTA)

## Playbook 5 — Property Experience
Cards ✅ · Pages ✅ · Gallery 🟡 · **Images ❌** (stock, duplicated) · **Pricing ✅ (best on the site)** · Location 🟡 · Amenities ✅ · Specifications ✅ · **Floor plans N/A** → sleeping arrangement ❌ · Descriptions ✅ · **Availability 🟡** (boolean; cannot answer "free on the 14th?") · Inquiry ✅ · **Comparison N/A** at 6 units · **Related properties ❌** · Trust 🟡
**Enough info to decide? ❌** — no dates, cancellation, check-in times, rules or map

## Playbook 6 — User Experience
Navigation 🟡 · Scrolling ✅ · Hierarchy ✅ · Readability 🟡 · Spacing ✅ · **Accessibility ❌** · **Responsiveness 🟡** · Consistency ✅ · Interaction 🟡 · Forms 🟡 · **Buttons ❌** · Search ❌ · Filtering 🟡 · **Maps ❌**

## Playbook 7 — Conversion
Hero CTA 🟡 · **Buttons ❌** · Forms 🟡 · **WhatsApp ✅** · Phone ✅ · **Sticky actions ❌** · Lead forms 🟡 · Booking 🟡 · Trust 🟡 · Urgency 🟡 · Objections 🟡 · Testimonials 🟡 · FAQ ✅ · **Contact ❌**

## Playbook 8 — Trust *(weakest category)*
Testimonials 🟡 · **Reviews ❌** · Case studies ❌ · Past projects 🟡 · Statistics 🟡 · Awards ❌ · Certifications ❌ · **Team 🟡** (named ✅, no photo ❌) · Office 🟡 · **Google Maps ❌** · **Company registration ❌** · Partners ❌ · **Social proof ❌**

## Playbook 9 — Content Strategy
Headlines ✅ · Descriptions ✅ · CTAs 🟡 ("Book Now" doesn't book) · About ✅ · Services 🟡 · FAQs ✅ · Location ✅ · **Investment N/A** · Education ✅
**Answers customer questions 🟡** — answers "which area?" excellently, fails "what are your terms?"

## Playbook 10 — Design System
**Typography ❌** · Colour 🟡 · Spacing ✅ · Buttons 🟡 · Cards 🟡 · Badges 🟡 · Icons ✅ · Shadows ✅ · Grid ✅ · Consistency 🟡 · Rhythm ✅ · **Professional appearance 🟡**

## Playbook 11 — Component Inventory
**Present:** Navbar ✅ Hero ✅ Property Card ✅ Gallery ✅ CTA ✅ Footer ✅ Inquiry Form ✅ FAQ ✅ Filters ✅ Badge ✅ · Testimonial 🟡 (inline) Feature List 🟡 (inline)
**Missing:** Search ❌ Map ❌ Location Card ❌ SectionHeader ❌ Card ❌ Agent Card **N/A** → HostProfile ✅

## Playbook 12 — Technical Architecture
Folder ✅ · Routing ✅ · Components 🟡 · State ✅ · Data flow 🟡 · API 🟡 · **CMS ❌** · Scalability 🟡 · Maintainability 🟡 · Reusability 🟡

## Playbook 13 — Responsive
Desktop ✅ · Tablet 🟡 · **Mobile ❌** · Spacing ✅ · **Navigation ❌** · Cards ✅ · **Buttons ❌** · Forms ✅ · Typography 🟡 · Images ✅ · **Touch targets ❌**

## Playbook 14 — Accessibility
**Contrast ❌** (5 failures incl. the primary CTA) · **Keyboard ❌** (lightbox trap) · Focus states 🟡 · Alt text 🟡 · **ARIA ❌** · Semantic HTML ✅ · **Headings ❌** · Forms 🟡 · Labels 🟡 · **Screen reader ❌**

## Playbook 15 — Performance
Images ✅ · Loading ✅ · Lazy loading ✅ · Bundle 🟡 · Animations ✅ · **Fonts ❌** · Caching 🟡 · Rendering ✅ · Code splitting ✅ · CWV 🟡

## Playbook 16 — SEO *(strongest category)*
Titles ✅ · Meta descriptions ✅ · **Open Graph ✅** (incl. dynamic OG image) · Headings 🟡 · **Internal linking 🟡** · URLs ✅ · **Schema ✅ (best-in-class)** · Alt text 🟡 · **Location pages ✅** · Indexing ✅ · Blog ✅ · Intent ✅ · Duplicate content 🟡 · Entity consistency 🟡 (`.ng` vs `.com`, empty `sameAs`)

## Playbook 17 — Real Estate Features

| Feature | Present | Necessary here? |
|---|---|---|
| Search | ❌ | No, at 6 units |
| Filters / Categories | ✅ | Yes |
| **Date availability** | ❌ | **Essential — biggest gap** |
| Comparison / Saved / Favorites | ❌ | Not yet |
| Agent profiles | **N/A** → host ✅ | Yes — needs a photo |
| Inquiry / WhatsApp | ✅ | Core |
| Booking | 🟡 | WhatsApp correct at this scale |
| **Mortgage calculator** | **N/A** | **No — would damage credibility** |
| **Investment calculator** | **N/A** | No |
| → *Stay-cost calculator* | ❌ | **Yes — real equivalent value** |
| **Maps** | ❌ | **Yes — high priority** |
| **Floor plans** | **N/A** → sleeping arrangement ❌ | Yes |
| Gallery | ✅ | Yes |
| Videos / Virtual tours | ❌ | **High value for diaspora** |
| **Download brochure** | **N/A** → shareable link | Low |
| **Payment plans** | **N/A** | No |
| FAQs | ✅ | Yes |
| **Reviews** | ❌ | **Yes — critical** |
| Testimonials | 🟡 | Yes, rebuild |
| **Similar properties** | ❌ | Yes |
| Property status | ✅ | Yes — well done |
| **CRM** | ❌ | **Yes — no lead is stored** |
| CMS | ❌ | Not yet |
| Dashboards | ✅ | Admin exists |

## Playbook 18 — AI Opportunities *(ranked by business value)*

1. **AI availability + booking assistant on WhatsApp** — highest value. The funnel terminates in a human answering "is it free on the 14th?" dozens of times daily. A bot over a real availability table handles that and escalates only real bookings. *Requires the date model first.*
2. **AI lead qualification** — auto-tag inbound enquiries (corporate/diaspora/contractor), pre-fill the reply.
3. **AI follow-up** — most enquiries don't convert on first contact and nothing follows up. 24h/72h WhatsApp nudges.
4. **AI content generation** — 3 guides → 30 multiplies the programmatic SEO already built.
5. **AI property matching** — low value at 6 units, high at 25.
6. **AI search** — not warranted at this scale.

## Compliance summary

| Category | ✅ | 🟡 | ❌ | N/A |
|---|---|---|---|---|
| Business | 5 | 3 | 0 | 0 |
| Brand | 6 | 2 | 1 | 0 |
| IA | 6 | 4 | 1 | 2 |
| Homepage | 10 | 3 | 2 | 0 |
| Property | 7 | 5 | 3 | 2 |
| UX | 4 | 6 | 4 | 0 |
| Conversion | 3 | 7 | 3 | 0 |
| **Trust** | **0** | **4** | **8** | 0 |
| Content | 6 | 3 | 0 | 1 |
| Design system | 5 | 6 | 1 | 0 |
| **Accessibility** | **1** | **4** | **5** | 0 |
| Performance | 6 | 3 | 1 | 0 |
| **SEO** | **9** | **4** | **0** | 0 |
| Features | 8 | 2 | 8 | 6 |

**Strongest: SEO, Content, Business clarity. Weakest: Trust, Accessibility, Mobile.**

---

# PART 9 — FRONTEND ENGINEERING REVIEW

## 9.1 What a senior engineer would praise

1. Server-first rendering — 31 prerendered pages, 7 justified client components.
2. `pageMetadata()` as a correctness guarantee — canonical cannot be forgotten.
3. Schema derived from domain data — price in JSON-LD cannot drift from the DOM.
4. `getAreaTypeCombos()` — the empty-page guard separating real programmatic SEO from spam.
5. Literal union types instead of `string`.
6. `availability: … | null` — nullable, not optional, forcing callers to handle absence.
7. Service-role key confined to server modules (verified: never imported by a client component).
8. Reading the actual Next 16 docs — `proxy.ts` where most would ship deprecated `middleware.ts`.
9. Comments that explain *why*, not *what*.

## 9.2 What a senior engineer would change

**Severity 1 — correctness**

| Issue | Location |
|---|---|
| Font tokens broken | `globals.css:14` |
| Incomplete revalidation | `lib/actions.ts:580` |
| Constant-string auth | `api/admin-auth/route.ts:16` |
| Popup-blocked form | `ContactForm.tsx:671` |
| Keyboard trap | `ApartmentGallery.tsx:756` |
| WhatsApp contrast 2.28:1 | `WhatsAppButton` |

**Severity 2 — architecture**
`SiteChrome` → route groups · 19 hardcoded phone numbers → `siteConfig` · `getAvailabilityMap()` bypassed by 3 call sites · `formatPrice` duplicated · Haven Promise duplicated · filter state → URL · `highlights` hardcoded instead of derived · fail-open `?? true` → three-state

**Severity 3 — hygiene**
`<Link><Button></Link>` ~8× instead of `<Button asChild>` (nested interactive elements, lost button semantics — and you use `asChild` correctly inside `WhatsAppButton`, so the knowledge is there) · commented-out code at `HeroSection.tsx:105` · `tsconfig.tsbuildinfo` (126KB) committed · no tests (`getAreaTypeCombos` and `formatPrice` are pure functions with real branching — ten minutes to cover) · no `.nvmrc`, no CI, no lint-on-commit · redundant `id` on `Apartment` · Supabase types hand-written rather than generated

## 9.3 The `dangerouslySetInnerHTML` question

`JsonLd.tsx:410` comments:
> *"JSON.stringify output is safe to inject; it can't contain a raw `</script>` because the quotes/slashes are escaped as data."*

**The reasoning is wrong; the code is currently safe.** `JSON.stringify("</script>")` returns `"\"</script>\""` — the forward slash is **not** escaped, it's a legal JSON character. A string containing `</script>` *would* break out and execute. The stated mechanism doesn't hold.

It's safe today only because every value is a compile-time constant you authored. The moment any comes from a database, a CMS, or a guest review, this is stored XSS.

**One-line permanent fix:**
```tsx
__html: JSON.stringify(block).replace(/</g, "\\u003c")
```

**The lesson is bigger than the bug: a confident comment made a wrong claim, and the confidence is what stops a reviewer checking.** A wrong reason attached to a right outcome is a trap that springs later.

## 9.4 Scorecard

| Dimension | Score | | Dimension | Score |
|---|---|---|---|---|
| Next.js architecture | 8/10 | | Code duplication | 5/10 |
| TypeScript | 8/10 | | Error handling | 5/10 |
| Naming | 9/10 | | **Tailwind usage** | **4/10** |
| Readability | 9/10 | | **Security** | **4/10** |
| File organisation | 8/10 | | **Testing** | **1/10** |
| Component composition | 7/10 | | Maintainability | 7/10 |

---

# PART 10 — PERFORMANCE REVIEW

## 10.1 Measured payload

```
JS chunks:   956 KB on disk; largest single chunk 224 KB
CSS:          77.7 KB (one file)
Fonts:       301.3 KB across 11 woff2
Fonts PRELOADED: 84.9 KB — and used by nothing
```

## 10.2 LCP

The hero image is `priority` with `sizes="100vw"` — correctly flagged, so Next emits a preload and doesn't lazy-load it.

**But it competes with two useless font preloads.** The browser fetches three preloads in parallel; on a Nigerian 4G connection ~85KB of fonts **no CSS rule references** steals bandwidth from your LCP element.

**This is the clearest link between the Part 1 CSS bug and a business metric.** Fixing the tokens either makes 85KB useful or lets you delete it. Right now it's pure loss on every page load.

Secondary: the hero requests Unsplash at `?w=1600` and is heavily overlaid by two gradients — it can carry aggressive compression (`quality={65}`, AVIF/WebP).

## 10.3 CLS — genuinely good, by construction

Every `next/image` uses `fill` inside an explicitly-sized parent ✅ · navbar is `fixed`, removed from flow ✅ · the `scrolled` state changes colour, not geometry ✅ · FAQ `<details>` shifts only on user action ✅ · no FOUT — **because the fonts never apply** (once fixed, `next/font` handles this with `size-adjust` fallbacks). **Estimated CLS <0.05.**

## 10.4 Rendering

31 prerendered pages → CDN-served static HTML, ~20–50ms TTFB, no server cost, infinitely scalable. **For an SEO-led business this is close to ideal.** The cost is freshness; the right fix (`revalidateTag`) keeps the static benefit. **You don't need dynamic rendering; you need correct invalidation.**

## 10.5 JavaScript
`SiteChrome` drags `Navbar` **and `Footer`** into the bundle on every page — 179 lines of static markup hydrated for nothing. `ApartmentsClient` ships Radix Select ×3 to filter six items. `radix-ui` imported as the umbrella package rather than `@radix-ui/react-slot`.

## 10.6 CSS
77.7KB uncompressed is heavy here. Contributors: full shadcn theme (all `--sidebar-*` and `--chart-1..5` tokens — **used zero times**), `tw-animate-css` wholesale, and a complete dark-mode block for a site with no dark-mode toggle. **~40% of CSS variables are never referenced.**

## 10.7 Images
✅ `next/image` everywhere · ✅ `sizes` on every instance · ✅ `priority` only above-fold · ✅ `remotePatterns` · ✅ AVIF/WebP automatic
❌ no `placeholder="blur"` · ❌ only 4 photos per apartment

## 10.8 Caching
`revalidatePath` on four routes only. No `unstable_cache` around the Supabase read, so at build time the same query runs **once per page across 31 pages**. Harmless at this scale; fixed by the same change that fixes invalidation.

## 10.9 Scorecard

| Metric | Estimate | Score |
|---|---|---|
| TTFB | ~20–50ms static | 10/10 |
| CLS | <0.05 | 9/10 |
| INP | Good | 8/10 |
| Image optimisation | Good config, thin content | 7/10 |
| LCP | 1.8–2.5s mobile 4G | 6/10 |
| JS payload | Avoidable Footer cost | 6/10 |
| CSS payload | 77.7KB, ~40% unused | 5/10 |
| Caching | Correct model, broken invalidation | 4/10 |
| **Font strategy** | **85KB preloaded, 0 used** | **1/10** |
| **Overall** | | **6/10** |

---

# PART 11 — DESIGN SYSTEM REVIEW

## 11.1 Tokens

| Token | Defined | Works |
|---|---|---|
| `--color-charcoal` | ✅ | ✅ excellent |
| `--color-gold` | ✅ | ✅ on dark, **fails on light** |
| `--color-gold-dark` | ✅ | ✅ hover only |
| `--color-ivory` | ✅ | ✅ |
| `--color-ivory-dark` | ❌ | ❌ **used, never defined** |
| `--font-sans` | circular | ❌ **self-referential** |
| `--font-display` | ❌ | ❌ **51 usages, zero effect** |
| `--radius` | ✅ | ✅ good `calc()` scale |
| Spacing | Tailwind default | ✅ |

**Three of nine brand tokens are broken**, verified in the production bundle.

## 11.2 What's genuinely good

- **`calc()`-based radius scale** — `sm: calc(var(--radius) * 0.6)` … `4xl: * 2.6`. Change one value, the system rescales proportionally.
- **OKLCH throughout** — perceptually uniform.
- **Spacing discipline** — `py-20` sections, `gap-6` grids, `p-6` cards, `max-w-7xl`, `px-4 sm:px-6 lg:px-8`, used consistently across 30 components with almost no drift. **The most disciplined thing in the project, and why the site *feels* coherent despite the broken typography.**
- **Card pattern** — `bg-white rounded-2xl border border-slate-200 p-6` repeated identically ~20 times.

## 11.3 What's undisciplined

**Colour drift.** Alongside `charcoal`/`gold` the code also uses `bg-amber-500` for the logo mark (**the logo is not the brand gold**), `text-amber-400` in the footer, `hover:text-amber-500` in nav, `bg-slate-900` for the footer instead of `charcoal`, `text-slate-900` in ~15 places, and raw green/red with no semantic tokens. **Two golds, two charcoals, no semantic colour layer.**

**Radius drift:** `rounded-xl` on `ApartmentCard`, `rounded-2xl` almost everywhere else.

**Button semantics undefined.** The site's actual meanings — primary, WhatsApp, outline-on-dark, outline-on-light — are ad-hoc className overrides repeated ~15 times:
```tsx
className="bg-gold hover:bg-gold-dark text-charcoal font-semibold"           // ×6
className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white" // ×4
```
These should be **variants**. Right now the design system exists in the developer's head and is re-typed each time.

## 11.4 Components to extract

| Extract | Occurrences |
|---|---|
| `<SectionHeader eyebrow title description />` | **14** |
| `<Card>` wrapper | ~20 |
| Button variants `primary`/`whatsapp`/`onDark` | ~15 |
| `<StatPill icon text />` | 4 |
| `<TrustBadge />` | 3 |
| `<ComparisonTable rows />` | 2 |
| `<PromiseList items />` | 2 |

## 11.5 Is it scalable?

**Structurally yes, in execution no.** Token architecture, spacing discipline and the band pattern are sound foundations. But with three broken tokens, two competing golds, no semantic colour layer and no button variants, a second developer would immediately add a third gold — because nothing stops them.

**A design system isn't a set of tokens. It's a set of constraints that make the wrong thing hard.** Yours has the tokens and not the constraints.

## 11.6 Scorecard

| Dimension | Score | | Dimension | Score |
|---|---|---|---|---|
| Spacing scale | 9/10 | | Cards | 6/10 |
| Radius scale | 9/10 | | Consistency | 6/10 |
| Icons | 9/10 | | Forms | 6/10 |
| Animation | 6/10 | | Colour tokens | 5/10 |
| Buttons | 4/10 | | Component reuse | 5/10 |
| **Typography scale** | **2/10** | | **Scalability** | **5/10** |

---

# PART 12 — FINAL SCORECARD

| Category | Score | Justification |
|---|---|---|
| **SEO** | **9/10** | Schema, programmatic pages, GEO — best category |
| Information Architecture | 7/10 | Clean hierarchy; SEO tree orphaned from nav |
| Frontend Engineering | 7/10 | Senior structure, three unverified decisions |
| Code Quality | 7/10 | Readable, well-commented, some duplication |
| Maintainability | 7/10 | Predictable; two sources of truth for key facts |
| UX | 6/10 | Strong desktop, weak mobile, broken keyboard |
| Performance | 6/10 | Great rendering model; 85KB wasted preload |
| Scalability | 6/10 | Fine to ~25 units; availability model is the ceiling |
| Overall Professionalism | 6/10 | Reads professional until you measure it |
| Visual Design | 5/10 | Excellent instincts; typography never renders |
| Conversion Optimization | 5/10 | Great mechanics, mobile path broken, no lead capture |
| Shortlet Best Practices | 4/10 | No dates, policies, rules, check-in times, map |
| **Accessibility** | **3/10** | WCAG 2.1.2 (Level A) failure, 5 contrast failures |
| **Client Readiness** | **5/10** | **Not shippable — four verified defects** |

**Why "not shippable" when much of this is good work:** the four blockers are verified defects, not opinions, and each is fixable in under a day. The distance from 5/10 to ~8/10 is about two days — unusual, and worth appreciating. Most 5/10 projects are 5/10 structurally.

---

# PART 13 — PRIORITY IMPROVEMENTS

## 🔴 HIGH — before anyone sees this site (~2 days total)

| # | Fix | Why | Difficulty | Time |
|---|---|---|---|---|
| 1 | **Fix font tokens** (3 lines in `globals.css`) | 51 dead classes; both fonts wasted | Trivial | 15 min |
| 2 | **`revalidateTag` for availability** | 8 SEO pages show stale data | Easy | 1 h |
| 3 | **Sticky mobile CTA + unhide navbar Book** | Mobile has no visible booking action | Easy | 2 h |
| 4 | **Price above the fold on mobile (listing)** | Price sits below the FAQ | Easy | 1 h |
| 5 | **Fix contact-form popup failure** | Silent lead loss + false success | Easy | 1 h |
| 6 | **WhatsApp button → `green-700`** | 2.28:1 on the primary CTA | Trivial | 10 min |
| 7 | **Sign the admin auth cookie** | Constant string, devtools-forgeable | Medium | 2 h |
| 8 | **Add cancellation, check-in/out, house rules** | Top booking objections, all absent | Easy (copy) | 3 h |
| 9 | **Photograph of Chidi** | Page argues "a real person", shows a letter | Trivial | 30 min |
| 10 | **Replace lightbox with Radix Dialog** | Keyboard trap — WCAG Level A | Medium | 2 h |
| 11 | **Add `not-found.tsx`** | WhatsApp mangles URLs | Easy | 1 h |
| 12 | **Escape `<` in `JsonLd`** | XSS the moment content is dynamic | Trivial | 5 min |

## 🟡 MEDIUM — next sprint

13. **Date-range availability model** (2–3 d) — unlocks the whole product category
14. Route groups, delete `SiteChrome` (2 h)
15. Persist leads to Supabase before WhatsApp (2 h)
16. Map on listing + area pages (3 h)
17. Phone number → `siteConfig`, 19 sites (1 h)
18. Button size scale → 44px (30 min)
19. `gold-text` token + fix 4 contrast failures (2 h)
20. Fix h1→h3 skips; label the Select; name icon buttons (2 h)
21. CTA block on all 8 `/port-harcourt` pages (1 h)
22. Similar apartments on listing (3 h)
23. Filter state → URL (2 h)
24. `/port-harcourt` into the nav (30 min)
25. Three-state availability (`unknown`) (2 h)
26. Attribute guides to Chidi + publish dates (1 h)
27. **Real photography, 15–20 per unit** — blocks launch credibility (external)
28. Google Business Profile + review link (2 h)
29. Privacy policy + terms (2 h)
30. Lose one row in the comparison table (15 min)

## 🟢 LOW

31. Extract `SectionHeader`/`Card`/`PromiseList` · 32. Button variants · 33. `motion-reduce:` · 34. Skip link · 35. Descriptive alt text · 36. `placeholder="blur"` · 37. Prune unused CSS tokens · 38. Studio as a distinct type · 39. Corporate/long-stay page · 40. Stay-cost calculator · 41. Lead magnet on the diaspora guide · 42. Tests for `getAreaTypeCombos`/`formatPrice` · 43. Generate Supabase types · 44. Gitignore `tsbuildinfo` · 45. Admin mobile layout · 46. Admin confirm-on-toggle · 47. `openingHoursSpecification` · 48. Unique content on type pages · 49. `lang="en-NG"` · 50. Video walkthroughs

---

# PART 14 — PRINCIPLES TO CARRY FORWARD

## 14.1 The meta-lesson: verification, not decisions

| Defect | The decision | What was missing |
|---|---|---|
| Fonts don't render | "Playfair for headings, Inter for body" — **correct** | Nobody looked and asked "is that the serif?" |
| Stale availability | "Revalidate pages that show availability" — **correct** | Nobody asked "which pages *actually* show it?" |
| Forgeable auth | "Gate admin behind a cookie, check twice" — **correct** | Nobody asked "what stops someone typing this value?" |

**Every decision was right. Every verification was absent.** That's the gap between competent and senior, and it's a habit, not a talent.

**After any decision, ask: "what would I observe if this were silently wrong?" — then go and observe it.** Fonts → open the page and compare to the specimen. Cache → grep for every consumer of the data. Auth → open devtools and try to forge it. Each takes under two minutes.

## 14.2 Silent failure is the enemy

```
TypeScript      → build fails.        Found in 2 seconds.
React           → runtime error.      Found in 1 minute.
Tailwind        → class vanishes.     Found in 6 months.
CSS variables   → property invalid.   Found never.
revalidatePath  → nothing happens.    Found by a customer.
window.open     → blocked silently.   Found by a lost lead.
```

**Your project is disciplined in the loud tools and undisciplined in the quiet ones.** Not coincidence — you get feedback where feedback exists.

**So add feedback where it's missing.** `eslint-plugin-tailwindcss` turns a vanished class into a lint error; a contrast check in CI turns 2.28:1 into a failed build. The senior move isn't "be more careful" — it's *make carelessness impossible*.

## 14.3 Duplication of facts vs duplication of code

Your duplications are all **facts**: the phone number (×19), the Haven Promise (×2), `formatPrice` (×2), the availability query (×3).

Duplicated *behaviour* gets caught — tests fail, behaviour diverges visibly. Duplicated *facts* rot invisibly, because each copy stays individually correct and only the **set** becomes wrong.

**The tell you already left yourself** (`site.ts:35`):
> `// NAP — keep identical to what is shown in the Footer and Contact page.`

**If you write a comment asking a future developer to keep two things in sync, you have found a missing abstraction.**

## 14.4 Fail-closed, not fail-open

`availability?.available ?? true` = *"If we don't know, tell the guest it's free."*

**Default to the state where being wrong is cheapest.** Fail-closed costs you nothing here — the guest still WhatsApps, and you still get the lead. **When you write a default, say the failure it produces out loud. If you wince, pick the other one.**

## 14.5 Match the CTA to the funnel stage

| Placement | Message produced | Lead quality |
|---|---|---|
| Hero | "I would like to book an apartment" | Low — 4 messages to qualify |
| Listing card | "…the Executive Suite — GRA Phase 3" | High |
| Booked listing | "…it's booked, suggest a similar one" | **High + upsell** |

You built all three; you just haven't used the hierarchy deliberately. **Cold traffic → qualification. Warm traffic → action.**

## 14.6 Trust is evidence, not adjectives

"Verified" · "4.9 rating" · "500+ guests" · "Not cherry-picked" · "A Real Person" — not one is checkable by a stranger. For an audience whose defining fear is fraud, **unverifiable confidence is itself a fraud signal.**

```
Bad:       "Trusted by hundreds of guests."
Good:      A named testimonial with a role.
Excellent: A WhatsApp screenshot, real date, face blurred, one awkward sentence.
```

Imperfection reads as authentic; polish reads as marketing. **One photograph of Chidi will outperform every adjective on this site.**

Related: **the damaging admission.** Naming one genuine weakness ("no instant online booking — we confirm by WhatsApp in 30 min") makes your other five claims credible. A 6–0 comparison table persuades nobody paying attention.

## 14.7 Design systems are constraints, not tokens

Two golds, two charcoals, a primary button style copy-pasted into six files, a section header repeated fourteen times. **Tokens describe the system; constraints enforce it.** Without variants, lint rules and extracted components, the next developer adds a third gold — not from carelessness, but because nothing made the right thing easier than the wrong thing.

Corollary: **`radix-nova`'s 32px buttons were right for its context and wrong for yours.** Adopting a design system means re-tuning it to your context, not inheriting its assumptions.

## 14.8 Measure the things that look fine

Your palette *looks* premium. Measured: gold on charcoal **9.06:1** (excellent); gold on white **1.95:1** (a failure). Same colour — designed for dark bands, reused on light ones by habit.

**Nobody sees a contrast failure; everybody experiences it.** Measure contrast, bundle size, LCP and tap targets. Numbers survive arguments about taste.

## 14.9 Content and product must agree

You wrote a guide telling nervous guests to demand cancellation terms, an exact address, and proof the apartment is real — then built listings providing none of the three. **Content that raises a bar your product fails to clear hands the visitor a checklist to fail you with.** When they conflict, the product moves.

## 14.10 Know what not to build — and what to reach for

Best decisions in this project are the ones where you *didn't* add infrastructure: no CMS at 6 apartments · no online booking · no state library · no custom backend. **Junior instinct: add the thing. Senior instinct: know the scale at which the thing starts paying.**

The mirror image: **you hand-rolled a modal instead of using the Radix Dialog already installed.** So the full rule is *know what to build and what to reach for* — skip infrastructure you don't need yet, and never hand-roll a solved accessibility problem.

## 14.11 Comments must be verified like code

`JsonLd.tsx`'s safety comment describes a mechanism that doesn't exist (`JSON.stringify` does not escape `/`). The code is safe only because every input is a constant today. **A wrong reason attached to a right outcome is a trap that springs later** — when the inputs change and the reason was never true.

## 14.12 The checklist to carry into the next project

1. Server-first by default; `"use client"` only with a named reason.
2. Helpers that make the correct thing the only thing (`pageMetadata()` is the model).
3. Derive schema and content from one source so they cannot drift.
4. Read the actual framework docs.
5. Comment the *why* — and verify the why.
6. Colocate folders by change frequency.
7. Literal union types over `string`.
8. Nullable-not-optional props, to force handling of absence.
9. **Verify every decision by asking what silent wrongness would look like.**
10. **Measure contrast, bundle and tap targets before calling anything done.**
11. **Fail closed.**
12. **Never hand-roll a modal.**

---

*End of audit. 14 parts · 6,456 lines reviewed · production build, compiled CSS and WCAG contrast computed as evidence.*
