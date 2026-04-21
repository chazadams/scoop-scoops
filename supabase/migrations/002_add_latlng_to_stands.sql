-- Add lat/lng coordinates to stands for distance-based sorting
alter table public.stands
  add column lat double precision,
  add column lng double precision;

-- Recreate stand_stats view to include last_reviewed_at
create or replace view public.stand_stats as
  select
    stand_id,
    count(*)                              as total_scoops,
    round(avg(flavor_rating)::numeric, 1) as avg_flavor_rating,
    round(avg(value_rating)::numeric, 1)  as avg_value_rating,
    round(avg(price)::numeric, 2)         as avg_price,
    array_agg(distinct flavor)            as flavors_logged,
    max(created_at)                       as last_reviewed_at
  from public.scoops
  group by stand_id;
