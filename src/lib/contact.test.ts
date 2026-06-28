import { describe, expect, it } from 'vitest'
import { isHoneypotTriggered } from './contact'

describe('isHoneypotTriggered', () => {
  it('detecta honeypot con contenido', () => {
    expect(isHoneypotTriggered('bot-fill')).toBe(true)
    expect(isHoneypotTriggered('  spam  ')).toBe(true)
  })

  it('ignora honeypot vacío', () => {
    expect(isHoneypotTriggered('')).toBe(false)
    expect(isHoneypotTriggered('   ')).toBe(false)
    expect(isHoneypotTriggered(undefined)).toBe(false)
  })
})
