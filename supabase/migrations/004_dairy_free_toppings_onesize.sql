-- Non-dairy flag on individual scoop logs
alter table public.scoops
  add column is_dairy_free boolean not null default false;

-- Topping usage counts, used to promote custom toppings to the shared list at 5 uses
create view public.topping_counts as
  select topping, count(*) as uses
  from public.scoops, unnest(toppings) as topping
  group by topping;

-- Allow shops with no size choice to log a single "One Size" option
alter table public.scoops drop constraint scoops_size_check;
alter table public.scoops add constraint scoops_size_check
  check (size in ('kids', 'small', 'medium', 'large', 'xl', 'one-size'));
