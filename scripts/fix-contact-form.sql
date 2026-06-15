-- Fix formularios de contacto: permitir envíos anónimos desde el sitio público
-- Ejecutar en SQL Editor de Supabase (https://supabase.com/dashboard)

-- Política RLS para inserts públicos
drop policy if exists "Submissions: insert público" on public.contact_submissions;
create policy "Submissions: insert público" on public.contact_submissions
  for insert to anon, authenticated
  with check (true);

-- Función RPC alternativa (security definer — funciona aunque falle RLS)
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
  insert into public.contact_submissions (name, email, phone, organization, area, message, type)
  values (p_name, p_email, p_phone, p_organization, p_area, p_message, p_type)
  returning id into new_id;
  return new_id;
end;
$$;

revoke all on function public.submit_contact_submission(text, text, text, text, text, text, text) from public;
grant execute on function public.submit_contact_submission(text, text, text, text, text, text, text) to anon, authenticated;
