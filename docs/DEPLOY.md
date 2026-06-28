# Arquitectura de despliegue — estado actual

Documento de referencia de **cómo están implementadas y operan hoy** las dos instancias del sitio EMPRENOR.  
Mismo código fuente, **una sola base Supabase**, dos formas de publicar el frontend.

---

## Resumen

| | **Vercel** | **Ferozo** |
|---|-----------|------------|
| **URL** | https://grupo.emprenor.com | https://www.emprenor.com.ar |
| **Hosting** | Vercel Serverless + CDN | Apache/cPanel (FTP) |
| **Build** | `npm run build` | `npm run build:ferozo` |
| **Variables build** | Vercel Dashboard | `.env.ferozo` local |
| **`VITE_SITE_URL`** | `https://grupo.emprenor.com` | `https://www.emprenor.com.ar` |
| **Deploy código** | **Automático** — push a `main` | **Manual** — subir `dist/` por FTP |
| **Backend API** | Sí (`/api/*` serverless) | No (estático) |
| **Formularios** | `/api/contact` → Supabase | RPC `submit_contact_submission` → Supabase |
| **Respuestas email admin** | `/api/reply` (mismo origen) | `/api/reply` en Vercel (cross-origin) |
| **CMS / contenido** | Supabase (tiempo real) | Supabase (tiempo real) |

---

## Diagrama

```mermaid
flowchart TB
  subgraph repo [Repositorio GitHub main]
    Code[Código React + api/]
  end

  subgraph vercel [Vercel — grupo.emprenor.com]
    VBuild[npm run build]
    VDist[CDN + SPA]
    VAPI["/api/contact · /api/reply · webhooks"]
  end

  subgraph ferozo [Ferozo — www.emprenor.com.ar]
    FBuild["npm run build:ferozo\n(.env.ferozo)"]
    FDist[dist/ → FTP → public_html]
    Apache[Apache + .htaccess]
  end

  subgraph supabase [Supabase — compartido]
    DB[(CMS · auth · formularios · proveedores)]
  end

  subgraph smtp [Correo Ferozo SMTP]
    Mail[info@emprenor.com.ar]
  end

  Code -->|push main| VBuild
  VBuild --> VDist
  VBuild --> VAPI
  Code -->|ACTUALIZAR-FEROZO.bat| FBuild
  FBuild --> FDist
  FDist --> Apache

  VDist --> DB
  Apache --> DB
  VAPI --> DB
  VAPI --> Mail
  FDist -.->|admin reply fetch| VAPI
```

---

## 1. Vercel — grupo.emprenor.com (automático)

### Cómo se despliega

1. Push o merge a la rama **`main`** en GitHub (`RMSolutions1/grupo.emprenor`).
2. **Vercel** detecta el cambio (integración Git, configurada en `vercel.json` → `deploymentEnabled.main: true`).
3. Ejecuta `npm run build` con variables de **Vercel Dashboard** (no usa `.env.local`).
4. Publica frontend + funciones en `api/**/*.ts`.

No hay GitHub Action de deploy para Vercel; la automatización es **nativa de Vercel**.

### CI en GitHub (solo validación)

Workflow `.github/workflows/ci.yml`:

- `npm ci` → `lint` → `test` → `build`
- Se ejecuta en push/PR a `main`; **no sube archivos**, solo comprueba que compila.

### Qué incluye Vercel y Ferozo no

| Ruta | Función |
|------|---------|
| `/api/contact` | Formularios con rate limit + honeypot (service role) |
| `/api/reply` | Respuestas email desde panel admin |
| `/api/webhooks/inbox` | Notificaciones Supabase → email |
| `/api/migrate-rls` | Migraciones protegidas (secret) |

Configuración: `vercel.json` (redirects, SPA rewrites, headers CSP, funciones 30s).

### Variables en Vercel (Production)

