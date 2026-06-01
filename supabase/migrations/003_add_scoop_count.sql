ALTER TABLE public.scoops
  ADD COLUMN scoop_count smallint CHECK (scoop_count BETWEEN 1 AND 10);
