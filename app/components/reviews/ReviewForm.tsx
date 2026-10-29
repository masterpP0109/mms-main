"use client";

import React, { useState } from "react";
import Link from "next/link";
import StarRating from "./StarRating";

const MMS_SERVICES = [
  "Videography",
  "Live Streaming",
  "Photography",
  "Drone Services",
  "Podcast Production",
  "DJ & Lighting",
  "360 Photo Booth",
  "Special Effects",
  "LED Screens & Display",
  "Conference & Interpretation Systems",
  "Audio Solutions",
  "Other",
];

const RECOMMEND_OPTIONS = ["Yes", "Maybe", "No"] as const;

const PERMISSION_OPTIONS = [
  { id: "yes", label: "Yes, I give permission.", value: true },
  { id: "no", label: "No, please keep my feedback private.", value: false },
] as const;

const ATTRIBUTION_OPTIONS = [
  "My name and organisation",
  "My name only",
  "Organisation only (subject to authorisation)",
  "Anonymous client",
] as const;

interface ReviewFormProps {
  defaultService?: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ defaultService = "", onSuccess }: ReviewFormProps) {
  const [page, setPage] = useState<number>(1);

  // Form State matching Tally X5xb0e
  // Section 1: About You
  const [name, setName] = useState<string>("");
  const [organisation, setOrganisation] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>(
    defaultService ? [defaultService] : []
  );

  // Section 2: Your Experience
  const [rating, setRating] = useState<number>(5);
  const [stoodOut, setStoodOut] = useState<string>("");
  const [contribution, setContribution] = useState<string>("");
  const [improvements, setImprovements] = useState<string>("");
  const [wouldRecommend, setWouldRecommend] = useState<"Yes" | "Maybe" | "No">("Yes");

  // Section 3: Share Your Experience
  const [headline, setHeadline] = useState<string>("");
  const [permissionToFeature, setPermissionToFeature] = useState<boolean>(true);
  const [attribution, setAttribution] = useState<
    | "My name and organisation"
    | "My name only"
    | "Organisation only (subject to authorisation)"
    | "Anonymous client"
  >("My name and organisation");

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [reference, setReference] = useState<string>("");

  const toggleService = (srv: string) => {
    setSelectedServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const validatePage1 = () => {
    if (!name.trim()) return "Please enter your full name.";
    if (!organisation.trim()) return "Please enter your company or organisation.";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email address.";
    if (selectedServices.length === 0) return "Please select at least one service provided by MMS.";
    return null;
  };

  const validatePage2 = () => {
    if (rating < 1 || rating > 5) return "Please choose an overall rating.";
    if (!stoodOut.trim() || stoodOut.trim().length < 5) return "Please tell us what stood out most about working with our team.";
    return null;
  };

  const validatePage3 = () => {
    if (!headline.trim() || headline.trim().length < 5) {
      return "Please share a few words describing your experience with MMS.";
    }
    return null;
  };

  const handleNext = () => {
    setError(null);
    if (page === 1) {
      const err = validatePage1();
      if (err) {
        setError(err);
        return;
      }
      setPage(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (page === 2) {
      const err = validatePage2();
      if (err) {
        setError(err);
        return;
      }
      setPage(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setError(null);
    setPage((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);

    const err = validatePage3();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);

    const payload = {
      name: name.trim(),
      organisation: organisation.trim(),
      email: email.trim(),
      services: selectedServices,
      rating,
      stoodOut: stoodOut.trim(),
      contribution: contribution.trim() || undefined,
      improvements: improvements.trim() || undefined,
      wouldRecommend,
      headline: headline.trim(),
      consent: permissionToFeature,
      attribution,
    };

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Unable to submit your review. Please try again.");
      }

      setReference(resData.reference || `REV-${resData.submissionId?.slice(-6).toUpperCase()}`);
      setSubmitted(true);
      onSuccess?.();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please check your submission.");
    } finally {
      setLoading(false);
    }
  };

  // Thank You Page (matching Tally completion screen)
  if (submitted) {
    return (
      <div
        role="status"
        className="w-full bg-[#0b0b0f] border border-brand-accent/25 rounded-3xl p-8 sm:p-14 text-center space-y-7 shadow-2xl relative overflow-hidden backdrop-blur-xl animate-in fade-in duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/15 via-transparent to-brand-accent/10 pointer-events-none" />

        <div className="space-y-3 relative z-10 max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-brand-accent font-semibold font-heading block">
            Submission Confirmed
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading leading-tight">
            Thank You for Sharing Your Experience!
          </h2>
          <p className="text-sm sm:text-base text-brand-foreground/80 font-light leading-relaxed">
            Your feedback means a great deal to us. Every insight helps us refine our work and continue creating exceptional experiences.
          </p>
          <div className="pt-2">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/30 border border-brand-accent/30 text-brand-accent text-xs font-mono font-medium">
              Reference: {reference}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-light pt-2">
            We look forward to being part of your next success story.
          </p>
          <p className="text-sm font-semibold text-white tracking-wide font-heading pt-1">
            Mosi Media Solutions — Bringing Every Moment to Life.
          </p>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-4 relative z-10">
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setPage(1);
              setName("");
              setEmail("");
              setHeadline("");
              setStoodOut("");
              setContribution("");
              setImprovements("");
            }}
            className="text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-full border border-brand-accent/30 text-brand-foreground hover:bg-brand-accent/10 transition-colors cursor-pointer"
          >
            Submit Another Response
          </button>
          <Link
            href="/"
            className="mms-button px-7 py-3 text-xs uppercase tracking-[0.2em] font-semibold"
          >
            <span className="relative z-10">Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0b0b0f]/95 border border-brand-accent/20 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl backdrop-blur-2xl relative transition-all">
      {/* Form Title & Tally Header */}
      <div className="space-y-4 pb-6 border-b border-brand-accent/15">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em] text-brand-accent font-semibold font-heading">
            Client Feedback
          </span>

          {/* Progress Indicator */}
          <div className="text-right">
            <span className="text-xs text-brand-accent font-medium font-mono">
              Page {page} of 3
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-300"
            style={{ width: `${(page / 3) * 100}%` }}
          />
        </div>

        <div className="space-y-2 pt-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-heading leading-tight">
            Your Experience Matters | Mosi Media Solutions
          </h1>
          <p className="text-xs sm:text-sm text-brand-foreground/75 font-light leading-relaxed">
            Every successful event tells a story, and we&apos;re grateful to have been part of yours.
            At Mosi Media Solutions, we believe that exceptional service is built through collaboration, attention to detail and continuous improvement.
          </p>
          <p className="text-[11px] text-zinc-400 font-light pt-1">
            Takes approximately 2 minutes to complete.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="pt-6 space-y-8">
        {/* ================= PAGE 1: SECTION 1 - ABOUT YOU ================= */}
        {page === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-brand-accent/10 pb-2">
              <h2 className="text-lg sm:text-xl font-semibold text-white font-heading">
                Section 1: About You
              </h2>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="tally-name" className="text-xs uppercase tracking-[0.15em] text-brand-accent font-semibold block font-heading">
                Your Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="tally-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full bg-[#050507] border border-brand-accent/25 rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
              />
            </div>

            {/* Company / Organisation */}
            <div className="space-y-2">
              <label htmlFor="tally-org" className="text-xs uppercase tracking-[0.15em] text-brand-accent font-semibold block font-heading">
                Company / Organisation <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="tally-org"
                value={organisation}
                onChange={(e) => setOrganisation(e.target.value)}
                placeholder="Enter your company or organisation name"
                required
                className="w-full bg-[#050507] border border-brand-accent/25 rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label htmlFor="tally-email" className="text-xs uppercase tracking-[0.15em] text-brand-accent font-semibold block font-heading">
                Your Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="tally-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-[#050507] border border-brand-accent/25 rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
              />
            </div>

            {/* Services Multi-Select */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.15em] text-brand-accent font-semibold block font-heading">
                Which service(s) did MMS provide? <span className="text-red-400">*</span>
              </label>
              <p className="text-[11px] text-zinc-400 font-light">
                Select all that apply to your event or production:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                {MMS_SERVICES.map((srv) => {
                  const isSelected = selectedServices.includes(srv);
                  return (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => toggleService(srv)}
                      className={`px-4 py-3 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-brand-primary/50 border-brand-accent text-white shadow-md shadow-brand-primary/20"
                          : "bg-[#050507]/60 border-brand-accent/15 text-zinc-400 hover:border-brand-accent/40 hover:text-white"
                      }`}
                    >
                      {srv}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 2: SECTION 2 - YOUR EXPERIENCE ================= */}
        {page === 2 && (
          <div className="space-y-7 animate-in fade-in duration-200">
            <div className="border-b border-brand-accent/10 pb-2">
              <h2 className="text-lg sm:text-xl font-semibold text-white font-heading">
                Section 2: Your Experience
              </h2>
            </div>

            {/* Overall Rating */}
            <div className="space-y-3 bg-[#121218] border border-brand-accent/15 rounded-2xl p-5">
              <label className="text-xs uppercase tracking-[0.15em] text-brand-accent font-semibold block font-heading">
                Overall, how would you rate your experience with Mosi Media Solutions? <span className="text-red-400">*</span>
              </label>
              <StarRating value={rating} onChange={setRating} interactive size="lg" showLabel />
            </div>

            {/* What stood out most */}
            <div className="space-y-2">
              <label htmlFor="tally-stoodout" className="text-xs uppercase tracking-[0.15em] text-brand-accent font-semibold block font-heading">
                What stood out most about working with our team? <span className="text-red-400">*</span>
              </label>
              <textarea
                id="tally-stoodout"
                rows={4}
                value={stoodOut}
                onChange={(e) => setStoodOut(e.target.value)}
                placeholder="Perhaps it was our professionalism, communication, technical execution or the overall experience..."
                required
                className="w-full bg-[#050507] border border-brand-accent/25 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all resize-y"
              />
            </div>

            {/* How services contributed */}
            <div className="space-y-2">
              <label htmlFor="tally-contribution" className="text-xs uppercase tracking-[0.15em] text-brand-accent font-semibold block font-heading">
                How did our services contribute to the success of your event or project?
              </label>
              <textarea
                id="tally-contribution"
                rows={3}
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
                placeholder="Tell us about the difference our team made..."
                className="w-full bg-[#050507] border border-brand-accent/25 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all resize-y"
              />
            </div>

            {/* Anything we could have done better */}
            <div className="space-y-2">
              <label htmlFor="tally-improvements" className="text-xs uppercase tracking-[0.15em] text-brand-accent font-semibold block font-heading">
                Is there anything we could have done better?
              </label>
              <textarea
                id="tally-improvements"
                rows={3}
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                placeholder="Help us improve by sharing your constructive feedback..."
                className="w-full bg-[#050507] border border-brand-accent/25 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all resize-y"
              />
            </div>

            {/* Would you recommend */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.15em] text-brand-accent font-semibold block font-heading">
                Would you recommend Mosi Media Solutions to another organisation or individual? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {RECOMMEND_OPTIONS.map((opt, idx) => {
                  const isSelected = wouldRecommend === opt;
                  const letter = String.fromCharCode(65 + idx); // A, B, C
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setWouldRecommend(opt)}
                      className={`p-3.5 rounded-xl border text-sm font-medium flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-brand-primary/50 border-brand-accent text-white shadow-md shadow-brand-primary/20"
                          : "bg-[#050507] border-brand-accent/15 text-zinc-400 hover:border-brand-accent/40 hover:text-white"
                      }`}
                    >
                      <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-brand-accent">
                        {letter}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 3: SECTION 3 - SHARE YOUR EXPERIENCE ================= */}
        {page === 3 && (
          <div className="space-y-7 animate-in fade-in duration-200">
            <div className="border-b border-brand-accent/10 pb-2">
              <h2 className="text-lg sm:text-xl font-semibold text-white font-heading">
                Section 3: Share Your Experience
              </h2>
              <p className="text-xs text-zinc-400 font-light mt-1">
                Your experience may help others make a confident decision when choosing an event and media production partner.
              </p>
            </div>

            {/* Recommendation in a few words */}
            <div className="space-y-2">
              <label htmlFor="tally-headline" className="text-xs uppercase tracking-[0.15em] text-brand-accent font-semibold block font-heading">
                In a few words, how would you describe your experience with Mosi Media Solutions to someone considering our services? <span className="text-red-400">*</span>
              </label>
              <textarea
                id="tally-headline"
                rows={4}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="A short, genuine recommendation in your own words..."
                required
                className="w-full bg-[#050507] border border-brand-accent/25 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all resize-y"
              />
            </div>

            {/* Permission to feature */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.15em] text-brand-accent font-semibold block font-heading">
                May we feature your testimonial on our website or other MMS marketing materials? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PERMISSION_OPTIONS.map((opt, idx) => {
                  const isSelected = permissionToFeature === opt.value;
                  const letter = String.fromCharCode(65 + idx); // A, B
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPermissionToFeature(opt.value)}
                      className={`p-3.5 rounded-xl border text-sm font-medium flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-brand-primary/50 border-brand-accent text-white shadow-md shadow-brand-primary/20"
                          : "bg-[#050507] border-brand-accent/15 text-zinc-400 hover:border-brand-accent/40 hover:text-white"
                      }`}
                    >
                      <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-brand-accent">
                        {letter}
                      </span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conditional: Attribution Preference (if permission is granted) */}
            {permissionToFeature && (
              <div className="space-y-4 p-5 bg-[#121218] border border-brand-accent/15 rounded-2xl animate-in fade-in duration-200">
                <label className="text-xs uppercase tracking-[0.15em] text-brand-accent font-semibold block font-heading">
                  How would you prefer to be identified? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ATTRIBUTION_OPTIONS.map((attr, idx) => {
                    const isSelected = attribution === attr;
                    const letter = String.fromCharCode(65 + idx);
                    return (
                      <button
                        key={attr}
                        type="button"
                        onClick={() => setAttribution(attr)}
                        className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-brand-primary/50 border-brand-accent text-white"
                            : "bg-[#050507] border-brand-accent/15 text-zinc-400 hover:border-brand-accent/30 hover:text-white"
                        }`}
                      >
                        <span className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[10px] font-mono font-bold text-brand-accent">
                          {letter}
                        </span>
                        <span>{attr}</span>
                      </button>
                    );
                  })}
                </div>

                <p className="text-[11px] text-zinc-400 italic leading-relaxed pt-2 border-t border-brand-accent/10">
                  &ldquo;I authorise Mosi Media Solutions to display the testimonial I have provided on its website and marketing materials, using my selected attribution. I understand that MMS may correct minor spelling or grammatical errors without changing the meaning of my words.&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div role="alert" className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs">
            {error}
          </div>
        )}

        {/* Navigation & Submit Buttons (Clean Text - No Icon Clutter) */}
        <div className="flex items-center justify-between pt-4 border-t border-brand-accent/15">
          {page > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2.5 rounded-full border border-zinc-700 text-zinc-300 hover:text-white text-xs font-medium hover:bg-white/5 transition-colors cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {page < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="mms-button px-8 py-3 text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer"
            >
              <span className="relative z-10">Next</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="mms-button px-9 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer disabled:opacity-50"
            >
              <span className="relative z-10">
                {loading ? "Submitting..." : "Submit Review"}
              </span>
            </button>
          )}
        </div>

        <div className="text-center text-zinc-500 text-[11px] pt-1 font-light">
          Responses are securely recorded and reviewed by the MMS executive team
        </div>
      </form>
    </div>
  );
}
