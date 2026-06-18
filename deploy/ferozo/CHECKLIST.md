# Deploy EMPRENOR en Ferozo

Misma web y **misma base de datos Supabase** que Vercel. No reemplaza `grupo.emprenor.com`.

## 1. Preparar build local

```bash
cp .env.ferozo.example .env.ferozo
# Editar .env.ferozo — copiar claves Supabase desde .env.local
```

Variables mínimas en `.env.ferozo`:

| Variable | Ejemplo |
|----------|---------|
| `VITE_SITE_URL` | `https://www.emprenor.com.ar` |
| `VITE_SUPABASE_URL` | Igual que en `.env.local` |
| `VITE_SUPABASE_ANON_KEY` | Igual que en `.env.local` |

Build:

```bash
npm run build:ferozo
```

O en Windows: doble clic en `scripts\build-ferozo.bat`.

Resultado: carpeta `dist/` con `.htaccess`, assets y SEO apuntando al dominio .com.ar.

### Segundo dominio (`www.grupo.emprenor.com.ar`)

Opción A — **Redirigir** en Ferozo/cPanel (recomendado para SEO):

- `www.grupo.emprenor.com.ar` → 301 → `https://www.emprenor.com.ar`

Opción B — **Mismo sitio en ambos**:

1. Cambiar `VITE_SITE_URL` a `https://www.grupo.emprenor.com.ar`
2. Volver a ejecutar `npm run build:ferozo`
3. Subir `dist/` al hosting del segundo dominio

## 2. Supabase (solo agregar URLs)

Dashboard → **Authentication** → **URL Configuration**:

**Redirect URLs** (agregar, no borrar las de Vercel):

```
https://www.emprenor.com.ar/**
https://www.grupo.emprenor.com.ar/**
```

Con esto el panel `/admin` funciona también desde .com.ar.

## 3. DNS en Ferozo / registrador

Para cada dominio (`emprenor.com.ar`, `grupo.emprenor.com.ar`):

| Registro | Nombre | Valor |
|----------|--------|-------|
| A | `@` | IP del servidor Ferozo (panel → Información del servidor) |
| A o CNAME | `www` | Misma IP o CNAME que indique Ferozo |

Esperar propagación DNS (15 min – 48 h).

## 4. SSL en Ferozo (cPanel)

1. **SSL/TLS** → **Manage SSL sites** o **AutoSSL**
2. Activar Let's Encrypt para `emprenor.com.ar` y `www`
3. Repetir para `grupo.emprenor.com.ar` si aplica

El `.htaccess` incluido fuerza HTTPS.

## 5. Subir archivos

1. cPanel → **Administrador de archivos** → `public_html/`
2. Borrar contenido previo del sitio (backup antes si hace falta)
3. Subir **todo** el contenido de `dist/` (no la carpeta `dist` en sí):
   - `index.html`
   - `.htaccess`
   - `assets/`
   - `brand/`, `images/`, etc.

FTP: modo binario, mismo destino `public_html/`.

## 6. Verificación post-deploy

- [ ] `https://www.emprenor.com.ar/` carga el home
- [ ] `https://www.emprenor.com.ar/contacto` (recarga directa, sin 404)
- [ ] Formulario de contacto envía OK (usa Supabase directo)
- [ ] `https://www.emprenor.com.ar/admin/login` muestra login
- [ ] Contenido CMS igual que en grupo.emprenor.com
- [ ] `https://grupo.emprenor.com` sigue funcionando en Vercel (sin cambios)

## 7. Actualizar el sitio en Ferozo

Cada vez que cambie el código:

```bash
git pull
npm run build:ferozo
# Subir dist/ por FTP
```

Vercel se actualiza solo con push a `main`; Ferozo requiere subir `dist/` manualmente (o automatizar FTP aparte).

## Notas

- **Formularios:** en Ferozo no hay `/api/contact`; el sitio guarda en Supabase vía RPC `submit_contact_submission` (misma tabla que Vercel).
- **Rate limit** del servidor (5/hora) solo aplica en Vercel; en Ferozo no.
- **Service role key** no va en Ferozo — solo la anon key en el build.

## Sincronización con grupo.emprenor.com

| Tipo de cambio | ¿Se sincroniza solo? | Cómo |
|----------------|----------------------|------|
| Contenido CMS (proyectos, blog, textos del panel) | **Sí, al instante** | Misma base Supabase en ambos sitios |
| Cambios de código (diseño, bugs, features) | **No automático hoy** | Vercel despliega con `git push`; Ferozo requiere `npm run build:ferozo` + subir `dist/` |
| Formularios recibidos | **Sí** | Misma tabla `contact_submissions` |
| Panel `/admin` | **Sí** | Mismo login Supabase en cualquier dominio |

### Automatizar deploy de código a Ferozo (opcional)

Agregar un GitHub Action que, en cada push a `main`, ejecute `build:ferozo` y suba `dist/` por FTP a Ferozo. Así código y CMS quedarían alineados sin intervención manual.

Alternativa simple: redirigir `www.emprenor.com.ar` → `https://grupo.emprenor.com` y usar un solo frontend (sin duplicar deploys).
