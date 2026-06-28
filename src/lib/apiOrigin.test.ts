import { describe, expect, it } from 'vitest'
import { apiUrl, resolveApiBase } from './apiOrigin'

describe('resolveApiBase', () => {
  it('usa origen Vercel en dominios .com.ar', () => {
    expect(resolveApiBase('www.emprenor.com.ar')).toBe('https://grupo.emprenor.com')
  })

  it('usa mismo origen en grupo.emprenor.com', () => {
    expect(resolveApiBase('grupo.emprenor.com')).toBe('')
  })

  it('respeta VITE_API_ORIGIN', () => {
    expect(resolveApiBase('grupo.emprenor.com', 'https://api.example.com')).toBe('https://api.example.com')
  })
})

describe('apiUrl', () => {
  it('construye URL cross-origin para Ferozo', () => {
    expect(apiUrl('/api/contact')).toContain('/api/contact')
  })
})
