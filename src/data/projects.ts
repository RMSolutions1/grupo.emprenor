import { image } from './images'

export interface Project {
  id: string
  title: string
  client: string
  location: string
  year: number
  category: string
  description: string
  carouselDescription?: string
  tags: string[]
  image: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'proj-1',
    title: 'Hospital Regional de Orán',
    client: 'Ministerio de Salud de Salta',
    location: 'San Ramón de la Nueva Orán, Salta',
    year: 2024,
    category: 'Salud',
    description: 'Construcción integral de hospital regional de alta complejidad. El proyecto incluye 180 camas de internación, 6 quirófanos de última generación, unidad de terapia intensiva con 24 camas, servicio de emergencias con helipuerto, centro de diagnóstico por imágenes con resonador y tomógrafo, y sistema de climatización central inteligente.',
    carouselDescription: 'Construcción integral de hospital regional de 12.000 m² con equipamiento médico completo, sistema de climatización central y helipuerto de emergencias.',
    tags: ['Ingeniería', 'Construcción', 'Energía'],
    image: image('proj-hosp-2026-01'),
    featured: true,
  },
  {
    id: 'proj-2',
    title: 'Parque Solar Fotovoltaico Cafayate',
    client: 'Secretaría de Energía de la Nación',
    location: 'Cafayate, Salta',
    year: 2023,
    category: 'Energía',
    description: 'Diseño, ingeniería y construcción de parque solar fotovoltaico de 50 MW de potencia instalada. El proyecto comprende 120.000 paneles solares bifaciales de última generación, 250 inversores string, estación transformadora 33/132 kV y línea de transmisión de alta tensión de 18 km para conexión al sistema interconectado nacional.',
    carouselDescription: 'Parque solar fotovoltaico de 50 MW con 120.000 paneles bifaciales, estación transformadora y línea de transmisión de 18 km.',
    tags: ['Energía', 'Ingeniería', 'Construcción'],
    image: image('proj-solar-2026-02'),
    featured: true,
  },
  {
    id: 'proj-3',
    title: 'Complejo Educativo Güemes',
    client: 'Ministerio de Educación de Salta',
    location: 'General Güemes, Salta',
    year: 2023,
    category: 'Educación',
    description: 'Construcción integral de complejo educativo de nivel secundario con 24 aulas equipadas, laboratorios de ciencias, física y química, biblioteca multimedial con capacidad para 80 alumnos, SUM cubierto para 400 personas y playón deportivo polideportivo. El establecimiento tiene capacidad para 1.200 alumnos en doble turno.',
    carouselDescription: 'Construcción de complejo educativo con 24 aulas, laboratorios, biblioteca, SUM cubierto y playón deportivo para 1.200 alumnos.',
    tags: ['Construcción', 'Ingeniería', 'Energía'],
    image: image('proj-school-2026-03'),
    featured: true,
  },
  {
    id: 'proj-4',
    title: 'Planta Industrial Alimenticia',
    client: 'Grupo Agroindustrial Norte',
    location: 'Metán, Salta',
    year: 2022,
    category: 'Industrial',
    description: 'Proyecto llave en mano de planta procesadora de alimentos con certificación de normas internacionales. Incluye 3 naves industriales con estructura metálica de grandes luces, oficinas administrativas de 800 m², laboratorio de control de calidad, cámara frigorífica de 2.000 m³ y sistema de tratamiento de efluentes industriales.',
    carouselDescription: 'Proyecto llave en mano de planta procesadora de 8.000 m² con naves industriales, oficinas administrativas y sistema de tratamiento de efluentes.',
    tags: ['Obras Industriales', 'Ingeniería', 'Construcción'],
    image: image('proj-plant-2026-04'),
    featured: true,
  },
  {
    id: 'proj-5',
    title: 'Autovía RN 34 - Tramo Metán',
    client: 'Dirección Nacional de Vialidad',
    location: 'Metán - Rosario de la Frontera, Salta',
    year: 2021,
    category: 'Infraestructura',
    description: 'Obra de transformación en autovía de la Ruta Nacional 34 en un tramo de 32 kilómetros. El proyecto incluye duplicación de calzada, construcción de 4 puentes, 3 intercambiadores a distinto nivel, iluminación LED integral, señalización horizontal y vertical, y barreras de seguridad metálicas.',
    carouselDescription: 'Transformación en autovía de 32 km con duplicación de calzada, 4 puentes, 3 intercambiadores e iluminación LED integral.',
    tags: ['Infraestructura', 'Construcción', 'Ingeniería'],
    image: image('proj-grid-2026-05'),
    featured: true,
  },
  {
    id: 'proj-6',
    title: 'Escuela Técnica N° 8',
    client: 'Ministerio de Educación de Jujuy',
    location: 'San Salvador de Jujuy, Jujuy',
    year: 2022,
    category: 'Educación',
    description: 'Diseño y construcción de escuela técnica con orientación electromecánica. El proyecto incluye 16 aulas, 4 talleres especializados con maquinaria industrial, laboratorio de automatización, aula de informática y espacio administrativo. Capacidad para 800 alumnos.',
    tags: ['Construcción', 'Ingeniería'],
    image: image('proj-edu02-a-2026'),
  },
  {
    id: 'proj-7',
    title: 'Centro de Salud Barrial',
    client: 'Municipalidad de Salvador Mazza',
    location: 'Salvador Mazza, Salta',
    year: 2023,
    category: 'Salud',
    description: 'Construcción de centro de atención primaria de la salud con 12 consultorios, sala de rayos X, farmacia, vacunatorio, sala de espera climatizada y estacionamiento para ambulancias. Diseñado para atender a una población de 25.000 habitantes.',
    tags: ['Construcción', 'Ingeniería'],
    image: image('proj-salud02-a-2026'),
  },
  {
    id: 'proj-8',
    title: 'Red de Distribución Tartagal',
    client: 'EDESA - Empresa de Energía de Salta',
    location: 'Tartagal, Salta',
    year: 2022,
    category: 'Energía',
    description: 'Ampliación integral de la red de distribución eléctrica en media tensión de 13,2 kV. El proyecto incluye 45 kilómetros de tendido trifásico, instalación de 120 transformadores de distribución, 45 seccionalizadores telecontrolados y 2.800 nuevas conexiones domiciliarias con medidores inteligentes.',
    tags: ['Energía', 'Ingeniería'],
    image: image('proj-ener02-a-2026'),
  },
  {
    id: 'proj-9',
    title: 'Subestación Transformadora Güemes',
    client: 'Transportadora de Electricidad del Norte',
    location: 'General Güemes, Salta',
    year: 2021,
    category: 'Energía',
    description: 'Construcción de subestación transformadora 132/33/13,2 kV con dos transformadores de potencia de 60 MVA cada uno, sistema de barras dobles con interruptor de acoplamiento, sala de comando con sistema SCADA y playa de maniobras para líneas de alta tensión.',
    tags: ['Energía', 'Ingeniería', 'Construcción'],
    image: image('proj-ener03-a-2026'),
  },
  {
    id: 'proj-10',
    title: 'Centro Logístico Norte',
    client: 'Transportadora Logística SA',
    location: 'Perico, Jujuy',
    year: 2022,
    category: 'Industrial',
    description: 'Construcción de centro logístico de distribución regional con 3 galpones modulares de 5.000 m² cada uno, 24 muelles de carga, playa de maniobras para camiones de gran porte, oficinas operativas y sistema contra incendios con reserva de agua de 200 m³.',
    tags: ['Obras Industriales', 'Construcción'],
    image: image('proj-ind02-a-2026'),
  },
  {
    id: 'proj-11',
    title: 'Complejo Residencial Los Lapachos',
    client: 'Instituto Provincial de la Vivienda',
    location: 'Salta Capital, Salta',
    year: 2023,
    category: 'Viviendas',
    description: 'Desarrollo integral de complejo habitacional de 240 viviendas unifamiliares de 65 m² cada una, distribuidas en 12 manzanas con calles pavimentadas, red de agua potable, cloacas, alumbrado público LED, espacio verde comunitario con juegos infantiles y SUM barrial de 400 m².',
    tags: ['Construcción', 'Ingeniería', 'Infraestructura'],
    image: image('proj-viv01-a-2026'),
  },
  {
    id: 'proj-12',
    title: 'Viviendas Modulares de Emergencia',
    client: 'Ministerio de Desarrollo Social',
    location: 'Santa Victoria Este, Salta',
    year: 2022,
    category: 'Viviendas',
    description: 'Fabricación e instalación de 80 viviendas modulares de rápida ejecución para comunidades rurales dispersas. Cada unidad de 45 m² incluye 2 dormitorios, cocina-comedor, baño completo y panel solar para abastecimiento eléctrico autónomo. Sistema constructivo con paneles termoacústicos.',
    tags: ['Viviendas', 'Energía'],
    image: image('proj-viv02-a-2026'),
  },
  {
    id: 'proj-13',
    title: 'Planta Potabilizadora Norte',
    client: 'Aguas del Norte SA',
    location: 'Orán, Salta',
    year: 2023,
    category: 'Infraestructura',
    description: 'Diseño y construcción de planta potabilizadora de agua con capacidad de tratamiento de 2.500 m³/hora. El proyecto incluye obra de toma sobre río, cámara de carga, floculadores mecánicos, decantadores laminares, filtros rápidos autolavantes, sistema de cloración y laboratorio de control de calidad.',
    tags: ['Infraestructura', 'Ingeniería', 'Construcción'],
    image: image('proj-infra02-a-2026'),
  },
  {
    id: 'proj-14',
    title: 'Desagües Pluviales Cuenca Sur',
    client: 'Municipalidad de Salta',
    location: 'Zona Sur, Salta Capital',
    year: 2022,
    category: 'Infraestructura',
    description: 'Ejecución del sistema de desagües pluviales de la cuenca sur de la ciudad. Obra de 8 kilómetros de conductos rectangulares de hormigón armado de secciones entre 2x1,5 m y 4x2 m, 180 bocas de tormenta, 12 cámaras de inspección, y 3 reservorios de retención con capacidad total de 45.000 m³.',
    tags: ['Infraestructura', 'Construcción'],
    image: image('proj-infra03-a-2026'),
  },
]

const listOrder = ['proj-3', 'proj-6', 'proj-1', 'proj-7', 'proj-2', 'proj-8', 'proj-9', 'proj-4', 'proj-10', 'proj-11', 'proj-12', 'proj-13', 'proj-5', 'proj-14']

export const projectsList = listOrder.map((id) => projects.find((p) => p.id === id)!)

export const featuredProjects = projects.filter((p) => p.featured)

export const projectCategories = ['Todos los Proyectos', 'Educación', 'Salud', 'Energía', 'Industrial', 'Viviendas', 'Infraestructura']
