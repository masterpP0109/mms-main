"use client";

import Link from "next/link";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function CatalogueError({ reset }: { reset: () => void }) {
  return <div className="min-h-screen bg-[#050507] text-brand-foreground"><Navbar />
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-6 pb-24 pt-40 space-y-6">
      <h1 className="text-3xl md:text-5xl font-semibold text-white font-heading">We couldn&apos;t load this collection.</h1>
      <p role="alert" className="text-brand-foreground/75">Please try again, or contact MMS to discuss your production and request relevant examples.</p>
      <div className="flex flex-wrap gap-4"><button type="button" onClick={reset} className="mms-button px-6 py-3">Try again</button><Link href="/contact" className="mms-button px-6 py-3">Contact MMS</Link></div>
    </main><Footer /></div>;
}
