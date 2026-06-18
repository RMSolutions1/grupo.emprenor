-- Fix: proveedores no podían leer su fila en organizaciones (política EXISTS fallaba en evaluación RLS).
-- Usar my_organizacion_id() (security definer) en la política de lectura.

drop policy if exists "Org: lectura miembro" on public.organizaciones;
create policy "Org: lectura miembro" on public.organizaciones
  for select using (id = public.my_organizacion_id());
