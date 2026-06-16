import { IMAGES } from './images'
import { DEFAULT_DESCRIPTION, SITE_NAME } from './site'

export type SeoCopy = {
  title: string
  description: string
}

export type HeroCopy = {
  label?: string
  title: string
  subtitle?: string
  image?: string
}

export type SectionCopy = {
  label?: string
  title: string
  subtitle?: string
}

export type CtaCopy = {
  label?: string
  title: string
  description: string
  primaryLabel: string
  primaryUrl: string
  secondaryLabel?: string
  secondaryUrl?: string
  image?: string
}

export type GlobalCopy = {
  siteName: string
  siteDescription: string
  footerTagline: string
  footerCopyright: string
  newsletterTitle: string
  newsletterText: string
  navCtaLabel: string
  social: {
    instagram: string
    youtube: string
    facebook: string
  }
}

export type HomePageCopy = {
  seo: SeoCopy
  hero: HeroCopy & { ctaPrimary: string; ctaSecondary: string; ctaSecondaryUrl: string }
  statsIntro: string
  statsImage: string
  services: SectionCopy
  projects: SectionCopy & { linkLabel: string }
  sectors: SectionCopy
  certifications: SectionCopy
  testimonials: SectionCopy
  cta: CtaCopy
}

export type ContactoPageCopy = {
  seo: SeoCopy
  hero: HeroCopy
  form: SectionCopy
  formSuccessTitle: string
  formSuccessText: string
  sidebarTitle: string
  areas: SectionCopy
  callback: SectionCopy
  callbackSuccess: string
}

export type EmpresaPageCopy = {
  seo: SeoCopy
  hero: HeroCopy
  history: SectionCopy & { paragraphs: string[] }
  mission: string
  vision: string
  valuesTitle: string
  team: SectionCopy
  regions: SectionCopy
  cta: CtaCopy
}

export type ServiciosPageCopy = {
  seo: SeoCopy
  hero: HeroCopy
  divisions: SectionCopy
  grid: SectionCopy
  cta: CtaCopy
}

export type ProyectosPageCopy = {
  seo: SeoCopy
  hero: HeroCopy
  cta: CtaCopy
}

export type BlogPageCopy = {
  seo: SeoCopy
}

export type LicitacionesPageCopy = {
  seo: SeoCopy
  hero: HeroCopy
  provider: SectionCopy & {
    ctaPrimary: string
    ctaPrimaryUrl: string
    ctaSecondary: string
    ctaSecondaryUrl: string
  }
}

export type SitePages = {
  global: GlobalCopy
  home: HomePageCopy
  contacto: ContactoPageCopy
  empresa: EmpresaPageCopy
  servicios: ServiciosPageCopy
  proyectos: ProyectosPageCopy
  blog: BlogPageCopy
  licitaciones: LicitacionesPageCopy
}

