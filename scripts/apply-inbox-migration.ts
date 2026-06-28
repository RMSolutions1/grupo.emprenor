/**
 * Verifica y aplica migrate-inbox-notifications.sql + triggers webhook (pg_net).
 * Requiere DATABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local
 *
 *   npx tsx scripts/apply-inbox-migration.ts
 */
import { readFileSync, existsSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnv()

const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const webhookUrl = process.env.INBOX_WEBHOOK_URL || 'https://grupo.emprenor.com/api/webhooks/inbox'

type ColumnCheck = { table: string; column: string; ok: boolean }

async function queryPg<T extends Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const { default: pg } = await import('pg')
  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })
  await client.connect()
  try {
    const res = await client.query(sql, params)
    return res.rows as T[]
  } finally {
    await client.end()
  }
}

async function columnExists(table: string, column: string): Promise<boolean> {
  const rows = await queryPg<{ exists: boolean }>(
    `select exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = $1 and column_name = $2
    ) as exists`,
    [table, column],
  )
  return rows[0]?.exists === true
}

async function triggerExists(name: string): Promise<boolean> {
  const rows = await queryPg<{ exists: boolean }>(
    `select exists (
      select 1 from pg_trigger t
      join pg_class c on c.oid = t.tgrelid
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and t.tgname = $1 and not t.tgisinternal
    ) as exists`,
    [name],
  )
  return rows[0]?.exists === true
}

async function pgNetAvailable(): Promise<boolean> {
  const rows = await queryPg<{ exists: boolean }>(
    `select exists (select 1 from pg_extension where extname = 'pg_net') as exists`,
  )
  return rows[0]?.exists === true
}

async function tableExists(table: string): Promise<boolean> {
  const rows = await queryPg<{ exists: boolean }>(
    `select exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = $1
    ) as exists`,
    [table],
  )
  return rows[0]?.exists === true
}

async function verify(): Promise<{ columns: ColumnCheck[]; triggers: { name: string; ok: boolean }[]; pgNet: boolean }> {
  const columns: ColumnCheck[] = [
    { table: 'contact_submissions', column: 'staff_reply', ok: await columnExists('contact_submissions', 'staff_reply') },
    { table: 'contact_submissions', column: 'replied_at', ok: await columnExists('contact_submissions', 'replied_at') },
    { table: 'licitacion_consultas', column: 'read', ok: await columnExists('licitacion_consultas', 'read') },
  ]

  const triggers = [
    { name: 'trg_inbox_webhook_contact_submissions', ok: await triggerExists('trg_inbox_webhook_contact_submissions') },
    { name: 'trg_inbox_webhook_licitacion_consultas', ok: await triggerExists('trg_inbox_webhook_licitacion_consultas') },
  ]

  return { columns, triggers, pgNet: await pgNetAvailable() }
}

function buildWebhookSql(secret: string): string {
  const esc = secret.replace(/'/g, "''")
  const url = webhookUrl.replace(/'/g, "''")
  return `
-- Webhook email: aviso a info@emprenor.com.ar en INSERT (emprenor.com.ar + Vercel)
create extension if not exists pg_net with schema extensions;

create or replace function public.notify_inbox_webhook()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  payload jsonb;
begin
  payload := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA,
    'record', to_jsonb(NEW)
  );

  perform net.http_post(
    url := '${url}',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ${esc}'
    ),
    body := payload
  );

  return NEW;
exception
  when others then
    raise warning 'notify_inbox_webhook failed: %', SQLERRM;
    return NEW;
end;
$$;

drop trigger if exists trg_inbox_webhook_contact_submissions on public.contact_submissions;
create trigger trg_inbox_webhook_contact_submissions
  after insert on public.contact_submissions
  for each row execute function public.notify_inbox_webhook();

drop trigger if exists trg_inbox_webhook_licitacion_consultas on public.licitacion_consultas;
create trigger trg_inbox_webhook_licitacion_consultas
  after insert on public.licitacion_consultas
  for each row execute function public.notify_inbox_webhook();
`
}

async function applySql(sql: string, label: string) {
  const { default: pg } = await import('pg')
  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })
  await client.connect()
  try {
    await client.query(sql)
    console.log(`✓ ${label}`)
  } finally {
    await client.end()
  }
}

