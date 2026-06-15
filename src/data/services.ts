import { image } from './images'

export interface Service {
  id: string
  title: string
  tabTitle: string
  description: string
  tagline: string
  icon: string
  image: string
  pageImage: string
  services: string[]
}

export const services: Service[] = [
  {
    id: 'ingenieria',
    title: 'Ingeniería',
    tabTitle: 'Ingeniería',
    description: 'Cálculo estructural, dirección técnica, proyecto ejecutivo e inspección de obras.',
    tagline: 'Soluciones técnicas de alto nivel para cada etapa del proyecto.',
    icon: 'ri-ruler-line',
    image: image('div-eng-2026-01'),
    pageImage: image('serv-ing-2026'),
    services: ['Cálculo Estructural', 'Dirección Técnica', 'Proyecto Ejecutivo', 'Inspección de Obras'],
  },
  {
    id: 'construccion',
    title: 'Construcción',
    tabTitle: 'Construcción',
    description: 'Obras civiles, infraestructura, urbanización y desarrollos a gran escala.',
    tagline: 'Ejecución de obras con los más altos estándares de calidad y seguridad.',
    icon: 'ri-building-line',
    image: image('div-const-2026-02'),
    pageImage: image('serv-const-2026'),
    services: ['Obras Civiles', 'Infraestructura', 'Urbanización'],
  },
  {
    id: 'energia',
    title: 'Energía',
    tabTitle: 'Energía',
    description: 'Instalaciones de baja y media tensión, tableros eléctricos y automatización industrial.',
    tagline: 'Soluciones energéticas integrales para el desarrollo productivo.',
    icon: 'ri-flashlight-line',
    image: image('div-en-2026-03'),
    pageImage: image('serv-energy-2026'),
    services: ['Baja Tensión', 'Media Tensión', 'Tableros Eléctricos', 'Automatización Industrial'],
  },
  {
    id: 'industrial',
    title: 'Obras Industriales',
    tabTitle: 'Obras Industriales',
    description: 'Naves industriales, plantas de producción, galpones y desarrollos logísticos.',
    tagline: 'Proyectos llave en mano para el sector productivo.',
    icon: 'ri-store-2-line',
    image: image('div-ind-2026-04'),
    pageImage: image('serv-ind-2026'),
    services: ['Naves Industriales', 'Plantas de Producción', 'Galpones Logísticos'],
  },
  {
    id: 'viviendas',
    title: 'Viviendas Modulares',
    tabTitle: 'Viviendas',
    description: 'Viviendas tradicionales, prefabricadas y modulares de alta calidad constructiva.',
    tagline: 'Soluciones habitacionales de calidad para cada necesidad.',
    icon: 'ri-home-4-line',
    image: image('div-viv-2026-05'),
    pageImage: image('serv-viv-2026'),
    services: ['Viviendas Tradicionales', 'Viviendas Prefabricadas', 'Viviendas Modulares'],
  },
  {
    id: 'mantenimiento',
    title: 'Mantenimiento Integral',
    tabTitle: 'Mantenimiento',
    description: 'Mantenimiento correctivo, preventivo e integral para infraestructura e instalaciones.',
    tagline: 'Conservación y operación continua de sus instalaciones.',
    icon: 'ri-tools-line',
    image: image('div-mant-2026-06'),
    pageImage: image('serv-mant-2026'),
    services: ['Mantenimiento Correctivo', 'Mantenimiento Preventivo', 'Mantenimiento Integral'],
  },
]

