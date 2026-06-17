import { image } from './images'

export interface Licitacion {
  id: string
  code: string
  status: 'Publicada' | 'En Análisis' | 'Presentada' | 'Adjudicada' | 'Finalizada'
  category: string
  title: string
  client: string
  location: string
  apertura: string
  cierre: string
  budget: string
  docs: number
  consultas?: number
  image: string
}

/** Imagen única por licitación, alineada a categoría y tipo de obra. */
const LICITACION_MEDIA: Record<string, string> = {
  'lic-1': 'proj-hosp-2026-01',
  'lic-2': 'proj-solar-2026-02',
  'lic-3': 'proj-grid-2026-05',
  'lic-4': 'proj-school-2026-03',
  'lic-5': 'proj-infra01-a-2026',
  'lic-6': 'proj-ind01-a-2026',
  'lic-7': 'proj-salud01-a-2026',
  'lic-8': 'proj-ener01-a-2026',
  'lic-9': 'proj-infra02-a-2026',
  'lic-10': 'proj-ener02-a-2026',
  'lic-11': 'proj-salud02-a-2026',
  'lic-12': 'proj-ind02-a-2026',
}

const CATEGORY_MEDIA: Record<string, string> = {
  'Obra Civil': 'proj-hosp-2026-01',
  Energía: 'proj-solar-2026-02',
  Infraestructura: 'proj-grid-2026-05',
  Equipamiento: 'proj-salud01-a-2026',
  Mantenimiento: 'div-mant-2026-06',
}

export function licitacionImage(lic: Pick<Licitacion, 'id' | 'category'>): string {
  const key = LICITACION_MEDIA[lic.id] ?? CATEGORY_MEDIA[lic.category] ?? 'lic-hero-bg-2026'
  return image(key)
}

function withImage(lic: Omit<Licitacion, 'image'>): Licitacion {
  return { ...lic, image: licitacionImage(lic) }
}

export const licitaciones: Licitacion[] = [
  withImage({ id: 'lic-1', code: 'LP-2026-045-SAL', status: 'Publicada', category: 'Obra Civil', title: 'Construcción de Hospital de Alta Complejidad - Zona Norte', client: 'Ministerio de Obras Públicas de Salta', location: 'Tartagal, Salta', apertura: '14/08/2026', cierre: '29/09/2026', budget: '$ 4.850M', docs: 6, consultas: 2 }),
  withImage({ id: 'lic-2', code: 'CP-2026-112-JUJ', status: 'Publicada', category: 'Energía', title: 'Ampliación Parque Solar Fotovoltaico - Etapa II 30 MW', client: 'Dirección Provincial de Energía de Jujuy', location: 'Susques, Jujuy', apertura: '19/07/2026', cierre: '24/08/2026', budget: '$ 3.800M', docs: 4, consultas: 1 }),
  withImage({ id: 'lic-3', code: 'LP-2026-078-TUC', status: 'En Análisis', category: 'Infraestructura', title: 'Duplicación de Calzada Ruta Nacional 9 - Tramo Rosario de la Frontera', client: 'Dirección Nacional de Vialidad - Distrito IV', location: 'Rosario de la Frontera, Salta', apertura: '09/06/2026', cierre: '27/07/2026', budget: '$ 6.500M', docs: 6, consultas: 3 }),
  withImage({ id: 'lic-4', code: 'LP-2026-033-SAL', status: 'Presentada', category: 'Obra Civil', title: 'Construcción de 12 Establecimientos Educativos - Programa Federal', client: 'Ministerio de Educación de Salta', location: 'Diversas localidades, Salta', apertura: '19/05/2026', cierre: '29/06/2026', budget: '$ 3.200M', docs: 4, consultas: 1 }),
  withImage({ id: 'lic-5', code: 'CP-2025-201-SAL', status: 'Adjudicada', category: 'Infraestructura', title: 'Renovación de Red Cloacal - Cuenca Este', client: 'Aguas del Norte SA', location: 'Salta Capital, Salta', apertura: '14/11/2025', cierre: '19/12/2025', budget: '$ 890M', docs: 3 }),
  withImage({ id: 'lic-6', code: 'LP-2025-145-JUJ', status: 'Adjudicada', category: 'Infraestructura', title: 'Construcción Planta de Tratamiento de Residuos Sólidos Urbanos', client: 'Gobierno de la Provincia de Jujuy', location: 'Palpalá, Jujuy', apertura: '09/08/2025', cierre: '04/10/2025', budget: '$ 2.100M', docs: 3 }),
  withImage({ id: 'lic-7', code: 'LP-2026-019-SAL', status: 'Publicada', category: 'Equipamiento', title: 'Equipamiento Médico Hospital Regional Tartagal', client: 'Ministerio de Salud de Salta', location: 'Tartagal, Salta', apertura: '01/07/2026', cierre: '15/08/2026', budget: '$ 450M', docs: 5, consultas: 0 }),
  withImage({ id: 'lic-8', code: 'CP-2026-088-FOR', status: 'Publicada', category: 'Mantenimiento', title: 'Mantenimiento Integral Red Eléctrica Media Tensión', client: 'EDENOR Formosa', location: 'Formosa Capital, Formosa', apertura: '05/08/2026', cierre: '20/09/2026', budget: '$ 320M', docs: 3, consultas: 1 }),
  withImage({ id: 'lic-9', code: 'LP-2025-178-TUC', status: 'Finalizada', category: 'Obra Civil', title: 'Ampliación Terminal de Ómnibus San Miguel de Tucumán', client: 'Municipalidad de San Miguel de Tucumán', location: 'San Miguel de Tucumán, Tucumán', apertura: '10/03/2025', cierre: '30/04/2025', budget: '$ 1.800M', docs: 4 }),
  withImage({ id: 'lic-10', code: 'CP-2025-156-SAL', status: 'Finalizada', category: 'Energía', title: 'Instalación Sistema de Iluminación LED Vial RN 34', client: 'Dirección Nacional de Vialidad', location: 'Metán - Rosario de la Frontera, Salta', apertura: '15/01/2025', cierre: '28/02/2025', budget: '$ 280M', docs: 3 }),
  withImage({ id: 'lic-11', code: 'LP-2025-134-JUJ', status: 'Adjudicada', category: 'Obra Civil', title: 'Construcción Centro de Salud Palpalá', client: 'Ministerio de Salud de Jujuy', location: 'Palpalá, Jujuy', apertura: '20/06/2025', cierre: '10/08/2025', budget: '$ 650M', docs: 4 }),
  withImage({ id: 'lic-12', code: 'CP-2025-098-SAL', status: 'En Análisis', category: 'Mantenimiento', title: 'Mantenimiento Preventivo Instalaciones Industriales', client: 'Grupo Agroindustrial Norte', location: 'Metán, Salta', apertura: '01/09/2026', cierre: '15/10/2026', budget: '$ 180M', docs: 2, consultas: 2 }),
]

export const licitacionStatuses = ['Todas las Licitaciones', 'Publicadas', 'En Análisis', 'Presentadas', 'Adjudicadas', 'Finalizadas']
export const licitacionCategories = ['Todas las Categorías', 'Obra Civil', 'Energía', 'Infraestructura', 'Equipamiento', 'Mantenimiento']

export const STATUS_FILTER_MAP: Record<string, Licitacion['status'] | null> = {
  'Todas las Licitaciones': null,
  Publicadas: 'Publicada',
  'En Análisis': 'En Análisis',
  Presentadas: 'Presentada',
  Adjudicadas: 'Adjudicada',
  Finalizadas: 'Finalizada',
}
