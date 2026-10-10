import { createStickyAside } from '@sticky-aside/core'
import { render } from '@testing-library/vue'
import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h } from 'vue'

import { StickyAside } from '@sticky-aside/vue'

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

afterEach(() => {
  document.body.innerHTML = ''
})

describe('StickyAside', () => {
  it('renders the requested tag and merges the class', async () => {
    const view = render(StickyAside, {
      props: { as: 'aside' },
      attrs: {
        class: 'toc',
        'aria-label': 'Contents',
      },
      slots: { default: 'item' },
    })
    const aside = view.getByRole('complementary', { name: 'Contents' })
    expect(aside.tagName).toBe('ASIDE')
    expect(aside.className).toContain('sticky-aside-root')
    expect(aside.className).toContain('toc')
  })

  it('destroys the controller on unmount', () => {
    const view = render(StickyAside, { slots: { default: 'item' } })
    const controller = vi.mocked(createStickyAside).mock.results.at(-1)?.value
    view.unmount()
    expect(controller.destroy).toHaveBeenCalledOnce()
  })

  it('renders on the server without touching the window', async () => {
    const app = createSSRApp({
      render: () => h(StickyAside, { as: 'aside' }, () => 'item'),
    })
    const html = await renderToString(app)
    expect(html).toContain('sticky-aside-root')
    expect(html).toContain('item')
  })
})
