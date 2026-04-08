'use client';

import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  label?: string;
  descriptors?: string[];
}

export default function StarRating({ value, onChange, label, descriptors }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  const descriptor = descriptors && display > 0 ? descriptors[display - 1] : null;

  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-stone-700">{label}</span>}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="text-2xl leading-none transition-transform hover:scale-110 focus:outline-none"
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          >
            <span className={star <= display ? 'text-amber-400' : 'text-stone-200'}>★</span>
          </button>
        ))}
        {descriptor && (
          <span className="ml-2 text-sm text-stone-500 italic">{descriptor}</span>
        )}
      </div>
    </div>
  );
}
