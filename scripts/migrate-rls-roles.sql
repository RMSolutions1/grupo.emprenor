-- Migración: RLS por rol staff (admin/editor)
-- Ejecutar en SQL Editor si ya desplegó scripts/supabase-schema.sql anteriormente

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

-- site_settings
drop policy if exists "Settings: edición autenticada" on public.site_settings;
drop policy if exists "Settings: escritura staff" on public.site_settings;
drop policy if exists "Settings: actualización staff" on public.site_settings;
drop policy if exists "Settings: eliminación staff" on public.site_settings;
create policy "Settings: escritura staff" on public.site_settings for insert with check (public.is_staff());
create policy "Settings: actualización staff" on public.site_settings for update using (public.is_staff());
create policy "Settings: eliminación staff" on public.site_settings for delete using (public.is_admin());

-- projects
drop policy if exists "Projects: CRUD autenticado" on public.projects;
drop policy if exists "Projects: lectura staff" on public.projects;
drop policy if exists "Projects: escritura staff" on public.projects;
drop policy if exists "Projects: actualización staff" on public.projects;
drop policy if exists "Projects: eliminación staff" on public.projects;
create policy "Projects: lectura staff" on public.projects for select using (public.is_staff());
create policy "Projects: escritura staff" on public.projects for insert with check (public.is_staff());
create policy "Projects: actualización staff" on public.projects for update using (public.is_staff());
create policy "Projects: eliminación staff" on public.projects for delete using (public.is_staff());

-- services
drop policy if exists "Services: CRUD autenticado" on public.services;
drop policy if exists "Services: lectura staff" on public.services;
drop policy if exists "Services: escritura staff" on public.services;
drop policy if exists "Services: actualización staff" on public.services;
drop policy if exists "Services: eliminación staff" on public.services;
create policy "Services: lectura staff" on public.services for select using (public.is_staff());
create policy "Services: escritura staff" on public.services for insert with check (public.is_staff());
create policy "Services: actualización staff" on public.services for update using (public.is_staff());
create policy "Services: eliminación staff" on public.services for delete using (public.is_staff());

-- blog
drop policy if exists "Blog: CRUD autenticado" on public.blog_posts;
drop policy if exists "Blog: lectura staff" on public.blog_posts;
drop policy if exists "Blog: escritura staff" on public.blog_posts;
drop policy if exists "Blog: actualización staff" on public.blog_posts;
drop policy if exists "Blog: eliminación staff" on public.blog_posts;
create policy "Blog: lectura staff" on public.blog_posts for select using (public.is_staff());
create policy "Blog: escritura staff" on public.blog_posts for insert with check (public.is_staff());
create policy "Blog: actualización staff" on public.blog_posts for update using (public.is_staff());
create policy "Blog: eliminación staff" on public.blog_posts for delete using (public.is_staff());

-- licitaciones
drop policy if exists "Licitaciones: CRUD autenticado" on public.licitaciones;
drop policy if exists "Licitaciones: lectura staff" on public.licitaciones;
drop policy if exists "Licitaciones: escritura staff" on public.licitaciones;
drop policy if exists "Licitaciones: actualización staff" on public.licitaciones;
drop policy if exists "Licitaciones: eliminación staff" on public.licitaciones;
create policy "Licitaciones: lectura staff" on public.licitaciones for select using (public.is_staff());
create policy "Licitaciones: escritura staff" on public.licitaciones for insert with check (public.is_staff());
create policy "Licitaciones: actualización staff" on public.licitaciones for update using (public.is_staff());
create policy "Licitaciones: eliminación staff" on public.licitaciones for delete using (public.is_staff());

-- contact_submissions
drop policy if exists "Submissions: lectura autenticada" on public.contact_submissions;
drop policy if exists "Submissions: lectura staff" on public.contact_submissions;
drop policy if exists "Submissions: actualización autenticada" on public.contact_submissions;
drop policy if exists "Submissions: actualización staff" on public.contact_submissions;
drop policy if exists "Submissions: eliminación autenticada" on public.contact_submissions;
drop policy if exists "Submissions: eliminación staff" on public.contact_submissions;
create policy "Submissions: lectura staff" on public.contact_submissions for select using (public.is_staff());
create policy "Submissions: actualización staff" on public.contact_submissions for update using (public.is_staff());
create policy "Submissions: eliminación staff" on public.contact_submissions for delete using (public.is_staff());

-- trigger: nuevos usuarios → client (admin/editor solo vía create-admin.ts; provider vía metadata)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_meta_role text := new.raw_user_meta_data->>'role';
  v_role text := 'client';
begin
  if v_meta_role = 'provider' then
    v_role := 'provider';
  end if;
  insert into public.profiles (id, email, role)
  values (new.id, new.email, v_role)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

-- storage: solo staff
drop policy if exists "Media: subida autenticada" on storage.objects;
drop policy if exists "Media: actualización autenticada" on storage.objects;
drop policy if exists "Media: eliminación autenticada" on storage.objects;
create policy "Media: subida autenticada" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_staff());
create policy "Media: actualización autenticada" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_staff());
create policy "Media: eliminación autenticada" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_staff());

update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
where id = 'media';