export const serviceDetails: Record<string, { intro: string; items: { title: string; description: string }[] }> = {
  ingenieria: {
    intro: 'Nuestra división de ingeniería combina el conocimiento técnico más avanzado con metodologías probadas para garantizar la viabilidad, seguridad y eficiencia de cada proyecto. Contamos con profesionales especializados en las distintas disciplinas de la ingeniería civil, estructural y eléctrica.',
    items: [
      { title: 'Cálculo Estructural', description: 'Análisis y dimensionamiento de estructuras de hormigón armado, acero y mixtas. Cumplimiento de normativas CIRSOC y sismorresistentes.' },
      { title: 'Dirección Técnica', description: 'Conducción integral del proyecto desde la etapa de diseño hasta la recepción final. Coordinación de equipos multidisciplinarios.' },
      { title: 'Proyecto Ejecutivo', description: 'Desarrollo completo de documentación técnica: planos, memorias de cálculo, cómputos métricos y especificaciones técnicas.' },
      { title: 'Inspección de Obras', description: 'Control de calidad en obra, verificación de cumplimiento de pliegos, seguimiento de avances y certificación de trabajos.' },
    ],
  },
  construccion: {
    intro: 'Nuestra capacidad constructiva abarca desde obras civiles de pequeña escala hasta grandes proyectos de infraestructura. Contamos con equipamiento propio, personal altamente calificado y sistemas de gestión que garantizan el cumplimiento de plazos y presupuestos.',
    items: [
      { title: 'Obras Civiles', description: 'Construcción de edificios públicos, instituciones educativas, centros de salud y edificios corporativos de gran envergadura.' },
      { title: 'Infraestructura', description: 'Desarrollo de obras viales, puentes, desagües pluviales, redes de agua potable, cloacas y sistemas de saneamiento.' },
      { title: 'Urbanización', description: 'Desarrollo integral de barrios, loteos, espacios públicos, parques y obras de equipamiento comunitario.' },
    ],
  },
  energia: {
    intro: 'Diseñamos, construimos y ponemos en marcha sistemas eléctricos de potencia e instalaciones industriales. Nuestra división de energía integra ingeniería, montaje y puesta en servicio con certificación de normas IRAM y habilitaciones de ENRE.',
    items: [
      { title: 'Baja Tensión', description: 'Instalaciones eléctricas domiciliarias, comerciales e industriales. Tableros, canalizaciones y sistemas de iluminación.' },
      { title: 'Media Tensión', description: 'Subestaciones transformadoras, líneas de distribución, seccionadores y sistemas de protección y medición.' },
      { title: 'Tableros Eléctricos', description: 'Diseño y fabricación de tableros de distribución, fuerza motriz y control para instalaciones industriales.' },
      { title: 'Automatización Industrial', description: 'Sistemas PLC, SCADA, variadores de frecuencia y control de procesos para plantas industriales.' },
    ],
  },
  industrial: {
    intro: 'Desarrollamos proyectos industriales llave en mano, desde la ingeniería básica hasta la puesta en marcha. Nuestra experiencia abarca plantas de producción, naves logísticas y complejos agroindustriales en todo el Norte Argentino.',
    items: [
      { title: 'Naves Industriales', description: 'Estructuras metálicas de grandes luces, naves cerradas y semi-cerradas para almacenamiento y producción.' },
      { title: 'Plantas de Producción', description: 'Instalaciones completas con sistemas de climatización, tratamiento de efluentes y redes de servicios.' },
      { title: 'Galpones Logísticos', description: 'Centros de distribución con muelles de carga, playas de maniobras y sistemas contra incendio.' },
    ],
  },
  viviendas: {
    intro: 'Ofrecemos soluciones habitacionales que combinan calidad constructiva, eficiencia energética y plazos de ejecución competitivos. Desde viviendas tradicionales hasta sistemas modulares industrializados.',
    items: [
      { title: 'Viviendas Tradicionales', description: 'Construcción en seco y húmedo con materiales de primera calidad y terminaciones de alto estándar.' },
      { title: 'Viviendas Prefabricadas', description: 'Sistemas constructivos con paneles termoacústicos y montaje rápido en obra.' },
      { title: 'Viviendas Modulares', description: 'Unidades modulares transportables para zonas rurales, emergencias y desarrollos habitacionales.' },
    ],
  },
  mantenimiento: {
    intro: 'Garantizamos la operación continua y segura de sus instalaciones mediante programas de mantenimiento preventivo, correctivo e integral. Atendemos infraestructura pública, plantas industriales y edificios institucionales.',
    items: [
      { title: 'Mantenimiento Correctivo', description: 'Reparación y restauración de instalaciones, equipos y estructuras ante fallas o deterioro.' },
      { title: 'Mantenimiento Preventivo', description: 'Programas periódicos de inspección, lubricación y ajuste para prevenir fallas y extender la vida útil.' },
      { title: 'Mantenimiento Integral', description: 'Contratos de servicio completo que incluyen operación, mantenimiento y gestión de instalaciones.' },
    ],
  },
}
