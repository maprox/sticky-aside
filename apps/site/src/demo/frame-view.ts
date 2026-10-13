import type { StickyAsideClasses } from '@sticky-aside/core'
import type {
  Box,
  ScrollMetrics,
  StickyAsideHandlers,
  StickyAsideView,
  StickyPaint,
  StickyReading,
} from '@sticky-aside/core/headless'

import { ASIDE_STATE, DATASET, MEASURE_STYLE, OFFSET_CLASS, WRAPPER_STYLE } from '#core/view/constants.ts'
import { getClassTokens, syncClassTokens } from '#core/view/utils.ts'

export interface FrameViewOptions {
  viewport: HTMLElement
  wrapper: HTMLElement
  content: HTMLElement
  topClass?: string
  bottomClass?: string
  contentClass?: string
}

export function createFrameView(options: FrameViewOptions): StickyAsideView {
  const measure = document.createElement('div')
  measure.dataset[DATASET.measure] = ''
  Object.assign(measure.style, MEASURE_STYLE)
  options.wrapper.append(measure)
  Object.assign(options.wrapper.style, WRAPPER_STYLE)
  const frame = options.viewport.parentElement
  if (frame && frame !== document.body) {
    frame.style.transform = 'translateZ(0)'
  }

  let resizeObserver: ResizeObserver | undefined
  let onScroll: (() => void) | undefined
  let topClass = options.topClass ?? OFFSET_CLASS.top
  let bottomClass = options.bottomClass ?? OFFSET_CLASS.bottom
  let contentClass = options.contentClass ?? ''
  let appliedMeasureClasses: string[] = []
  let appliedContentClasses: string[] = []

  function clearContentStyle() {
    options.content.style.position = ''
    options.content.style.top = ''
    options.content.style.bottom = ''
    options.content.style.width = ''
    options.content.style.pointerEvents = ''
  }

  function getBox(element: HTMLElement): Box {
    const rect = element.getBoundingClientRect()
    const origin = options.viewport.getBoundingClientRect()

    return {
      top: rect.top - origin.top,
      bottom: rect.bottom - origin.top,
      width: rect.width,
      height: rect.height,
    }
  }

  function getMetrics(): ScrollMetrics {
    return {
      scrollY: options.viewport.scrollTop,
      viewportHeight: options.viewport.clientHeight,
      documentHeight: options.viewport.scrollHeight,
    }
  }

  function read(): StickyReading {
    return {
      metrics: getMetrics(),
      wrapper: getBox(options.wrapper),
      content: getBox(options.content),
      measure: getBox(measure),
    }
  }

  function setClasses(next: StickyAsideClasses) {
    if (next.topClass !== undefined) {
      topClass = next.topClass
    }

    if (next.bottomClass !== undefined) {
      bottomClass = next.bottomClass
    }

    if (next.contentClass !== undefined) {
      contentClass = next.contentClass
    }
  }

  function paintMeasure() {
    const contentBox = getBox(options.content)
    measure.style.top = ''
    measure.style.bottom = ''
    measure.style.maxHeight = `${contentBox.height}px`
    appliedMeasureClasses = syncClassTokens(measure, appliedMeasureClasses, [
      ...getClassTokens(topClass),
      ...getClassTokens(bottomClass),
    ])
  }

  function paint(next: StickyPaint) {
    clearContentStyle()
    options.content.dataset[DATASET.aside] = ASIDE_STATE[next.state]
    const nextTokens = getClassTokens(contentClass)
    if (next.state === 'off') {
      options.content.style.position = 'relative'
    } else if (next.state === 'flow') {
      options.content.style.position = 'relative'
      options.content.style.top = `${next.top}px`
    } else if (next.state === 'bottom') {
      options.content.style.position = 'fixed'
      options.content.style.pointerEvents = 'none'
      options.content.style.width = `${next.width}px`
      nextTokens.push(...getClassTokens(bottomClass))
    } else if (next.state === 'locked') {
      options.content.style.position = 'fixed'
      options.content.style.pointerEvents = 'none'
      options.content.style.width = `${next.width}px`
      options.content.style.top = `${next.top}px`
    } else {
      options.content.style.position = 'fixed'
      options.content.style.pointerEvents = 'none'
      options.content.style.width = `${next.width}px`
      nextTokens.push(...getClassTokens(topClass))
    }

    appliedContentClasses = syncClassTokens(options.content, appliedContentClasses, nextTokens)
  }

  function unsubscribe() {
    resizeObserver?.disconnect()
    resizeObserver = undefined
    if (onScroll) {
      options.viewport.removeEventListener('scroll', onScroll)
    }

    onScroll = undefined
  }

  function subscribe(handlers: StickyAsideHandlers) {
    onScroll = () => handlers.scroll()
    resizeObserver = new ResizeObserver(() => handlers.resize())
    resizeObserver.observe(options.viewport)
    resizeObserver.observe(options.content)
    resizeObserver.observe(measure)
    options.viewport.addEventListener('scroll', onScroll, {
      passive: true,
    })

    return unsubscribe
  }

  function destroy() {
    appliedContentClasses = syncClassTokens(options.content, appliedContentClasses, [])
    appliedMeasureClasses = syncClassTokens(measure, appliedMeasureClasses, [])
    unsubscribe()
    measure.remove()
    clearContentStyle()
    delete options.content.dataset[DATASET.aside]
  }

  return {
    read,
    setClasses,
    paintMeasure,
    paint,
    subscribe,
    destroy,
  }
}
