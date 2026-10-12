import { describe, expect, it } from 'vitest'

import * as astro from '@sticky-aside/astro'

describe('public exports', () => {
  it('re-exports the core sticky surface for Astro scripts', () => {
    expect(Object.keys(astro).sort()).toEqual(['OFFSET_CLASS', 'createStickyAside'])
    expect(typeof astro.createStickyAside).toBe('function')
    expect(astro.OFFSET_CLASS).toEqual({
      top: 'sticky-aside-top',
      bottom: 'sticky-aside-bottom',
    })
  })
})
