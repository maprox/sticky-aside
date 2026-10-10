import { createStickyAside } from '@sticky-aside/core'
import { cleanup, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { StickyAside } from '@sticky-aside/react'

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
    render(<StickyAside as="aside" className="toc" aria-label="Contents">item</StickyAside>)
    const aside = screen.getByRole('complementary', { name: 'Contents' })
    expect(aside.tagName).toBe('ASIDE')
    expect(aside.className).toContain('sticky-aside-root')
    expect(aside.className).toContain('toc')
  })

  it('destroys the controller on unmount', () => {
    const view = render(<StickyAside>item</StickyAside>)
    const controller = vi.mocked(createStickyAside).mock.results.at(-1)?.value
    view.unmount()
    expect(controller.destroy).toHaveBeenCalledOnce()
  })

  it('renders on the server without touching the window', () => {
    const html = renderToString(<StickyAside as="aside">item</StickyAside>)
    expect(html).toContain('sticky-aside-root')
    expect(html).toContain('item')
  })
})
