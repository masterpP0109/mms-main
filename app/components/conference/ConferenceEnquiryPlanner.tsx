"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { submitEnquiry, enquiryErrorMessage } from "@/lib/submit-enquiry";

const EVENT_TYPE_OPTIONS = [
  "International Conferences & Summits",
  "Corporate Meetings & Executive Retreats",
  "AGMs & Business Conferences",
  "Product Launches & Brand Activations",
  "Awards Ceremonies & Gala Dinners",
  "Exhibitions & Trade Shows",
  "Corporate Retreats & Team-Building Events",
  "Hybrid & Virtual Conferences",
  "Other",
];

const LAYOUT_OPTIONS = [
  "Theatre",
  "Classroom",
  "Boardroom",
  "U-shape",
  "Banquet",
  "Not sure yet",
];

const SERVICE_OPTIONS = [
  "Sound and microphones",
  "Screens and projection",
  "Event lighting and stage setup",
  "Simultaneous interpretation",
  "Photography",
  "Video recording",
  "Multi-camera production",
  "Live streaming",
  "Event branding",
  "Highlight video",
  "Post-event content",
  "Venue, accommodation & transfers",
];

export default function ConferenceEnquiryPlanner({
  initialEventType = "",
  initialLayout = "",
  initialServices = [],
}: {
  initialEventType?: string;
  initialLayout?: string;
  initialServices?: string[];
}) {
  const [mode, setMode] = useState<"guided" | "quick">("guided");
  const [step, setStep] = useState(1);

  const [eventType, setEventType] = useState(initialEventType);
  const [eventFormat, setEventFormat] = useState("In-person");
  const [layout, setLayout] = useState(initialLayout);
  const [delegates, setDelegates] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>(initialServices);

  const [organisation, setOrganisation] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organisationType, setOrganisationType] = useState("");
  const [details, setDetails] = useState("");
  const [website, setWebsite] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    const summaryNotes = [
      eventFormat ? `Format: ${eventFormat}` : "",
      layout ? `Preferred layout: ${layout}` : "",
      details.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    const body = {
      organisation,
      contact,
      email,
      phone,
      eventType,
      date,
      delegates,
      venue,
      organisationType,
      services: selectedServices,
      details: summaryNotes,
      website,
    };

    try {
      const result = await submitEnquiry("/api/conference-enquiry", body);
      setReference(result.reference ?? `MMS-${result.submissionId}`);
      setSubmitted(true);
    } catch (err) {
      setError(enquiryErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto bg-[#efefef] rounded-3xl border border-[#050507]/12 shadow-lg p-8 sm:p-12 text-center space-y-4">
        <CheckCircle className="w-12 h-12 text-[#7f141f] mx-auto" />
        <h3 className="text-2xl font-semibold text-[#050507] font-heading">Proposal Request Received</h3>
        <p className="text-sm text-[#050507]/85">
          Your conference enquiry has been logged under reference{" "}
          <strong className="text-[#7f141f]">{reference}</strong>. Our production team will review your requirements and respond.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setStep(1);
          }}
          className="text-xs font-semibold text-[#7f141f] hover:underline pt-2"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-[#efefef] rounded-3xl border border-[#050507]/12 shadow-lg p-5 sm:p-8 md:p-10 space-y-6">
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#050507]/10">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#7f141f] font-bold block">
            {mode === "guided" ? `Step ${step} of 4` : "Direct Form"}
          </span>
          <p className="text-sm font-semibold text-[#050507]">
            {mode === "guided" ? "Guided Event Planner" : "Quick Enquiry"}
          </p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Enquiry mode">
          <button
            type="button"
            onClick={() => setMode("guided")}
            aria-pressed={mode === "guided"}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              mode === "guided"
                ? "bg-[#981b28] text-white"
                : "bg-white text-[#050507] border border-[#050507]/15 hover:border-[#981b28]"
            }`}
          >
            Guided Planner
          </button>
          <button
            type="button"
            onClick={() => setMode("quick")}
            aria-pressed={mode === "quick"}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              mode === "quick"
                ? "bg-[#981b28] text-white"
                : "bg-white text-[#050507] border border-[#050507]/15 hover:border-[#981b28]"
            }`}
          >
            Quick Enquiry
          </button>
        </div>
      </div>

      <form aria-busy={loading} onSubmit={handleSubmit} className="space-y-6">
        {mode === "guided" && step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#050507] font-heading">What are you planning?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EVENT_TYPE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setEventType(option)}
                  aria-pressed={eventType === option}
                  className={`text-left px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-colors ${
                    eventType === option
                      ? "bg-[#981b28] text-white border-[#981b28]"
                      : "bg-white text-[#050507] border-[#050507]/15 hover:border-[#981b28]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="mms-button px-7 py-3 text-xs uppercase tracking-[0.16em] font-semibold inline-flex items-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {mode === "guided" && step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#050507] font-heading">Event requirements &amp; layout</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block text-sm font-semibold text-[#7f141f]">
                <span className="block mb-1.5">Event format</span>
                <select
                  value={eventFormat}
                  onChange={(e) => setEventFormat(e.target.value)}
                  className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm font-normal text-[#050507]"
                >
                  <option>In-person</option>
                  <option>Hybrid</option>
                  <option>Virtual</option>
                  <option>Not sure yet</option>
                </select>
              </label>
              <label className="block text-sm font-semibold text-[#7f141f]">
                <span className="block mb-1.5">Preferred room layout</span>
                <select
                  value={layout}
                  onChange={(e) => setLayout(e.target.value)}
                  className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm font-normal text-[#050507]"
                >
                  <option value="">Select a layout (optional)</option>
                  {LAYOUT_OPTIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold text-[#7f141f]">
                <span className="block mb-1.5">Expected number of delegates</span>
                <input
                  type="number"
                  min={1}
                  value={delegates}
                  onChange={(e) => setDelegates(e.target.value)}
                  placeholder="e.g. 120"
                  className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm font-normal text-[#050507]"
                />
              </label>
              <label className="block text-sm font-semibold text-[#7f141f]">
                <span className="block mb-1.5">Proposed event date</span>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Proposed event date"
                  className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm font-normal text-[#050507]"
                />
              </label>
              <label className="block md:col-span-2 text-sm font-semibold text-[#7f141f]">
                <span className="block mb-1.5">Venue or location</span>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Venue or destination (or Not sure yet)"
                  className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm font-normal text-[#050507]"
                />
              </label>
            </div>
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#050507]/80 hover:text-[#7f141f]"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="mms-button px-7 py-3 text-xs uppercase tracking-[0.16em] font-semibold inline-flex items-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {mode === "guided" && step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-[#050507] font-heading">Services &amp; equipment</h3>
              <p className="text-xs text-[#050507]/75 mt-1">
                Select what you think you may need — or skip this step and our team will guide you.
              </p>
            </div>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2">
              {SERVICE_OPTIONS.map((s) => (
                <label
                  key={s}
                  className="inline-flex items-center gap-2 p-3 bg-white border border-[#050507]/15 rounded-xl cursor-pointer hover:border-[#7f141f]/45 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(s)}
                    onChange={() => toggleService(s)}
                    className="accent-[#981b28]"
                  />
                  <span className="text-xs text-[#050507] font-medium">{s}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#050507]/80 hover:text-[#7f141f]"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="mms-button px-7 py-3 text-xs uppercase tracking-[0.16em] font-semibold inline-flex items-center gap-2"
              >
                Review &amp; Contact
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {(mode === "quick" || (mode === "guided" && step === 4)) && (
          <div className="space-y-4">
            {mode === "guided" && (
              <div className="rounded-2xl bg-white border border-[#050507]/10 p-4 text-xs text-[#050507]/85 space-y-1">
                <p className="font-semibold text-[#7f141f] uppercase tracking-wider">Your Event Brief</p>
                <p>
                  <strong>Event:</strong> {eventType || "Not specified"} · <strong>Format:</strong> {eventFormat}
                  {layout ? ` · Layout: ${layout}` : ""}
                  {delegates ? ` · Delegates: ${delegates}` : ""}
                </p>
                {selectedServices.length > 0 && (
                  <p>
                    <strong>Selected:</strong> {selectedServices.join(", ")}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block text-sm font-semibold text-[#7f141f]">
                <span className="block mb-1.5">Organisation name</span>
                <input
                  name="organisation"
                  type="text"
                  required
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  placeholder="Organisation name"
                  className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm font-normal text-[#050507]"
                />
              </label>
              <label className="block text-sm font-semibold text-[#7f141f]">
                <span className="block mb-1.5">Contact person</span>
                <input
                  name="contact"
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Contact person"
                  className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm font-normal text-[#050507]"
                />
              </label>
              <label className="block text-sm font-semibold text-[#7f141f]">
                <span className="block mb-1.5">Email address</span>
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm font-normal text-[#050507]"
                />
              </label>
              <label className="block text-sm font-semibold text-[#7f141f]">
                <span className="block mb-1.5">Phone number</span>
                <input
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm font-normal text-[#050507]"
                />
              </label>

              {mode === "quick" && (
                <>
                  <label className="block text-sm font-semibold text-[#7f141f]">
                    <span className="block mb-1.5">Type of event</span>
                    <input
                      name="eventType"
                      type="text"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      placeholder="Type of event"
                      className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm font-normal text-[#050507]"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-[#7f141f]">
                    <span className="block mb-1.5">Proposed event date</span>
                    <input
                      name="date"
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="Proposed event date"
                      className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm font-normal text-[#050507]"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-[#7f141f]">
                    <span className="block mb-1.5">Expected number of delegates</span>
                    <input
                      name="delegates"
                      type="number"
                      min={1}
                      value={delegates}
                      onChange={(e) => setDelegates(e.target.value)}
                      placeholder="Expected number of delegates"
                      className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm font-normal text-[#050507]"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-[#7f141f]">
                    <span className="block mb-1.5">Venue or location</span>
                    <input
                      name="venue"
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="Venue or location"
                      className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm font-normal text-[#050507]"
                    />
                  </label>
                </>
              )}

              <label className="block md:col-span-2 text-sm font-semibold text-[#7f141f]">
                <span className="block mb-1.5">Type of organisation</span>
                <select
                  name="organisationType"
                  value={organisationType}
                  onChange={(e) => setOrganisationType(e.target.value)}
                  className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm font-normal text-[#050507]"
                >
                  <option value="">Type of organisation</option>
                  <option>Government</option>
                  <option>International</option>
                  <option>NGO</option>
                  <option>Corporate</option>
                </select>
              </label>

              <label className="block md:col-span-2 text-sm font-semibold text-[#7f141f]">
                <span className="block mb-1.5">Additional information or specific requirements</span>
                <textarea
                  name="details"
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Additional information or specific requirements"
                  className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm font-normal text-[#050507] resize-y"
                />
              </label>
            </div>

            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              {mode === "guided" && (
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#050507]/80 hover:text-[#7f141f]"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Back
                </button>
              )}
              <button
                data-lead-cta
                type="submit"
                disabled={loading}
                className="mms-button px-8 py-3.5 text-xs uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? "Sending…" : "Request an Event Proposal"}
              </button>
              {error && (
                <span role="alert" className="text-sm font-semibold text-[#981b28]">
                  {error}
                </span>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
