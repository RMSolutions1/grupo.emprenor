-- Bandeja de entrada: respuestas por email y notificaciones
-- Ejecutar en Supabase SQL Editor (una sola vez)

alter table public.contact_submissions
  add column if not exists staff_reply text,
  add column if not exists replied_at timestamptz;

alter table public.licitacion_consultas
  add column if not exists read boolean not null default false;

comment on column public.contact_submissions.staff_reply is 'Última respuesta enviada al contacto desde el panel';
comment on column public.licitacion_consultas.read is 'Marcada como vista por staff en la bandeja';

-- Webhook opcional (Database Webhooks en Supabase Dashboard):
-- Tabla contact_submissions → INSERT → POST https://grupo.emprenor.com/api/webhooks/inbox
-- Tabla licitacion_consultas → INSERT → POST https://grupo.emprenor.com/api/webhooks/inbox
-- Header: Authorization: Bearer <INBOX_WEBHOOK_SECRET>
