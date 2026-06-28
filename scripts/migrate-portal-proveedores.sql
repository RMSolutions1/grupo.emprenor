-- Fase 1: Portal de Proveedores — registro, ofertas digitales, documentos privados
-- Ejecutar en Supabase SQL Editor después de migrate-licitaciones-portal.sql
-- Brief: docs/fase-1-portal-proveedores.md

-- ─── 1. Roles extendidos ───────────────────────────────────────────────────

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('admin', 'editor', 'provider', 'client'));

alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists full_name text;

-- ─── 2. Helper is_provider ─────────────────────────────────────────────────

create or replace function public.is_provider()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'provider'
  );
$$;

revoke all on function public.is_provider() from public;
grant execute on function public.is_provider() to authenticated, anon;

-- ─── 3. Organizaciones (empresa proveedora) ────────────────────────────────

create table if not exists public.organizaciones (
  id uuid primary key default gen_random_uuid(),
  razon_social text not null,
  cuit text not null,
  email text not null,
  phone text,
  address text,
  city text,
  province text,
  rubros text[] not null default '{}',
  website text,
  contact_name text,
  status text not null default 'pendiente'
    check (status in ('pendiente', 'aprobado', 'rechazado', 'suspendido')),
  status_note text,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_organizaciones_cuit on public.organizaciones(cuit);
create index if not exists idx_organizaciones_status on public.organizaciones(status);

create table if not exists public.proveedor_miembros (
  id uuid primary key default gen_random_uuid(),
  organizacion_id uuid not null references public.organizaciones(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  unique (organizacion_id, user_id)
);

create index if not exists idx_proveedor_miembros_user on public.proveedor_miembros(user_id);

-- Helpers que dependen de organizaciones / proveedor_miembros
create or replace function public.my_organizacion_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select m.organizacion_id
  from public.proveedor_miembros m
  where m.user_id = auth.uid()
  limit 1;
$$;

create or replace function public.is_org_approved(p_org_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.organizaciones o
    where o.id = p_org_id and o.status = 'aprobado'
  );
$$;

revoke all on function public.my_organizacion_id() from public;
revoke all on function public.is_org_approved(uuid) from public;
grant execute on function public.my_organizacion_id() to authenticated;
grant execute on function public.is_org_approved(uuid) to authenticated;

-- ─── 4. Requisitos documentales por licitación ─────────────────────────────

create table if not exists public.licitacion_requisitos (
  id uuid primary key default gen_random_uuid(),
  licitacion_id text not null references public.licitaciones(id) on delete cascade,
  doc_kind text not null
    check (doc_kind in (
      'itemizado', 'gantt', 'pliego_firmado', 'garantia', 'anexo_tecnico', 'otro'
    )),
  label text not null,
  required boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_lic_requisitos_lic on public.licitacion_requisitos(licitacion_id);

-- Tipos de documento publicados por EMPRENOR (extensión)
alter table public.licitacion_documentos drop constraint if exists licitacion_documentos_doc_type_check;
-- doc_type es text libre; usar valores: pliego, anexo, plano, acta, plantilla_itemizado, plantilla_gantt, especificaciones, otro

-- Flag: licitación acepta ofertas digitales
alter table public.licitaciones add column if not exists acepta_ofertas boolean not null default true;
alter table public.licitaciones add column if not exists ofertas_cierre timestamptz;

-- ─── 5. Ofertas de proveedores ───────────────────────────────────────────

create table if not exists public.licitacion_ofertas (
  id uuid primary key default gen_random_uuid(),
  licitacion_id text not null references public.licitaciones(id) on delete cascade,
  organizacion_id uuid not null references public.organizaciones(id) on delete cascade,
  status text not null default 'borrador'
    check (status in ('borrador', 'enviada', 'en_evaluacion', 'adjudicada', 'no_seleccionada', 'retirada')),
  monto_total numeric(14, 2),
  moneda text not null default 'ARS',
  notas text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (licitacion_id, organizacion_id)
);

create index if not exists idx_ofertas_lic on public.licitacion_ofertas(licitacion_id);
create index if not exists idx_ofertas_org on public.licitacion_ofertas(organizacion_id);
create index if not exists idx_ofertas_status on public.licitacion_ofertas(status);

create table if not exists public.oferta_documentos (
  id uuid primary key default gen_random_uuid(),
  oferta_id uuid not null references public.licitacion_ofertas(id) on delete cascade,
  requisito_id uuid references public.licitacion_requisitos(id) on delete set null,
  doc_kind text not null,
  title text not null,
  file_url text not null,
  file_name text,
  file_size int,
  mime_type text,
  version int not null default 1,
  created_at timestamptz not null default now()
);

create index if not exists idx_oferta_docs_oferta on public.oferta_documentos(oferta_id);

-- Vincular consultas técnicas al proveedor autenticado (opcional)
alter table public.licitacion_consultas add column if not exists organizacion_id uuid references public.organizaciones(id);
alter table public.licitacion_consultas add column if not exists user_id uuid references auth.users(id);

-- ─── 6. RLS ────────────────────────────────────────────────────────────────

alter table public.organizaciones enable row level security;
alter table public.proveedor_miembros enable row level security;
alter table public.licitacion_requisitos enable row level security;
alter table public.licitacion_ofertas enable row level security;
alter table public.oferta_documentos enable row level security;

-- Organizaciones
drop policy if exists "Org: lectura staff" on public.organizaciones;
create policy "Org: lectura staff" on public.organizaciones
  for select using (public.is_staff());

drop policy if exists "Org: lectura miembro" on public.organizaciones;
create policy "Org: lectura miembro" on public.organizaciones
  for select using (id = public.my_organizacion_id());

drop policy if exists "Org: actualización staff" on public.organizaciones;
create policy "Org: actualización staff" on public.organizaciones
  for update using (public.is_staff());

drop policy if exists "Org: insert staff" on public.organizaciones;
create policy "Org: insert staff" on public.organizaciones
  for insert with check (public.is_staff());

-- Miembros
drop policy if exists "Prov miembros: lectura propia o staff" on public.proveedor_miembros;
create policy "Prov miembros: lectura propia o staff" on public.proveedor_miembros
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists "Prov miembros: insert staff" on public.proveedor_miembros;
create policy "Prov miembros: insert staff" on public.proveedor_miembros
  for insert with check (public.is_staff());

-- Requisitos: lectura pública en licitaciones publicadas
drop policy if exists "Lic req: lectura pública" on public.licitacion_requisitos;
create policy "Lic req: lectura pública" on public.licitacion_requisitos
  for select using (
    exists (
      select 1 from public.licitaciones l
      where l.id = licitacion_id and l.published = true
    )
  );

drop policy if exists "Lic req: CRUD staff" on public.licitacion_requisitos;
create policy "Lic req: CRUD staff" on public.licitacion_requisitos
  for all using (public.is_staff()) with check (public.is_staff());

-- Ofertas
drop policy if exists "Ofertas: lectura staff" on public.licitacion_ofertas;
create policy "Ofertas: lectura staff" on public.licitacion_ofertas
  for select using (public.is_staff());

drop policy if exists "Ofertas: lectura org propia" on public.licitacion_ofertas;
create policy "Ofertas: lectura org propia" on public.licitacion_ofertas
  for select using (
    organizacion_id = public.my_organizacion_id()
  );

drop policy if exists "Ofertas: insert org aprobada" on public.licitacion_ofertas;
create policy "Ofertas: insert org aprobada" on public.licitacion_ofertas
  for insert with check (
    organizacion_id = public.my_organizacion_id()
    and public.is_org_approved(organizacion_id)
  );

drop policy if exists "Ofertas: update borrador propia" on public.licitacion_ofertas;
create policy "Ofertas: update borrador propia" on public.licitacion_ofertas
  for update using (
    organizacion_id = public.my_organizacion_id()
    and status = 'borrador'
  );

drop policy if exists "Ofertas: update staff" on public.licitacion_ofertas;
create policy "Ofertas: update staff" on public.licitacion_ofertas
  for update using (public.is_staff());

-- Documentos de oferta
drop policy if exists "Oferta docs: lectura staff" on public.oferta_documentos;
create policy "Oferta docs: lectura staff" on public.oferta_documentos
  for select using (public.is_staff());

drop policy if exists "Oferta docs: lectura org propia" on public.oferta_documentos;
create policy "Oferta docs: lectura org propia" on public.oferta_documentos
  for select using (
    exists (
      select 1 from public.licitacion_ofertas o
      where o.id = oferta_id and o.organizacion_id = public.my_organizacion_id()
    )
  );

drop policy if exists "Oferta docs: insert borrador propia" on public.oferta_documentos;
create policy "Oferta docs: insert borrador propia" on public.oferta_documentos
  for insert with check (
    exists (
      select 1 from public.licitacion_ofertas o
      where o.id = oferta_id
        and o.organizacion_id = public.my_organizacion_id()
        and o.status = 'borrador'
    )
  );

drop policy if exists "Oferta docs: delete borrador propia" on public.oferta_documentos;
create policy "Oferta docs: delete borrador propia" on public.oferta_documentos
  for delete using (
    exists (
      select 1 from public.licitacion_ofertas o
      where o.id = oferta_id
        and o.organizacion_id = public.my_organizacion_id()
        and o.status = 'borrador'
    )
  );

-- ─── 7. RPC: registro proveedor ────────────────────────────────────────────

create or replace function public.register_proveedor(
  p_razon_social text,
  p_cuit text,
  p_email text,
  p_phone text default null,
  p_address text default null,
  p_city text default null,
  p_province text default null,
  p_rubros text[] default '{}',
  p_contact_name text default null,
  p_website text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_org_id uuid;
begin
  if v_user_id is null then
    raise exception 'Debe iniciar sesión';
  end if;

  if p_razon_social is null or length(trim(p_razon_social)) < 2 then
    raise exception 'Razón social inválida';
  end if;
  if p_cuit is null or length(regexp_replace(p_cuit, '[^0-9]', '', 'g')) < 10 then
    raise exception 'CUIT inválido';
  end if;

  if exists (select 1 from public.proveedor_miembros where user_id = v_user_id) then
    raise exception 'Ya tiene una empresa registrada';
  end if;

  insert into public.organizaciones (
    razon_social, cuit, email, phone, address, city, province,
    rubros, contact_name, website, status
  ) values (
    trim(p_razon_social),
    regexp_replace(trim(p_cuit), '[^0-9-]', '', 'g'),
    trim(p_email),
    nullif(trim(p_phone), ''),
    nullif(trim(p_address), ''),
    nullif(trim(p_city), ''),
    nullif(trim(p_province), ''),
    coalesce(p_rubros, '{}'),
    nullif(trim(p_contact_name), ''),
    nullif(trim(p_website), ''),
    'pendiente'
  )
  returning id into v_org_id;

  insert into public.proveedor_miembros (organizacion_id, user_id, role)
  values (v_org_id, v_user_id, 'owner');

  update public.profiles
  set role = 'provider', email = trim(p_email), phone = nullif(trim(p_phone), '')
  where id = v_user_id;

  return v_org_id;
end;
$$;

revoke all on function public.register_proveedor(text, text, text, text, text, text, text, text[], text, text) from public;
grant execute on function public.register_proveedor(text, text, text, text, text, text, text, text[], text, text) to authenticated;

-- ─── 8. RPC: enviar oferta (sella borrador) ────────────────────────────────

create or replace function public.submit_licitacion_oferta(p_oferta_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_oferta public.licitacion_ofertas%rowtype;
  v_req record;
  v_missing int := 0;
begin
  select * into v_oferta from public.licitacion_ofertas where id = p_oferta_id;
  if not found then raise exception 'Oferta no encontrada'; end if;

  if v_oferta.organizacion_id <> public.my_organizacion_id() then
    raise exception 'No autorizado';
  end if;
  if v_oferta.status <> 'borrador' then
    raise exception 'La oferta ya fue enviada';
  end if;
  if not public.is_org_approved(v_oferta.organizacion_id) then
    raise exception 'Empresa no aprobada';
  end if;

  if not exists (
    select 1 from public.licitaciones l
    where l.id = v_oferta.licitacion_id and l.published = true and l.acepta_ofertas = true
  ) then
    raise exception 'Licitación no acepta ofertas';
  end if;

  for v_req in
    select * from public.licitacion_requisitos
    where licitacion_id = v_oferta.licitacion_id and required = true
  loop
    if not exists (
      select 1 from public.oferta_documentos d
      where d.oferta_id = p_oferta_id and d.doc_kind = v_req.doc_kind
    ) then
      v_missing := v_missing + 1;
    end if;
  end loop;

  if v_missing > 0 then
    raise exception 'Faltan documentos obligatorios (%).', v_missing;
  end if;

  update public.licitacion_ofertas
  set status = 'enviada', submitted_at = now(), updated_at = now()
  where id = p_oferta_id;
end;
$$;

revoke all on function public.submit_licitacion_oferta(uuid) from public;
grant execute on function public.submit_licitacion_oferta(uuid) to authenticated;

-- ─── 9. Storage bucket privado ofertas ─────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'oferta-privada',
  'oferta-privada',
  false,
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
    'image/png'
  ]
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Proveedor sube solo a su carpeta org_id/oferta_id/*
drop policy if exists "Oferta storage: lectura staff" on storage.objects;
create policy "Oferta storage: lectura staff" on storage.objects
  for select using (bucket_id = 'oferta-privada' and public.is_staff());

drop policy if exists "Oferta storage: lectura org" on storage.objects;
create policy "Oferta storage: lectura org" on storage.objects
  for select using (
    bucket_id = 'oferta-privada'
    and (storage.foldername(name))[1] = public.my_organizacion_id()::text
  );

drop policy if exists "Oferta storage: insert org aprobada" on storage.objects;
create policy "Oferta storage: insert org aprobada" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'oferta-privada'
    and public.is_provider()
    and public.is_org_approved(public.my_organizacion_id())
    and (storage.foldername(name))[1] = public.my_organizacion_id()::text
  );

drop policy if exists "Oferta storage: delete org borrador" on storage.objects;
create policy "Oferta storage: delete org borrador" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'oferta-privada'
    and (storage.foldername(name))[1] = public.my_organizacion_id()::text
  );

-- ─── 10. Requisitos default por licitación existente (opcional) ────────────

insert into public.licitacion_requisitos (licitacion_id, doc_kind, label, required, sort_order)
select l.id, r.doc_kind, r.label, true, r.sort_order
from public.licitaciones l
cross join (
  values
    ('itemizado', 'Itemizado / oferta económica (XLSX)', 1),
    ('gantt', 'Cronograma Gantt (XLSX)', 2),
    ('anexo_tecnico', 'Anexo técnico / documentación complementaria', 3)
) as r(doc_kind, label, sort_order)
where l.published = true
  and not exists (
    select 1 from public.licitacion_requisitos lr where lr.licitacion_id = l.id
  );

comment on table public.organizaciones is 'Empresas proveedoras registradas en el portal';
comment on table public.licitacion_ofertas is 'Ofertas digitales por licitación (una por empresa)';
comment on table public.oferta_documentos is 'Documentos adjuntos a una oferta (privados hasta evaluación staff)';

-- ─── 11. Trigger auth: soporte rol provider en signUp ───────────────────────

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
