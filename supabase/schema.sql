-- Шестнадцать — film development requests
-- Run in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create type public.request_status as enum (
  'new',
  'in_progress',
  'ready',
  'done',
  'cancelled'
);

create type public.film_process as enum (
  'c41',
  'bw',
  'e6',
  'ecn2'
);

create type public.film_format as enum (
  '135',
  '120',
  'other'
);

create type public.scan_option as enum (
  'none',
  'standard',
  'high'
);

create table if not exists public.film_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  contact text not null,
  email text,
  film_process public.film_process not null,
  film_format public.film_format not null,
  rolls_count integer not null check (rolls_count > 0 and rolls_count <= 100),
  scan_option public.scan_option not null default 'standard',
  notes text,
  status public.request_status not null default 'new',
  admin_notes text
);

create index if not exists film_requests_created_at_idx
  on public.film_requests (created_at desc);

create index if not exists film_requests_status_idx
  on public.film_requests (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists film_requests_set_updated_at on public.film_requests;
create trigger film_requests_set_updated_at
  before update on public.film_requests
  for each row
  execute function public.set_updated_at();

alter table public.film_requests enable row level security;

-- Anyone can submit a request (anon insert only).
create policy "Public can insert film requests"
  on public.film_requests
  for insert
  to anon, authenticated
  with check (true);

-- Reads/updates/deletes go through the service role from the Astro server.
-- No select/update/delete policies for anon on purpose.
