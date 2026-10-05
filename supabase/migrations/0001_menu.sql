-- TOTO menu schema. Safe to re-run.
-- Everyone (anon) can read what's on the site; only users listed in public.admins can write.

create table if not exists public.categories (
  id          text primary key,
  name        text not null,
  note        text not null default '',
  image       text not null default '',
  sort        int  not null default 0,
  visible     boolean not null default true,
  updated_at  timestamptz not null default now()
);

create table if not exists public.option_groups (
  id          text primary key,
  legend      text not null,
  cta         text not null,
  min         int  not null default 1 check (min >= 0),
  max         int  not null default 1 check (max >= 1),
  -- [{ "name": "סלמון מעושן", "extra": 45 }, ...]
  choices     jsonb not null default '[]'::jsonb,
  updated_at  timestamptz not null default now(),
  check (min <= max)
);

create table if not exists public.items (
  id               text primary key default gen_random_uuid()::text,
  category_id      text not null references public.categories(id) on update cascade on delete restrict,
  name             text not null,
  price            int  not null check (price >= 0),
  image            text not null default '',
  unit             text,
  description      text,
  option_group_id  text references public.option_groups(id) on update cascade on delete set null,
  badge            text,
  featured         boolean not null default false,
  available        boolean not null default true,
  sort             int  not null default 0,
  updated_at       timestamptz not null default now()
);
create index if not exists items_category_sort on public.items (category_id, sort);

create table if not exists public.admins (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  email    text
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

grant execute on function public.is_admin() to anon, authenticated;
grant select on public.categories, public.option_groups, public.items to anon, authenticated;
grant insert, update, delete on public.categories, public.option_groups, public.items to authenticated;
grant select on public.admins to authenticated;

alter table public.categories    enable row level security;
alter table public.option_groups enable row level security;
alter table public.items         enable row level security;
alter table public.admins        enable row level security;

drop policy if exists "read visible categories" on public.categories;
create policy "read visible categories" on public.categories for select to anon, authenticated
  using (visible or public.is_admin());
drop policy if exists "admins write categories" on public.categories;
create policy "admins write categories" on public.categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "read option groups" on public.option_groups;
create policy "read option groups" on public.option_groups for select to anon, authenticated using (true);
drop policy if exists "admins write option groups" on public.option_groups;
create policy "admins write option groups" on public.option_groups for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "read available items" on public.items;
create policy "read available items" on public.items for select to anon, authenticated
  using (available or public.is_admin());
drop policy if exists "admins write items" on public.items;
create policy "admins write items" on public.items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "read own admin row" on public.admins;
create policy "read own admin row" on public.admins for select to authenticated using (user_id = auth.uid());

-- Dish photos: public bucket, only admins may upload/replace/delete.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('menu-images', 'menu-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admins upload menu images" on storage.objects;
create policy "admins upload menu images" on storage.objects for insert to authenticated
  with check (bucket_id = 'menu-images' and public.is_admin());
drop policy if exists "admins update menu images" on storage.objects;
create policy "admins update menu images" on storage.objects for update to authenticated
  using (bucket_id = 'menu-images' and public.is_admin());
drop policy if exists "admins delete menu images" on storage.objects;
create policy "admins delete menu images" on storage.objects for delete to authenticated
  using (bucket_id = 'menu-images' and public.is_admin());
