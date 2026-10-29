"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

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

export default function StarRating({
  value,
  onChange,
  interactive = false,
  size = "md",
  showLabel = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const activeValue = hoverValue !== null ? hoverValue : value;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const handleKeyDown = (e: React.KeyboardEvent, star: number) => {
    if (!interactive || !onChange) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(star);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="flex items-center gap-1"
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
                className="p-1 rounded-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 cursor-pointer"
              >
                <Star
                  className={`${sizeClasses[size]} transition-colors duration-200 ${
                    isFilled
                      ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                      : "text-zinc-600 hover:text-amber-400/60"
                  }`}
                />
              </button>
            );
          }

          return (
            <Star
              key={star}
              className={`${sizeClasses[size]} ${
                isFilled
                  ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]"
                  : "text-zinc-700"
              }`}
            />
          );
        })}
      </div>

      {showLabel && (
        <span className="text-xs text-brand-accent font-medium tracking-wide">
          {RATING_LABELS[activeValue] || "Select a rating"}
        </span>
      )}
    </div>
  );
}