async function ensureVercelWebhookSecret(secret: string) {
  console.log('\n--- Vercel INBOX_WEBHOOK_SECRET ---')
  console.log('Ejecute (si aún no está en Vercel):')
  console.log(`  echo "${secret}" | npx vercel env add INBOX_WEBHOOK_SECRET production --force`)
}

async function testWebhookEndToEnd() {
  if (!supabaseUrl || !serviceKey) return
  console.log('\n--- Prueba webhook (insert test + email) ---')
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

  const testEmail = `webhook-test-${Date.now()}@local.dev`
  const { data: id, error } = await admin.rpc('submit_contact_submission', {
    p_type: 'newsletter',
    p_email: testEmail,
    p_name: 'Test webhook inbox',
  })

  if (error) {
    console.log(`⚠ RPC test insert: ${error.message}`)
    return
  }

  console.log(`✓ Insert de prueba (${id}) — revise info@emprenor.com.ar en ~30s`)
  await admin.from('contact_submissions').delete().eq('email', testEmail)
  console.log('✓ Registro de prueba eliminado')
}

async function main() {
  console.log('\n=== Bandeja / inbox — verificación Supabase ===\n')

  if (!databaseUrl) {
    console.error('✗ Falta DATABASE_URL en .env.local')
    process.exit(1)
  }

  let state = await verify()

  console.log('Columnas:')
  for (const c of state.columns) {
    console.log(`  ${c.ok ? '✓' : '✗'} ${c.table}.${c.column}`)
  }

  const licTable = await tableExists('licitacion_consultas')
  console.log(`\nTabla licitacion_consultas: ${licTable ? '✓' : '✗ (ejecute migrate-licitaciones-portal.sql)'}`)
  console.log(`Extensión pg_net: ${state.pgNet ? '✓' : '✗ (se intentará crear)'}`)

  console.log('\nTriggers webhook:')
  for (const t of state.triggers) {
    console.log(`  ${t.ok ? '✓' : '✗'} ${t.name}`)
  }

  const needColumns = state.columns.some((c) => !(c.column === 'read' && !licTable) && !c.ok)

  if (needColumns) {
    console.log('\n→ Aplicando migrate-inbox-notifications.sql …')
    const sql = readFileSync(resolve(process.cwd(), 'scripts/migrate-inbox-notifications.sql'), 'utf-8')
    await applySql(sql, 'migrate-inbox-notifications.sql')
    state = await verify()
  }

  let secret = process.env.INBOX_WEBHOOK_SECRET
  if (!secret) {
    secret = randomBytes(32).toString('hex')
    console.log(`\n→ Generado INBOX_WEBHOOK_SECRET (${secret.slice(0, 8)}…)`)
  }

  if (state.triggers.some((t) => !t.ok) || !await triggerExists('trg_inbox_webhook_contact_submissions')) {
    console.log('\n→ Configurando triggers webhook (pg_net) …')
    await applySql(buildWebhookSql(secret), 'triggers inbox webhook')
  }

  // Sync secret to Vercel
  try {
    const { execSync } = await import('node:child_process')
    execSync(`npx vercel env add INBOX_WEBHOOK_SECRET production --force`, {
      input: secret + '\n',
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd(),
    })
    console.log('✓ INBOX_WEBHOOK_SECRET actualizado en Vercel production')
    execSync('npx vercel deploy --prod --yes', { stdio: 'inherit', cwd: process.cwd() })
  } catch (e) {
    await ensureVercelWebhookSecret(secret)
    console.log('⚠ No se pudo actualizar Vercel automáticamente:', e instanceof Error ? e.message : e)
  }

  state = await verify()
  console.log('\n=== Estado final ===')
  for (const c of state.columns) {
    console.log(`  ${c.ok ? '✓' : '✗'} ${c.table}.${c.column}`)
  }
  for (const t of state.triggers) {
    console.log(`  ${t.ok ? '✓' : '✗'} ${t.name}`)
  }

  const allReady = state.columns.filter((c) => !(c.column === 'read' && !licTable)).every((c) => c.ok)
    && state.triggers.every((t) => t.ok)

  if (allReady) {
    console.log('\n✅ Base de datos lista para bandeja + webhooks email')
    if (process.argv.includes('--test')) {
      await testWebhookEndToEnd()
    }
  } else {
    console.log('\n⚠ Quedaron ítems pendientes — revise arriba')
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
