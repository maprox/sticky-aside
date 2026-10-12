import { createStickyAside } from '@sticky-aside/core'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { initStickyAsideRoots } from '@sticky-aside/astro/client'

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
  vi.mocked(createStickyAside).mockClear()
})

function mountRoot(attrs: Record<string, string> = {}) {
  const wrapper = document.createElement('aside')
  wrapper.className = 'sticky-aside-root'
  wrapper.setAttribute('data-sticky-aside', '')
  for (const [key, value] of Object.entries(attrs)) {
    wrapper.setAttribute(key, value)
  }
  const content = document.createElement('div')
  content.setAttribute('data-sticky-aside-content', '')
  content.textContent = 'item'
  wrapper.append(content)
  document.body.append(wrapper)

  return wrapper
}

describe('initStickyAsideRoots', () => {
  it('creates a controller for each uninitialized root', () => {
    mountRoot({
      'data-top-class': 'top-10',
      'data-bottom-class': 'bottom-0',
      'data-locked': 'true',
    })
    initStickyAsideRoots()
    expect(createStickyAside).toHaveBeenCalledOnce()
    const options = vi.mocked(createStickyAside).mock.calls[0][0]
    expect(options.topClass).toBe('top-10')
    expect(options.bottomClass).toBe('bottom-0')
    expect(options.locked).toBe(true)
  })

  it('is idempotent for the same root', () => {
    mountRoot()
    initStickyAsideRoots()
    initStickyAsideRoots()
    expect(createStickyAside).toHaveBeenCalledOnce()
  })

  it('skips roots without a content node', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute('data-sticky-aside', '')
    document.body.append(wrapper)
    initStickyAsideRoots()
    expect(createStickyAside).not.toHaveBeenCalled()
  })

  it('dispatches sticky-aside-state on the root', () => {
    const wrapper = mountRoot()
    const seen: string[] = []
    wrapper.addEventListener('sticky-aside-state', ((event: CustomEvent<string>) => {
      seen.push(event.detail)
    }) as EventListener)

    initStickyAsideRoots()
    const options = vi.mocked(createStickyAside).mock.calls[0][0]
    options.onStateChange?.('bottom')
    expect(seen).toEqual(['bottom'])
  })

  it('updates lock when data-locked changes', () => {
    const wrapper = mountRoot({ 'data-locked': 'false' })
    initStickyAsideRoots()
    const controller = vi.mocked(createStickyAside).mock.results[0].value
    wrapper.setAttribute('data-locked', 'true')

    return Promise.resolve().then(() => {
      expect(controller.setLocked).toHaveBeenCalledWith(true)
    })
  })
})
