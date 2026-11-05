"use client";

import { useRef, useState } from "react";
import { Send, CheckCircle, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveEnquiry } from "@/lib/actions";
import { siteConfig, whatsappUrl, telHref } from "@/lib/site";

interface FormData {
  name: string;
  phone: string;
  email: string;
  enquiryType: string;
  checkIn: string;
  nights: string;
  message: string;
}

type FormStatus = "idle" | "submitting" | "success";

const enquiryTypes = [
  { value: "booking", label: "I want to book an apartment" },
  { value: "availability", label: "I want to check availability" },
  { value: "corporate", label: "Corporate / long-stay enquiry" },
  { value: "diaspora", label: "Diaspora returnee enquiry" },
  { value: "other", label: "Other question" },
];

const emptyForm: FormData = {
  name: "",
  phone: "",
  email: "",
  enquiryType: "",
  checkIn: "",
  nights: "",
  message: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [status, setStatus] = useState<FormStatus>("idle");
  // The composed wa.me URL is kept in state so the success screen can offer a
  // REAL link if the automatic open was blocked. See the note below.
  const [handoffUrl, setHandoffUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.enquiryType !== "";

  /**
   * THE BUG THIS REPLACES — worth understanding in detail, because it is subtle
   * and it silently destroyed warm leads.
   *
   * The old handler did:
   *
   *   setTimeout(() => {
   *     setStatus("success");
   *     window.open(waUrl, "_blank");
   *   }, 1000);
   *
   * Browsers only allow `window.open` while a user gesture is still "active" —
   * a short window that begins on click. Deferring the call into a 1-second
   * setTimeout puts it OUTSIDE that window, so popup blockers (iOS Safari
   * especially, a large share of diaspora traffic) block it.
   *
   * When they did, `setStatus("success")` had already run. The guest saw a green
   * tick and "Message Sent". Nothing was sent, no record existed, and they waited
   * for a reply that could never come — then concluded we ignore enquiries.
   *
   * And the setTimeout existed only to display a spinner for one second: fake
   * latency, faking work that wasn't happening, paid for in lost revenue.
   *
   * The fix has three parts:
   *   1. Open WhatsApp SYNCHRONOUSLY inside the click handler, in the gesture
   *      window, so it is not blocked in the first place.
   *   2. Persist the enquiry to Supabase FIRST, so the lead exists regardless of
   *      what the handoff does. Fire-and-forget — a failed insert must never
   *      block the guest from reaching the host.
   *   3. Never claim success. The success screen presents a real, tappable link
   *      as its primary element, so a blocked popup is a one-tap recovery
   *      rather than a dead end.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || status === "submitting") return;

    const selectedEnquiry =
      enquiryTypes.find((t) => t.value === formData.enquiryType)?.label ??
      formData.enquiryType;

    const message =
      `Hello Haven Shortlets, my name is ${formData.name}.\n\n` +
      `Phone: ${formData.phone}\n` +
      `Email: ${formData.email || "Not provided"}\n` +
      `Enquiry: ${selectedEnquiry}\n` +
      `Check-in: ${formData.checkIn || "Not specified"}\n` +
      `Nights: ${formData.nights || "Not specified"}\n\n` +
      `Message: ${formData.message || "No additional message"}`;

    const url = whatsappUrl(message);
    setHandoffUrl(url);

    // (1) Open in the SAME synchronous turn as the click. No await before this
    // line — a single `await` would end the gesture window and reintroduce the
    // bug. Everything that can wait happens after.
    const opened = window.open(url, "_blank", "noopener,noreferrer");

    // (2) Persist regardless of whether the handoff worked. Deliberately not
    // awaited before showing the confirmation: the guest should not wait on our
    // CRM, and a database problem must not stop them contacting us.
    setStatus("submitting");
    void saveEnquiry({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      enquiry_type: formData.enquiryType,
      check_in: formData.checkIn || null,
      nights: formData.nights ? Number(formData.nights) : null,
      message: formData.message.trim() || null,
      apartment_slug: null,
      source: "contact-form",
    })
      .then((result) => setSaved(result.ok))
      .catch(() => setSaved(false))
      .finally(() => setStatus("success"));

    // If the popup was blocked, `opened` is null. We do not treat that as an
    // error — the success screen leads with the manual link either way, so both
    // paths converge on something the guest can act on.
    if (!opened) {
      setStatus("success");
    }
  };

  const handleReset = () => {
    setFormData(emptyForm);
    setHandoffUrl(null);
    setSaved(false);
    setStatus("idle");
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="size-8 text-green-700" aria-hidden="true" />
        </div>

        {/* WORDING MATTERS. The old copy said "Message Sent" — a claim we could
            not verify. This states what actually happened and what to do next,
            which is both honest and more useful. */}
        <h3 className="font-display text-xl font-bold text-charcoal mb-3">
          Your details are with us
        </h3>
        <p className="text-slate-700 mb-6 leading-relaxed">
          {saved
            ? `We have your enquiry and ${siteConfig.host.firstName} will reply within ${siteConfig.responseTimeMinutes} minutes during business hours.`
            : `Send it straight to ${siteConfig.host.firstName} on WhatsApp using the button below — that is the fastest way to get a reply.`}
        </p>

        {/* The primary element is a REAL link, not a message telling the guest to
            retype a phone number. If the automatic open was blocked, this is a
            single tap. */}
        {handoffUrl && (
          <Button asChild variant="whatsapp" size="lg" className="w-full mb-3">
            <a href={handoffUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" aria-hidden="true" />
              Open WhatsApp with your message
            </a>
          </Button>
        )}

        <p className="text-sm text-slate-600 mb-6">
          Prefer to call?{" "}
          <a
            href={telHref}
            className="font-medium text-charcoal underline decoration-gold decoration-2 underline-offset-4"
          >
            {siteConfig.phoneDisplay}
          </a>
        </p>

        <Button variant="onLight" onClick={handleReset}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
      <h2 className="font-display text-xl font-bold text-charcoal mb-2">
        Send us a message
      </h2>
      <p className="text-slate-600 text-sm mb-8">
        Fill this in and your enquiry goes straight to{" "}
        {siteConfig.host.firstName}&apos;s WhatsApp, with your details already
        filled in.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            id="name"
            label="Full name"
            required
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Emeka Okafor"
            autoComplete="name"
          />
          <Field
            id="phone"
            label="Phone / WhatsApp"
            required
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="e.g. 0809 876 5432"
            autoComplete="tel"
          />
        </div>

        <Field
          id="email"
          label="Email"
          optional
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="e.g. emeka@email.com"
          autoComplete="email"
        />

        {/* THE LABEL IS NOW ASSOCIATED WITH THE CONTROL.
            This was the one field on the form with a bare <label> — no htmlFor,
            and the Radix trigger had no id. Every other field was wired
            correctly, so a screen-reader user hit exactly one unlabelled
            REQUIRED combobox and had no idea what it was for. */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="enquiryType"
            className="text-sm font-medium text-slate-800"
          >
            What can we help with?{" "}
            <span className="text-red-700" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <Select
            value={formData.enquiryType}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, enquiryType: value }))
            }
          >
            <SelectTrigger id="enquiryType" className="w-full">
              <SelectValue placeholder="Choose one" />
            </SelectTrigger>
            <SelectContent>
              {enquiryTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            id="checkIn"
            label="Check-in date"
            optional
            type="date"
            value={formData.checkIn}
            onChange={handleInputChange}
            min={new Date().toISOString().split("T")[0]}
          />
          <Field
            id="nights"
            label="Number of nights"
            optional
            type="number"
            value={formData.nights}
            onChange={handleInputChange}
            placeholder="e.g. 7"
            min="1"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="message"
            className="text-sm font-medium text-slate-800"
          >
            Anything else?{" "}
            <span className="text-slate-600 font-normal">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Which apartment caught your eye, how many guests, any special requirements…"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-text focus:border-transparent resize-none"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isFormValid || status === "submitting"}
          className="w-full sm:w-auto"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              Send via WhatsApp
            </>
          )}
        </Button>

        {/* aria-live so a screen-reader user is told why submit is disabled
            rather than being left to guess. */}
        <p
          ref={errorRef}
          className="text-xs text-slate-600"
          aria-live="polite"
        >
          {isFormValid
            ? `Your message goes to ${siteConfig.host.firstName} directly. No account needed.`
            : "Fill in your name, phone number and what you need to continue."}
        </p>
      </form>
    </div>
  );
}

/** Labelled input. Every field goes through this, so none can lose its label. */
function Field({
  id,
  label,
  required,
  optional,
  ...props
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
} & React.ComponentProps<"input">) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-800">
        {label}{" "}
        {required && (
          <>
            <span className="text-red-700" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
          </>
        )}
        {optional && (
          <span className="text-slate-600 font-normal">(optional)</span>
        )}
      </label>
      <Input id={id} name={id} required={required} {...props} />
    </div>
  );
}
