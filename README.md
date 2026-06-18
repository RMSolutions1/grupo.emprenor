# EMPRENOR — Sitio corporativo + CMS

Sitio web de EMPRENOR GROUP: React 19, Vite, TypeScript, Tailwind CSS 4 y Supabase como backend del panel administrativo.

## Requisitos

- Node.js 20+
- Proyecto en [Supabase](https://supabase.com)
- Cuenta en [Vercel](https://vercel.com) (recomendado para despliegue)

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
3. **Deshabilitar registro público** en Authentication → Providers → Email (solo admins creados manualmente).
4. Crear usuario admin:

```bash
# En .env.local: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SEED_ADMIN_PASSWORD
npx tsx scripts/create-admin.ts
```

5. (Opcional) Migrar contenido estático a la base:

```bash
npm run seed
```

### Migración RLS (proyectos existentes)

Si ya desplegaste una versión anterior del esquema, ejecutá también:

```sql
-- scripts/migrate-rls-roles.sql
```

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

## Despliegue en Vercel

Proyecto: **`grupo-emprenor`** → dominio de producción: **https://grupo.emprenor.com**

1. El repo debe estar conectado a ese proyecto en Vercel (rama `main` → Production).
2. Variables de entorno en Vercel (Production + Preview):
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `VITE_SITE_URL=https://grupo.emprenor.com`
3. Deploy manual desde la raíz del repo (proyecto ya vinculado en `.vercel`):

```bash
npx vercel deploy --prod
```

Cada push a `main` en GitHub también despliega automáticamente si el proyecto está conectado.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm run seed` | Migrar datos estáticos a Supabase |
| `npm run verify:env` | Validar variables y JWT |
| `npx tsx scripts/create-admin.ts` | Crear o resetear usuario admin |

## Panel administrativo

- URL: `/admin` (login en `/acceso` o `/admin/login`)
- Requiere usuario con perfil `admin` o `editor` en la tabla `profiles`
- Módulos: proyectos, servicios, blog, licitaciones, consultas, textos, medios, etc.

## Seguridad

- RLS en Supabase: solo perfiles `admin`/`editor` pueden editar contenido.
- Formularios: validación + rate limit (5 envíos/hora por email o teléfono) vía `/api/contact`.
- No commitear `.env.local` ni la service role key.

## Estructura

```
src/
  pages/       # Páginas públicas
  admin/       # Panel CMS
  data/        # Contenido estático (fallback)
  lib/         # Supabase, CMS, contacto, SEO
  context/     # ContentProvider
api/
  contact.ts   # Serverless Vercel
scripts/       # SQL, seed, utilidades
```