export const defaultPages: SitePages = {
  global: {
    siteName: SITE_NAME,
    siteDescription: DEFAULT_DESCRIPTION,
    footerTagline: 'Construimos la infraestructura que impulsa el crecimiento del Norte Argentino.',
    footerCopyright: '© 2026 GRUPO EMPRENOR. Todos los derechos reservados.',
    newsletterTitle: 'Newsletter',
    newsletterText: 'Recibí novedades sobre proyectos, licitaciones y el sector de la construcción.',
    navCtaLabel: 'Solicitar Cotización',
    social: {
      instagram: 'https://instagram.com/emprenorgroup',
      youtube: 'https://youtube.com/@emprenorgroup',
      facebook: 'https://facebook.com/emprenorgroup',
    },
  },
  home: {
    seo: { title: 'Inicio', description: DEFAULT_DESCRIPTION },
    hero: {
      title: 'Construimos la infraestructura que impulsa el crecimiento del Norte Argentino.',
      subtitle: 'Más de 15 años desarrollando proyectos de ingeniería, construcción y energía para organismos públicos, industrias y clientes privados.',
      image: IMAGES.hero,
      ctaPrimary: 'Solicitar Cotización',
      ctaSecondary: 'Ver Proyectos',
      ctaSecondaryUrl: '/proyectos',
    },
    statsIntro: '+500 proyectos ejecutados, más de 15 años de experiencia y presencia en 4 provincias del Norte Argentino.',
    statsImage: IMAGES.statsAerial,
    services: {
      title: 'Divisiones de servicio',
      subtitle: 'Soluciones integrales de ingeniería para cada etapa del proyecto.',
    },
    projects: {
      label: 'Portafolio',
      title: 'Proyectos destacados',
      linkLabel: 'Ver todos',
    },
    sectors: { title: 'Sectores que confían en nosotros' },
    certifications: {
      label: 'Calidad Garantizada',
      title: 'Certificaciones',
      subtitle: 'Nuestros procesos y estándares están respaldados por las certificaciones más exigentes a nivel nacional e internacional.',
    },
    testimonials: {
      label: 'Testimonios',
      title: 'Lo que dicen nuestros clientes',
    },
    cta: {
      label: 'Comencemos su proyecto',
      title: 'Solicite una reunión técnica con nuestro equipo de ingeniería',
      description: 'Analizaremos los requerimientos de su proyecto y le presentaremos una propuesta técnica y económica a medida.',
      primaryLabel: 'Solicitar Reunión Técnica',
      primaryUrl: '/contacto',
      secondaryLabel: 'Llamar por Teléfono',
      secondaryUrl: 'tel:+543874312800',
      image: IMAGES.cta,
    },
  },
  contacto: {
    seo: {
      title: 'Contacto',
      description: 'Comuníquese con EMPRENOR GROUP para consultas de ingeniería, construcción, energía y licitaciones.',
    },
    hero: {
      label: 'Contacto',
      title: 'Hablemos de su próximo proyecto',
      subtitle: 'Estamos listos para escuchar sus necesidades y encontrar la mejor solución de ingeniería, construcción o energía para su organización.',
      image: IMAGES.contactoHero,
    },
    form: {
      title: 'Envíenos su consulta',
      subtitle: 'Complete el formulario y un asesor especializado se pondrá en contacto a la brevedad.',
    },
    formSuccessTitle: '¡Consulta enviada!',
    formSuccessText: 'Un asesor especializado se pondrá en contacto a la brevedad.',
    sidebarTitle: 'Información de Contacto',
    areas: {
      title: 'Áreas de Contacto Directo',
      subtitle: 'Comuníquese directamente con el área que mejor se adapte a su necesidad.',
    },
    callback: {
      title: '¿Prefiere que lo llamemos?',
      subtitle: 'Déjenos sus datos y un representante se comunicará en el horario que usted indique.',
    },
    callbackSuccess: '¡Gracias! Nos comunicaremos con usted pronto.',
  },
  empresa: {
    seo: {
      title: 'Empresa',
      description: 'Conozca la historia, valores y equipo directivo de GRUPO EMPRENOR.',
    },
    hero: {
      title: 'Somos GRUPO EMPRENOR',
      subtitle: 'Ingeniería, construcción y energía. Más de 15 años impulsando el desarrollo del Norte Argentino.',
      image: IMAGES.empresaHero,
    },
    history: {
      label: 'Trayectoria',
      title: 'Nuestra Historia',
      paragraphs: [
        'GRUPO EMPRENOR nació en el año 2008 en la ciudad de Salta, fundada por un grupo de ingenieros con la visión de transformar la infraestructura del Norte Argentino. Lo que comenzó como una oficina técnica de tres profesionales, hoy es una empresa de referencia regional con más de 50 colaboradores.',
        'Desde nuestros primeros proyectos de infraestructura eléctrica rural, fuimos expandiendo nuestras capacidades hacia la construcción de obras civiles, edificios públicos, plantas industriales y desarrollos energéticos de gran escala.',
        'Hoy, con presencia en 4 provincias y más de 500 proyectos ejecutados, seguimos comprometidos con la excelencia técnica, la innovación y el desarrollo sostenible de las comunidades donde operamos.',
      ],
    },
    mission: 'Desarrollar proyectos de ingeniería y construcción de excelencia que impulsen el crecimiento económico y social del Norte Argentino, generando valor para nuestros clientes, colaboradores y comunidades.',
    vision: 'Ser la empresa de ingeniería y construcción de referencia en el Norte Argentino para el año 2030, reconocida por nuestra excelencia técnica, innovación, sostenibilidad y compromiso con el desarrollo regional.',
    valuesTitle: 'Nuestros Valores',
    team: {
      label: 'Liderazgo',
      title: 'Equipo Directivo',
      subtitle: 'Profesionales con amplia trayectoria que lideran cada área con excelencia y compromiso.',
    },
    regions: {
      label: 'Presencia Regional',
      title: 'Cobertura Geográfica',
      subtitle: 'Operamos en 4 provincias del Norte Argentino, con oficinas centrales en Salta y capacidad de despliegue en toda la región.',
    },
    cta: {
      title: 'Formá parte del equipo líder en ingeniería del Norte Argentino',
      description: 'Buscamos profesionales comprometidos con la excelencia. Conocé nuestras oportunidades.',
      primaryLabel: 'Trabajá con Nosotros',
      primaryUrl: '/contacto',
      image: IMAGES.empresaCta,
    },
  },
  servicios: {
    seo: {
      title: 'Servicios',
      description: 'Seis divisiones de ingeniería, construcción, energía y mantenimiento para proyectos de cualquier escala.',
    },
    hero: {
      title: 'Servicios de Ingeniería y Construcción',
      subtitle: 'Soluciones integrales en seis divisiones especializadas que cubren cada etapa y escala de su proyecto.',
      image: IMAGES.serviciosHero,
    },
    divisions: {
      label: 'Divisiones',
      title: 'Seis áreas de especialización para proyectos de cualquier escala',
    },
    grid: {
      label: 'Soluciones Integrales',
      title: 'Todas nuestras divisiones',
    },
    cta: {
      label: '¿No encuentra lo que busca?',
      title: 'Desarrollamos soluciones a medida para su proyecto',
      description: 'Cuéntenos sobre su proyecto y nuestro equipo técnico le presentará una propuesta personalizada sin cargo.',
      primaryLabel: 'Solicitar Asesoramiento',
      primaryUrl: '/contacto',
      image: IMAGES.serviciosCta,
    },
  },
  proyectos: {
    seo: {
      title: 'Proyectos',
      description: 'Más de 500 proyectos ejecutados en 4 provincias para organismos públicos, industrias y clientes privados.',
    },
    hero: {
      title: 'Proyectos que transforman el Norte Argentino',
      subtitle: 'Más de 500 proyectos ejecutados en 4 provincias para organismos públicos, industrias y clientes privados. Conocé nuestra trayectoria.',
      image: IMAGES.proyectosHero,
    },
    cta: {
      title: 'Convertimos sus necesidades en soluciones de ingeniería',
      description: 'Nuestro equipo técnico está listo para analizar su proyecto y elaborar una propuesta a medida sin compromiso.',
      primaryLabel: 'Solicitar Cotización',
      primaryUrl: '/contacto',
      secondaryLabel: 'Ver Servicios',
      secondaryUrl: '/servicios',
      image: IMAGES.proyectosCta,
    },
  },
  blog: {
    seo: {
      title: 'Blog',
      description: 'Artículos técnicos sobre ingeniería, construcción, energía y licitaciones en el Norte Argentino.',
    },
  },
  licitaciones: {
    seo: {
      title: 'Licitaciones',
      description: 'Portal de licitaciones vigentes de EMPRENOR GROUP. Acceda a documentación, consultas y ofertas.',
    },
    hero: {
      label: 'Transparencia y Gestión',
      title: 'Portal de Licitaciones',
      subtitle: 'Acceda a llamados vigentes, descargue documentación, realice consultas y presente sus ofertas. Interactuamos con organismos públicos y privados con total transparencia.',
      image: IMAGES.licitacionesHero,
    },
    provider: {
      label: '¿Quiere participar?',
      title: 'Registre su empresa como proveedor',
      subtitle: 'Al registrarse en nuestro portal de proveedores recibirá notificaciones automáticas de nuevos llamados, podrá descargar pliegos, realizar consultas técnicas y presentar sus ofertas de manera digital.',
      ctaPrimary: 'Registrarme como Proveedor',
      ctaPrimaryUrl: '/contacto',
      ctaSecondary: 'Conocer nuestros servicios',
      ctaSecondaryUrl: '/servicios',
    },
  },
}
