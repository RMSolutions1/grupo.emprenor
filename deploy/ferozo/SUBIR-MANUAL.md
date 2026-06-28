# Subir manualmente a Ferozo (FTP)

## Cada vez que actualices el sitio

### Opción A — doble clic (Windows)

1. Ejecutar **`ACTUALIZAR-FEROZO.bat`** en la raíz del proyecto.
2. Se abrirá la carpeta **`dist/`** automáticamente.
3. Subir **todo** su contenido a **`public_html/`** en Ferozo.

### Opción B — terminal

```bash
npm run build:ferozo
```

Luego subir el contenido de `dist/` por FTP.

---

## Qué subir

| Local (`dist/`) | Remoto (Ferozo) |
|-----------------|-----------------|
| `index.html` | `public_html/index.html` |
| `.htaccess` | `public_html/.htaccess` |
| `assets/` | `public_html/assets/` |
| `brand/` | `public_html/brand/` |
| `images/` | `public_html/images/` |
| `robots.txt`, `sitemap.xml` | `public_html/` |

**No** subas la carpeta `dist` como carpeta; subí **el contenido** dentro de ella.

---

## FTP (FileZilla u otro)

- **Host:** el de cPanel → Cuentas FTP (ej. `c2751446.ferozo.com`)
- **Usuario / contraseña:** cuenta FTP del dominio
- **Directorio remoto:** `/public_html`
- **Modo de transferencia:** binario

---

## Después de subir

Comprobar en el navegador:

- https://www.emprenor.com.ar/
- https://www.emprenor.com.ar/contacto
- https://www.emprenor.com.ar/admin/login

O desde terminal:

```bash
npm run verify:ferozo
```

---

## Notas

- El **contenido del CMS** (textos, proyectos, blog) **no** va en el FTP: está en Supabase y se actualiza solo.
- Solo subís **código compilado** cuando cambiás diseño o funciones.
- `VITE_*` en `.env.ferozo` deben estar configurados **antes** del build (no se editan en el servidor).
