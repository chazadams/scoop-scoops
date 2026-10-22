-- Page views (one row per non-API page request, logged from proxy.ts)
create table public.page_views (
  id          uuid primary key default gen_random_uuid(),
  path        text not null,
  created_at  timestamptz not null default now()
);

-- Login events (one row per OAuth sign-in, logged from /auth/callback)
create table public.login_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Server error log (logged from instrumentation.ts's onRequestError)
create table public.error_log (
  id          uuid primary key default gen_random_uuid(),
  message     text not null,
  digest      text,
  path        text,
  method      text,
  created_at  timestamptz not null default now()
);

-- These tables are only ever read/written by the service-role admin client
-- (src/lib/supabase-admin.ts), never by the anon key. Enable RLS with no
-- policies so the anon/authenticated roles are denied by default.
alter table public.page_views   enable row level security;
alter table public.login_events enable row level security;
alter table public.error_log    enable row level security;
