"use client";
import React from "react";

export default function ConferenceCTA({ href = "/conference-production#enquiry", children = "Plan Your Conference" }: { href?: string; children?: React.ReactNode }) {
  return (
    <a href={href} className="inline-flex items-center px-5 py-3 rounded-full bg-[#b48a3d] text-[#050507] font-semibold">
      {children}
    </a>
  );
}
