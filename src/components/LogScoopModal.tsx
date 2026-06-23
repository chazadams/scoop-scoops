'use client';

import { useEffect, useState } from 'react';
import StandSearch from './StandSearch';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { haversine } from '@/lib/haversine';
import StarRating from './StarRating';
import {
  TOPPINGS,
  CONTAINER_LABELS,
  SIZE_LABELS,
  type Stand,
  type Size,
  type ContainerType,
  type Topping,
} from '@/types/scoop';

interface LogScoopModalProps {
  isOpen: boolean;
  onClose: (logged?: boolean) => void;
}

const FLAVOR_DESCRIPTORS = ['Disappointing', 'Below average', 'Pretty good', 'Delicious', 'Life-changing'];
const VALUE_DESCRIPTORS = ['Daylight robbery', 'Overpriced', 'Fair deal', 'Good value', 'Worth every penny'];

const SIZES = Object.entries(SIZE_LABELS) as [Size, string][];
const CONTAINERS = Object.entries(CONTAINER_LABELS) as [ContainerType, { label: string; emoji: string }][];

type FooterConfig = {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
};

function ProgressDots({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`h-1 rounded-full transition-all duration-300 ${
            s === step ? 'w-4 bg-brand' : s < step ? 'w-1.5 bg-brand/40' : 'w-1.5 bg-stone-200 dark:bg-stone-700'
          }`}
        />
      ))}
    </div>
  );
}

interface NearbyStand {
  standId: string;
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: number;
  visited: boolean;
}

