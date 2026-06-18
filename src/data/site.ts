export const SITE_NAME = 'EMPRENOR'
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://grupo.emprenor.com'

/** Origen actual del sitio (funciona en grupo.emprenor.com y emprenor.com.ar). */
export function getSiteOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return SITE_URL
}

export const DEFAULT_DESCRIPTION =
  'Construcción e instalaciones integradas en el NOA. Doce especialidades técnicas, operación documentada desde 2018 en Salta, Jujuy, Tucumán y Formosa.'

export const formDemoNotice =
  'Formulario demostrativo: los datos no se envían a un servidor. Conecte su backend para habilitar el envío real.'

export function pageTitle(page: string): string {
  return `${page} | ${SITE_NAME}`
}
