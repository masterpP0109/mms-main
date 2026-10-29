import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#050507] border-t border-brand-accent/15 pt-14 pb-24">
      <div className="max-w-[1600px] mx-auto mms-gutter">
        <div data-stagger className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="min-[400px]:col-span-2 lg:col-span-1 space-y-4">
            <Image src="/mms/MMS%20LOGO.png" alt="MMS Logo" width={130} height={38} className="object-contain" />
            <p className="text-sm text-brand-foreground/60 leading-relaxed font-light">
              Mosi Media Solutions is a Victoria Falls-based conference and media production company serving ministries, government agencies, international organisations and businesses.
            </p>
            <Link
              href="/conference-production#enquiry"
              data-lead-cta
              className="mms-button inline-flex items-center px-4 py-2 rounded-full font-semibold text-xs"
            >
              Planning a conference? Talk to our team.
            </Link>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-brand-accent font-semibold font-heading">Services</h4>
            <ul className="space-y-2 text-sm text-brand-foreground/60 font-light">
              <li><Link href="/conference-production" className="hover:text-white transition-colors">Conference Production</Link></li>
              <li><Link href="/services/drone" className="hover:text-white transition-colors">Drone Services</Link></li>
              <li><Link href="/packages" className="hover:text-white transition-colors">Signature Packages</Link></li>
              <li><Link href="/services/weddings-elopements" className="hover:text-white transition-colors">Weddings &amp; Elopements</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Visual Storytelling</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Event Experiences</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Cinematic Production</Link></li>
            </ul>
          </div>

          {/* Gallery */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-brand-accent font-semibold font-heading">Gallery</h4>
            <ul className="space-y-2 text-sm text-brand-foreground/60 font-light">
              <li><Link href="/gallery?cat=Wedding" className="hover:text-white transition-colors">Wedding Highlights</Link></li>
              <li><Link href="/gallery?cat=Conference" className="hover:text-white transition-colors">Corporate Keynotes</Link></li>
              <li><Link href="/gallery?cat=Drone" className="hover:text-white transition-colors">Scenic Drones</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">All Work</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-brand-accent font-semibold font-heading">Company</h4>
            <ul className="space-y-2 text-sm text-brand-foreground/60 font-light">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/reviews" className="hover:text-white transition-colors">Client Reviews</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Partnerships</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-accent/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-foreground/40 gap-4">
          <p>© {new Date().getFullYear()} Mosi Media Solutions. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6">
            <Link href="/privacy" className="hover:text-brand-accent transition-colors">Privacy Policy</Link>
            <a href="mailto:info@mosimediasolutions.com?subject=Terms%20of%20Service" className="hover:text-brand-accent transition-colors">Request Terms of Service</a>
          </div>
        </div>
      </div>
    <div className="text-center pb-6"><a href="/privacy" className="text-sm text-brand-accent underline">Enquiry privacy</a></div></footer>
  );
}
