/**
 * Prueba SMTP Ferozo (lee variables de entorno, nunca commitear contraseñas).
 *
 *   set SMTP_HOST=c2751446.ferozo.com
 *   set SMTP_PORT=465
 *   set SMTP_USER=info@emprenor.com.ar
 *   set SMTP_PASS=...
 *   set MAIL_FROM=EMPRENOR <info@emprenor.com.ar>
 *   npx tsx scripts/test-smtp.ts tu-email@ejemplo.com
 */
import { sendViaSmtp, isSmtpConfigured } from '../api/_lib/smtp.js'

const to = process.argv[2] || process.env.STAFF_NOTIFY_EMAIL || process.env.SMTP_USER
if (!to) {
  console.error('Uso: npx tsx scripts/test-smtp.ts destino@email.com')
  process.exit(1)
}

if (!isSmtpConfigured()) {
  console.error('❌ Faltan SMTP_HOST, SMTP_USER, SMTP_PASS o MAIL_FROM')
  process.exit(1)
}

console.log(`Enviando prueba SMTP → ${to} …`)

const result = await sendViaSmtp({
  to,
  subject: 'Prueba SMTP EMPRENOR — panel admin',
  html: '<p>Si recibió este mensaje, el correo corporativo Ferozo está configurado correctamente.</p>',
})

if (result.ok) {
  console.log('✓ Email enviado')
} else {
  console.error('❌', result.error)
  process.exit(1)
}
