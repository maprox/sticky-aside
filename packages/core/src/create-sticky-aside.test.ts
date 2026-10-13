import { afterEach, describe, expect, it, vi } from 'vitest'

import { createStickyAside } from '#core/index.ts'
import { domRect, mockBoundingClientRect } from '#core/test/mocks/bounding-client-rect.ts'

describe('createStickyAside', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('pins a short panel and removes its measure element on destroy', () => {
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    content.className = 'h-full'
    wrapper.append(content)
    document.body.append(wrapper)
    mockBoundingClientRect((element) => {
      if (element === content) {
        return domRect(40, 100)
      }

      if (element === wrapper) {
        return domRect(0, 2000, 320)
      }

      return domRect(12, 600)
    })

    const aside = createStickyAside({
      wrapper,
      content,
      topClass: 'pin-top',
      bottomClass: 'pin-bottom',
      contentClass: 'fill',
    })

    expect(content.dataset.stickyAside).toBe('top')
    expect(content.style.position).toBe('fixed')
    expect(content.style.top).toBe('')
    expect(content.style.width).toBe('320px')
    expect(content.classList.contains('pin-top')).toBe(true)
    expect(content.classList.contains('pin-bottom')).toBe(false)
    expect(content.classList.contains('h-full')).toBe(true)
    expect(content.classList.contains('fill')).toBe(true)

    const measure = wrapper.querySelector<HTMLElement>('[data-sticky-measure]')
    expect(measure).not.toBeNull()
    expect(measure!.classList.contains('pin-top')).toBe(true)
    expect(measure!.classList.contains('pin-bottom')).toBe(true)
    expect(measure!.style.top).toBe('')
    expect(measure!.style.bottom).toBe('')

    aside.setClasses({
      topClass: 'next-top',
    })

    expect(content.classList.contains('next-top')).toBe(true)
    expect(content.classList.contains('pin-top')).toBe(false)
    expect(content.classList.contains('fill')).toBe(true)
    expect(measure!.classList.contains('next-top')).toBe(true)
    expect(measure!.classList.contains('pin-bottom')).toBe(true)
    expect(measure!.classList.contains('pin-top')).toBe(false)

    aside.destroy()

    expect(wrapper.querySelector('[data-sticky-measure]')).toBeNull()
    expect(content.style.position).toBe('')
    expect(content.classList.contains('next-top')).toBe(false)
    expect(content.classList.contains('h-full')).toBe(true)
    expect(content.classList.contains('fill')).toBe(false)
    wrapper.remove()
  })
})
