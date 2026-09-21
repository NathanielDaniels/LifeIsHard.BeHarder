-- Patrick Wingert website: minimal Supabase schema
--
-- This file is intentionally schema-only. Do not copy tokens, OAuth state,
-- biometric responses, Strava data, coaching history, or subscriber addresses
-- from the legacy project into the replacement project.
--
-- The Next.js server accesses these tables with a server-only Supabase secret
-- key. Browser roles receive no table privileges and RLS remains enabled as a
-- second boundary.

create table if not exists public.whoop_tokens (
  id text primary key,
  access_token text not null,
  refresh_token text not null,
  expires_at bigint not null,
  whoop_user_id integer,
  updated_at timestamptz not null default now()
);

create table if not exists public.whoop_oauth_state (
  id text primary key,
  state text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.api_connections (
  id text primary key,
  display_name text not null,
  status text not null default 'disconnected',
  token_expires_at timestamptz,
  last_health_check timestamptz,
  last_successful_fetch timestamptz,
  last_error text,
  health_details jsonb,
  updated_at timestamptz not null default now()
);

insert into public.api_connections (id, display_name)
values ('whoop', 'WHOOP')
on conflict (id) do update set display_name = excluded.display_name;

alter table public.whoop_tokens enable row level security;
alter table public.whoop_oauth_state enable row level security;
alter table public.api_connections enable row level security;

revoke all on table public.whoop_tokens from anon, authenticated;
revoke all on table public.whoop_oauth_state from anon, authenticated;
revoke all on table public.api_connections from anon, authenticated;

grant select, insert, update, delete on table public.whoop_tokens to service_role;
grant select, insert, update, delete on table public.whoop_oauth_state to service_role;
grant select, insert, update, delete on table public.api_connections to service_role;
