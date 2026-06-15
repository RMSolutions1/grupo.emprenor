export const SITE_NAME = 'EMPRENOR GROUP'
export const SITE_URL = 'https://www.emprenor.com.ar'
export const DEFAULT_DESCRIPTION =
  'Ingeniería, construcción y energía. Más de 18 años desarrollando proyectos de gran escala en el Norte Argentino.'

export const formDemoNotice =
  'Formulario demostrativo: los datos no se envían a un servidor. Conecte su backend para habilitar el envío real.'

export function pageTitle(page: string): string {
  return `${page} | ${SITE_NAME}`
}
