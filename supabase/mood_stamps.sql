-- Shared mood board for /playground/i-was-here/
-- Run in the Supabase SQL editor after deploying client hardening.
-- Re-run the policy/trigger section if the table already exists.

create table if not exists public.mood_stamps (
  id uuid primary key,
  stamp_id text not null,
  x double precision not null,
  y double precision not null,
  rotation double precision not null default 0,
  name text not null default '',
  created_at timestamptz not null default now(),
  constraint mood_stamps_stamp_id_check check (
    stamp_id in (
      'happy', 'calm', 'tired', 'hyped', 'meh', 'sad', 'inspired', 'grumpy'
    )
  ),
  constraint mood_stamps_coords_check check (
    x >= 0 and x <= 100 and y >= 0 and y <= 100
  ),
  constraint mood_stamps_rotation_check check (
    rotation >= -180 and rotation <= 180
  ),
  constraint mood_stamps_name_length_check check (char_length(name) <= 32)
);

create index if not exists mood_stamps_created_at_idx
  on public.mood_stamps (created_at desc);

alter table public.mood_stamps enable row level security;

drop policy if exists "mood_stamps_read" on public.mood_stamps;
drop policy if exists "mood_stamps_insert" on public.mood_stamps;
drop policy if exists "mood_stamps_update" on public.mood_stamps;
drop policy if exists "mood_stamps_delete" on public.mood_stamps;

create policy "mood_stamps_read"
  on public.mood_stamps
  for select
  using (created_at >= now() - interval '7 days');

create policy "mood_stamps_insert"
  on public.mood_stamps
  for insert
  with check (
    char_length(stamp_id) <= 32
    and char_length(name) <= 32
    and x >= 0 and x <= 100
    and y >= 0 and y <= 100
    and rotation >= -180 and rotation <= 180
  );

-- No public update/delete policies: stamps are append-only for anonymous users.

create or replace function public.mood_stamps_force_created_at()
returns trigger
language plpgsql
as $$
begin
  new.created_at := now();
  return new;
end;
$$;

create or replace function public.mood_stamps_enforce_cap()
returns trigger
language plpgsql
as $$
declare
  active_count integer;
begin
  select count(*) into active_count
  from public.mood_stamps
  where created_at >= now() - interval '7 days';

  if active_count >= 120 then
    raise exception 'Board is full';
  end if;

  return new;
end;
$$;

create or replace function public.mood_stamps_rate_limit()
returns trigger
language plpgsql
as $$
declare
  recent_count integer;
begin
  select count(*) into recent_count
  from public.mood_stamps
  where created_at >= now() - interval '1 minute';

  if recent_count >= 40 then
    raise exception 'Too many stamps. Try again in a minute.';
  end if;

  return new;
end;
$$;

drop trigger if exists mood_stamps_force_created_at on public.mood_stamps;
create trigger mood_stamps_force_created_at
  before insert on public.mood_stamps
  for each row execute function public.mood_stamps_force_created_at();

drop trigger if exists mood_stamps_enforce_cap on public.mood_stamps;
create trigger mood_stamps_enforce_cap
  before insert on public.mood_stamps
  for each row execute function public.mood_stamps_enforce_cap();

drop trigger if exists mood_stamps_rate_limit on public.mood_stamps;
create trigger mood_stamps_rate_limit
  before insert on public.mood_stamps
  for each row execute function public.mood_stamps_rate_limit();

-- Optional: enable pg_cron in Supabase and schedule daily cleanup
-- select cron.schedule(
--   'purge-old-mood-stamps',
--   '15 3 * * *',
--   $$delete from public.mood_stamps where created_at < now() - interval '7 days';$$
-- );
