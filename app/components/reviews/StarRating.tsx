"use client";

import React, { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: "1 - Poor",
  2: "2 - Below Expectations",
  3: "3 - Good",
  4: "4 - Very Good",
  5: "5 - Exceptional / World-Class",
};

// Realistic 5-Point Star SVG with metallic gold gradient and depth
function RealisticStar({
  filled,
  className = "",
  size = "md",
}: {
  filled: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const pixelSizes = {
    sm: 18,
    md: 26,
    lg: 36,
  };

  const px = pixelSizes[size] || 24;

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-200 select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Realistic Metallic Gold Gradient */}
        <linearGradient id={`goldGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4B8" />
          <stop offset="25%" stopColor="#F5D061" />
          <stop offset="60%" stopColor="#D4A017" />
          <stop offset="85%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#8A6300" />
        </linearGradient>

        {/* Soft Bevel Shading */}
        <linearGradient id={`goldShade-${size}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
        </linearGradient>

        {/* Subtle Inactive Gradient */}
        <linearGradient id={`emptyGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#27272a" />
          <stop offset="100%" stopColor="#18181b" />
        </linearGradient>
      </defs>

      {filled ? (
        <g className="filter drop-shadow-[0_2px_7px_rgba(212,160,23,0.55)]">
          {/* Main 5-Point Star */}
          <path
            d="M12 2.2l2.95 6.3 6.95.8-5.14 4.7 1.39 6.8-6.15-3.4-6.15 3.4 1.39-6.8-5.14-4.7 6.95-.8L12 2.2z"
            fill={`url(#goldGrad-${size})`}
            stroke="#FFE890"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
          {/* Dimensional Bevel Facet */}
          <path
            d="M12 2.2v14.4l-6.15 3.4 1.39-6.8-5.14-4.7 6.95-.8L12 2.2z"
            fill={`url(#goldShade-${size})`}
          />
        </g>
      ) : (
        <path
          d="M12 2.2l2.95 6.3 6.95.8-5.14 4.7 1.39 6.8-6.15-3.4-6.15 3.4 1.39-6.8-5.14-4.7 6.95-.8L12 2.2z"
          fill={`url(#emptyGrad-${size})`}
          stroke="#3f3f46"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export default function StarRating({
  value,
  onChange,
  interactive = false,
  size = "md",
  showLabel = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const activeValue = hoverValue !== null ? hoverValue : value;

  const handleKeyDown = (e: React.KeyboardEvent, star: number) => {
    if (!interactive || !onChange) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(star);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex items-center gap-1.5"
        role={interactive ? "radiogroup" : "img"}
        aria-label={`Rating: ${value} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= activeValue;

          if (interactive) {
            return (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={value === star}
                aria-label={RATING_LABELS[star]}
                tabIndex={0}
                onMouseEnter={() => setHoverValue(star)}
                onMouseLeave={() => setHoverValue(null)}
                onClick={() => onChange?.(star)}
                onKeyDown={(e) => handleKeyDown(e, star)}
                className="p-1 rounded-lg transition-transform hover:scale-115 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 cursor-pointer"
              >
                <RealisticStar filled={isFilled} size={size} />
              </button>
            );
          }

          return (
            <div key={star} className="inline-flex">
              <RealisticStar filled={isFilled} size={size} />
            </div>
          );
        })}
      </div>

      {showLabel && (
        <div className="text-xs text-brand-accent font-medium font-heading">
          {RATING_LABELS[activeValue] || `${activeValue} Stars`}
        </div>
      )}
    </div>
  );
}
