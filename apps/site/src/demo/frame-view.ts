import type { StickyAsideClasses } from '@sticky-aside/core'
import type {
  Box,
  ScrollMetrics,
  StickyAsideHandlers,
  StickyAsideView,
  StickyPaint,
  StickyReading,
} from '@sticky-aside/core/headless'

const OFFSET_TOP = 'sticky-aside-top'
const OFFSET_BOTTOM = 'sticky-aside-bottom'

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
  measure.dataset.stickyMeasure = ''
  Object.assign(measure.style, {
    position: 'fixed',
    visibility: 'hidden',
    pointerEvents: 'none',
    left: '0',
    width: '0',
  } as const)
  options.wrapper.append(measure)
  Object.assign(options.wrapper.style, {
    position: 'relative',
    height: '100%',
  })
  const frame = options.viewport.parentElement
  if (frame && frame !== document.body) {
    frame.style.transform = 'translateZ(0)'
  }

  let resizeObserver: ResizeObserver | undefined
  let onScroll: (() => void) | undefined
  let onResize: (() => void) | undefined
  let topClass = options.topClass ?? OFFSET_TOP
  let bottomClass = options.bottomClass ?? OFFSET_BOTTOM
  let contentClass = options.contentClass ?? ''
  let appliedMeasure: string[] = []
  let appliedContent: string[] = []

  function getClassTokens(value: string): string[] {
    return value.split(/\s+/).filter((token) => token.length > 0)
  }

  function syncClassTokens(element: HTMLElement, previous: string[], next: string[]): string[] {
    for (const token of previous) {
      if (!next.includes(token)) {
        element.classList.remove(token)
      }
    }

    for (const token of next) {
      element.classList.add(token)
    }

    return next
  }

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
    appliedMeasure = syncClassTokens(measure, appliedMeasure, [
      ...getClassTokens(topClass),
      ...getClassTokens(bottomClass),
    ])
  }

  function paint(next: StickyPaint) {
    clearContentStyle()
    options.content.dataset.stickyAside = next.state
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

    appliedContent = syncClassTokens(options.content, appliedContent, nextTokens)
  }

  function unsubscribe() {
    resizeObserver?.disconnect()
    resizeObserver = undefined
    if (onScroll) {
      options.viewport.removeEventListener('scroll', onScroll)
    }
    if (onResize) {
      options.viewport.removeEventListener('resize', onResize)
    }
    onScroll = undefined
    onResize = undefined
  }

  function subscribe(handlers: StickyAsideHandlers) {
    onScroll = () => handlers.scroll()
    onResize = () => handlers.resize()
    resizeObserver = new ResizeObserver(() => handlers.resize())
    resizeObserver.observe(options.viewport)
    resizeObserver.observe(options.content)
    resizeObserver.observe(measure)
    options.viewport.addEventListener('scroll', onScroll, { passive: true })

    return unsubscribe
  }

  function destroy() {
    appliedContent = syncClassTokens(options.content, appliedContent, [])
    appliedMeasure = syncClassTokens(measure, appliedMeasure, [])
    unsubscribe()
    measure.remove()
    clearContentStyle()
    delete options.content.dataset.stickyAside
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
