-- Triggers pg_net: aviso email a info@emprenor.com.ar en cada INSERT
-- Aplicado automáticamente por: npx tsx scripts/apply-inbox-migration.ts
-- Requiere INBOX_WEBHOOK_SECRET en Vercel (mismo valor embebido al aplicar)

create extension if not exists pg_net with schema extensions;

-- La función y triggers se generan con el secret en apply-inbox-migration.ts
-- Endpoint: https://grupo.emprenor.com/api/webhooks/inbox
