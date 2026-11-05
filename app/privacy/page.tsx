import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";
import { siteConfig, fullAddress, mailHref, telHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Notice",
  description:
    "How Haven Shortlets PH collects, uses and protects your personal information when you enquire about or book a short-let apartment in Port Harcourt.",
  path: "/privacy",
});

/**
 * Privacy notice.
 *
 * WHY THIS IS NOT OPTIONAL
 *
 * The site collects name, phone number, email, travel dates and free-text
 * messages through the contact form, and now stores them in Supabase. That is
 * personal data processing, which triggers:
 *   - Nigeria's Data Protection Act 2023 (NDPA), which requires a lawful basis
 *     and a privacy notice for Nigerian data subjects; and
 *   - UK/EU GDPR expectations from the diaspora audience this business
 *     explicitly targets — a London-based guest arrives assuming a privacy
 *     notice exists.
 *
 * It is also a trust signal. A guest already worried about scams reads the
 * absence of a privacy page as evidence of an amateur or fraudulent operation.
 *
 * NOTE FOR PRECIOUS: this is a solid, honest starting notice that accurately
 * reflects what the code actually does. It is NOT legal advice — before launch,
 * have it reviewed and fill in the real company registration details.
 */
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy notice", path: "/privacy" },
        ])}
      />

      <div className="bg-charcoal text-white pt-28 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Privacy notice
          </h1>
          <p className="text-white/80">
            How we handle your information when you enquire or book.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col gap-8">
          <Section title="Who we are">
            <P>
              {siteConfig.name} operates short-let apartments in Port Harcourt,
              Rivers State, Nigeria. Our registered address is {fullAddress}. For
              anything in this notice, contact us at{" "}
              <A href={mailHref}>{siteConfig.email}</A> or{" "}
              <A href={telHref}>{siteConfig.phoneDisplay}</A>.
            </P>
          </Section>

          <Section title="What we collect">
            <P>We only collect what we need to answer an enquiry and host a stay:</P>
            <Ul
              items={[
                "Your name — so we know who we are speaking to.",
                "Your phone or WhatsApp number — this is how we confirm bookings.",
                "Your email address, if you choose to give it (optional).",
                "Your intended check-in date and number of nights.",
                "Anything you write in the message field.",
              ]}
            />
            <P>
              We do <strong>not</strong> collect card or bank details through this
              website. Payments happen by bank transfer or through Paystack, who
              handle card data on their own systems — we never see it.
            </P>
          </Section>

          <Section title="Why we use it, and our lawful basis">
            <Ul
              items={[
                "To reply to your enquiry and arrange your stay — necessary to enter into and perform a contract with you.",
                "To contact you about a booking you have made, including check-in details — contractual necessity.",
                "To keep a record of enquiries so we can follow up and improve how we respond — our legitimate interest in running the business.",
              ]}
            />
            <P>
              We do not sell your information, and we do not use it for
              advertising.
            </P>
          </Section>

          <Section title="Who else sees it">
            <Ul
              items={[
                "Supabase — our database provider, which stores enquiry records on our behalf.",
                "WhatsApp (Meta) — when you choose to message us, that conversation is subject to WhatsApp's own privacy terms.",
                "Paystack — only if you pay through them, and only the data they need to process the payment.",
                "Vercel — our website host, which processes technical request logs.",
              ]}
            />
            <P>
              Some of these providers operate servers outside Nigeria, which means
              your information may be transferred abroad. We choose established
              providers that offer appropriate safeguards for that transfer.
            </P>
          </Section>

          <Section title="How long we keep it">
            <P>
              Enquiries that do not become bookings are kept for 12 months, so we
              can pick up a conversation if you come back. Booking records are kept
              for 6 years, which is the period we may need them for tax and
              accounting purposes. After that they are deleted.
            </P>
          </Section>

          <Section title="Your rights">
            <P>
              You can ask us to show you what we hold about you, correct it,
              delete it, or stop using it. Email{" "}
              <A href={mailHref}>{siteConfig.email}</A> and we will respond within
              30 days. You do not need to give a reason, and asking will never
              affect how we treat you as a guest.
            </P>
            <P>
              If you are not satisfied with how we have handled your information,
              you can complain to the Nigeria Data Protection Commission.
            </P>
          </Section>

          <Section title="Cookies and tracking">
            <P>
              This website sets no advertising or analytics cookies. The only
              cookie we use is a sign-in cookie for the private admin area, which
              is strictly necessary for that area to work and is never set for
              ordinary visitors.
            </P>
          </Section>

          <Section title="Changes to this notice">
            <P>
              If we change how we handle information we will update this page. It
              was last reviewed in July 2026.
            </P>
          </Section>
        </article>

        <p className="mt-6 text-sm text-slate-700">
          See also our{" "}
          <Link
            href="/policies"
            className="font-medium text-charcoal underline decoration-gold decoration-2 underline-offset-4"
          >
            booking terms, house rules and cancellation policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-lg font-bold text-charcoal mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-slate-700 leading-relaxed mb-3 last:mb-0">
      {children}
    </p>
  );
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2 mb-3 pl-5 list-disc">
      {items.map((item) => (
        <li key={item} className="text-sm text-slate-700 leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  );
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="font-medium text-charcoal underline decoration-gold decoration-2 underline-offset-4"
    >
      {children}
    </a>
  );
}