export default function LogScoopModal({ isOpen, onClose }: LogScoopModalProps) {
  const { user, signInWithGoogle } = useAuth();
  const { coords } = useLocation();
  const [step, setStep] = useState(1);
  const [stand, setStand] = useState<Stand | null>(null);
  const [flavor, setFlavor] = useState('');
  const [size, setSize] = useState<Size | null>(null);
  const [scoopCount, setScoopCount] = useState<number | null>(null);
  const [container, setContainer] = useState<ContainerType | null>(null);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [price, setPrice] = useState('');
  const [flavorRating, setFlavorRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [pastFlavors, setPastFlavors] = useState<string[]>([]);
  const [flavorFocused, setFlavorFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [nearbyStands, setNearbyStands] = useState<NearbyStand[]>([]);

  // Fetch past flavors for the selected stand
  useEffect(() => {
    if (!stand?.placeId) return;
    fetch(`/api/stands/flavors?placeId=${encodeURIComponent(stand.placeId)}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPastFlavors(data); })
      .catch(() => {});
  }, [stand?.placeId]);

  // Fetch nearby stands when modal opens and location is available
  useEffect(() => {
    if (!isOpen || !coords) { setNearbyStands([]); return; }
    Promise.all([
      fetch('/api/stands').then(r => r.json()),
      user ? fetch(`/api/scoops/my-stands?userId=${encodeURIComponent(user.id)}`).then(r => r.json()) : Promise.resolve([]),
    ]).then(([rows, visitedIds]) => {
      const visited = new Set<string>(Array.isArray(visitedIds) ? visitedIds : []);
      const nearby = (rows as Array<{
        stand_id: string;
        stands: { place_id: string; name: string; address: string; lat: number | null; lng: number | null } | null;
      }>)
        .filter(r => r.stands?.lat != null && r.stands?.lng != null)
        .map(r => ({
          standId: r.stand_id,
          placeId: r.stands!.place_id,
          name: r.stands!.name,
          address: r.stands!.address,
          lat: r.stands!.lat!,
          lng: r.stands!.lng!,
          distance: haversine(coords.lat, coords.lng, r.stands!.lat!, r.stands!.lng!),
          visited: visited.has(r.stand_id),
        }))
        .filter(s => s.distance <= 50)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);
      setNearbyStands(nearby);
    }).catch(() => setNearbyStands([]));
  }, [isOpen, coords, user]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const reset = () => {
    setStep(1); setStand(null); setFlavor(''); setSize(null); setScoopCount(null);
    setContainer(null); setToppings([]); setPrice(''); setFlavorRating(0);
    setValueRating(0); setNotes(''); setSubmitted(false);
    setSubmitting(false); setSubmitError(null);
    setPastFlavors([]); setFlavorFocused(false); setNearbyStands([]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (!user) {
        signInWithGoogle();
        return;
      }
      const res = await fetch('/api/scoops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stand, flavor, size, container,
          price: price ? parseInt(price, 10) : null,
          toppings, flavorRating, valueRating, notes, scoopCount,
          userId: user.id,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        let message = 'Something went wrong';
        try { message = JSON.parse(text).error ?? message; } catch {}
        throw new Error(message);
      }
      setSubmitted(true);
      onClose(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => { reset(); onClose(); };

  const toggleTopping = (t: Topping) =>
    setToppings((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const suggestions = flavorFocused && flavor.length >= 3
    ? pastFlavors.filter(f => f.toLowerCase().includes(flavor.toLowerCase()))
    : [];

  const step2Valid = flavor.trim().length > 0 && size !== null && container !== null;
  const step3Valid = flavorRating > 0 && valueRating > 0;

  const stepLabels = ['Find your stand', 'What did you get?', 'How was it?'];

  const footerNav: FooterConfig = step === 1
    ? { onNext: () => setStep(2), nextDisabled: !stand }
    : step === 2
    ? { onBack: () => setStep(1), onNext: () => setStep(3), nextDisabled: !step2Valid }
    : { onBack: () => setStep(2), onNext: handleSubmit, nextLabel: submitting ? 'Saving…' : 'Log It! 🍦', nextDisabled: !step3Valid || submitting };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop — desktop only */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm hidden sm:block"
        onClick={handleClose}
      />

      {/* Panel: full-screen on mobile, centered dialog on desktop */}
      <div className="absolute inset-0 flex flex-col bg-white dark:bg-stone-900 sm:right-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md sm:max-h-[90vh] sm:rounded-xl sm:shadow-2xl overflow-hidden">
        {submitted ? (
          <SuccessView stand={stand!} flavor={flavor} onClose={handleClose} />
        ) : (
          <>
            {/* Sticky header */}
            <div className="shrink-0 flex items-center justify-between px-5 pt-5 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h2 className="font-bold text-stone-900 dark:text-stone-100 text-base tracking-tight">Log a Scoop</h2>
                <p className="text-xs font-semibold tracking-wide uppercase text-stone-400 dark:text-stone-500 mt-0.5">
                  Step {step} — {stepLabels[step - 1]}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ProgressDots step={step} />
                <button
                  onClick={handleClose}
                  className="text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 text-xl leading-none touch-manipulation"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {step === 1 && (
                <div className="flex flex-col gap-5">
                  {nearbyStands.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold tracking-wide uppercase text-stone-400 dark:text-stone-500 mb-2">
                        Nearby stands
                      </p>
                      <ul className="flex flex-col gap-2">
                        {nearbyStands.map((s) => (
                          <li key={s.standId}>
                            <button
                              type="button"
                              onClick={() => setStand({ name: s.name, placeId: s.placeId, address: s.address, lat: s.lat, lng: s.lng })}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-colors touch-manipulation ${
                                stand?.placeId === s.placeId
                                  ? 'border-brand bg-brand/5 dark:bg-brand/10'
                                  : 'border-stone-200 dark:border-stone-700 hover:border-brand hover:bg-stone-50 dark:hover:bg-stone-800'
                              }`}
                            >
                              <span className="text-base shrink-0">🍦</span>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm truncate">{s.name}</p>
                                <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5 truncate">{s.address}</p>
                              </div>
                              <div className="shrink-0 flex flex-col items-end gap-1">
                                <span className="text-xs font-bold text-brand">{s.distance.toFixed(1)} mi</span>
                                {s.visited && (
                                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">✓ Visited</span>
                                )}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold tracking-wide uppercase text-stone-400 dark:text-stone-500 mb-2">
                      {nearbyStands.length > 0 ? 'Or search for another stand' : 'Search for the stand you visited'}
                    </p>
                    <StandSearch selected={nearbyStands.some(s => s.placeId === stand?.placeId) ? null : stand} onSelect={setStand} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="sm:grid sm:grid-cols-2 sm:gap-x-6">
                  {/* Left column: Flavor + Size/Scoops */}
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="text-xs font-bold tracking-[0.08em] uppercase text-stone-400 dark:text-stone-500 block mb-1.5">
                        Flavor
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={flavor}
                          onChange={(e) => setFlavor(e.target.value)}
                          onFocus={() => setFlavorFocused(true)}
                          onBlur={() => setTimeout(() => setFlavorFocused(false), 150)}
                          placeholder="e.g. Strawberry Cheesecake"
                          className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-brand text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-base"
                        />
                        {suggestions.length > 0 && (
                          <ul className="absolute z-10 top-full mt-1 left-0 right-0 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                            {suggestions.map(s => (
                              <li key={s}>
                                <button
                                  type="button"
                                  onMouseDown={() => { setFlavor(s); setFlavorFocused(false); }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700"
                                >
                                  {s}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold tracking-[0.08em] uppercase text-stone-400 dark:text-stone-500 block mb-1.5">
                        Size
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {SIZES.map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => { setSize(value); setScoopCount(null); }}
                            className={`px-4 py-2.5 rounded-lg text-sm font-semibold border transition-colors touch-manipulation ${
                              size === value
                                ? 'bg-brand border-brand text-white'
                                : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-brand hover:text-brand'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      {size && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold tracking-wide uppercase text-stone-400 dark:text-stone-500 mb-1.5">
                            How many scoops? <span className="font-normal normal-case">(optional)</span>
                          </p>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setScoopCount(scoopCount === n ? null : n)}
                                className={`w-11 h-11 rounded-lg text-sm font-bold border transition-colors touch-manipulation ${
                                  scoopCount === n
                                    ? 'bg-brand border-brand text-white'
                                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-brand hover:text-brand'
                                }`}
                              >
                                {n === 5 ? '5+' : n}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right column: Container + Toppings + Price */}
                  <div className="flex flex-col gap-5 mt-5 sm:mt-0">
                    <div>
                      <label className="text-xs font-bold tracking-[0.08em] uppercase text-stone-400 dark:text-stone-500 block mb-1.5">
                        Cone or Speciality?
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {CONTAINERS.map(([value, { label, emoji }]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setContainer(value)}
                            className={`flex flex-col items-center gap-1 py-3 rounded-lg border text-xs font-semibold transition-colors touch-manipulation ${
                              container === value
                                ? 'bg-brand/8 border-brand text-brand dark:text-brand'
                                : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-brand hover:text-brand'
                            }`}
                          >
                            <span className="text-xl">{emoji}</span>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold tracking-[0.08em] uppercase text-stone-400 dark:text-stone-500 block mb-1.5">
                        Toppings <span className="font-normal normal-case">(optional)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {TOPPINGS.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => toggleTopping(t)}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors touch-manipulation ${
                              toppings.includes(t)
                                ? 'bg-brand border-brand text-white'
                                : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-brand hover:text-brand'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="text-xs font-bold tracking-[0.08em] uppercase text-stone-400 dark:text-stone-500">
                          Price <span className="font-normal normal-case">(optional)</span>
                        </label>
                        <div className="relative group">
                          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 text-xs cursor-default leading-none">?</span>
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-44 px-3 py-2 bg-stone-900 dark:bg-stone-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                            Enter whole dollar amounts only — no cents.
                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-stone-900 dark:border-t-stone-700" />
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 text-sm">$</span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="0"
                          className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-brand text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-6">
                  <StarRating
                    label="How did it taste?"
                    value={flavorRating}
                    onChange={setFlavorRating}
                    descriptors={FLAVOR_DESCRIPTORS}
                  />
                  <StarRating
                    label="Was it worth the price?"
                    value={valueRating}
                    onChange={setValueRating}
                    descriptors={VALUE_DESCRIPTORS}
                  />
                  <div>
                    <label className="text-xs font-bold tracking-[0.08em] uppercase text-stone-400 dark:text-stone-500 block mb-1.5">
                      Notes <span className="font-normal normal-case">(optional)</span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Anything worth mentioning?"
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-brand text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-base resize-none"
                    />
                  </div>
                  {submitError && (
                    <p className="text-sm text-red-500">{submitError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Sticky footer */}
            <div className="shrink-0 flex justify-between items-center px-5 py-4 border-t border-stone-100 dark:border-stone-800">
              {footerNav.onBack ? (
                <button
                  type="button"
                  onClick={footerNav.onBack}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors touch-manipulation"
                >
                  ← Back
                </button>
              ) : <div />}
              <button
                type="button"
                onClick={footerNav.onNext}
                disabled={footerNav.nextDisabled}
                className="px-6 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase bg-brand text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all touch-manipulation"
              >
                {footerNav.nextLabel ?? (step < 3 ? 'Next →' : 'Log It! 🍦')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SuccessView({
  stand,
  flavor,
  onClose,
}: {
  stand: Stand;
  flavor: string;
  onClose: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-12 gap-4">
      <div className="text-6xl">🍦</div>
      <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Scoop logged!</h2>
      <p className="text-stone-500 dark:text-stone-400 text-sm">
        <span className="font-semibold text-stone-700 dark:text-stone-300">{flavor}</span> at{' '}
        <span className="font-semibold text-stone-700 dark:text-stone-300">{stand.name}</span> — nice choice.
      </p>
      <button
        onClick={onClose}
        className="mt-4 px-8 py-3 rounded-lg bg-brand text-white font-bold uppercase tracking-wide text-xs hover:opacity-90 transition-colors touch-manipulation"
      >
        Done
      </button>
    </div>
  );
}
