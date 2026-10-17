"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Users, Heart, Briefcase, Award, ChevronLeft, ChevronRight, Megaphone, Palette } from "lucide-react";
import { submitEnquiry } from "@/lib/submit-enquiry";
import { projectBriefRows, projectBriefWhatsAppUrl } from "@/lib/project-brief";

export default function ProjectBriefBuilder() {
  const [builderStep, setBuilderStep] = useState(0);
  const [builderLoading, setBuilderLoading] = useState(false);
  const [builderWebsite, setBuilderWebsite] = useState("");
  const [builderError, setBuilderError] = useState<string | null>(null);
  const [builderSubmitted, setBuilderSubmitted] = useState(false);
  const [builderData, setBuilderData] = useState({
    goal: "",
    audience: "",
    timeline: "",
    name: "",
    email: "",
    phone: "",
    details: ""
  });
  return (
          <section style={{ opacity: 1, visibility: "visible" }} id="builder" className="py-16 md:py-24 max-w-6xl mx-auto mms-gutter relative">


        <div data-reveal="scale" className="bg-[#050507] rounded-3xl border border-[#c5a880]/10 p-5 sm:p-8 md:p-10">
          {/* Step Progress Indicator */}
          <div className="builder-progress flex items-center justify-between gap-2 mb-6 max-w-md mx-auto">
            {["Goal", "Audience", "Timeline", "Contact", "Review"].map((label, idx) => {
              const stepNum = idx + 1;
              const isActive = builderStep === idx;
              const isDone = builderStep > idx;
              return (
                <div key={label} aria-current={isActive ? "step" : undefined} aria-label={`${label}, step ${stepNum}`} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-[#c5a880] text-[#050507] scale-110"
                        : isDone
                        ? "bg-[#c5a880]/30 text-[#c5a880]"
                        : "bg-[#c5a880]/10 text-[#f4ebd0]/40"
                    }`}
                  >
                    {isDone ? "✓" : stepNum}
                  </div>
                  <span className={`text-xs uppercase tracking-widest mt-1.5 font-heading ${
                    isActive ? "text-[#c5a880]" : isDone ? "text-[#c5a880]/60" : "text-[#f4ebd0]/30"
                  }`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm text-[#c5a880] mb-6 sm:hidden" aria-live="polite">Step {builderStep + 1} of 5: {["Goal", "Audience", "Timeline", "Contact", "Review"][builderStep]}</p>
          {/* Step 1: Goal Selection */}
          {builderStep === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-white font-heading">What type of project are you planning?</h3>
                <p className="text-base text-[#f4ebd0]/60 mt-2">Select the option that best describes your needs</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "wedding", label: "Wedding Film", desc: "Cinematic wedding coverage & elopements", icon: Heart },
                  { id: "corporate", label: "Corporate Event", desc: "Conferences, summits & live productions", icon: Briefcase },
                  { id: "brand", label: "Brand Campaign", desc: "Advertisements, motion & brand storytelling", icon: Palette },
                  { id: "content", label: "Content Package", desc: "Social content, podcasts & digital assets", icon: Megaphone },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    aria-pressed={builderData.goal === opt.id}
                    onClick={() => setBuilderData({ ...builderData, goal: opt.id })}
                    className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                      builderData.goal === opt.id
                        ? "border-[#c5a880] bg-[#c5a880]/10 shadow-[0_0_20px_rgba(197,168,128,0.1)]"
                        : "border-[#c5a880]/15 bg-[#050507]/50 hover:border-[#c5a880]/40"
                    }`}
                  >
                    <div className="grow text-left">
                      <h4 className="text-sm font-medium text-white">{opt.label}</h4>
                      <p className="text-xs text-[#f4ebd0]/70 mt-1">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Audience / Event Type */}
          {builderStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-white font-heading">Tell us about your event or audience</h3>
                <p className="text-base text-[#f4ebd0]/60 mt-2">This helps us tailor the creative approach</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "intimate", label: "Intimate Gathering", desc: "Small group, personal celebration" },
                  { id: "large-event", label: "Large Event", desc: "100+ guests, multi-camera setup" },
                  { id: "corporate-audience", label: "Corporate Audience", desc: "Stakeholders, partners, press" },
                  { id: "digital-first", label: "Digital-First", desc: "Content made for screens & social" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    aria-pressed={builderData.audience === opt.id}
                    onClick={() => setBuilderData({ ...builderData, audience: opt.id })}
                    className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                      builderData.audience === opt.id
                        ? "border-[#c5a880] bg-[#c5a880]/10 shadow-[0_0_20px_rgba(197,168,128,0.1)]"
                        : "border-[#c5a880]/15 bg-[#050507]/50 hover:border-[#c5a880]/40"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#c5a880]/15 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-[#c5a880]" />
                    </div>
                    <div className="grow text-left">
                      <h4 className="text-sm font-medium text-white">{opt.label}</h4>
                      <p className="text-xs text-[#f4ebd0]/70 mt-1">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Timeline */}
          {builderStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-white font-heading">What&apos;s your timeline?</h3>
                <p className="text-base text-[#f4ebd0]/60 mt-2">We work with all timelines, from urgent to flexible</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "urgent", label: "Urgent", desc: "Within 2 weeks", days: "ASAP" },
                  { id: "soon", label: "Soon", desc: "1–3 months out", days: "Medium" },
                  { id: "planned", label: "Planning Ahead", desc: "3–6 months out", days: "Comfortable" },
                  { id: "flexible", label: "Just Exploring", desc: "No fixed date yet", days: "Flexible" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    aria-pressed={builderData.timeline === opt.id}
                    onClick={() => setBuilderData({ ...builderData, timeline: opt.id })}
                    className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                      builderData.timeline === opt.id
                        ? "border-[#c5a880] bg-[#c5a880]/10 shadow-[0_0_20px_rgba(197,168,128,0.1)]"
                        : "border-[#c5a880]/15 bg-[#050507]/50 hover:border-[#c5a880]/40"
                    }`}
                  >
                    <div className="min-w-16 min-h-10 px-2 rounded-full bg-[#c5a880]/15 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-[#c5a880]">{opt.days}</span>
                    </div>
                    <div>
                      <span className="text-base font-medium text-white block">{opt.label}</span>
                      <span className="text-sm text-[#f4ebd0]/60 mt-1 block">{opt.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Contact Capture */}
          {builderStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 max-w-lg mx-auto"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-white font-heading">Where should we send your custom quote?</h3>
                <p className="text-base text-[#f4ebd0]/60 mt-2">We&apos;ll respond within 24 hours</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="builder-name" className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold block mb-2">Your Name</label>
                  <input
                    type="text"
                    id="builder-name"
                    name="name"
                    autoComplete="name"
                    value={builderData.name}
                    onChange={(e) => setBuilderData({ ...builderData, name: e.target.value })}
                    placeholder="e.g. Sarah Johnson"
                    className="w-full bg-[#050507]/70 border border-[#c5a880]/20 rounded-xl px-4 py-3 text-base text-white placeholder:text-[#f4ebd0]/30 focus:outline-none focus:border-[#c5a880]/50 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="builder-email" className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold block mb-2">Email Address</label>
                  <input
                    type="email"
                    id="builder-email"
                    name="email"
                    autoComplete="email"
                    value={builderData.email}
                    onChange={(e) => setBuilderData({ ...builderData, email: e.target.value })}
                    placeholder="e.g. sarah@example.com"
                    className="w-full bg-[#050507]/70 border border-[#c5a880]/20 rounded-xl px-4 py-3 text-base text-white placeholder:text-[#f4ebd0]/30 focus:outline-none focus:border-[#c5a880]/50 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="builder-phone" className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold block mb-2">Phone (optional)</label>
                  <input
                    type="tel"
                    id="builder-phone"
                    name="phone"
                    autoComplete="tel"
                    value={builderData.phone}
                    onChange={(e) => setBuilderData({ ...builderData, phone: e.target.value })}
                    placeholder="e.g. +1 234 567 890"
                    className="w-full bg-[#050507]/70 border border-[#c5a880]/20 rounded-xl px-4 py-3 text-base text-white placeholder:text-[#f4ebd0]/30 focus:outline-none focus:border-[#c5a880]/50 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="builder-details" className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold block mb-2">Project Details</label>
                  <textarea
                    id="builder-details"
                    name="details"
                    value={builderData.details}
                    onChange={(e) => setBuilderData({ ...builderData, details: e.target.value })}
                    placeholder="Tell us about your vision, location, guest count, or any special requirements..."
                    rows={3}
                    className="w-full bg-[#050507]/70 border border-[#c5a880]/20 rounded-xl px-4 py-3 text-base text-white placeholder:text-[#f4ebd0]/30 focus:outline-none focus:border-[#c5a880]/50 transition-colors resize-y"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Summary & Quote-Ready CTA */}
          {builderStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 max-w-lg mx-auto"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#c5a880]/15 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-[#c5a880]" />
                </div>
                <h3 className="text-2xl font-semibold text-white font-heading">Your Brief Is Ready</h3>
                <p className="text-base text-[#f4ebd0]/60 mt-2">Review your selections below. We&apos;ll create a custom quote based on your brief.</p>
              </div>

                <div className="space-y-3">
                {projectBriefRows(builderData).map((item) => (
                  <div key={item.label} className="flex flex-col sm:flex-row gap-2 justify-between sm:items-center py-2 border-b border-[#c5a880]/10">
                    <span className="text-xs uppercase tracking-widest text-[#c5a880]/70 font-semibold">{item.label}</span>
                    <span className="text-base text-white font-medium text-left sm:text-right sm:max-w-[60%] whitespace-pre-wrap break-words min-w-0">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <a
                  href={projectBriefWhatsAppUrl(builderData)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 mb-3 rounded-full bg-[#25d366] text-[#050507] font-bold text-sm hover:brightness-110 transition-all"
                >
                  <MessageSquare className="w-5 h-5" /> Send My Brief on WhatsApp
                </a>
                <p className="text-sm text-[#f4ebd0]/60 mb-5">Opens WhatsApp to 0788 111 391 with your full brief. Press Send in WhatsApp to request your quote.</p>
                <button
                  onClick={async () => {
                    setBuilderError(null);
                    setBuilderLoading(true);
                    try {
                      await submitEnquiry("/api/leads", { ...builderData, website: builderWebsite });
                      setBuilderSubmitted(true);
                    } catch {
                      setBuilderError("We couldn't send your enquiry right now. Please try again or contact Mosi Media Solutions directly.");
                    } finally {
                      setBuilderLoading(false);
                    }
                  }}
                  disabled={!builderData.name || !builderData.email || builderLoading || builderSubmitted}
                  data-lead-cta
                  className="inline-flex items-center justify-center px-8 py-3.5 text-sm uppercase tracking-widest bg-gradient-to-r from-[#b48a3d] to-[#c5a880] text-[#050507] font-bold rounded-full hover:brightness-110 hover:shadow-lg hover:shadow-[#b48a3d]/20 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {builderSubmitted ? "Brief Saved — Thank You" : builderLoading ? "Sending…" : "Send My Brief & Get a Free Quote"}
                </button>
                {builderSubmitted && <p role="status" className="text-sm text-[#f4ebd0]/60 mt-3">Thank you. Your enquiry has been saved for the Mosi Media Solutions team. We&apos;ll get back to you shortly.</p>}
                <input aria-hidden="true" tabIndex={-1} autoComplete="off" name="website" className="hidden" value={builderWebsite} onChange={(event) => setBuilderWebsite(event.target.value)} />
                {builderError && <p role="alert" className="text-sm text-red-400 mt-3">{builderError}</p>}
                <p className="text-sm text-[#f4ebd0]/40 mt-3">We respect your privacy. No spam, ever.</p>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="builder-actions flex flex-wrap gap-3 items-center justify-between mt-8 pt-6 border-t border-[#c5a880]/10">
            <button
              onClick={() => setBuilderStep((prev) => Math.max(0, prev - 1))}
              disabled={builderStep === 0}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#f4ebd0]/50 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex flex-wrap items-center gap-3">
              {builderStep < 4 && (
                <button
                  onClick={() => {
                    // Validate current step before proceeding
                    if (builderStep === 0 && !builderData.goal) return;
                    if (builderStep === 1 && !builderData.audience) return;
                    if (builderStep === 2 && !builderData.timeline) return;
                    if (builderStep === 3 && (!builderData.name || !builderData.email)) return;
                    setBuilderStep((prev) => Math.min(4, prev + 1));
                  }}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest bg-[#c5a880] text-[#050507] px-5 py-3 rounded-full font-semibold hover:brightness-110 transition-all duration-300 cursor-pointer"
                >
                  {builderStep === 3 ? "Review Brief" : "Continue"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              {builderStep > 0 && builderStep < 5 && (
                <button
                  onClick={() => {
                    setBuilderStep(0);
                    setBuilderSubmitted(false);
                    setBuilderError(null);
                    setBuilderData({ goal: "", audience: "", timeline: "", name: "", email: "", phone: "", details: "" });
                  }}
                  className="text-xs uppercase tracking-widest text-[#f4ebd0]/40 hover:text-[#f4ebd0]/70 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
  );
}
