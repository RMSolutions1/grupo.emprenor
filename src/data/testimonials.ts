import { image } from './images'

export interface Testimonial {
  name: string
  role: string
  company: string
  quote: string
  avatar: string
  offset?: boolean
}

export const testimonials: Testimonial[] = [
  {
    name: 'Dr. Carlos Mendoza',
    role: 'Ministro de Obras Públicas',
    company: 'Gobierno de Salta',
    quote: 'EMPRENOR GROUP demostró un nivel de profesionalismo y compromiso excepcional en la ejecución del Hospital Regional. Cumplieron con los plazos establecidos y superaron nuestras expectativas de calidad.',
    avatar: image('av-test-01'),
  },
  {
    name: 'Ing. María Laura Torres',
    role: 'Directora de Infraestructura',
    company: 'EDESA',
    quote: 'La ejecución de la red de distribución eléctrica fue impecable. Cumplieron con todas las normativas técnicas y los plazos de ejecución fueron óptimos. Un socio estratégico para nuestros proyectos.',
    avatar: image('av-test-02'),
    offset: true,
  },
  {
    name: 'Lic. Roberto Sánchez',
    role: 'Gerente de Proyectos',
    company: 'Grupo Agroindustrial Norte',
    quote: 'El proyecto llave en mano de nuestra planta industrial fue un éxito rotundo. EMPRENOR GROUP entendió nuestras necesidades y entregó una solución integral que optimizó nuestros procesos productivos.',
    avatar: image('av-test-03'),
  },
  {
    name: 'Arq. Patricia Giménez',
    role: 'Directora de Planificación',
    company: 'Ministerio de Educación de Salta',
    quote: 'Construir escuelas no es solo levantar paredes, es crear espacios donde se forma el futuro. EMPRENOR GROUP lo entendió a la perfección en cada uno de los establecimientos educativos que desarrollaron para nosotros.',
    avatar: image('av-test-04'),
    offset: true,
  },
]
