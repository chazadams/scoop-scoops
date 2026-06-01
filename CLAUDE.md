# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "What inputs should fail, and what should happen when they do?"
- "Fix the bug" → "What exact behavior should change, and how will I confirm it's fixed?"
- "Refactor X" → "What observable behavior must stay the same?"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria reduce back-and-forth. Weak criteria ("make it work") require constant clarification.

---

## Project: scoop-scoops

> **This is Next.js 16** — APIs, conventions, and file structure may differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any Next.js code. Heed deprecation notices.

### Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build (output: standalone)
npm run lint     # Run ESLint
```

There are no tests.

### Architecture

**Stack:** Next.js 16.2 (App Router), React 19, TypeScript, Tailwind CSS v4, Supabase (Postgres + Auth), Google Maps Places API.

### Pages & Routes

- `/` — Home feed: hero with SVG wordmark logo, recent scoops feed, floating "Log a Scoop" button
- `/stands` — Directory of all stands that have been reviewed
- `/api/scoops` — GET (feed, last 50) / POST (log a new scoop; upserts stand by `place_id`)
- `/api/stands` — GET (all stands with stats from `stand_stats` view)
- `/api/stands/[standId]/reviews` — GET (scoops for a specific stand)
- `/api/places/[placeId]` — GET (proxies Google Places API for opening hours; 1h cache)
- `/auth/callback` — Handles Supabase OAuth code exchange; upserts user into `public.users`

### Supabase Clients

Two separate clients exist for different rendering contexts:
- `src/lib/supabase.ts` — Plain `createClient` for **server-side** API routes
- `src/lib/supabase-browser.ts` — `createBrowserClient` from `@supabase/ssr` for **client components**

Always use the browser client in `'use client'` components and the server client in API routes.

### Auth Flow

Google OAuth via Supabase. `AuthContext` (`src/context/AuthContext.tsx`) exposes `user`, `loading`, `signInWithGoogle`, and `signOut` to all client components. On first sign-in, `/auth/callback` upserts a row into `public.users` using the user's Google display name.

### Database Schema

Three tables + one view (migrations in `supabase/migrations/`):
- `stands` — one row per unique Google Place (`place_id` is the unique key); has `lat`/`lng`
- `scoops` — one log per visit; references `stands.id` and `users.id`; stores flavor, size, container, toppings (text[]), price, flavor_rating, value_rating, notes
- `users` — extends `auth.users`; stores display name
- `stand_stats` (view) — aggregates avg ratings, total scoops, `last_reviewed_at` per stand

Stands are upserted by `place_id` on every `POST /api/scoops` so duplicates can't accumulate.

### Theme

Light/dark toggled via `ThemeContext` (`src/context/ThemeContext.tsx`). Dark mode adds both `.dark` and `.theme-slate` to `<html>`. A blocking inline script in `layout.tsx` reads `localStorage` before hydration to prevent flash. Default for new visitors is `light`.

### Google Maps

The Maps JS SDK (with the `places` library) is loaded as an `afterInteractive` script in `layout.tsx`. `StandSearch` uses the `google.maps.places.Autocomplete` widget to let users search for stands. The `@types/google.maps` package provides typings.

### Deployment

`next.config.ts` sets `output: 'standalone'`. The `docker/` directory contains a Docker Compose setup with Tailscale + Nginx that serves the app only over the Tailnet.

### Required Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```
