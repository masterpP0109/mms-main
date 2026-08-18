"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function ConferenceProduction() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const body = Object.fromEntries(data.entries());
    try {
      const res = await fetch("/api/conference-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-[#050507] text-[#f4ebd0]">
      <header className="py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-serif">Conference production you can depend on.</h1>
        <p className="mt-4 max-w-2xl mx-auto text-[#f4ebd0]/80">MMS provides coordinated media and technical production for conferences, seminars, workshops and institutional events in Victoria Falls and beyond.</p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <a href="#enquiry" className={`${"inline-flex items-center px-5 py-3 rounded-full bg-[#b48a3d] text-[#050507] font-semibold"}`}>Request a Conference Proposal</a>
          <a href="#contact" className="inline-flex items-center px-5 py-3 rounded-full border border-[#c5a880]/20">Speak to Our Team</a>
        </div>
      </header>

      <main className="px-6 max-w-5xl mx-auto space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Types of events we support</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#f4ebd0]/80">
            {[
              "Conferences and conventions",
              "Seminars and workshops",
              "Ministerial and government meetings",
              "Stakeholder engagement sessions",
              "Training and capacity-building programmes",
              "Annual general meetings",
              "Professional association events",
              "Public health and development forums",
              "Hybrid and virtual conferences",
              "Press briefings and institutional launches",
            ].map((t) => (
              <li key={t} className="p-3 bg-black/30 rounded-md">{t}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Conference production capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-2xl">Audiovisual production</div>
            <div className="glass-panel p-4 rounded-2xl">Photography & documentation</div>
            <div className="glass-panel p-4 rounded-2xl">Multi-camera video & streaming</div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Our production process</h2>
          <ol className="list-decimal ml-6 text-[#f4ebd0]/80">
            <li className="mb-2"><strong>Consultation:</strong> Understand objectives, venue and programme.</li>
            <li className="mb-2"><strong>Production planning:</strong> Technical and staffing plan.</li>
            <li className="mb-2"><strong>Pre-event preparation:</strong> Testing and schedules.</li>
            <li className="mb-2"><strong>Event delivery:</strong> On-site management and coverage.</li>
            <li className="mb-2"><strong>Post-event delivery:</strong> Edited deliverables for reports and archives.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Who we serve</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#f4ebd0]/80">
            <div>Government ministries and departments</div>
            <div>Government agencies and public institutions</div>
            <div>United Nations and international development organisations</div>
            <div>Health organisations and development programmes</div>
            <div>NGOs and humanitarian organisations</div>
            <div>Professional institutes and associations</div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Why institutions should choose MMS</h2>
          <ul className="text-[#f4ebd0]/80 list-disc ml-6">
            <li>One coordinated production partner</li>
            <li>Professional and discreet institutional service</li>
            <li>Reliable technical preparation and clear communication</li>
            <li>High-quality visual documentation prepared for reports and archives</li>
            <li>Local Victoria Falls knowledge</li>
          </ul>
        </section>

        <section id="enquiry" className="bg-black/40 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-3">Conference enquiry</h3>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="organisation" placeholder="Organisation name" className="p-3 rounded bg-black/20" required />
              <input name="contact" placeholder="Contact person" className="p-3 rounded bg-black/20" required />
              <input type="email" name="email" placeholder="Email address" className="p-3 rounded bg-black/20" required />
              <input name="phone" placeholder="Phone number" className="p-3 rounded bg-black/20" />
              <select name="organisationType" className="p-3 rounded bg-black/20">
                <option>Type of organisation</option>
                <option>Government</option>
                <option>International</option>
                <option>NGO</option>
                <option>Corporate</option>
              </select>
              <input name="eventType" placeholder="Type of event" className="p-3 rounded bg-black/20" />
              <input name="date" placeholder="Proposed event date" className="p-3 rounded bg-black/20" />
              <input name="delegates" placeholder="Expected number of delegates" className="p-3 rounded bg-black/20" />
              <input name="venue" placeholder="Venue or location" className="p-3 rounded bg-black/20" />
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm mb-2">Required services</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Sound and microphones",
                    "Screens and projection",
                    "Photography",
                    "Video recording",
                    "Multi-camera production",
                    "Live streaming",
                    "Event branding",
                    "Speaker interviews",
                    "Highlight video",
                    "Post-event content",
                  ].map((s) => (
                    <label key={s} className="inline-flex items-center gap-2 p-2 bg-black/20 rounded">
                      <input type="checkbox" name="services" value={s} />
                      <span className="text-sm">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
              <textarea name="details" placeholder="Additional information" className="p-3 rounded bg-black/20 col-span-1 md:col-span-2" />
              <div className="col-span-1 md:col-span-2 flex items-center gap-3">
                <button type="submit" disabled={loading} className={`${"px-5 py-3 rounded bg-[#b48a3d] text-[#050507] font-semibold"}`}>
                  {loading ? "Sending…" : "Request a Conference Proposal"}
                </button>
                {error && <span className="text-sm text-red-400">{error}</span>}
              </div>
            </form>
          ) : (
            <div className="p-6 bg-black/30 rounded">Thank you — we will be in touch shortly.</div>
          )}
        </section>
      </main>
    </div>
  );
}
