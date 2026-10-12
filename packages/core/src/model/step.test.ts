import { describe, expect, it } from 'vitest'

import { getInitialStickyModel, getNewStickyModel } from '#core/model/step.ts'
import type { Box, StickyFrame, StickyModel } from '#core/model/step.ts'

function box(top: number, height: number, width = 240): Box {
  return {
    top,
    bottom: top + height,
    width,
    height,
  }
}

function frame(overrides: Partial<StickyFrame> = {}): StickyFrame {
  return {
    disabled: false,
    locked: false,
    allowLockedOverflowTop: false,
    allowLockedOverflowBottom: false,
    scrollingUp: false,
    scrollY: 400,
    viewportHeight: 800,
    documentHeight: 4000,
    wrapper: box(0, 2400),
    content: box(120, 200),
    measure: box(16, 500),
    reason: 'scroll',
    ...overrides,
  }
}

describe('getNewStickyModel', () => {
  it('leaves the model unchanged while disabled', () => {
    const model: StickyModel = {
      mode: 'fixed-top',
      containerTop: 40,
      locked: false,
      lockedTop: null,
    }

    expect(getNewStickyModel(model, frame({
      disabled: true,
      reason: 'scroll',
    }))).toEqual(model)
  })

  it('leaves a tall panel in flow on resize when its top is above the window', () => {
    const model = getInitialStickyModel()
    const next = getNewStickyModel(model, frame({
      reason: 'resize',
      content: box(-200, 900),
      measure: box(48, 360),
    }))

    expect(next).toBe(model)
  })

  it('pins a tall panel on resize when its top covers the offset', () => {
    const next = getNewStickyModel(getInitialStickyModel(), frame({
      reason: 'resize',
      content: box(18, 900),
      measure: box(48, 360),
      wrapper: box(18, 2400),
    }))

    expect(next.mode).toBe('fixed-top')
  })

  it('pins a short panel to the top when the measure lane sits inside the wrapper', () => {
    const next = getNewStickyModel(getInitialStickyModel(), frame({
      reason: 'resize',
      content: box(80, 120),
      measure: box(16, 700),
    }))

    expect(next.mode).toBe('fixed-top')
  })

  it('pins to the top while scrolling up once the panel passes the lane', () => {
    const next = getNewStickyModel(getInitialStickyModel(), frame({
      scrollingUp: true,
      content: box(140, 900),
      measure: box(16, 500),
    }))

    expect(next.mode).toBe('fixed-top')
  })

  it('pins to the bottom while scrolling down once the panel end passes the lane', () => {
    const next = getNewStickyModel(getInitialStickyModel(), frame({
      scrollingUp: false,
      content: box(-430, 900),
      measure: box(80, 400),
    }))

    expect(next.mode).toBe('fixed-bottom')
  })

  it('releases a tall fixed panel when the scroll direction flips', () => {
    const next = getNewStickyModel(
      {
        mode: 'fixed-top',
        containerTop: 0,
        locked: false,
        lockedTop: null,
      },
      frame({
        scrollingUp: false,
        content: box(150, 900),
        wrapper: box(100, 2000),
        measure: box(120, 400),
      }),
    )

    expect(next.mode).toBe('relative')
    expect(next.containerTop).toBe(50)
  })

  it('keeps a fixed panel while Safari scrolls past the document', () => {
    const model: StickyModel = {
      mode: 'fixed-top',
      containerTop: 0,
      locked: false,
      lockedTop: null,
    }
    const next = getNewStickyModel(model, frame({
      scrollingUp: true,
      scrollY: -20,
      content: box(40, 900),
      measure: box(800, 200),
      wrapper: box(0, 400),
    }))

    expect(next).toEqual(model)
  })

  it('parks a panel on the wrapper edge when the lane has left the wrapper', () => {
    const next = getNewStickyModel(getInitialStickyModel(), frame({
      wrapper: box(100, 400),
      content: box(200, 150),
      measure: box(450, 250),
    }))

    expect(next.mode).toBe('relative')
    expect(next.containerTop).toBe(250)
  })

  it('locks the panel at its current viewport top', () => {
    const next = getNewStickyModel(getInitialStickyModel(), frame({
      reason: 'lock',
      locked: true,
      content: box(180, 200),
      wrapper: box(100, 2000),
    }))

    expect(next.mode).toBe('fixed-locked')
    expect(next.lockedTop).toBe(180)
  })

  it('drops the lock back into the wrapper when the locked point leaves the top', () => {
    const next = getNewStickyModel(
      {
        mode: 'fixed-locked',
        containerTop: 0,
        locked: true,
        lockedTop: 180,
      },
      frame({
        reason: 'scroll',
        locked: true,
        content: box(180, 200),
        wrapper: box(250, 2000),
      }),
    )

    expect(next.mode).toBe('relative')
    expect(next.locked).toBe(true)
  })

  it('returns to flow when unlocked', () => {
    const next = getNewStickyModel(
      {
        mode: 'fixed-locked',
        containerTop: 0,
        locked: true,
        lockedTop: 180,
      },
      frame({
        reason: 'unlock',
        locked: false,
        content: box(400, 200),
        wrapper: box(100, 2000),
      }),
    )

    expect(next.mode).toBe('relative')
    expect(next.lockedTop).toBeNull()
    expect(next.containerTop).toBe(300)
  })
})
