"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import StarRating from "./StarRating";

const MMS_SERVICES = [
  "Weddings & Elopements",
  "Conference Production",
  "Live Streaming Production",
  "Videography & Photography",
  "Drone Packages",
  "Event Lighting & Stage Setup",
  "Interactive Screens",
  "DJ Services",
  "Special Effects",
  "Other / Custom Project",
];

interface ReviewFormProps {
  defaultService?: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ defaultService = "", onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(5);
  const [service, setService] = useState<string>(defaultService);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [reference, setReference] = useState<string>("");
  const [contentLength, setContentLength] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? "").trim();

    const payload = {
      name: field("name"),
      email: field("email"),
      role: field("role") || undefined,
      organisation: field("organisation") || undefined,
      service: service || undefined,
      eventDate: field("eventDate") || undefined,
      rating,
      headline: field("headline") || undefined,
      content: field("content"),
      consent: data.get("consent") === "on",
      website: field("website"), // honeypot
    };

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Unable to submit review. Please try again.");
      }

      setReference(resData.reference || `REV-${resData.submissionId.slice(-6).toUpperCase()}`);
      setSubmitted(true);
      form.reset();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please check your submission.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        role="status"
        className="bg-[#0b0b0f] border border-brand-accent/25 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-accent/5 pointer-events-none" />

        <div className="w-16 h-16 rounded-full bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center mx-auto text-brand-accent shadow-lg shadow-brand-primary/20">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2 relative z-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-semibold font-heading block">
            Submission Confirmed
          </span>
          <h3 className="text-2xl sm:text-3xl font-semibold text-white font-heading">
            Thank you for your review!
          </h3>
          <p className="text-sm text-brand-foreground/75 font-light max-w-lg mx-auto leading-relaxed">
            Your feedback means the world to our team. Your review has been securely recorded under reference{" "}
            <span className="text-brand-accent font-mono font-medium">{reference}</span> and will be published to the client gallery following verification.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 relative z-10">
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setRating(5);
            }}
            className="text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-full border border-brand-accent/30 text-brand-foreground hover:bg-brand-accent/10 transition-colors"
          >
            Submit Another Review
          </button>
          <Link
            href="/"
            className="mms-button px-7 py-3 text-xs uppercase tracking-[0.2em] font-semibold"
          >
            <span className="relative z-10 flex items-center gap-2">
              Back to Homepage <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      id="review-form"
      onSubmit={handleSubmit}
      aria-busy={loading}
      className="bg-[#0b0b0f]/90 border border-brand-accent/20 rounded-3xl p-6 sm:p-10 md:p-12 space-y-7 shadow-2xl backdrop-blur-xl relative"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-brand-accent text-xs font-semibold uppercase tracking-[0.25em] font-heading">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>Client Testimonial</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-white font-heading">
          Share Your Experience With MMS
        </h2>
        <p className="text-xs sm:text-sm text-brand-foreground/70 font-light leading-relaxed">
          From weddings in Victoria Falls to nationwide summits and creative brand productions, your story inspires our standard of excellence.
        </p>
      </div>

      {/* Star Rating Section */}
      <div className="bg-[#121218] border border-brand-accent/15 rounded-2xl p-5 space-y-3">
        <label className="text-[10px] uppercase tracking-[0.2em] text-brand-accent font-semibold block font-heading">
          Overall Experience Rating <span className="text-red-400">*</span>
        </label>
        <StarRating value={rating} onChange={setRating} interactive size="lg" showLabel />
      </div>

      {/* Reviewer Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="rev-name" className="text-[10px] uppercase tracking-[0.2em] text-brand-accent font-semibold block mb-2 font-heading">
            Your Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="rev-name"
            name="name"
            maxLength={120}
            required
            placeholder="e.g. Tendai Moyo / Sarah Jenkins"
            className="w-full bg-[#050507]/80 border border-brand-accent/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent/60 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="rev-email" className="text-[10px] uppercase tracking-[0.2em] text-brand-accent font-semibold block mb-2 font-heading">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="rev-email"
            name="email"
            maxLength={254}
            required
            placeholder="you@company.com"
            className="w-full bg-[#050507]/80 border border-brand-accent/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent/60 transition-colors"
          />
        </div>
      </div>

      {/* Role & Organisation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="rev-role" className="text-[10px] uppercase tracking-[0.2em] text-brand-accent font-semibold block mb-2 font-heading">
            Role or Title (optional)
          </label>
          <input
            type="text"
            id="rev-role"
            name="role"
            maxLength={120}
            placeholder="e.g. Bride, Summit Director, Producer"
            className="w-full bg-[#050507]/80 border border-brand-accent/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent/60 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="rev-org" className="text-[10px] uppercase tracking-[0.2em] text-brand-accent font-semibold block mb-2 font-heading">
            Organisation / Company (optional)
          </label>
          <input
            type="text"
            id="rev-org"
            name="organisation"
            maxLength={160}
            placeholder="e.g. SADC Forum, Luxury Weddings Co."
            className="w-full bg-[#050507]/80 border border-brand-accent/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent/60 transition-colors"
          />
        </div>
      </div>

      {/* Service Category & Event Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="rev-service" className="text-[10px] uppercase tracking-[0.2em] text-brand-accent font-semibold block mb-2 font-heading">
            Service Experienced
          </label>
          <select
            id="rev-service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full bg-[#050507]/80 border border-brand-accent/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-accent/60 transition-colors cursor-pointer"
          >
            <option value="">Select a service category</option>
            {MMS_SERVICES.map((srv) => (
              <option key={srv} value={srv}>
                {srv}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rev-date" className="text-[10px] uppercase tracking-[0.2em] text-brand-accent font-semibold block mb-2 font-heading">
            Event Date or Season (optional)
          </label>
          <input
            type="text"
            id="rev-date"
            name="eventDate"
            maxLength={80}
            placeholder="e.g. October 2026 / Winter 2026"
            className="w-full bg-[#050507]/80 border border-brand-accent/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent/60 transition-colors"
          />
        </div>
      </div>

      {/* Headline */}
      <div>
        <label htmlFor="rev-headline" className="text-[10px] uppercase tracking-[0.2em] text-brand-accent font-semibold block mb-2 font-heading">
          Review Headline (optional)
        </label>
        <input
          type="text"
          id="rev-headline"
          name="headline"
          maxLength={160}
          placeholder="e.g. 'Unrivalled production quality at our Victoria Falls conference'"
          className="w-full bg-[#050507]/80 border border-brand-accent/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent/60 transition-colors"
        />
      </div>

      {/* Review Content */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="rev-content" className="text-[10px] uppercase tracking-[0.2em] text-brand-accent font-semibold font-heading">
            Your Review / Testimonial Story <span className="text-red-400">*</span>
          </label>
          <span className="text-[10px] text-zinc-500 font-mono">
            {contentLength} / 2000
          </span>
        </div>
        <textarea
          id="rev-content"
          name="content"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          onChange={(e) => setContentLength(e.target.value.length)}
          placeholder="Describe your journey working with Mosi Media Solutions — the setup, production quality, reliability, and how our team elevated your vision..."
          className="w-full bg-[#050507]/80 border border-brand-accent/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent/60 transition-colors resize-y"
        />
      </div>

      {/* Consent Checkbox */}
      <div className="flex items-start gap-3 bg-[#121218]/60 border border-brand-accent/15 rounded-xl p-4">
        <input
          type="checkbox"
          id="rev-consent"
          name="consent"
          required
          defaultChecked
          className="mt-0.5 rounded border-brand-accent/30 bg-[#050507] text-brand-primary focus:ring-brand-accent cursor-pointer"
        />
        <label htmlFor="rev-consent" className="text-xs text-brand-foreground/80 leading-relaxed cursor-pointer select-none">
          I confirm that this review represents my genuine experience and I grant Mosi Media Solutions permission to publish it on their website, client testimonials, and marketing showcases.
        </label>
      </div>

      {/* Honeypot Anti-Spam Field */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {/* Error Alert */}
      {error && (
        <div role="alert" className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="mms-button px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer disabled:opacity-50"
        >
          <span className="relative z-10 flex items-center gap-2">
            {loading ? "Submitting Review..." : "Submit Review"}
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>

        <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-brand-accent/70" />
          <span>Verified client submissions are moderated for authenticity</span>
        </div>
      </div>
    </form>
  );
}
