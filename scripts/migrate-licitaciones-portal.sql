-- Portal de licitaciones: documentos, consultas técnicas y bucket de archivos
-- Ejecutar en Supabase SQL Editor (una sola vez)

alter table public.licitaciones add column if not exists description text;
alter table public.licitaciones add column if not exists image_url text;

create table if not exists public.licitacion_documentos (
  id uuid primary key default gen_random_uuid(),
  licitacion_id text not null references public.licitaciones(id) on delete cascade,
  title text not null,
  doc_type text not null default 'otro',
  file_url text not null,
  file_name text,
  file_size int,
  mime_type text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.licitacion_consultas (
  id uuid primary key default gen_random_uuid(),
  licitacion_id text not null references public.licitaciones(id) on delete cascade,
  name text not null,
  email text not null,
  organization text,
  question text not null,
  answer text,
  status text not null default 'pending',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  answered_at timestamptz
);

create index if not exists idx_lic_docs_licitacion on public.licitacion_documentos(licitacion_id);
create index if not exists idx_lic_consultas_licitacion on public.licitacion_consultas(licitacion_id);

alter table public.licitacion_documentos enable row level security;
alter table public.licitacion_consultas enable row level security;

drop policy if exists "Lic docs: lectura pública" on public.licitacion_documentos;
create policy "Lic docs: lectura pública" on public.licitacion_documentos
  for select using (
    published = true
    and exists (
      select 1 from public.licitaciones l
      where l.id = licitacion_id and l.published = true
    )
  );

drop policy if exists "Lic docs: lectura staff" on public.licitacion_documentos;
create policy "Lic docs: lectura staff" on public.licitacion_documentos
  for select using (public.is_staff());

drop policy if exists "Lic docs: escritura staff" on public.licitacion_documentos;
create policy "Lic docs: escritura staff" on public.licitacion_documentos
  for insert with check (public.is_staff());

drop policy if exists "Lic docs: actualización staff" on public.licitacion_documentos;
create policy "Lic docs: actualización staff" on public.licitacion_documentos
  for update using (public.is_staff());

drop policy if exists "Lic docs: eliminación staff" on public.licitacion_documentos;
create policy "Lic docs: eliminación staff" on public.licitacion_documentos
  for delete using (public.is_staff());

drop policy if exists "Lic consultas: lectura pública publicadas" on public.licitacion_consultas;
create policy "Lic consultas: lectura pública publicadas" on public.licitacion_consultas
  for select using (
    published = true and status = 'published'
    and exists (
      select 1 from public.licitaciones l
      where l.id = licitacion_id and l.published = true
    )
  );

drop policy if exists "Lic consultas: lectura staff" on public.licitacion_consultas;
create policy "Lic consultas: lectura staff" on public.licitacion_consultas
  for select using (public.is_staff());

drop policy if exists "Lic consultas: actualización staff" on public.licitacion_consultas;
create policy "Lic consultas: actualización staff" on public.licitacion_consultas
  for update using (public.is_staff());

drop policy if exists "Lic consultas: eliminación staff" on public.licitacion_consultas;
create policy "Lic consultas: eliminación staff" on public.licitacion_consultas
  for delete using (public.is_staff());

-- RPC: envío público de consulta técnica
create or replace function public.submit_licitacion_consulta(
  p_licitacion_id text,
  p_name text,
  p_email text,
  p_organization text default null,
  p_question text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  if not exists (select 1 from public.licitaciones where id = p_licitacion_id and published = true) then
    raise exception 'Licitación no encontrada';
  end if;
  if p_name is null or length(trim(p_name)) = 0 or length(p_name) > 200 then
    raise exception 'Nombre inválido';
  end if;
  if p_email is null or length(trim(p_email)) = 0 or length(p_email) > 320 then
    raise exception 'Email inválido';
  end if;
  if p_question is null or length(trim(p_question)) = 0 or length(p_question) > 5000 then
    raise exception 'Consulta inválida';
  end if;

  insert into public.licitacion_consultas (licitacion_id, name, email, organization, question)
  values (p_licitacion_id, trim(p_name), trim(p_email), nullif(trim(p_organization), ''), trim(p_question))
  returning id into new_id;

  update public.licitaciones
  set consultas = coalesce(consultas, 0) + 1, updated_at = now()
  where id = p_licitacion_id;

  return new_id;
end;
$$;

revoke all on function public.submit_licitacion_consulta(text, text, text, text, text) from public;
grant execute on function public.submit_licitacion_consulta(text, text, text, text, text) to anon, authenticated;

-- Contadores automáticos de documentos
create or replace function public.sync_licitacion_doc_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.licitaciones
  set docs = (
    select count(*)::int from public.licitacion_documentos d
    where d.licitacion_id = coalesce(new.licitacion_id, old.licitacion_id) and d.published = true
  ),
  updated_at = now()
  where id = coalesce(new.licitacion_id, old.licitacion_id);
  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_sync_licitacion_doc_count on public.licitacion_documentos;
create trigger trg_sync_licitacion_doc_count
  after insert or update or delete on public.licitacion_documentos
  for each row execute function public.sync_licitacion_doc_count();

-- Bucket documentos licitación (PDF, DOCX, planos, ZIP)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'licitacion-docs',
  'licitacion-docs',
  true,
  52428800,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-zip-compressed',
    'image/jpeg',
    'image/png',
    'application/octet-stream'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Lic docs storage: lectura pública" on storage.objects;
create policy "Lic docs storage: lectura pública" on storage.objects
  for select using (bucket_id = 'licitacion-docs');

drop policy if exists "Lic docs storage: subida staff" on storage.objects;
create policy "Lic docs storage: subida staff" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'licitacion-docs' and public.is_staff());

drop policy if exists "Lic docs storage: actualización staff" on storage.objects;
create policy "Lic docs storage: actualización staff" on storage.objects
  for update to authenticated
  using (bucket_id = 'licitacion-docs' and public.is_staff());

drop policy if exists "Lic docs storage: eliminación staff" on storage.objects;
create policy "Lic docs storage: eliminación staff" on storage.objects
  for delete to authenticated
  using (bucket_id = 'licitacion-docs' and public.is_staff());
