import { createStickyAside } from '@sticky-aside/core'
import { cleanup, render } from '@testing-library/svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'

import StickyAside from '@sticky-aside/svelte'

vi.mock('@sticky-aside/core', () => ({
  OFFSET_CLASS: {
    top: 'sticky-aside-top',
    bottom: 'sticky-aside-bottom',
  },
  createStickyAside: vi.fn(() => ({
    update: vi.fn(),
    setLocked: vi.fn(),
    setDisabled: vi.fn(),
    setClasses: vi.fn(),
    setAllowLockedOverflow: vi.fn(),
    destroy: vi.fn(),
    getState: vi.fn(() => 'top'),
    getModel: vi.fn(),
  })),
}))

afterEach(cleanup)

describe('StickyAside', () => {
  it('renders the requested tag and merges the class', () => {
    const view = render(StickyAside, {
      as: 'aside',
      class: 'toc',
      'aria-label': 'Contents',
    })
    const aside = view.getByRole('complementary', { name: 'Contents' })
    expect(aside.tagName).toBe('ASIDE')
    expect(aside.className).toContain('sticky-aside-root')
    expect(aside.className).toContain('toc')
  })

  it('destroys the controller on unmount', () => {
    const view = render(StickyAside)
    const controller = vi.mocked(createStickyAside).mock.results.at(-1)?.value
    view.unmount()
    expect(controller.destroy).toHaveBeenCalledOnce()
  })
})
