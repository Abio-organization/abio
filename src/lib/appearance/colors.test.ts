import { describe, expect, it } from 'vitest'

import { toValidColor } from './colors'

describe('toValidColor', () => {
  it('returns fallback when color is missing', () => {
    expect(toValidColor(undefined)).toBe('#000000')
  })

  it('maps "none" to fallback (API rejects none)', () => {
    expect(toValidColor('none')).toBe('#000000')
    expect(toValidColor('none', '#ffffff')).toBe('#ffffff')
  })

  it('passes through valid hex colors', () => {
    expect(toValidColor('#ff00aa')).toBe('#ff00aa')
  })
})
