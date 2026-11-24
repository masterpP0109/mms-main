"use client";

import React from "react";
import Image from "next/image";

interface PartnerLogo {
  src: string;
  alt: string;
  name: string;
}

const PARTNER_LOGOS: PartnerLogo[] = [
  {
    name: "Victoria Falls Hotel",
    alt: "Victoria Falls Hotel Logo",
    src: "/mms/mms/logo/A.VFH_.logo_.png",
  },
  {
    name: "AISA",
    alt: "AISA Logo",
    src: "/mms/mms/logo/AISA_UpdatedColor_Jul22.webp",
  },
  {
    name: "Capital Foods",
    alt: "Capital Foods Logo",
    src: "/mms/mms/logo/capital-foods-logo-160.png",
  },
  {
    name: "Client Partner",
    alt: "Partner Logo",
    src: "/mms/mms/logo/images%20(2).jpg",
  },
  {
    name: "Partner Organization",
    alt: "Partner Logo",
    src: "/mms/mms/logo/logo%20(3).png",
  },
  {
    name: "LRTI",
    alt: "LRTI Logo",
    src: "/mms/mms/logo/LRTI-logo-Updated-Red-PNG-mine%20(1).png",
  },
  {
    name: "Stanbic Bank",
    alt: "Stanbic Bank Logo",
    src: "/mms/mms/logo/New-Stanbic-Bank-Logo.jpg",
  },
  {
    name: "SUG Zimbabwe",
    alt: "SUG Zimbabwe Logo",
    src: "/mms/mms/logo/SUG_Zimbabwe_Transparent_Logo.png",
  },
  {
    name: "TAC",
    alt: "TAC Logo",
    src: "/mms/mms/logo/TAC-logo.png",
  },
  {
    name: "ZB Financial Holdings",
    alt: "ZB Financial Holdings Logo",
    src: "/mms/mms/logo/zbfinancialholdings_logo.jpg",
  },
];

export default function LogoMarquee() {
  return (
    <section
      aria-label="Our Clients and Partners"
      className="relative w-full py-12 md:py-16 bg-[#fafafa] border-t border-b border-[#050507]/10 overflow-hidden select-none"
    >
      <div className="max-w-[1600px] mx-auto mms-wide-gutter mb-10 text-center">
        <span className="text-[12px] md:text-sm tracking-[0.35em] text-[#7f141f] uppercase font-semibold block font-heading">
          Trusted By Industry Leaders &amp; Partners
        </span>
      </div>

      {/* Marquee viewport container with edge fade masks */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left & Right gradient edge fades for smooth entry/exit */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-36 md:w-56 bg-gradient-to-r from-[#fafafa] to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-36 md:w-56 bg-gradient-to-l from-[#fafafa] to-transparent z-10"
        />

        {/* The scrolling ribbon: moves left-to-right via CSS keyframe translate */}
        <div className="marquee-wrapper flex w-max">
          {/* Repeating identical logo sets. Translating by -50% to 0% creates an infinite seamless left-to-right loop */}
          {[0, 1].map((copyIndex) => (
            <div
              key={copyIndex}
              aria-hidden={copyIndex > 0 ? "true" : undefined}
              className="marquee-track flex items-center shrink-0 justify-around gap-12 sm:gap-16 md:gap-24 lg:gap-28 px-6 sm:px-10 md:px-14"
            >
              {PARTNER_LOGOS.map((logo, idx) => (
                <div
                  key={`${copyIndex}-${idx}-${logo.name}`}
                  className="flex items-center justify-center shrink-0 h-24 sm:h-28 md:h-32 transition-transform duration-300 hover:scale-105"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={320}
                    height={140}
                    className="max-h-20 sm:max-h-24 md:max-h-28 w-auto max-w-[200px] sm:max-w-[240px] md:max-w-[280px] object-contain transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-wrapper {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: marquee-left-to-right 38s linear infinite;
        }

        .marquee-wrapper:hover {
          animation-play-state: paused;
        }

        @keyframes marquee-left-to-right {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-wrapper {
            animation: none;
            transform: none;
            width: 100%;
            overflow-x: auto;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
