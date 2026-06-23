'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

interface Coords {
  lat: number;
  lng: number;
}

interface LocationContextValue {
  coords: Coords | null;
  zip: string;
  source: 'gps' | 'zip' | null;
  loading: boolean;
  error: string | null;
  requestGPS: () => Promise<void>;
  geocodeZip: (zip: string) => Promise<void>;
  clear: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

const STORAGE_KEY = 'scoop_location';

interface PersistedLocation {
  coords: Coords | null;
  zip: string;
  source: 'gps' | 'zip' | null;
}

function loadFromStorage(): PersistedLocation {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { coords: null, zip: '', source: null };
}

function saveToStorage(data: PersistedLocation) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [zip, setZip] = useState('');
  const [source, setSource] = useState<'gps' | 'zip' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved.coords) setCoords(saved.coords);
    if (saved.zip) setZip(saved.zip);
    if (saved.source) setSource(saved.source);
  }, []);

  const persist = useCallback((c: Coords | null, z: string, s: 'gps' | 'zip' | null) => {
    saveToStorage({ coords: c, zip: z, source: s });
  }, []);

  const requestGPS = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setError(null);
    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(c);
          setZip('');
          setSource('gps');
          persist(c, '', 'gps');
          setLoading(false);
          resolve();
        },
        () => {
          setError('Location access denied — enter a zip code instead.');
          setLoading(false);
          resolve();
        },
        { timeout: 10000 }
      );
    });
  }, [persist]);

  const geocodeZip = useCallback(async (z: string) => {
    const trimmed = z.trim();
    if (!trimmed) return;
    if (!/^\d{5}(-\d{4})?$/.test(trimmed)) {
      setError('Enter a valid 5-digit zip code.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/geocode?zip=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (res.ok) {
        const c = { lat: data.lat, lng: data.lng };
        setCoords(c);
        setZip(trimmed);
        setSource('zip');
        persist(c, trimmed, 'zip');
      } else {
        setError('Zip code not found — try again.');
      }
    } catch {
      setError('Could not look up zip code.');
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const clear = useCallback(() => {
    setCoords(null);
    setZip('');
    setSource(null);
    setError(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  return (
    <LocationContext.Provider value={{ coords, zip, source, loading, error, requestGPS, geocodeZip, clear }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
