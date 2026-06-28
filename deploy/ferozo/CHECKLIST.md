# Deploy EMPRENOR en Ferozo (automatizado)

Misma web y **misma base de datos Supabase** que Vercel (`grupo.emprenor.com`).  
Dominio típico Ferozo: **https://www.emprenor.com.ar**

---

## Configuración inicial (una sola vez)

### 1. Archivo `.env.ferozo`

```bash
cp .env.ferozo.example .env.ferozo
```

Completar en `.env.ferozo`:

| Variable | Dónde obtenerla |
|----------|-----------------|
| `VITE_SITE_URL` | `https://www.emprenor.com.ar` |
| `VITE_SUPABASE_URL` | Igual que `.env.local` → Supabase Dashboard |
| `VITE_SUPABASE_ANON_KEY` | Igual que `.env.local` |
| `FTP_HOST` | cPanel Ferozo → **Cuentas FTP** → servidor (ej. `c2751446.ferozo.com`) |
| `FTP_USER` | Usuario FTP del dominio |
| `FTP_PASS` | Contraseña FTP |
| `FTP_REMOTE_DIR` | `/public_html` (por defecto) |

Opcional: `FTP_PORT=21`, `FTP_SECURE=true` si Ferozo exige FTPS.

### 2. Supabase — URLs de redirect

Dashboard → **Authentication** → **URL Configuration** → **Redirect URLs** (agregar, no borrar Vercel):

```
https://www.emprenor.com.ar/**
https://www.grupo.emprenor.com.ar/**
```

### 3. Migraciones de seguridad (proyectos existentes)

En el SQL Editor de Supabase (o con `DATABASE_URL` en `.env.local`):

```bash
npm run migrate:contact    # honeypot + rate limit en formularios
```

SQL manual: `scripts/migrate-secure-auth.sql` + `scripts/migrate-contact-hardening.sql`

Deshabilitar registro público:

```bash
npx tsx scripts/disable-signup.ts
```

### 4. DNS y SSL en Ferozo

| Registro | Nombre | Valor |
|----------|--------|-------|
| A | `@` | IP del servidor (panel Ferozo) |
| A o CNAME | `www` | Misma IP o CNAME indicado por Ferozo |

cPanel → **SSL/TLS** → AutoSSL / Let's Encrypt para el dominio.  
El `.htaccess` incluido fuerza HTTPS.

---

## Deploy automatizado vs manual (estado actual)

| Paso | Vercel | Ferozo |
|------|--------|--------|
| Build | Automático en push a `main` | `ACTUALIZAR-FEROZO.bat` o `npm run build:ferozo` |
| Publicar | Automático (integración Git Vercel) | **Manual — FTP** `dist/` → `public_html/` |
| Verificar | — | `npm run verify:ferozo` o `npm run verify:sites` |

### Pipeline local Ferozo (antes del FTP)

```bash
npm run deploy:ferozo -- --skip-upload   # lint + test + build, sin FTP
```

### Subida manual por FTP (operación habitual)

1. **Doble clic:** `ACTUALIZAR-FEROZO.bat` (raíz del proyecto) → abre `dist/` listo para FTP.
2. Guía paso a paso: **[SUBIR-MANUAL.md](SUBIR-MANUAL.md)**

```bash
npm run build:ferozo   # solo genera dist/
```

### Comandos individuales

| Comando | Qué hace |
|---------|----------|
| `npm run deploy:ferozo` | Pipeline completo |
| `npm run build:ferozo` | Solo genera `dist/` |
| `npm run upload:ferozo` | Solo sube `dist/` por FTP (requiere build previo) |
| `npm run verify:ferozo` | Comprueba URLs en vivo (`VITE_SITE_URL`) |

### Opciones del deploy

```bash
npm run deploy:ferozo -- --clean-remote   # borra public_html remoto antes de subir
npm run deploy:ferozo -- --skip-upload   # solo verificaciones + build
npm run deploy:ferozo -- --skip-checks   # solo build + FTP (más rápido)
```

---

## Automatización FTP vía GitHub (opcional)

El workflow `.github/workflows/deploy-ferozo.yml` **está preparado** para build + FTP en push a `main`, pero **no está activo** hasta que:

1. Se commitee y pushee al repo remoto.
2. Se configuren los secrets `FEROZO_*` en GitHub.

**Flujo habitual hoy:** `ACTUALIZAR-FEROZO.bat` → subir `dist/` por FTP manualmente.

Si activás GitHub Actions, secrets requeridos:

| Secret | Valor |
|--------|-------|
| `FEROZO_VITE_SITE_URL` | `https://www.emprenor.com.ar` |
| `FEROZO_VITE_SUPABASE_URL` | URL Supabase |
| `FEROZO_VITE_SUPABASE_ANON_KEY` | Anon key |
| `FEROZO_FTP_HOST` | Servidor FTP |
| `FEROZO_FTP_USER` | Usuario FTP |
| `FEROZO_FTP_PASSWORD` | Contraseña FTP |

Vercel despliega `grupo.emprenor.com` por su propia integración Git (no usa este workflow).

---

## Verificación post-deploy

Manual (recomendado tras cada FTP):

```bash
npm run verify:ferozo    # solo Ferozo
npm run verify:sites     # Vercel + Ferozo
```

Comprueba:

- [ ] `https://www.emprenor.com.ar/` → HTTP 200, contiene "EMPRENOR"
- [ ] `https://www.emprenor.com.ar/contacto` → HTTP 200 (SPA, sin 404)
- [ ] `https://www.emprenor.com.ar/admin/login` → HTTP 200
- [ ] `https://www.emprenor.com.ar/robots.txt` → HTTP 200

Pruebas manuales recomendadas:

- [ ] Formulario de contacto envía OK (RPC Supabase + rate limit)
- [ ] Panel `/admin` login funciona
- [ ] Contenido CMS igual que en `grupo.emprenor.com`
- [ ] `https://grupo.emprenor.com` sigue en Vercel sin cambios

---

## Sincronización entre dominios

| Qué editás | ¿Se ve en ambos al instante? |
|------------|------------------------------|
| **Contenido CMS** (proyectos, blog, licitaciones, textos) | **Sí** — misma Supabase |
| **Código** (diseño, features) | Vercel: push a `main` (auto). Ferozo: build + **FTP manual** |
| **Formularios** | **Sí** — misma tabla `contact_submissions` |
| **Panel admin** | **Sí** — mismo login Supabase |

---

## Notas técnicas

- **Formularios en Ferozo:** no hay `/api/contact` serverless; el sitio usa RPC `submit_contact_submission` (honeypot + rate limit 5/h incluidos tras `migrate:contact`).
- **Service role key:** nunca va en Ferozo ni en `.env.ferozo` — solo anon key en el build.
- **`.htaccess`:** se copia automáticamente a `dist/` en cada build.
- **Assets con hash:** Vite genera nombres únicos; use `--clean-remote` periódicamente para limpiar assets viejos en el servidor.

## Segundo dominio (`www.grupo.emprenor.com.ar`)

**Opción A (recomendada):** redirigir 301 → `https://www.emprenor.com.ar` en cPanel.

**Opción B:** cambiar `VITE_SITE_URL`, ejecutar `npm run deploy:ferozo` y apuntar el FTP al `public_html` de ese dominio.
