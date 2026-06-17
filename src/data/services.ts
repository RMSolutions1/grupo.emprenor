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

const imgs = [
  image('div-const-2026-02'),
  image('div-eng-2026-01'),
  image('div-en-2026-03'),
  image('div-ind-2026-04'),
  image('div-viv-2026-05'),
  image('div-mant-2026-06'),
]

export const services: Service[] = [
  {
    id: 'construccion-general',
    title: 'Construcción General',
    tabTitle: 'Construcción',
    description: 'Proyectos llave en mano para viviendas, edificios comerciales, obras públicas y estructuras metálicas.',
    tagline: 'Proyectos llave en mano para todos los sectores.',
    icon: 'ri-building-line',
    image: imgs[0],
    pageImage: image('serv-const-2026'),
    services: ['Viviendas unifamiliares', 'Edificios comerciales', 'Obras públicas', 'Estructuras metálicas'],
  },
  {
    id: 'remodelacion',
    title: 'Remodelación y Refacciones',
    tabTitle: 'Remodelación',
    description: 'Reformas integrales, ampliaciones y refacciones con un solo interlocutor técnico.',
    tagline: 'Reformas integrales con alcance y presupuesto por escrito.',
    icon: 'ri-home-gear-line',
    image: imgs[1],
    pageImage: image('serv-ing-2026'),
    services: ['Remodelación integral', 'Ampliaciones', 'Refacciones', 'Redistribución de ambientes'],
  },
  {
    id: 'albanileria',
    title: 'Albañilería',
    tabTitle: 'Albañilería',
    description: 'Mampostería, hormigón, revoques y estructuras con maestros certificados.',
    tagline: 'Obra gruesa y terminaciones estructurales con control de calidad.',
    icon: 'ri-hammer-line',
    image: imgs[2],
    pageImage: image('serv-const-2026'),
    services: ['Mampostería', 'Revoques', 'Contrapisos', 'Hormigón'],
  },
  {
    id: 'pintura',
    title: 'Pintura y Revestimientos',
    tabTitle: 'Pintura',
    description: 'Acabados premium interior, exterior e industrial con preparación profesional de superficies.',
    tagline: 'Terminaciones de alto rendimiento para obra nueva y remodelación.',
    icon: 'ri-paint-brush-line',
    image: imgs[3],
    pageImage: image('serv-ind-2026'),
    services: ['Interior', 'Exterior', 'Revestimientos', 'Texturas'],
  },
  {
    id: 'electricas',
    title: 'Instalaciones Eléctricas',
    tabTitle: 'Eléctricas',
    description: 'Media y baja tensión, subestaciones, tableros e iluminación con habilitaciones vigentes.',
    tagline: 'Instalaciones eléctricas seguras y documentadas.',
    icon: 'ri-flashlight-line',
    image: imgs[4],
    pageImage: image('serv-energy-2026'),
    services: ['Instalaciones nuevas', 'Tableros', 'Iluminación', 'Trifásica'],
  },
  {
    id: 'sanitarias',
    title: 'Instalaciones Sanitarias',
    tabTitle: 'Sanitarias',
    description: 'Agua potable, cloacales, pluviales y tratamiento de efluentes.',
    tagline: 'Redes sanitarias completas para obra civil e industrial.',
    icon: 'ri-drop-line',
    image: imgs[5],
    pageImage: image('serv-mant-2026'),
    services: ['Instalaciones sanitarias', 'Desagües', 'Agua caliente', 'Reparaciones'],
  },
  {
    id: 'gas',
    title: 'Instalaciones de Gas',
    tabTitle: 'Gas',
    description: 'Gas natural y envasado con matrícula habilitada y certificación de instalaciones.',
    tagline: 'Instalaciones de gas con habilitación y pruebas de estanqueidad.',
    icon: 'ri-fire-line',
    image: imgs[0],
    pageImage: image('serv-energy-2026'),
    services: ['Gas natural', 'Gas envasado', 'Calderas', 'Habilitaciones'],
  },
  {
    id: 'industrial',
    title: 'Obras Industriales',
    tabTitle: 'Industrial',
    description: 'Naves industriales, plantas productivas, agroindustria y sistemas contra incendio.',
    tagline: 'Infraestructura industrial llave en mano.',
    icon: 'ri-store-2-line',
    image: imgs[1],
    pageImage: image('serv-ind-2026'),
    services: ['Naves y galpones', 'Agroindustria', 'Plantas', 'Infraestructura'],
  },
  {
    id: 'agropecuarios',
    title: 'Proyectos Agropecuarios',
    tabTitle: 'Agro',
    description: 'Infraestructura rural, riego tecnificado y electrificación de establecimientos.',
    tagline: 'Obras para el sector agropecuario del NOA.',
    icon: 'ri-plant-line',
    image: imgs[2],
    pageImage: image('serv-const-2026'),
    services: ['Infraestructura rural', 'Riego tecnificado', 'Electrificación', 'Galpones rurales'],
  },
  {
    id: 'climatizacion',
    title: 'Climatización',
    tabTitle: 'Climatización',
    description: 'Aire acondicionado, calefacción y ventilación industrial y comercial.',
    tagline: 'Confort térmico con eficiencia energética.',
    icon: 'ri-temp-cold-line',
    image: imgs[3],
    pageImage: image('serv-mant-2026'),
    services: ['Aire acondicionado', 'Calefacción', 'Ventilación', 'Sistemas VRF'],
  },
  {
    id: 'mantenimiento',
    title: 'Mantenimiento Integral',
    tabTitle: 'Mantenimiento',
    description: 'Servicios preventivos y correctivos para infraestructura, plantas y edificios.',
    tagline: 'Continuidad operativa de sus instalaciones.',
    icon: 'ri-tools-line',
    image: imgs[4],
    pageImage: image('serv-mant-2026'),
    services: ['Mantenimiento preventivo', 'Mantenimiento correctivo', 'Contratos integrales', 'Emergencias'],
  },
  {
    id: 'viviendas',
    title: 'Viviendas Llave en Mano',
    tabTitle: 'Viviendas',
    description: 'Steel frame, madera, hormigón o tradicional — obra completa en el NOA.',
    tagline: 'Viviendas con diseño, ejecución y entrega documentada.',
    icon: 'ri-home-4-line',
    image: imgs[5],
    pageImage: image('serv-viv-2026'),
    services: ['Steel framing', 'Diseño a medida', 'Montaje en sitio', 'Aislación térmica'],
  },
]

