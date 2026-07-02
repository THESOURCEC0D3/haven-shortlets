"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    enquiryType: "",
    checkIn: "",
    nights: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.enquiryType !== "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;
    setStatus("submitting");

    const selectedEnquiry =
      enquiryTypes.find((t) => t.value === formData.enquiryType)?.label ??
      formData.enquiryType;

    const whatsappMessage = encodeURIComponent(
      `Hello Haven Shortlets, my name is ${formData.name}.\n\n` +
        `Phone: ${formData.phone}\n` +
        `Email: ${formData.email || "Not provided"}\n` +
        `Enquiry: ${selectedEnquiry}\n` +
        `Check-in: ${formData.checkIn || "Not specified"}\n` +
        `Nights: ${formData.nights || "Not specified"}\n\n` +
        `Message: ${formData.message || "No additional message"}`,
    );

    setTimeout(() => {
      setStatus("success");
      window.open(
        `https://wa.me/2348098765432?text=${whatsappMessage}`,
        "_blank",
      );
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      enquiryType: "",
      checkIn: "",
      nights: "",
      message: "",
    });
    setStatus("idle");
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="font-display text-xl font-bold text-charcoal mb-2">
          Message Sent
        </h3>
        <p className="text-slate-600 mb-2 leading-relaxed">
          Your enquiry has been sent to Chidi on WhatsApp. Expect a response
          within 30 minutes during business hours.
        </p>
        <p className="text-slate-500 text-sm mb-8">
          If WhatsApp did not open automatically, message us directly on{" "}
          <span className="font-semibold text-slate-700">0809 876 5432</span>.
        </p>
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8">
      <h2 className="font-display text-xl font-bold text-charcoal mb-2">
        Send Us a Message
      </h2>
      <p className="text-slate-500 text-sm mb-8">
        Fill in the form and your enquiry goes straight to Chidi&apos;s
        WhatsApp.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-700"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Emeka Okafor"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-slate-700"
            >
              Phone / WhatsApp <span className="text-red-500">*</span>
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="e.g. 0809 876 5432"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="e.g. emeka@email.com"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Enquiry Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.enquiryType}
            onValueChange={(value) => handleSelectChange("enquiryType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="What are you looking for?" />
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
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="checkIn"
              className="text-sm font-medium text-slate-700"
            >
              Check-in Date{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <Input
              id="checkIn"
              name="checkIn"
              type="date"
              value={formData.checkIn}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="nights"
              className="text-sm font-medium text-slate-700"
            >
              Number of Nights{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <Input
              id="nights"
              name="nights"
              type="number"
              placeholder="e.g. 7"
              min="1"
              value={formData.nights}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="message"
            className="text-sm font-medium text-slate-700"
          >
            Additional Message{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Tell us more — which apartment caught your eye, any special requirements, preferred payment method..."
            value={formData.message}
            onChange={handleInputChange}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={!isFormValid || status === "submitting"}
          className="bg-gold hover:bg-gold-dark text-charcoal font-semibold gap-2 w-full sm:w-auto"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send via WhatsApp
            </>
          )}
        </Button>

        <p className="text-xs text-slate-400">
          <span className="text-red-500">*</span> Required fields. Your message
          goes directly to Chidi&apos;s WhatsApp for the fastest response.
        </p>
      </form>
    </div>
  );
}
