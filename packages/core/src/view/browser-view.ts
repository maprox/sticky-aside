import type { Box } from '#core/model/types.ts'
import type {
  ScrollMetrics,
  StickyAsideClasses,
  StickyAsideHandlers,
  StickyAsideOptions,
  StickyAsideView,
  StickyPaint,
  StickyReading,
} from '#core/types.ts'
import { ASIDE_STATE, DATASET, MEASURE_STYLE, OFFSET_CLASS, WRAPPER_STYLE } from '#core/view/constants.ts'

export function createBrowserView(options: StickyAsideOptions): StickyAsideView {
  const measure = document.createElement('div')
  measure.dataset[DATASET.measure] = ''
  Object.assign(measure.style, MEASURE_STYLE)
  options.wrapper.append(measure)
  Object.assign(options.wrapper.style, WRAPPER_STYLE)

  let resizeObserver: ResizeObserver | undefined
  let onScroll: (() => void) | undefined
  let onResize: (() => void) | undefined
  let topClass = options.topClass ?? OFFSET_CLASS.top
  let bottomClass = options.bottomClass ?? OFFSET_CLASS.bottom
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
  }

  function getBox(element: HTMLElement): Box {
    if (options.readRect) {
      return options.readRect(element)
    }

    const rect = element.getBoundingClientRect()

    return {
      top: rect.top,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
    }
  }

  function getMetrics(): ScrollMetrics {
    if (options.getScrollMetrics) {
      return options.getScrollMetrics()
    }

    return {
      scrollY: window.scrollY,
      viewportHeight: window.innerHeight,
      documentHeight: document.body.clientHeight,
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
    options.content.dataset[DATASET.aside] = ASIDE_STATE[next.state]
    const nextTokens = getClassTokens(contentClass)
    if (next.state === 'off') {
      options.content.style.position = 'relative'
    } else if (next.state === 'flow') {
      options.content.style.position = 'relative'
      options.content.style.top = `${next.top}px`
    } else if (next.state === 'bottom') {
      options.content.style.position = 'fixed'
      options.content.style.width = `${next.width}px`
      nextTokens.push(...getClassTokens(bottomClass))
    } else if (next.state === 'locked') {
      options.content.style.position = 'fixed'
      options.content.style.width = `${next.width}px`
      options.content.style.top = `${next.top}px`
    } else {
      options.content.style.position = 'fixed'
      options.content.style.width = `${next.width}px`
      nextTokens.push(...getClassTokens(topClass))
    }

    appliedContent = syncClassTokens(options.content, appliedContent, nextTokens)
  }

  function unsubscribe() {
    resizeObserver?.disconnect()
    resizeObserver = undefined
    if (onScroll) {
      window.removeEventListener('scroll', onScroll)
    }

    if (onResize) {
      window.removeEventListener('resize', onResize)
    }

    onScroll = undefined
    onResize = undefined
  }

  function subscribe(handlers: StickyAsideHandlers) {
    onScroll = () => handlers.scroll()
    onResize = () => handlers.resize()
    resizeObserver = new ResizeObserver(() => handlers.resize())
    resizeObserver.observe(options.content)
    resizeObserver.observe(measure)
    window.addEventListener('scroll', onScroll, {
      passive: true,
    })
    window.addEventListener('resize', onResize, {
      passive: true,
    })

    return unsubscribe
  }

  function destroy() {
    appliedContent = syncClassTokens(options.content, appliedContent, [])
    appliedMeasure = syncClassTokens(measure, appliedMeasure, [])
    measure.remove()
    clearContentStyle()
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
