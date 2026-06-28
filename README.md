# EMPRENOR — Sitio corporativo + CMS

Sitio web de EMPRENOR GROUP: React 19, Vite, TypeScript, Tailwind CSS 4 y Supabase como backend del panel administrativo.

## Requisitos

- Node.js 20+
- Proyecto en [Supabase](https://supabase.com)
- Cuenta en [Vercel](https://vercel.com) — `grupo.emprenor.com`
- Hosting Ferozo (opcional) — `www.emprenor.com.ar` vía FTP automatizado

## Desarrollo local

```bash
npm install
cp .env.example .env.local
# Completar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
npm run dev
```

Sin Supabase configurado, el sitio funciona con datos estáticos en `src/data/`.

## Supabase (primera vez)

1. Crear proyecto en supabase.com.
2. Ejecutar `scripts/supabase-schema.sql` en el SQL Editor.
3. **Deshabilitar registro público** en Authentication → Providers → Email (o `npx tsx scripts/disable-signup.ts`).
4. Crear usuario admin:

```bash
# En .env.local: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SEED_ADMIN_PASSWORD
npx tsx scripts/create-admin.ts
```

5. (Opcional) Migrar contenido estático a la base:

```bash
npm run seed
```

### Migraciones (proyectos existentes)

```bash
npm run migrate:contact     # formularios: honeypot + rate limit + auth RPC seguro
npm run migrate:rls         # políticas RLS staff
npm run migrate:proveedores # portal proveedores
```

SQL manual: `scripts/migrate-secure-auth.sql`, `scripts/migrate-contact-hardening.sql`, `scripts/migrate-rls-roles.sql`.

## Variables de entorno

| Variable | Dónde | Uso |
|----------|-------|-----|
| `VITE_SUPABASE_URL` | Cliente + Vercel | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Cliente + Vercel | Clave pública (anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo Vercel / scripts | API `/api/contact` y seed |
| `VITE_SITE_URL` | Cliente | URL canónica (`https://grupo.emprenor.com`) |
| `SEED_ADMIN_PASSWORD` | Solo local | Crear/resetear admin |

Verificar configuración:

```bash
npm run verify:env
```

## Despliegue — dos instancias, una base de datos

Documentación completa: **[docs/DEPLOY.md](docs/DEPLOY.md)**

| Sitio | URL | Deploy código | Backend API |
|-------|-----|---------------|-------------|
| **Vercel** | https://grupo.emprenor.com | Automático — `git push main` | Sí (`/api/*`) |
| **Ferozo** | https://www.emprenor.com.ar | Manual — build + FTP `dist/` | No (Supabase directo) |

El **contenido CMS** (proyectos, blog, textos) se sincroniza solo entre ambos vía Supabase.  
Solo el **código compilado** requiere redeploy en cada hosting.

### Vercel (automático)

Push a `main` → Vercel construye y publica (`vercel.json`). CI en GitHub valida lint + test + build.

### Ferozo (build automático, subida FTP manual)

```bash
# Windows: doble clic ACTUALIZAR-FEROZO.bat
# o:
npm run build:ferozo
# → subir contenido de dist/ a public_html/ por FTP
npm run verify:ferozo
```

Guías: [deploy/ferozo/SUBIR-MANUAL.md](deploy/ferozo/SUBIR-MANUAL.md) · [deploy/ferozo/CHECKLIST.md](deploy/ferozo/CHECKLIST.md)

Verificar ambos sitios:

```bash
npm run verify:sites
```

Opcional: GitHub Action `deploy-ferozo.yml` (FTP automático al pushear) — requiere secrets `FEROZO_*`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (Vercel) |
| `npm run lint` | ESLint |
| `npm run test` | Tests unitarios (Vitest) |
| `npm run seed` | Migrar datos estáticos a Supabase |
| `npm run verify:env` | Validar variables y JWT |
| `npm run migrate:contact` | Endurecer formularios en Supabase |
| `npm run deploy:ferozo` | Build + FTP + verificación Ferozo |
| `npx tsx scripts/create-admin.ts` | Crear o resetear usuario admin |

## Panel administrativo

- URL: `/admin` (login en `/acceso` o `/admin/login`)
- Requiere usuario con perfil `admin` o `editor` en la tabla `profiles`
- Módulos: proyectos, servicios, blog, licitaciones, consultas, proveedores, textos, medios, etc.

## Seguridad

- RLS en Supabase: solo perfiles `admin`/`editor` pueden editar contenido.
- Formularios: honeypot + rate limit (5 envíos/hora) vía `/api/contact` (Vercel) y RPC `submit_contact_submission` (Ferozo).
- Registro: roles `admin`/`editor` solo vía `create-admin.ts`; signup público deshabilitado.
- No commitear `.env.local`, `.env.ferozo` ni la service role key.

## Estructura

```
src/
  pages/       # Páginas públicas
  admin/       # Panel CMS
  proveedor/   # Portal proveedores
  data/        # Contenido estático (fallback)
  lib/         # Supabase, CMS, contacto, SEO
  context/     # ContentProvider
api/
  contact.ts   # Serverless Vercel
  reply.ts     # Respuestas email staff
scripts/       # SQL, seed, deploy Ferozo
deploy/ferozo/ # .htaccess y checklist FTP
```
