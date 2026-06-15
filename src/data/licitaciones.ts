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
}

export const licitaciones: Licitacion[] = [
  { id: 'lic-1', code: 'LP-2026-045-SAL', status: 'Publicada', category: 'Obra Civil', title: 'Construcción de Hospital de Alta Complejidad - Zona Norte', client: 'Ministerio de Obras Públicas de Salta', location: 'Tartagal, Salta', apertura: '14/08/2026', cierre: '29/09/2026', budget: '$ 4.850M', docs: 6, consultas: 2 },
  { id: 'lic-2', code: 'CP-2026-112-JUJ', status: 'Publicada', category: 'Energía', title: 'Ampliación Parque Solar Fotovoltaico - Etapa II 30 MW', client: 'Dirección Provincial de Energía de Jujuy', location: 'Susques, Jujuy', apertura: '19/07/2026', cierre: '24/08/2026', budget: '$ 3.800M', docs: 4, consultas: 1 },
  { id: 'lic-3', code: 'LP-2026-078-TUC', status: 'En Análisis', category: 'Infraestructura', title: 'Duplicación de Calzada Ruta Nacional 9 - Tramo Rosario de la Frontera', client: 'Dirección Nacional de Vialidad - Distrito IV', location: 'Rosario de la Frontera, Salta', apertura: '09/06/2026', cierre: '27/07/2026', budget: '$ 6.500M', docs: 6, consultas: 3 },
  { id: 'lic-4', code: 'LP-2026-033-SAL', status: 'Presentada', category: 'Obra Civil', title: 'Construcción de 12 Establecimientos Educativos - Programa Federal', client: 'Ministerio de Educación de Salta', location: 'Diversas localidades, Salta', apertura: '19/05/2026', cierre: '29/06/2026', budget: '$ 3.200M', docs: 4, consultas: 1 },
  { id: 'lic-5', code: 'CP-2025-201-SAL', status: 'Adjudicada', category: 'Infraestructura', title: 'Renovación de Red Cloacal - Cuenca Este', client: 'Aguas del Norte SA', location: 'Salta Capital, Salta', apertura: '14/11/2025', cierre: '19/12/2025', budget: '$ 890M', docs: 3 },
  { id: 'lic-6', code: 'LP-2025-145-JUJ', status: 'Adjudicada', category: 'Infraestructura', title: 'Construcción Planta de Tratamiento de Residuos Sólidos Urbanos', client: 'Gobierno de la Provincia de Jujuy', location: 'Palpalá, Jujuy', apertura: '09/08/2025', cierre: '04/10/2025', budget: '$ 2.100M', docs: 3 },
  { id: 'lic-7', code: 'LP-2026-019-SAL', status: 'Publicada', category: 'Equipamiento', title: 'Equipamiento Médico Hospital Regional Tartagal', client: 'Ministerio de Salud de Salta', location: 'Tartagal, Salta', apertura: '01/07/2026', cierre: '15/08/2026', budget: '$ 450M', docs: 5, consultas: 0 },
  { id: 'lic-8', code: 'CP-2026-088-SDE', status: 'Publicada', category: 'Mantenimiento', title: 'Mantenimiento Integral Red Eléctrica Media Tensión', client: 'EDESAL', location: 'Santiago del Estero', apertura: '05/08/2026', cierre: '20/09/2026', budget: '$ 320M', docs: 3, consultas: 1 },
  { id: 'lic-9', code: 'LP-2025-178-TUC', status: 'Finalizada', category: 'Obra Civil', title: 'Ampliación Terminal de Ómnibus San Miguel de Tucumán', client: 'Municipalidad de San Miguel de Tucumán', location: 'San Miguel de Tucumán, Tucumán', apertura: '10/03/2025', cierre: '30/04/2025', budget: '$ 1.800M', docs: 4 },
  { id: 'lic-10', code: 'CP-2025-156-SAL', status: 'Finalizada', category: 'Energía', title: 'Instalación Sistema de Iluminación LED Vial RN 34', client: 'Dirección Nacional de Vialidad', location: 'Metán - Rosario de la Frontera, Salta', apertura: '15/01/2025', cierre: '28/02/2025', budget: '$ 280M', docs: 3 },
  { id: 'lic-11', code: 'LP-2025-134-JUJ', status: 'Adjudicada', category: 'Obra Civil', title: 'Construcción Centro de Salud Palpalá', client: 'Ministerio de Salud de Jujuy', location: 'Palpalá, Jujuy', apertura: '20/06/2025', cierre: '10/08/2025', budget: '$ 650M', docs: 4 },
  { id: 'lic-12', code: 'CP-2025-098-SAL', status: 'En Análisis', category: 'Mantenimiento', title: 'Mantenimiento Preventivo Instalaciones Industriales', client: 'Grupo Agroindustrial Norte', location: 'Metán, Salta', apertura: '01/09/2026', cierre: '15/10/2026', budget: '$ 180M', docs: 2, consultas: 2 },
]

export const licitacionStatuses = ['Todas las Licitaciones', 'Publicadas', 'En Análisis', 'Presentadas', 'Adjudicadas', 'Finalizadas']
export const licitacionCategories = ['Todas las Categorías', 'Obra Civil', 'Energía', 'Infraestructura', 'Equipamiento', 'Mantenimiento']
