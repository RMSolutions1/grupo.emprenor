-- Seguridad de registro: roles admin/editor nunca desde metadata de signup
-- Ejecutar en SQL Editor de Supabase (proyectos existentes)

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('admin', 'editor', 'provider', 'client'));

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
