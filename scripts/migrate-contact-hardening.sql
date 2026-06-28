-- Endurecimiento formularios de contacto: honeypot + rate limit en RPC, sin insert directo
-- Ejecutar en SQL Editor de Supabase (proyectos existentes)

drop policy if exists "Submissions: insert público" on public.contact_submissions;

drop function if exists public.submit_contact_submission(text, text, text, text, text, text, text);

create or replace function public.submit_contact_submission(
  p_type text,
  p_name text default null,
  p_email text default null,
  p_phone text default null,
  p_organization text default null,
  p_area text default null,
  p_message text default null,
  p_honeypot text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
  v_count int;
  v_since timestamptz := now() - interval '1 hour';
begin
  if p_honeypot is not null and length(trim(p_honeypot)) > 0 then
    return gen_random_uuid();
  end if;

  if p_type not in ('contact', 'callback', 'newsletter') then
    raise exception 'Tipo inválido';
  end if;
  if p_type = 'contact' and (p_name is null or length(trim(p_name)) = 0 or length(p_name) > 200) then
    raise exception 'Nombre inválido';
  end if;
  if p_type in ('contact', 'newsletter') and (p_email is null or length(trim(p_email)) = 0 or length(p_email) > 320) then
    raise exception 'Email inválido';
  end if;
  if p_type = 'callback' and (p_phone is null or length(trim(p_phone)) = 0 or length(p_phone) > 40) then
    raise exception 'Teléfono inválido';
  end if;
  if p_message is not null and length(p_message) > 5000 then
    raise exception 'Mensaje demasiado largo';
  end if;

  if p_type in ('contact', 'newsletter') and p_email is not null then
    select count(*) into v_count
    from public.contact_submissions
    where email = trim(p_email) and created_at >= v_since;
    if v_count >= 5 then
      raise exception 'Demasiados envíos';
    end if;
  end if;

  if p_type = 'callback' and p_phone is not null then
    select count(*) into v_count
    from public.contact_submissions
    where phone = trim(p_phone) and created_at >= v_since;
    if v_count >= 5 then
      raise exception 'Demasiados envíos';
    end if;
  end if;

  insert into public.contact_submissions (name, email, phone, organization, area, message, type)
  values (p_name, p_email, p_phone, p_organization, p_area, p_message, p_type)
  returning id into new_id;
  return new_id;
end;
$$;

revoke all on function public.submit_contact_submission(text, text, text, text, text, text, text, text) from public;
grant execute on function public.submit_contact_submission(text, text, text, text, text, text, text, text) to anon, authenticated;

-- Trigger seguro: solo 'provider' desde metadata; admin/editor solo vía service role + upsert
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
