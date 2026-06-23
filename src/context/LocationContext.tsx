'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

interface Coords {
  lat: number;
  lng: number;
}

interface LocationContextValue {
  coords: Coords | null;
  cityState: string | null;
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
  cityState: string | null;
  source: 'gps' | 'zip' | null;
}

function loadFromStorage(): PersistedLocation {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { coords: null, cityState: null, source: null };
}

function saveToStorage(data: PersistedLocation) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

async function reversGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.city && data.state) return `${data.city}, ${data.state}`;
  } catch {}
  return null;
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [cityState, setCityState] = useState<string | null>(null);
  const [source, setSource] = useState<'gps' | 'zip' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadFromStorage();
    if (saved.coords) setCoords(saved.coords);
    if (saved.cityState) setCityState(saved.cityState);
    if (saved.source) setSource(saved.source);
  }, []);

  const persist = useCallback((c: Coords | null, cs: string | null, s: 'gps' | 'zip' | null) => {
    saveToStorage({ coords: c, cityState: cs, source: s });
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
        async (pos) => {
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(c);
          setSource('gps');
          // Reverse geocode in background — update city/state when ready
          const cs = await reversGeocode(c.lat, c.lng);
          setCityState(cs);
          persist(c, cs, 'gps');
          setLoading(false);
          resolve();
        },
        () => {
          setError('Location access denied — try the Nearest tab to enter a zip code.');
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
        setSource('zip');
        const cs = await reversGeocode(c.lat, c.lng);
        setCityState(cs);
        persist(c, cs, 'zip');
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
    setCityState(null);
    setSource(null);
    setError(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  return (
    <LocationContext.Provider value={{ coords, cityState, source, loading, error, requestGPS, geocodeZip, clear }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
