import { cleanup, render, screen } from '@solidjs/testing-library'
import { createStickyAside } from '@sticky-aside/core'
import { renderToString } from 'solid-js/web'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { StickyAside } from '@sticky-aside/solid'

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
    render(() => (
      <StickyAside as="aside" class="toc" aria-label="Contents">
        item
      </StickyAside>
    ))
    const aside = screen.getByRole('complementary', { name: 'Contents' })
    expect(aside.tagName).toBe('ASIDE')
    expect(aside.className).toContain('sticky-aside-root')
    expect(aside.className).toContain('toc')
  })

  it('destroys the controller on unmount', () => {
    const { unmount } = render(() => <StickyAside>item</StickyAside>)
    const controller = vi.mocked(createStickyAside).mock.results.at(-1)?.value
    unmount()
    expect(controller.destroy).toHaveBeenCalledOnce()
  })

  it('renders on the server without touching the window', () => {
    const html = renderToString(() => <StickyAside as="aside">item</StickyAside>)
    expect(html).toContain('sticky-aside-root')
    expect(html).toContain('item')
  })
})