export const serviceDetails: Record<string, { intro: string; items: { title: string; description: string }[] }> = {
  'construccion-general': {
    intro: 'Ejecutamos obras de construcción general con gestión integral de proveedores, cronograma y controles de calidad. Un solo equipo técnico coordina todas las especialidades.',
    items: [
      { title: 'Viviendas unifamiliares', description: 'Obra tradicional y sistemas constructivos eficientes para vivienda unifamiliar en el NOA.' },
      { title: 'Edificios comerciales', description: 'Locales, oficinas y edificios de servicios con documentación de obra y entregables según contrato.' },
      { title: 'Obras públicas', description: 'Infraestructura institucional y equipamiento comunitario con cumplimiento de pliegos y normativa vigente.' },
      { title: 'Estructuras metálicas', description: 'Montaje de estructuras livianas y pesadas para naves, tinglados y ampliaciones industriales.' },
    ],
  },
  remodelacion: {
    intro: 'Reformas y ampliaciones con alcance definido, presupuesto por escrito y un único interlocutor para todas las especialidades involucradas.',
    items: [
      { title: 'Remodelación integral', description: 'Renovación completa de viviendas, oficinas y locales comerciales.' },
      { title: 'Ampliaciones', description: 'Extensión de superficies construidas con integración estructural y terminaciones homogéneas.' },
      { title: 'Refacciones', description: 'Reparaciones y mejoras puntuales con mínima interferencia en la operación del inmueble.' },
      { title: 'Redistribución de ambientes', description: 'Modificaciones de layout con intervención en mampostería, instalaciones y acabados.' },
    ],
  },
  albanileria: {
    intro: 'Equipos de albañilería con supervisión técnica, control de materiales y registro fotográfico de avance de obra.',
    items: [
      { title: 'Mampostería', description: 'Muros portantes y divisorios en ladrillo, bloque y sistemas mixtos.' },
      { title: 'Revoques', description: 'Revoques exteriores e interiores con terminaciones listas para pintura o revestimiento.' },
      { title: 'Contrapisos', description: 'Preparación de bases, nivelación y contrapisos de hormigón para pisos finales.' },
      { title: 'Hormigón', description: 'Fundaciones, losas y estructuras de hormigón armado bajo dirección técnica.' },
    ],
  },
  pintura: {
    intro: 'Preparación de superficies y aplicación de sistemas de pintura y revestimiento para interior, exterior e industria.',
    items: [
      { title: 'Interior', description: 'Látex, esmaltes y sistemas decorativos para espacios habitacionales y comerciales.' },
      { title: 'Exterior', description: 'Recubrimientos impermeabilizantes y pinturas de alta durabilidad para fachadas.' },
      { title: 'Revestimientos', description: 'Revestimientos plásticos, piedra y paneles para terminaciones de alto tránsito.' },
      { title: 'Texturas', description: 'Acabados texturados y decorativos para muros interiores y exteriores.' },
    ],
  },
  electricas: {
    intro: 'Instalaciones eléctricas de baja y media tensión con documentación, pruebas y habilitaciones según normativa IRAM y ENRE.',
    items: [
      { title: 'Instalaciones nuevas', description: 'Proyecto y ejecución de instalaciones eléctricas completas para obra nueva.' },
      { title: 'Tableros', description: 'Diseño, armado y certificación de tableros de distribución y fuerza motriz.' },
      { title: 'Iluminación', description: 'Sistemas de iluminación interior, exterior e industrial con eficiencia energética.' },
      { title: 'Trifásica', description: 'Conexiones trifásicas para maquinaria industrial y equipos de gran consumo.' },
    ],
  },
  sanitarias: {
    intro: 'Redes de agua, desagües y pluviales con pruebas de estanqueidad y entrega de planos conforme a obra.',
    items: [
      { title: 'Instalaciones sanitarias', description: 'Agua fría y caliente, desagües cloacales y ventilaciones en edificios y plantas.' },
      { title: 'Desagües', description: 'Colectores, cámaras y conexiones a red pública o sistemas de tratamiento.' },
      { title: 'Agua caliente', description: 'Termotanques, calderas y recirculación para edificios y establecimientos.' },
      { title: 'Reparaciones', description: 'Detección y reparación de pérdidas, obstrucciones y fallas en redes existentes.' },
    ],
  },
  gas: {
    intro: 'Instalaciones de gas natural y envasado con matrícula habilitada, pruebas y certificación de entrega.',
    items: [
      { title: 'Gas natural', description: 'Instalaciones domiciliarias e industriales con conexión a red de distribución.' },
      { title: 'Gas envasado', description: 'Tanques, reguladores y redes para establecimientos sin acceso a gas natural.' },
      { title: 'Calderas', description: 'Instalación y puesta en marcha de calderas y equipos de calefacción a gas.' },
      { title: 'Habilitaciones', description: 'Trámites y certificaciones ante organismos controladores habilitantes.' },
    ],
  },
  industrial: {
    intro: 'Obras industriales y logísticas con coordinación de estructura, instalaciones y sistemas contra incendio.',
    items: [
      { title: 'Naves y galpones', description: 'Estructuras metálicas y cerramientos para almacenamiento y producción.' },
      { title: 'Agroindustria', description: 'Silos, acopios, plantas de procesamiento y infraestructura rural industrial.' },
      { title: 'Plantas', description: 'Acondicionamiento de plantas productivas con redes de servicios integradas.' },
      { title: 'Infraestructura', description: 'Playas de carga, muelles, caminos internos y obras complementarias.' },
    ],
  },
  agropecuarios: {
    intro: 'Soluciones para el sector agropecuario del NOA: infraestructura, riego y electrificación con alcance técnico documentado.',
    items: [
      { title: 'Infraestructura rural', description: 'Galpones, corrales, tinglados y construcciones para producción agropecuaria.' },
      { title: 'Riego tecnificado', description: 'Sistemas de riego por goteo, aspersión y reservorios de almacenamiento.' },
      { title: 'Electrificación', description: 'Líneas, transformadores y tableros para establecimientos rurales.' },
      { title: 'Galpones rurales', description: 'Naves para ganadería, feedlot y almacenamiento de insumos.' },
    ],
  },
  climatizacion: {
    intro: 'Diseño e instalación de sistemas de climatización para confort térmico en viviendas, comercios e industria.',
    items: [
      { title: 'Aire acondicionado', description: 'Equipos split, centrales y sistemas multisplit para ambientes de distinta escala.' },
      { title: 'Calefacción', description: 'Radiadores, pisos radiantes y sistemas de calefacción central.' },
      { title: 'Ventilación', description: 'Extracción, insuflación y renovación de aire en plantas y espacios cerrados.' },
      { title: 'Sistemas VRF', description: 'Climatización variable para edificios comerciales y oficinas.' },
    ],
  },
  mantenimiento: {
    intro: 'Contratos de mantenimiento preventivo y correctivo para edificios, plantas e instalaciones en operación.',
    items: [
      { title: 'Mantenimiento preventivo', description: 'Planes periódicos de inspección, ajuste y conservación de instalaciones.' },
      { title: 'Mantenimiento correctivo', description: 'Reparación de fallas y restauración de servicios con tiempos de respuesta acordados.' },
      { title: 'Contratos integrales', description: 'Servicio completo de operación y conservación de infraestructura.' },
      { title: 'Emergencias', description: 'Atención prioritaria ante fallas críticas en instalaciones y servicios.' },
    ],
  },
  viviendas: {
    intro: 'Viviendas llave en mano con proyecto, ejecución y entrega documentada. Steel frame, tradicional y sistemas mixtos.',
    items: [
      { title: 'Steel framing', description: 'Construcción en seco con steel frame, aislación y terminaciones de calidad.' },
      { title: 'Diseño a medida', description: 'Anteproyecto y proyecto adaptado a normativa local y necesidades del cliente.' },
      { title: 'Montaje en sitio', description: 'Ejecución de obra con cronograma, controles y entrega conforme a contrato.' },
      { title: 'Aislación térmica', description: 'Soluciones térmicas y acústicas para climas extremos del NOA.' },
    ],
  },
}
