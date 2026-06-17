import { image } from './images'

export const timeline = [
  { year: '2018', shortYear: '18', title: 'Inicio en el NOA', description: 'Comienza la operación documentada de EMPRENOR en Salta con construcción e instalaciones integradas.' },
  { year: '2019', shortYear: '19', title: 'Primeras obras integradas', description: 'Ejecución de proyectos llave en mano combinando obra civil, electricidad y terminaciones.' },
  { year: '2021', shortYear: '21', title: 'Expansión regional', description: 'Presencia operativa en Jujuy y Tucumán. Incorporación de nuevas especialidades técnicas.' },
  { year: '2023', shortYear: '23', title: 'Cobertura en Formosa', description: 'Consolidación de operaciones en las cuatro provincias del NOA con equipos locales.' },
  { year: '2025', shortYear: '25', title: '12 especialidades', description: 'Doce especialidades integradas bajo un solo equipo técnico-comercial. Referencia en el NOA.' },
]

export const values = [
  { title: 'Excelencia Técnica', description: 'Aplicamos los más altos estándares de ingeniería en cada proyecto.', icon: 'ri-award-line' },
  { title: 'Compromiso', description: 'Cumplimos con los plazos, presupuestos y expectativas de calidad.', icon: 'ri-hand-heart-line' },
  { title: 'Innovación', description: 'Incorporamos tecnología de punta y metodologías modernas de gestión.', icon: 'ri-lightbulb-line' },
  { title: 'Seguridad', description: 'La seguridad de nuestros equipos y obras es prioridad absoluta.', icon: 'ri-shield-check-line' },
  { title: 'Sostenibilidad', description: 'Desarrollamos proyectos con criterios de responsabilidad ambiental.', icon: 'ri-leaf-line' },
  { title: 'Integridad', description: 'Actuamos con transparencia y ética profesional en todas nuestras relaciones.', icon: 'ri-scales-3-line' },
]

export const team = [
  {
    name: 'Ing. Marcelo Gutiérrez',
    role: 'Presidente & CEO',
    description: 'Ingeniero Civil con amplia experiencia en obras de infraestructura en el NOA. Lidera la estrategia técnica y comercial del grupo.',
    avatar: image('team-ceo-2026'),
  },
  {
    name: 'Ing. Laura Fernández',
    role: 'Directora de Ingeniería',
    description: 'Ingeniera Civil especializada en cálculo estructural y dirección de proyectos complejos.',
    avatar: image('team-eng-2026'),
  },
  {
    name: 'Ing. Ricardo Palacios',
    role: 'Director de Construcción',
    description: 'Ingeniero en Construcciones con trayectoria en obras civiles, industriales y de infraestructura.',
    avatar: image('team-const-2026'),
  },
  {
    name: 'Lic. Carolina Soria',
    role: 'Directora Comercial',
    description: 'Especialista en licitaciones públicas y gestión de clientes institucionales y corporativos.',
    avatar: image('team-com-2026'),
  },
  {
    name: 'Ing. Andrés Quiroga',
    role: 'Director de Instalaciones',
    description: 'Ingeniero Electricista con experiencia en instalaciones eléctricas, gas y climatización.',
    avatar: image('team-energy-2026'),
  },
  {
    name: 'Arq. María José Campos',
    role: 'Directora de Proyectos',
    description: 'Arquitecta especializada en dirección de proyectos y coordinación de equipos multidisciplinarios.',
    avatar: image('team-arch-2026'),
  },
]

export const regions = [
  { name: 'Salta', cities: 'Salta Capital · Orán · Tartagal · Metán · Cafayate' },
  { name: 'Jujuy', cities: 'San Salvador · Palpalá · Libertador' },
  { name: 'Tucumán', cities: 'San Miguel · Concepción · Monteros' },
  { name: 'Formosa', cities: 'Formosa Capital · Clorinda · Pirané' },
]
