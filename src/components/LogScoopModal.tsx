'use client';

import { useEffect, useState } from 'react';
import StandSearch from './StandSearch';
import { useAuth } from '@/context/AuthContext';
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

function ProgressDots({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`h-2 rounded-full transition-all duration-300 ${
            s === step ? 'w-5 bg-rose-500' : s < step ? 'w-2 bg-rose-300' : 'w-2 bg-stone-200 dark:bg-stone-700'
          }`}
        />
      ))}
    </div>
  );
}

function ModalNav({
  onBack,
  onNext,
  nextLabel = 'Next',
  nextDisabled = false,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex justify-between mt-6">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          Back
        </button>
      ) : (
        <div />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {nextLabel}
      </button>
    </div>
  );
}

export default function LogScoopModal({ isOpen, onClose }: LogScoopModalProps) {
  const { user, signInWithGoogle } = useAuth();
  const [step, setStep] = useState(1);
  const [stand, setStand] = useState<Stand | null>(null);
  const [flavor, setFlavor] = useState('');
  const [size, setSize] = useState<Size | null>(null);
  const [container, setContainer] = useState<ContainerType | null>(null);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [price, setPrice] = useState('');
  const [flavorRating, setFlavorRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  });

  if (!isOpen) return null;

  const reset = () => {
    setStep(1); setStand(null); setFlavor(''); setSize(null);
    setContainer(null); setToppings([]); setPrice(''); setFlavorRating(0);
    setValueRating(0); setNotes(''); setSubmitted(false);
    setSubmitting(false); setSubmitError(null);
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
          stand,
          flavor,
          size,
          container,
          price: price ? parseInt(price, 10) : null,
          toppings,
          flavorRating,
          valueRating,
          notes,
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

  const step2Valid = flavor.trim().length > 0 && size !== null && container !== null;
  const step3Valid = flavorRating > 0 && valueRating > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Sheet */}
      <div className="relative bg-white dark:bg-stone-900 w-full sm:rounded-2xl sm:max-w-md max-h-[92dvh] overflow-y-auto shadow-2xl">
        {submitted ? (
          <SuccessView stand={stand!} flavor={flavor} onClose={handleClose} />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h2 className="font-bold text-stone-900 dark:text-stone-100 text-lg">Log a Scoop</h2>
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                  {step === 1 ? 'Find your stand' : step === 2 ? 'What did you get?' : 'How was it?'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ProgressDots step={step} />
                <button
                  onClick={handleClose}
                  className="text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 text-xl leading-none"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="px-6 py-5">
              {step === 1 && (
                <div>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                    Search for the ice cream stand you visited.
                  </p>
                  <StandSearch selected={stand} onSelect={setStand} />
                  <ModalNav onNext={() => setStep(2)} nextDisabled={!stand} />
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-5">
                  {/* Flavor */}
                  <div>
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300 block mb-1.5">
                      Flavor
                    </label>
                    <input
                      type="text"
                      value={flavor}
                      onChange={(e) => setFlavor(e.target.value)}
                      placeholder="e.g. Strawberry Cheesecake"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-sm"
                    />
                  </div>

                  {/* Size */}
                  <div>
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300 block mb-1.5">Size</label>
                    <div className="flex gap-2 flex-wrap">
                      {SIZES.map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setSize(value)}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                            size === value
                              ? 'bg-rose-500 border-rose-500 text-white'
                              : 'border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:border-rose-300 hover:text-rose-600'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Container */}
                  <div>
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300 block mb-1.5">
                      Cone or Speciality?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {CONTAINERS.map(([value, { label, emoji }]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setContainer(value)}
                          className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium transition-colors ${
                            container === value
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-700 dark:text-rose-300'
                              : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-rose-200 hover:text-rose-600'
                          }`}
                        >
                          <span className="text-xl">{emoji}</span>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toppings */}
                  <div>
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300 block mb-1.5">
                      Toppings <span className="font-normal text-stone-400 dark:text-stone-500">(optional)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TOPPINGS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleTopping(t)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                            toppings.includes(t)
                              ? 'bg-amber-400 border-amber-400 text-white'
                              : 'border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:border-amber-300 hover:text-amber-700'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                        Price <span className="font-normal text-stone-400 dark:text-stone-500">(optional)</span>
                      </label>
                      <div className="relative group">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400 text-xs cursor-default leading-none">?</span>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-44 px-3 py-2 bg-stone-800 dark:bg-stone-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                          Enter whole dollar amounts only — no cents.
                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-stone-800 dark:border-t-stone-700" />
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
                        className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-sm"
                      />
                    </div>
                  </div>

                  <ModalNav
                    onBack={() => setStep(1)}
                    onNext={() => setStep(3)}
                    nextDisabled={!step2Valid}
                  />
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
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300 block mb-1.5">
                      Notes <span className="font-normal text-stone-400 dark:text-stone-500">(optional)</span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Anything worth mentioning?"
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-sm resize-none"
                    />
                  </div>
                  {submitError && (
                    <p className="text-sm text-red-500">{submitError}</p>
                  )}
                  <ModalNav
                    onBack={() => setStep(2)}
                    onNext={handleSubmit}
                    nextLabel={submitting ? 'Saving…' : 'Log It! 🍦'}
                    nextDisabled={!step3Valid || submitting}
                  />
                </div>
              )}
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
    <div className="flex flex-col items-center text-center px-8 py-12 gap-4">
      <div className="text-6xl">🍦</div>
      <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Scoop logged!</h2>
      <p className="text-stone-500 dark:text-stone-400 text-sm">
        <span className="font-semibold text-stone-700 dark:text-stone-300">{flavor}</span> at{' '}
        <span className="font-semibold text-stone-700 dark:text-stone-300">{stand.name}</span> — nice choice.
      </p>
      <button
        onClick={onClose}
        className="mt-4 px-8 py-3 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 transition-colors"
      >
        Done
      </button>
    </div>
  );
}
