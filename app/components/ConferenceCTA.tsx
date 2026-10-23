"use client";
import React from "react";

export default function ConferenceCTA({ href = "/conference-production#enquiry", children = "Plan Your Conference" }: { href?: string; children?: React.ReactNode }) {
  return (
    <a href={href} className="mms-button inline-flex items-center px-5 py-3 rounded-full font-semibold">
      {children}
    </a>
  );
}
