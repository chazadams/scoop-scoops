'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Stand } from '@/types/scoop';

interface StandSearchProps {
  selected: Stand | null;
  onSelect: (stand: Stand | null) => void;
}

interface Prediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-rose-400">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function StandSearch({ selected, onSelect }: StandSearchProps) {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [ready, setReady] = useState(false);
  const [resolving, setResolving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesRef = useRef<google.maps.places.PlacesService | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Poll until the Places library is ready
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

  // Initialise services once ready
  useEffect(() => {
    if (!ready || serviceRef.current) return;
    serviceRef.current = new window.google.maps.places.AutocompleteService();
    // PlacesService needs a DOM element but never renders anything visible
    const el = document.createElement('div');
    placesRef.current = new window.google.maps.places.PlacesService(el);
  }, [ready]);

  const fetchPredictions = useCallback((input: string) => {
    if (!serviceRef.current || input.length < 2) {
      setPredictions([]);
      return;
    }
    serviceRef.current.getPlacePredictions(
      { input, types: ['food', 'restaurant', 'store'] },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setPredictions(
            results.map((r) => ({
              placeId: r.place_id,
              mainText: r.structured_formatting.main_text,
              secondaryText: r.structured_formatting.secondary_text ?? '',
            }))
          );
        } else {
          setPredictions([]);
        }
      }
    );
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(value), 250);
  };

  const handleSelect = (prediction: Prediction) => {
    if (!placesRef.current) return;
    setResolving(true);
    placesRef.current.getDetails(
      { placeId: prediction.placeId, fields: ['name', 'place_id', 'formatted_address', 'geometry'] },
      (place, status) => {
        setResolving(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const loc = place.geometry?.location;
          onSelect({
            name: place.name ?? prediction.mainText,
            placeId: place.place_id ?? prediction.placeId,
            address: place.formatted_address ?? prediction.secondaryText,
            lat: loc?.lat() ?? undefined,
            lng: loc?.lng() ?? undefined,
          });
        }
        setOverlayOpen(false);
        setQuery('');
        setPredictions([]);
      }
    );
  };

  const openOverlay = () => {
    setOverlayOpen(true);
    // Focus the input on the next paint after the overlay renders
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const closeOverlay = () => {
    setOverlayOpen(false);
    setQuery('');
    setPredictions([]);
  };

  return (
    <>
      {/* Trigger — shows selected stand or a search prompt */}
      <button
        type="button"
        onClick={openOverlay}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-left transition-colors hover:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400 touch-manipulation"
      >
        <SearchIcon />
        {selected ? (
          <span className="text-stone-900 dark:text-stone-100 text-base truncate">{selected.name}</span>
        ) : (
          <span className="text-stone-400 dark:text-stone-500 text-base">Search for an ice cream stand…</span>
        )}
      </button>

      {/* Selected stand confirmation card */}
      {selected && (
        <div className="flex items-start gap-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl px-3 py-2.5 min-w-0 mt-3">
          <span className="text-xl mt-0.5 shrink-0">🍦</span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm truncate">{selected.name}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 break-words">{selected.address}</p>
          </div>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 text-lg leading-none shrink-0 touch-manipulation"
            aria-label="Clear selection"
          >
            ✕
          </button>
        </div>
      )}

      {/* Full-screen search overlay */}
      {overlayOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-stone-900">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100 dark:border-stone-800 shrink-0">
            <button
              type="button"
              onClick={closeOverlay}
              className="flex items-center justify-center w-9 h-9 rounded-full text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors touch-manipulation"
              aria-label="Close search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 focus-within:ring-2 focus-within:ring-rose-400 focus-within:border-rose-400 transition-colors">
              <SearchIcon />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Find your ice cream stand…"
                className="flex-1 bg-transparent text-base text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); setPredictions([]); inputRef.current?.focus(); }}
                  className="text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 text-lg leading-none touch-manipulation"
                  aria-label="Clear"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {resolving && (
              <div className="flex items-center justify-center py-12 text-stone-400 dark:text-stone-500 text-sm">
                Loading…
              </div>
            )}

            {!resolving && predictions.length === 0 && query.length >= 2 && (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-stone-400 dark:text-stone-500">
                <span className="text-3xl">🍦</span>
                <p className="text-sm">No stands found for &ldquo;{query}&rdquo;</p>
              </div>
            )}

            {!resolving && predictions.length === 0 && query.length < 2 && (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-stone-400 dark:text-stone-500">
                <span className="text-3xl">📍</span>
                <p className="text-sm">Start typing to search</p>
              </div>
            )}

            {!resolving && predictions.length > 0 && (
              <ul>
                {predictions.map((p, i) => (
                  <li key={p.placeId}>
                    <button
                      type="button"
                      onClick={() => handleSelect(p)}
                      className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-rose-50 dark:hover:bg-rose-950/20 active:bg-rose-100 dark:active:bg-rose-950/40 transition-colors touch-manipulation ${
                        i < predictions.length - 1 ? 'border-b border-stone-100 dark:border-stone-800' : ''
                      }`}
                    >
                      <PinIcon />
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm leading-snug">{p.mainText}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 truncate">{p.secondaryText}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
