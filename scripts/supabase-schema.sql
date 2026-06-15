-- EMPRENOR GROUP — Esquema CMS para Supabase
-- Ejecutar en SQL Editor de supabase.com

-- Perfiles de admin (vinculados a auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles: lectura propia" on public.profiles
  for select using (auth.uid() = id);

-- Configuración global del sitio
create table if not exists public.site_settings (
  id text primary key default 'main',
  contact jsonb not null default '{}',
  stats jsonb not null default '[]',
  social jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "Settings: lectura pública" on public.site_settings
  for select using (true);

create policy "Settings: edición autenticada" on public.site_settings
  for all using (auth.role() = 'authenticated');

-- Proyectos
create table if not exists public.projects (
  id text primary key,
  title text not null,
  client text,
  location text,
  year int,
  category text,
  description text,
  tags text[] default '{}',
  image_url text,
  featured boolean default false,
  published boolean default true,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Projects: lectura pública" on public.projects
  for select using (published = true);

create policy "Projects: CRUD autenticado" on public.projects
  for all using (auth.role() = 'authenticated');

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

create policy "Services: lectura pública" on public.services for select using (published = true);
create policy "Services: CRUD autenticado" on public.services for all using (auth.role() = 'authenticated');

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

create policy "Blog: lectura pública" on public.blog_posts for select using (published = true);
create policy "Blog: CRUD autenticado" on public.blog_posts for all using (auth.role() = 'authenticated');

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

create policy "Licitaciones: lectura pública" on public.licitaciones for select using (published = true);
create policy "Licitaciones: CRUD autenticado" on public.licitaciones for all using (auth.role() = 'authenticated');

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

create policy "Submissions: insert público" on public.contact_submissions
  for insert with check (true);

create policy "Submissions: lectura autenticada" on public.contact_submissions
  for select using (auth.role() = 'authenticated');

-- Storage bucket para imágenes (crear también en Storage UI: bucket "media", público lectura)
-- insert into storage.buckets (id, name, public) values ('media', 'media', true);
