-- Shared unique visitor counter for the homepage.
-- Run in the Supabase SQL editor.

create table if not exists public.site_visitors (
  visitor_id text primary key,
  first_seen timestamptz not null default now(),
  constraint site_visitors_visitor_id_format_check check (
    visitor_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  )
);

create index if not exists site_visitors_first_seen_idx
  on public.site_visitors (first_seen desc);

alter table public.site_visitors enable row level security;

revoke all on public.site_visitors from anon, authenticated;

create or replace function public.site_visitors_rate_limit()
returns trigger
language plpgsql
as $$
declare
  recent_count integer;
begin
  select count(*) into recent_count
  from public.site_visitors
  where first_seen >= now() - interval '1 minute';

  if recent_count >= 120 then
    raise exception 'Too many visits. Try again shortly.';
  end if;

  return new;
end;
$$;

drop trigger if exists site_visitors_rate_limit on public.site_visitors;
create trigger site_visitors_rate_limit
  before insert on public.site_visitors
  for each row execute function public.site_visitors_rate_limit();

create or replace function public.register_site_visitor(p_visitor_id text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  total bigint;
begin
  insert into public.site_visitors (visitor_id)
  values (p_visitor_id)
  on conflict (visitor_id) do nothing;

  select count(*) into total from public.site_visitors;
  return total;
end;
$$;

revoke all on function public.register_site_visitor(text) from public;
grant execute on function public.register_site_visitor(text) to anon, authenticated;
