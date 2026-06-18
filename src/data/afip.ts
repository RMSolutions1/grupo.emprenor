/** QR F960 AFIP por dominio (Data Fiscal). */
export const AFIP_F960_QR = {
  /** www.emprenor.com.ar / emprenor.com.ar */
  ar: 'http://qr.afip.gob.ar/?qr=E8UMdYRQ9d09wDpGqQn6CQ,,',
  /** grupo.emprenor.com / emprenor.com */
  com: 'http://qr.afip.gob.ar/?qr=zKlEiCJCcOiL2Svw619v8A,,',
} as const

export const AFIP_F960_IMAGE = 'https://www.afip.gob.ar/images/f960/DATAWEB.jpg'

function isArgentinaDomain(host: string): boolean {
  const h = host.replace(/^www\./, '').toLowerCase()
  return h.endsWith('.com.ar') || h === 'emprenor.com.ar'
}

/** Resuelve el enlace F960 según el dominio actual o VITE_SITE_URL en build. */
export function getAfipF960Url(): string {
  if (typeof window !== 'undefined' && window.location?.hostname) {
    return isArgentinaDomain(window.location.hostname) ? AFIP_F960_QR.ar : AFIP_F960_QR.com
  }
  const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined) ?? ''
  return siteUrl.includes('.com.ar') ? AFIP_F960_QR.ar : AFIP_F960_QR.com
}
