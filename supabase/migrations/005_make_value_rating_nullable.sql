-- Value rating question removed from the UI; keep historical data, stop requiring it going forward
alter table public.scoops alter column value_rating drop not null;