Obligatorias: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SITE_URL`, SMTP (`SMTP_*`, `MAIL_FROM`, etc.).

---

## 2. Ferozo — www.emprenor.com.ar (build automático, subida manual)

### Cómo se despliega hoy (operación real)

1. Ejecutar **`ACTUALIZAR-FEROZO.bat`** (o `npm run build:ferozo`).
   - Lint + tests + build con `.env.ferozo`.
   - Genera `dist/` con `.htaccess`, SEO apuntando a `.com.ar`.
2. **Subir manualmente por FTP** el contenido de `dist/` → `public_html/`.
3. (Opcional) `npm run verify:ferozo` para comprobar URLs.

Guía FTP: [deploy/ferozo/SUBIR-MANUAL.md](../deploy/ferozo/SUBIR-MANUAL.md)

### Automatización FTP (preparada, no activa por defecto)

Existe `.github/workflows/deploy-ferozo.yml` que en push a `main` haría build + FTP + verify, **pero requiere**:

1. Commitear y pushear el workflow al repo.
2. Configurar secrets `FEROZO_*` en GitHub.

Hasta entonces, Ferozo se actualiza **solo cuando subís `dist/` por FTP**.

### Diferencias técnicas en Ferozo

- **`deploy/ferozo/.htaccess`**: HTTPS, SPA fallback, `/api/*` → 404 (fuerza fallback Supabase en cliente).
- **Formularios** (`src/lib/contact.ts`): intenta `/api/contact`; si 404, usa RPC Supabase directo.
- **Panel admin** (`src/lib/adminMail.ts`): dominios `.com.ar` llaman a `https://grupo.emprenor.com/api/reply` (CORS permitido en `api/reply.ts`).
- **Sin service role** en el build Ferozo — solo anon key embebida.

### Variables en `.env.ferozo`

```
VITE_SITE_URL=https://www.emprenor.com.ar
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
# Opcional para npm run deploy:ferozo / upload:ferozo:
FTP_HOST=...
FTP_USER=...
FTP_PASS=...
FTP_REMOTE_DIR=/public_html
```

---

## 3. Backend compartido — Supabase

Ambos dominios leen y escriben la **misma** base:

- Contenido CMS (proyectos, servicios, blog, licitaciones, textos).
- Auth del panel `/admin` y portal `/proveedor`.
- Formularios → tabla `contact_submissions`.
- Storage de imágenes (`media` bucket).

**Redirect URLs** en Supabase Auth deben incluir ambos dominios (ver CHECKLIST).

Migraciones SQL aplicables: `npm run migrate:contact`, scripts en `scripts/`.

---

## 4. Flujos por funcionalidad

### Formulario de contacto

```
Vercel:  Browser → POST /api/contact → Supabase (rate limit server)
         ↓ fallback si falla
Ferozo:  Browser → RPC submit_contact_submission → Supabase (rate limit RPC)
```

### Respuesta desde panel admin

```
Vercel:  /admin → JWT → POST /api/reply → SMTP Ferozo
Ferozo:  /admin → JWT → POST grupo.emprenor.com/api/reply → SMTP Ferozo
```

### Actualizar contenido CMS

Editar en `/admin` desde **cualquier dominio** → visible al instante en **ambos** (sin redeploy).

### Actualizar código (diseño, bugs, features)

| Dominio | Acción |
|---------|--------|
| grupo.emprenor.com | `git push origin main` → Vercel despliega solo |
| www.emprenor.com.ar | `ACTUALIZAR-FEROZO.bat` → FTP `dist/` |

---

## 5. Comandos de verificación

```bash
npm run verify:env      # Supabase + RPC formularios (.env.local)
npm run verify:ferozo   # HTTP www.emprenor.com.ar
npm run verify:sites    # Ambos dominios en producción
npm run test            # Tests unitarios
npm run lint            # ESLint
```

---

## 6. Checklist operativo

### Cada cambio de código

- [ ] Push a `main` → esperar deploy Vercel (~1–2 min)
- [ ] `ACTUALIZAR-FEROZO.bat` → subir `dist/` por FTP
- [ ] `npm run verify:sites`

### Solo contenido CMS

- [ ] Editar en `/admin` — no hace falta redeploy en ningún dominio

### Primera vez / nuevo entorno

- [ ] Supabase schema + migraciones
- [ ] Vercel env vars + dominio custom
- [ ] `.env.ferozo` + FTP + SSL Ferozo
- [ ] Redirect URLs Supabase para ambos dominios

---

## 7. Archivos clave del repo

| Archivo | Rol |
|---------|-----|
| `vercel.json` | Deploy Vercel, API, headers |
| `.env.example` | Plantilla Vercel/local |
| `.env.ferozo.example` | Plantilla build Ferozo + FTP |
| `scripts/build-ferozo.ts` | Build estático .com.ar |
| `ACTUALIZAR-FEROZO.bat` | Build listo para FTP (Windows) |
| `deploy/ferozo/.htaccess` | Apache SPA + HTTPS |
| `.github/workflows/ci.yml` | Validación en PR/push |
| `.github/workflows/deploy-ferozo.yml` | FTP automático (opcional) |
| `api/contact.ts` | API formularios Vercel |
| `api/reply.ts` | API email + CORS .com.ar |
| `src/lib/contact.ts` | Formularios con fallback RPC |
| `src/lib/adminMail.ts` | Reply cross-origin desde Ferozo |
