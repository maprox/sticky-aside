import { render } from 'svelte/server'
import { describe, expect, it, vi } from 'vitest'

import StickyAside from '@sticky-aside/svelte'

vi.mock('@sticky-aside/core', () => ({
  OFFSET_CLASS: {
    top: 'sticky-aside-top',
    bottom: 'sticky-aside-bottom',
  },
  createStickyAside: vi.fn(),
}))

describe('StickyAside server render', () => {
  it('renders markup without touching the window', () => {
    const result = render(StickyAside, {
      props: { as: 'aside' },
    })
    expect(result.body).toContain('sticky-aside-root')
    expect(result.body).toContain('<aside')
  })
})
