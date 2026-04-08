-- Users (public profile, extends auth.users)
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now()
);

-- Stands (one row per unique Google place)
create table public.stands (
  id          uuid primary key default gen_random_uuid(),
  place_id    text not null unique,
  name        text not null,
  address     text not null default '',
  created_at  timestamptz not null default now()
);

-- Scoops (one log entry per visit)
create table public.scoops (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users(id) on delete cascade,
  stand_id       uuid not null references public.stands(id) on delete cascade,
  flavor         text not null,
  size           text not null check (size in ('kids', 'small', 'medium', 'large', 'xl')),
  container      text not null check (container in ('sugar-cone', 'waffle-cone', 'cake-cone', 'cup', 'dish')),
  price          numeric(6, 2),
  toppings       text[] not null default '{}',
  flavor_rating  smallint not null check (flavor_rating between 1 and 5),
  value_rating   smallint not null check (value_rating between 1 and 5),
  notes          text,
  created_at     timestamptz not null default now()
);

-- Stand stats view (auto-computed averages)
create view public.stand_stats as
  select
    stand_id,
    count(*)                              as total_scoops,
    round(avg(flavor_rating)::numeric, 1) as avg_flavor_rating,
    round(avg(value_rating)::numeric, 1)  as avg_value_rating,
    round(avg(price)::numeric, 2)         as avg_price,
    array_agg(distinct flavor)            as flavors_logged
  from public.scoops
  group by stand_id;

-- Row Level Security
alter table public.users  enable row level security;
alter table public.stands enable row level security;
alter table public.scoops enable row level security;

-- Users: anyone can read, only the user themselves can update their own row
create policy "users_select" on public.users for select using (true);
create policy "users_insert" on public.users for insert with check (auth.uid() = id);
create policy "users_update" on public.users for update using (auth.uid() = id);

-- Stands: public read, any authenticated user can insert
create policy "stands_select" on public.stands for select using (true);
create policy "stands_insert" on public.stands for insert with check (auth.uid() is not null);

-- Scoops: public read, users can only insert/update/delete their own
create policy "scoops_select" on public.scoops for select using (true);
create policy "scoops_insert" on public.scoops for insert with check (auth.uid() = user_id);
create policy "scoops_update" on public.scoops for update using (auth.uid() = user_id);
create policy "scoops_delete" on public.scoops for delete using (auth.uid() = user_id);
