import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white text-[#050507] border-t border-[#050507]/10 pt-14 pb-24">
      <div className="max-w-[1600px] mx-auto mms-gutter">
        <div data-stagger className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-center md:text-left">
          {/* Brand */}
          <div className="min-[400px]:col-span-2 lg:col-span-1 space-y-4 flex flex-col items-center md:items-start">
            <div className="inline-flex items-center rounded-2xl bg-[#050507] px-4 py-2.5 shadow-sm">
              <Image src="/mms/MMS%20LOGO.png" alt="MMS Logo" width={220} height={64} className="w-[120px] sm:w-[136px] h-auto object-contain" />
            </div>
            <p className="text-sm text-[#050507]/85 leading-relaxed font-normal max-w-sm md:max-w-none">
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
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h4 className="text-xs uppercase tracking-widest text-[#7f141f] font-bold font-heading">Services</h4>
            <ul className="space-y-2 text-sm text-[#050507]/85 font-normal flex flex-col items-center md:items-start">
              <li><Link href="/conference-production" className="hover:text-[#7f141f] transition-colors">Conference Production</Link></li>
              <li><Link href="/services/drone" className="hover:text-[#7f141f] transition-colors">Drone Services</Link></li>
              <li><Link href="/packages" className="hover:text-[#7f141f] transition-colors">Signature Packages</Link></li>
              <li><Link href="/services/weddings-elopements" className="hover:text-[#7f141f] transition-colors">Weddings &amp; Elopements</Link></li>
              <li><Link href="/services" className="hover:text-[#7f141f] transition-colors">Visual Storytelling</Link></li>
              <li><Link href="/services" className="hover:text-[#7f141f] transition-colors">Event Experiences</Link></li>
              <li><Link href="/services" className="hover:text-[#7f141f] transition-colors">Cinematic Production</Link></li>
            </ul>
          </div>

          {/* Projects & Packages */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h4 className="text-xs uppercase tracking-widest text-[#7f141f] font-bold font-heading">Showcase</h4>
            <ul className="space-y-2 text-sm text-[#050507]/85 font-normal flex flex-col items-center md:items-start">
              <li><Link href="/projects" className="hover:text-[#7f141f] transition-colors">Featured Projects</Link></li>
              <li><Link href="/packages/weddings" className="hover:text-[#7f141f] transition-colors">Wedding Packages</Link></li>
              <li><Link href="/packages/drone" className="hover:text-[#7f141f] transition-colors">Drone Packages</Link></li>
              <li><Link href="/packages/podcasts" className="hover:text-[#7f141f] transition-colors">Podcast Packages</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="min-[400px]:col-span-2 lg:col-span-1 space-y-4 flex flex-col items-center md:items-start">
            <h4 className="text-xs uppercase tracking-widest text-[#7f141f] font-bold font-heading">Company</h4>
            <ul className="space-y-2 text-sm text-[#050507]/85 font-normal flex flex-col items-center md:items-start">
              <li><Link href="/about" className="hover:text-[#7f141f] transition-colors">About Us</Link></li>
              <li><Link href="/reviews" className="hover:text-[#7f141f] transition-colors">Client Reviews</Link></li>
              <li><Link href="/contact" className="hover:text-[#7f141f] transition-colors">Contact</Link></li>
              <li><Link href="/about" className="hover:text-[#7f141f] transition-colors">FAQs</Link></li>
              <li><Link href="/about" className="hover:text-[#7f141f] transition-colors">Partnerships</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#050507]/12 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left text-[11px] text-[#050507]/75 gap-4">
          <p>© {new Date().getFullYear()} Mosi Media Solutions. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6">
            <Link href="/privacy" className="hover:text-[#7f141f] transition-colors">Privacy Policy</Link>
            <a href="mailto:info@mosimediasolutions.com?subject=Terms%20of%20Service" className="hover:text-[#7f141f] transition-colors">Request Terms of Service</a>
          </div>
        </div>
      </div>
    <div className="text-center pb-6"><a href="/privacy" className="text-sm font-medium text-[#7f141f] underline">Enquiry privacy</a></div></footer>
  );
}
