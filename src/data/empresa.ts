import { image } from './images'

export const timeline = [
  { year: '2008', shortYear: '08', title: 'Fundación', description: 'Nace EMPRENOR GROUP como oficina técnica de ingeniería en Salta.' },
  { year: '2010', shortYear: '10', title: 'Primera obra pública', description: 'Adjudicación del primer proyecto de infraestructura escolar para el Ministerio de Educación.' },
  { year: '2013', shortYear: '13', title: 'Expansión regional', description: 'Inicio de operaciones en Jujuy y Tucumán. Equipo supera los 25 profesionales.' },
  { year: '2016', shortYear: '16', title: 'División Energía', description: 'Creación de la división de energía con foco en energías renovables y redes de distribución.' },
  { year: '2019', shortYear: '19', title: 'Certificación ISO', description: 'Obtención de certificaciones ISO 9001, 14001 y 45001. Equipo supera los 40 profesionales.' },
  { year: '2022', shortYear: '22', title: 'Proyectos emblemáticos', description: 'Ejecución del Parque Solar de Cafayate y el Hospital Regional de Orán.' },
  { year: '2025', shortYear: '25', title: 'Consolidación', description: 'Más de 500 proyectos ejecutados. Presencia en 4 provincias. Referencia en el NOA.' },
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
    description: 'Ingeniero Civil con 25 años de experiencia en obras de infraestructura. Fundador de EMPRENOR GROUP.',
    avatar: image('team-ceo-2026'),
  },
  {
    name: 'Ing. Laura Fernández',
    role: 'Directora de Ingeniería',
    description: 'Ingeniera Civil especializada en cálculo estructural. Más de 18 años liderando equipos de proyecto.',
    avatar: image('team-eng-2026'),
  },
  {
    name: 'Ing. Ricardo Palacios',
    role: 'Director de Construcción',
    description: 'Ingeniero en Construcciones con 20 años dirigiendo obras civiles, industriales y de infraestructura.',
    avatar: image('team-const-2026'),
  },
  {
    name: 'Lic. Carolina Soria',
    role: 'Directora Comercial',
    description: 'Licenciada en Administración con especialización en licitaciones públicas y gestión de clientes corporativos.',
    avatar: image('team-com-2026'),
  },
  {
    name: 'Ing. Andrés Quiroga',
    role: 'Director de Energía',
    description: 'Ingeniero Electricista con 15 años de experiencia en proyectos de generación, transmisión y distribución.',
    avatar: image('team-energy-2026'),
  },
  {
    name: 'Arq. María José Campos',
    role: 'Directora de Proyectos',
    description: 'Arquitecta especializada en dirección de proyectos complejos y gestión de equipos multidisciplinarios.',
    avatar: image('team-arch-2026'),
  },
]

export const regions = [
  { name: 'Salta', cities: 'Salta Capital · Orán · Tartagal · Metán · Cafayate' },
  { name: 'Jujuy', cities: 'San Salvador · Palpalá · Libertador' },
  { name: 'Tucumán', cities: 'San Miguel · Concepción · Monteros' },
  { name: 'Santiago del Estero', cities: 'Santiago Capital · La Banda · Termas' },
]
