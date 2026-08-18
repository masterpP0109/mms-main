import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#050507] border-t border-[#c5a880]/15 pt-14 pb-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Image src="/mmslogo.webp" alt="MMS Logo" width={130} height={38} className="object-contain" />
            <p className="text-xs text-[#f4ebd0]/60 leading-relaxed font-light">
              Mosi Media Solutions is a Victoria Falls-based conference and media production company serving ministries, government agencies, international organisations and businesses.
            </p>
            <Link
              href="/conference-production#enquiry"
              className="inline-flex items-center px-4 py-2 rounded-full bg-[#b48a3d] text-[#050507] font-semibold text-xs"
            >
              Planning a conference? Talk to our team.
            </Link>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold">Services</h4>
            <ul className="space-y-2 text-xs text-[#f4ebd0]/60 font-light">
              <li><Link href="/conference-production" className="hover:text-white transition-colors">Conference Production</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Visual Storytelling</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Event Experiences</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Cinematic Production</Link></li>
            </ul>
          </div>

          {/* Gallery */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold">Gallery</h4>
            <ul className="space-y-2 text-xs text-[#f4ebd0]/60 font-light">
              <li><Link href="/gallery?cat=Wedding" className="hover:text-white transition-colors">Wedding Highlights</Link></li>
              <li><Link href="/gallery?cat=Conference" className="hover:text-white transition-colors">Corporate Keynotes</Link></li>
              <li><Link href="/gallery?cat=Drone" className="hover:text-white transition-colors">Scenic Drones</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">All Work</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold">Company</h4>
            <ul className="space-y-2 text-xs text-[#f4ebd0]/60 font-light">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Partnerships</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#c5a880]/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#f4ebd0]/40 gap-4">
          <p>© {new Date().getFullYear()} Mosi Media Solutions. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-[#c5a880] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#c5a880] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
