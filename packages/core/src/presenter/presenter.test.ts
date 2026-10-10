import { describe, expect, it } from 'vitest'

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
    },
  }
}

describe('createStickyAsidePresenter', () => {
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

    expect(harness.calls.slice(-4)).toEqual(['read', 'paintMeasure', 'read', 'paint'])
    expect(harness.paints.at(-1)).toEqual({
      state: 'top',
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
