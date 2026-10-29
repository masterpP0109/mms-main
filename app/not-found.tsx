import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function NotFound() {
  return <div className="min-h-screen bg-[#050507] text-brand-foreground"><Navbar />
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-6 pb-24 pt-40 space-y-6">
      <p className="text-xs uppercase tracking-widest text-brand-accent">Page not found</p>
      <h1 className="text-3xl md:text-5xl font-semibold text-white font-heading">Let&apos;s find your next step.</h1>
      <p className="text-brand-foreground/75">This page may have moved. Explore our production services or contact the MMS team about your brief.</p>
      <div className="flex flex-wrap gap-4"><Link href="/" className="mms-button px-6 py-3">Back to home</Link><Link href="/contact" className="mms-button px-6 py-3">Contact MMS</Link></div>
    </main><Footer /></div>;
}
