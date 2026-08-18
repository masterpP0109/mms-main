"use client";
import React from "react";

export default function ConferenceServiceCard({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-[#c5a880]/12">
      <h4 className="font-semibold text-lg text-white mb-2">{title}</h4>
      <div className="text-sm text-[#f4ebd0]/80">{children}</div>
    </div>
  );
}
