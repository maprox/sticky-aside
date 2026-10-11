import { describe, expect, it } from 'vitest'

import { initialViewportHeight, VIEWPORT_HEIGHT_MAX, VIEWPORT_HEIGHT_MIN } from './settings.ts'

describe('initialViewportHeight', () => {
  it('uses 80% of the screen', () => {
    expect(initialViewportHeight(1000)).toBe(800)
    expect(initialViewportHeight(1440)).toBe(1152)
  })

  it('stops at the screen share when the knobs still fit', () => {
    expect(initialViewportHeight(1400, 200)).toBe(1120)
  })

  it('shrinks below that share so the knobs stay on screen', () => {
    expect(initialViewportHeight(1000, 400)).toBe(600)
  })

  it('stays inside the resize limits', () => {
    expect(initialViewportHeight(200)).toBe(VIEWPORT_HEIGHT_MIN)
    expect(initialViewportHeight(4000)).toBe(VIEWPORT_HEIGHT_MAX)
    expect(initialViewportHeight(1000, 900)).toBe(VIEWPORT_HEIGHT_MIN)
  })

  it('falls back when the screen height is unknown', () => {
    expect(initialViewportHeight(0)).toBe(420)
    expect(initialViewportHeight(Number.NaN)).toBe(420)
  })
})
