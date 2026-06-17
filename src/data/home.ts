import { image } from './images'

export interface Sector {
  id: string
  title: string
  icon: string
  image: string
}

export const sectors: Sector[] = [
  { id: 'gobierno', title: 'Gobierno', icon: 'ri-government-line', image: image('sector-gob-2026') },
  { id: 'educacion', title: 'Educación', icon: 'ri-book-open-line', image: image('sector-edu-2026') },
  { id: 'salud', title: 'Salud', icon: 'ri-heart-pulse-line', image: image('sector-salud-2026') },
  { id: 'industria', title: 'Industria', icon: 'ri-building-3-line', image: image('sector-ind-2026') },
  { id: 'mineria', title: 'Minería', icon: 'ri-hammer-line', image: image('sector-min-2026') },
  { id: 'agro', title: 'Agro', icon: 'ri-plant-line', image: image('sector-agro-2026') },
  { id: 'petroleo', title: 'Petróleo y Gas', icon: 'ri-drop-line', image: image('sector-pet-2026') },
  { id: 'inmobiliario', title: 'Inmobiliario', icon: 'ri-building-4-line', image: image('sector-inm-2026') },
]

export const certifications = [
  { title: 'ISO 9001:2015', description: 'Sistema de Gestión de Calidad', icon: 'ri-verified-badge-line' },
  { title: 'ISO 14001:2015', description: 'Sistema de Gestión Ambiental', icon: 'ri-leaf-line' },
  { title: 'ISO 45001:2018', description: 'Seguridad y Salud en el Trabajo', icon: 'ri-shield-check-line' },
  { title: 'IRAM', description: 'Instituto Argentino de Normalización', icon: 'ri-award-line' },
  { title: 'CIRSOC', description: 'Reglamento de Seguridad Estructural', icon: 'ri-building-line' },
]

export const stats = [
  { value: 12, suffix: '', label: 'Especialidades integradas', icon: 'ri-tools-line' },
  { value: 4, suffix: '', label: 'Provincias del NOA', icon: 'ri-map-pin-line' },
  { value: 500, suffix: '+', label: 'Proyectos ejecutados', icon: 'ri-building-2-line' },
  { value: 50, suffix: '+', label: 'Profesionales', icon: 'ri-team-line' },
  { value: 98, suffix: '%', label: 'Satisfacción', icon: 'ri-star-line' },
]
