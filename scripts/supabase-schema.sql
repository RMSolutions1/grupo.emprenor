-- EMPRENOR GROUP — Esquema CMS para Supabase
-- Ejecutar en SQL Editor de supabase.com (o volver a ejecutar secciones ALTER si ya existe)

-- Perfiles de admin (vinculados a auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles: lectura propia" on public.profiles;
create policy "Profiles: lectura propia" on public.profiles
  for select using (auth.uid() = id);

-- Helpers RLS: solo usuarios con perfil staff (admin/editor) pueden editar CMS
create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_staff() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.is_staff() to authenticated, anon;
grant execute on function public.is_admin() to authenticated, anon;

-- Configuración global del sitio
create table if not exists public.site_settings (
  id text primary key default 'main',
  contact jsonb not null default '{}',
  stats jsonb not null default '[]',
  social jsonb not null default '{}',
  testimonials jsonb not null default '[]',
  home jsonb not null default '{}',
  empresa jsonb not null default '{}',
  contact_areas jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Settings: lectura pública" on public.site_settings;
create policy "Settings: lectura pública" on public.site_settings
  for select using (true);

drop policy if exists "Settings: edición autenticada" on public.site_settings;
drop policy if exists "Settings: escritura staff" on public.site_settings;
create policy "Settings: escritura staff" on public.site_settings
  for insert with check (public.is_staff());
create policy "Settings: actualización staff" on public.site_settings
  for update using (public.is_staff());
create policy "Settings: eliminación staff" on public.site_settings
  for delete using (public.is_admin());

-- Migración: columnas nuevas en site_settings (si la tabla ya existía)
alter table public.site_settings add column if not exists testimonials jsonb not null default '[]';
alter table public.site_settings add column if not exists home jsonb not null default '{}';
alter table public.site_settings add column if not exists empresa jsonb not null default '{}';
alter table public.site_settings add column if not exists contact_areas jsonb not null default '[]';
alter table public.site_settings add column if not exists pages jsonb not null default '{}';

-- Proyectos
create table if not exists public.projects (
  id text primary key,
  title text not null,
  client text,
  location text,
  year int,
  category text,
  description text,
  carousel_description text,
  tags text[] default '{}',
  image_url text,
  featured boolean default false,
  published boolean default true,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.projects add column if not exists carousel_description text;

drop policy if exists "Projects: lectura pública" on public.projects;
create policy "Projects: lectura pública" on public.projects
  for select using (published = true);

drop policy if exists "Projects: CRUD autenticado" on public.projects;
drop policy if exists "Projects: lectura staff" on public.projects;
drop policy if exists "Projects: escritura staff" on public.projects;
drop policy if exists "Projects: actualización staff" on public.projects;
drop policy if exists "Projects: eliminación staff" on public.projects;
create policy "Projects: lectura staff" on public.projects
  for select using (public.is_staff());
create policy "Projects: escritura staff" on public.projects
  for insert with check (public.is_staff());
create policy "Projects: actualización staff" on public.projects
  for update using (public.is_staff());
create policy "Projects: eliminación staff" on public.projects
  for delete using (public.is_staff());

-- Servicios
create table if not exists public.services (
  id text primary key,
  title text not null,
  tab_title text,
  description text,
  tagline text,
  icon text,
  image_url text,
  page_image_url text,
  services text[] default '{}',
  details jsonb default '{}',
  sort_order int default 0,
  published boolean default true,
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;

drop policy if exists "Services: lectura pública" on public.services;
create policy "Services: lectura pública" on public.services for select using (published = true);

drop policy if exists "Services: CRUD autenticado" on public.services;
drop policy if exists "Services: lectura staff" on public.services;
drop policy if exists "Services: escritura staff" on public.services;
drop policy if exists "Services: actualización staff" on public.services;
drop policy if exists "Services: eliminación staff" on public.services;
create policy "Services: lectura staff" on public.services
  for select using (public.is_staff());
create policy "Services: escritura staff" on public.services
  for insert with check (public.is_staff());
create policy "Services: actualización staff" on public.services
  for update using (public.is_staff());
create policy "Services: eliminación staff" on public.services
  for delete using (public.is_staff());

-- Blog
create table if not exists public.blog_posts (
  id text primary key,
  title text not null,
  excerpt text,
  content text,
  category text,
  author text,
  author_role text,
  author_avatar_url text,
  image_url text,
  date_label text,
  read_time text,
  featured boolean default false,
  published boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

drop policy if exists "Blog: lectura pública" on public.blog_posts;
create policy "Blog: lectura pública" on public.blog_posts for select using (published = true);

drop policy if exists "Blog: CRUD autenticado" on public.blog_posts;
drop policy if exists "Blog: lectura staff" on public.blog_posts;
drop policy if exists "Blog: escritura staff" on public.blog_posts;
drop policy if exists "Blog: actualización staff" on public.blog_posts;
drop policy if exists "Blog: eliminación staff" on public.blog_posts;
create policy "Blog: lectura staff" on public.blog_posts
  for select using (public.is_staff());
create policy "Blog: escritura staff" on public.blog_posts
  for insert with check (public.is_staff());
create policy "Blog: actualización staff" on public.blog_posts
  for update using (public.is_staff());
create policy "Blog: eliminación staff" on public.blog_posts
  for delete using (public.is_staff());

-- Licitaciones
create table if not exists public.licitaciones (
  id text primary key,
  code text,
  status text,
  category text,
  title text not null,
  client text,
  location text,
  apertura text,
  cierre text,
  budget text,
  docs int default 0,
  consultas int default 0,
  published boolean default true,
  updated_at timestamptz not null default now()
);

alter table public.licitaciones enable row level security;

drop policy if exists "Licitaciones: lectura pública" on public.licitaciones;
create policy "Licitaciones: lectura pública" on public.licitaciones for select using (published = true);

drop policy if exists "Licitaciones: CRUD autenticado" on public.licitaciones;
drop policy if exists "Licitaciones: lectura staff" on public.licitaciones;
drop policy if exists "Licitaciones: escritura staff" on public.licitaciones;
drop policy if exists "Licitaciones: actualización staff" on public.licitaciones;
drop policy if exists "Licitaciones: eliminación staff" on public.licitaciones;
create policy "Licitaciones: lectura staff" on public.licitaciones
  for select using (public.is_staff());
create policy "Licitaciones: escritura staff" on public.licitaciones
  for insert with check (public.is_staff());
create policy "Licitaciones: actualización staff" on public.licitaciones
  for update using (public.is_staff());
create policy "Licitaciones: eliminación staff" on public.licitaciones
  for delete using (public.is_staff());

-- Consultas de contacto
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  organization text,
  area text,
  message text,
  type text default 'contact' check (type in ('contact', 'callback', 'newsletter')),
  read boolean default false,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

drop policy if exists "Submissions: insert público" on public.contact_submissions;
create policy "Submissions: insert público" on public.contact_submissions
  for insert to anon, authenticated
  with check (true);

drop policy if exists "Submissions: lectura autenticada" on public.contact_submissions;
drop policy if exists "Submissions: lectura staff" on public.contact_submissions;
create policy "Submissions: lectura staff" on public.contact_submissions
  for select using (public.is_staff());

drop policy if exists "Submissions: actualización autenticada" on public.contact_submissions;
drop policy if exists "Submissions: actualización staff" on public.contact_submissions;
create policy "Submissions: actualización staff" on public.contact_submissions
  for update using (public.is_staff());

drop policy if exists "Submissions: eliminación autenticada" on public.contact_submissions;
drop policy if exists "Submissions: eliminación staff" on public.contact_submissions;
create policy "Submissions: eliminación staff" on public.contact_submissions
  for delete using (public.is_staff());

-- RPC para formularios públicos (alternativa robusta a RLS directo)
create or replace function public.submit_contact_submission(
  p_type text,
  p_name text default null,
  p_email text default null,
  p_phone text default null,
  p_organization text default null,
  p_area text default null,
  p_message text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  if p_type not in ('contact', 'callback', 'newsletter') then
    raise exception 'Tipo inválido';
  end if;
  if p_type = 'contact' and (p_name is null or length(trim(p_name)) = 0 or length(p_name) > 200) then
    raise exception 'Nombre inválido';
  end if;
  if p_type in ('contact', 'newsletter') and (p_email is null or length(trim(p_email)) > 320) then
    raise exception 'Email inválido';
  end if;
  if p_message is not null and length(p_message) > 5000 then
    raise exception 'Mensaje demasiado largo';
  end if;
  insert into public.contact_submissions (name, email, phone, organization, area, message, type)
  values (p_name, p_email, p_phone, p_organization, p_area, p_message, p_type)
  returning id into new_id;
  return new_id;
end;
$$;

revoke all on function public.submit_contact_submission(text, text, text, text, text, text, text) from public;
grant execute on function public.submit_contact_submission(text, text, text, text, text, text, text) to anon, authenticated;

-- Trigger: crear perfil editor al registrar usuario (admin solo vía scripts/create-admin.ts)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'editor')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage: imágenes subidas desde el panel admin
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Media: lectura pública" on storage.objects;
create policy "Media: lectura pública" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "Media: subida autenticada" on storage.objects;
create policy "Media: subida autenticada" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "Media: actualización autenticada" on storage.objects;
create policy "Media: actualización autenticada" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_staff());

drop policy if exists "Media: eliminación autenticada" on storage.objects;
create policy "Media: eliminación autenticada" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_staff());
