'use client';

import { useEffect, useRef, useState } from 'react';
import type { Stand } from '@/types/scoop';

interface StandSearchProps {
  selected: Stand | null;
  onSelect: (stand: Stand | null) => void;
}

export default function StandSearch({ selected, onSelect }: StandSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(selected?.name ?? '');
  const [ready, setReady] = useState(false);

  // Poll until Google Maps Places library is available
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const check = () => {
      if (window.google?.maps?.places) { setReady(true); return true; }
      return false;
    };
    if (check()) return;
    const id = setInterval(() => { if (check()) clearInterval(id); }, 200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!ready || !inputRef.current || autocompleteRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['food', 'restaurant', 'store'],
      fields: ['name', 'place_id', 'formatted_address'],
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current!.getPlace();
      if (place.name && place.place_id) {
        const stand: Stand = {
          name: place.name,
          placeId: place.place_id,
          address: place.formatted_address ?? '',
        };
        onSelect(stand);
        setInputValue(place.name);
      }
    });
  }, [ready, onSelect]);

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (!e.target.value) onSelect(null);
        }}
        placeholder="Search for an ice cream stand near you…"
        className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-stone-900 placeholder-stone-400 text-sm"
      />
      {selected && (
        <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5">
          <span className="text-xl mt-0.5">🍦</span>
          <div>
            <p className="font-semibold text-stone-900 text-sm">{selected.name}</p>
            <p className="text-xs text-stone-500 mt-0.5">{selected.address}</p>
          </div>
        </div>
      )}
    </div>
  );
}
