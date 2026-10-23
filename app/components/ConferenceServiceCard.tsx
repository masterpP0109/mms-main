"use client";
import React from "react";

export default function ConferenceServiceCard({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-brand-accent/12">
      <h4 className="font-semibold text-lg text-white mb-2">{title}</h4>
      <div className="text-sm text-brand-foreground/80">{children}</div>
    </div>
  );
}
