import { describe, expect, it } from 'vitest'
import { escapeHtml } from './mail'

describe('escapeHtml', () => {
  it('escapa caracteres HTML peligrosos', () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;',
    )
  })

  it('deja texto plano sin cambios', () => {
    expect(escapeHtml('Consulta sobre obra pública')).toBe('Consulta sobre obra pública')
  })
})
