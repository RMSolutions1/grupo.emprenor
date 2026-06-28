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
| **Deploy código** | **Automático** — push a `main` | **Automático** — GitHub Action FTP (o manual FTP) |
| **Backend API** | `/api/*` en Vercel (mismo origen) | `/api/*` en **grupo.emprenor.com** (CORS) |
| **Formularios** | `POST /api/contact` → Supabase | `POST grupo.emprenor.com/api/contact` → Supabase |
| **Respuestas email admin** | `POST /api/reply` | `POST grupo.emprenor.com/api/reply` (CORS) |
| **Consultas licitación** | RPC Supabase | RPC Supabase (misma DB) |
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
  Apache -->|fetch CORS| VAPI
  VAPI --> DB
  VAPI --> Mail
```

**Patrón unificado:** ambos frontends hablan con la **misma Supabase** (CMS, auth, licitaciones) y con las **mismas APIs Vercel** (formularios, email admin). Ferozo solo sirve archivos estáticos; el backend vive en `grupo.emprenor.com`.

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

### Qué corre en Vercel (compartido por ambos dominios)

| Ruta | Función | Usado desde |
|------|---------|-------------|
| `/api/contact` | Formularios + rate limit + honeypot → Supabase | `.com` y `.com.ar` (CORS) |
| `/api/reply` | Respuestas email panel admin → SMTP | `.com` y `.com.ar` (CORS) |
| `/api/webhooks/inbox` | Notificaciones Supabase → email | Supabase |
| `/api/migrate-rls` | Migraciones protegidas | Scripts |

CORS permitido en `api/_lib/cors.ts` para ambos dominios. Cliente: `src/lib/apiOrigin.ts`.

### Variables en Vercel (Production)

Obligatorias: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SITE_URL`, SMTP (`SMTP_*`, `MAIL_FROM`, etc.).

---

## 2. Ferozo — www.emprenor.com.ar

### Deploy (igual que Vercel: push a `main`)

| Método | Cómo |
|--------|------|
| **Automático** | Push a `main` → GitHub Action `deploy-ferozo.yml` (build + FTP + verify) |
| **Manual FTP** | `ACTUALIZAR-FEROZO.bat` → subir `dist/` a `public_html/` |

Requiere secrets `FEROZO_*` en GitHub para el Action automático.

### Mismo backend que Vercel

- **Formularios:** `src/lib/contact.ts` → `grupo.emprenor.com/api/contact` (CORS)
- **Email admin:** `src/lib/adminMail.ts` → `grupo.emprenor.com/api/reply` (CORS)
- **CMS / auth:** Supabase directo (misma anon key)
- **Respaldo:** si la API Vercel no responde, formularios usan RPC Supabase

Resolución de URL: `src/lib/apiOrigin.ts` (`VITE_API_ORIGIN=https://grupo.emprenor.com`).

### Variables en `.env.ferozo`

```
VITE_SITE_URL=https://www.emprenor.com.ar
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_ORIGIN=https://grupo.emprenor.com
FTP_HOST=...   # solo para deploy:ferozo / upload:ferozo
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

### Formulario de contacto (idéntico en ambos dominios)

```
Browser → POST grupo.emprenor.com/api/contact → Supabase + email staff
          (mismo origen en .com; CORS desde .com.ar)
          ↓ solo si API caída
          RPC submit_contact_submission → Supabase
```

### Respuesta desde panel admin (idéntico)

```
Browser → JWT Supabase → POST grupo.emprenor.com/api/reply → SMTP
```

### Consultas de licitación

```
Browser → RPC submit_licitacion_consulta → Supabase (ambos dominios)
```

### Actualizar contenido CMS

Editar en `/admin` desde **cualquier dominio** → visible al instante en **ambos** (sin redeploy).

### Actualizar código (diseño, bugs, features)

| Dominio | Acción |
|---------|--------|
| grupo.emprenor.com | `git push origin main` → Vercel auto |
| www.emprenor.com.ar | `git push origin main` → GitHub Action FTP (o manual) |

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
| `api/_lib/cors.ts` | CORS compartido .com + .com.ar |
| `src/lib/apiOrigin.ts` | URL base API Vercel |
| `src/lib/contact.ts` | Formularios → API Vercel (+ fallback RPC) |
| `src/lib/adminMail.ts` | Reply → API Vercel |
