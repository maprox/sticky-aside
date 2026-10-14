import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { createStickyAsidePresenter } from '#core/headless.ts'
import type { Box, StickyAsideView, StickyPaint, StickyReading } from '#core/headless.ts'
import type { StickyAsideClasses } from '#core/index.ts'

function box(top: number, height: number, width = 240): Box {
  return {
    top,
    bottom: top + height,
    width,
    height,
  }
}

function reading(scrollY: number, content: Box, measure: Box, wrapper = box(0, 2400)): StickyReading {
  return {
    metrics: {
      scrollY,
      viewportHeight: 800,
      documentHeight: 4000,
    },
    wrapper,
    content,
    measure,
  }
}

describe('createStickyAsidePresenter', () => {
  let rafQueue: FrameRequestCallback[]

  beforeEach(() => {
    rafQueue = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      rafQueue.push(callback)

      return rafQueue.length
    })
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      rafQueue[id - 1] = () => {}
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function flushFrame() {
    const batch = rafQueue.splice(0, rafQueue.length)
    for (const callback of batch) {
      callback(0)
    }
  }

  function createHarness(current: StickyReading) {
    const calls: string[] = []
    const paints: StickyPaint[] = []
    const classes: StickyAsideClasses[] = []
    let handlers: {
      scroll(): void
      resize(): void
    } | undefined

    const view: StickyAsideView = {
      read() {
        calls.push('read')

        return current
      },
      setClasses(next) {
        classes.push(next)
      },
      paintMeasure() {
        calls.push('paintMeasure')
      },
      paint(paint) {
        calls.push('paint')
        paints.push(paint)
      },
      subscribe(next) {
        calls.push('subscribe')
        handlers = next

        return () => {
          calls.push('unsubscribe')
          handlers = undefined
        }
      },
      destroy() {
        calls.push('destroy')
      },
    }

    return {
      view,
      calls,
      paints,
      classes,
      scroll() {
        handlers?.scroll()
        flushFrame()
      },
      scrollQueued() {
        handlers?.scroll()
      },
      resize() {
        handlers?.resize()
        flushFrame()
      },
      resizeQueued() {
        handlers?.resize()
      },
      flushFrame,
    }
  }

  it('reads the scroll position before subscribe and paints one frame', () => {
    const harness = createHarness(reading(400, box(80, 120), box(16, 700)))

    const aside = createStickyAsidePresenter(harness.view, {})

    expect(harness.calls).toEqual(['read', 'subscribe', 'paintMeasure', 'read', 'paint'])
    expect(harness.paints).toEqual([{
      state: 'top',
      width: 240,
    }])
    aside.destroy()
  })

  it('paints the top edge after the scroll position moves up', () => {
    const sample = reading(400, box(140, 900), box(16, 500))
    const harness = createHarness(sample)
    const aside = createStickyAsidePresenter(harness.view, {})

    sample.metrics.scrollY = 300
    harness.scroll()

    expect(harness.calls.slice(-3)).toEqual(['paintMeasure', 'read', 'paint'])
    expect(harness.paints.at(-1)).toEqual({
      state: 'top',
      width: 240,
    })
    aside.destroy()
  })

  it('does not paint again when StickyPaint is unchanged after scroll', () => {
    const sample = reading(400, box(80, 120), box(16, 700))
    const harness = createHarness(sample)
    const aside = createStickyAsidePresenter(harness.view, {})
    expect(harness.paints.at(-1)).toEqual({
      state: 'top',
      width: 240,
    })
    const paintCount = harness.paints.length

    sample.metrics.scrollY = 450
    harness.scroll()

    expect(harness.paints).toHaveLength(paintCount)
    expect(harness.calls.slice(-2)).toEqual(['paintMeasure', 'read'])
    aside.destroy()
  })

  it('coalesces multiple scroll events into one frame', () => {
    const sample = reading(400, box(140, 900), box(16, 500))
    const harness = createHarness(sample)
    const aside = createStickyAsidePresenter(harness.view, {})
    const paintCount = harness.paints.length
    const callCount = harness.calls.length

    sample.metrics.scrollY = 350
    harness.scrollQueued()
    sample.metrics.scrollY = 300
    harness.scrollQueued()
    expect(harness.paints).toHaveLength(paintCount)
    expect(harness.calls).toHaveLength(callCount)

    harness.flushFrame()

    expect(harness.paints.at(-1)).toEqual({
      state: 'top',
      width: 240,
    })
    expect(harness.calls.slice(callCount)).toEqual(['paintMeasure', 'read', 'paint'])
    aside.destroy()
  })

  it('applies scroll after resize when both are pending in the same frame', () => {
    const sample = reading(400, box(140, 900), box(16, 500))
    const harness = createHarness(sample)
    const aside = createStickyAsidePresenter(harness.view, {})
    expect(harness.paints.at(-1)?.state).toBe('flow')

    sample.metrics.scrollY = 300
    harness.scrollQueued()
    harness.resizeQueued()
    harness.flushFrame()

    expect(harness.paints.at(-1)).toEqual({
      state: 'top',
      width: 240,
    })
    expect(harness.calls.slice(-5)).toEqual([
      'paintMeasure',
      'read',
      'paintMeasure',
      'read',
      'paint',
    ])
    aside.destroy()
  })

  it('keeps a bottom pin when resize follows the scroll frame', () => {
    const sample = reading(200, box(-430, 900), box(80, 400))
    const harness = createHarness(sample)
    const aside = createStickyAsidePresenter(harness.view, {})

    sample.metrics.scrollY = 500
    harness.scroll()
    expect(harness.paints.at(-1)?.state).toBe('bottom')

    const paintCount = harness.paints.length
    harness.resize()
    expect(harness.paints.at(-1)?.state).toBe('bottom')
    expect(harness.paints).toHaveLength(paintCount)
    aside.destroy()
  })

  it('re-reads after releasing a fixed panel so a jump scroll can pin the other edge', () => {
    const sample = reading(0, box(0, 1400), box(16, 500), box(0, 2400))
    const harness = createHarness(sample)
    const aside = createStickyAsidePresenter(harness.view, {})
    expect(harness.paints.at(-1)?.state).toBe('top')

    const originalPaint = harness.view.paint
    harness.view.paint = (paint) => {
      originalPaint(paint)
      if (paint.state === 'flow') {
        sample.metrics.scrollY = 1000
        sample.wrapper = box(-1000, 2400)
        sample.content = box(-900, 1400)
        sample.measure = box(16, 500)
      }
    }

    sample.metrics.scrollY = 1000
    harness.scroll()

    expect(harness.paints.at(-1)).toEqual({
      state: 'bottom',
      width: 240,
    })
    aside.destroy()
  })

  it('forwards offset classes and paints a resize frame', () => {
    const harness = createHarness(reading(400, box(80, 120), box(16, 700)))
    const aside = createStickyAsidePresenter(harness.view, {})
    const paintCount = harness.paints.length

    aside.setClasses({
      topClass: 'top-16 md:top-24',
    })

    expect(harness.classes).toEqual([{
      topClass: 'top-16 md:top-24',
    }])
    expect(harness.paints).toHaveLength(paintCount + 1)
    aside.destroy()
  })

  it('does not paint again when lock is set to the same value', () => {
    const harness = createHarness(reading(400, box(180, 200), box(16, 500), box(100, 2000)))
    const aside = createStickyAsidePresenter(harness.view, {})

    aside.setLocked(true)
    const paintCount = harness.paints.length
    aside.setLocked(true)

    expect(harness.paints.at(-1)).toEqual({
      state: 'locked',
      top: 180,
      width: 240,
    })
    expect(harness.paints).toHaveLength(paintCount)
    aside.destroy()
  })

  it('unsubscribes and destroys the view once', () => {
    const harness = createHarness(reading(400, box(80, 120), box(16, 700)))
    const aside = createStickyAsidePresenter(harness.view, {})
    const paintCount = harness.paints.length

    aside.destroy()
    aside.destroy()
    aside.update()

    expect(harness.calls.filter((call) => call === 'unsubscribe')).toEqual(['unsubscribe'])
    expect(harness.calls.filter((call) => call === 'destroy')).toEqual(['destroy'])
    expect(harness.paints).toHaveLength(paintCount)
  })

  it('reports the painted state once at creation and again only when it changes', () => {
    const harness = createHarness(reading(400, box(80, 120), box(16, 700)))
    const states: string[] = []
    const aside = createStickyAsidePresenter(harness.view, {
      onStateChange(state) {
        states.push(state)
      },
    })

    expect(states).toEqual(['top'])
    expect(aside.getState()).toBe('top')
    aside.setDisabled(true)
    aside.setDisabled(true)
    expect(states).toEqual(['top', 'off'])
    expect(aside.getState()).toBe('off')
    aside.destroy()
  })

  it('does not report a state after destroy', () => {
    const harness = createHarness(reading(400, box(80, 120), box(16, 700)))
    const states: string[] = []
    const aside = createStickyAsidePresenter(harness.view, {
      onStateChange(state) {
        states.push(state)
      },
    })

    aside.destroy()
    aside.update()
    expect(states).toEqual(['top'])
  })
})
