import type {
  StickyAsideClasses,
  StickyAsideHandlers,
  StickyAsideOptions,
  StickyAsideView,
  StickyPaint,
  StickyReading,
} from '#core/types.ts'
import { ASIDE_STATE, DATASET, MEASURE_STYLE, OFFSET_CLASS, WRAPPER_STYLE } from '#core/view/constants.ts'
import { getBox, getClassTokens, getMetrics, syncClassTokens } from '#core/view/utils.ts'

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
  let appliedMeasureClasses: string[] = []
  let appliedContentClasses: string[] = []

  function clearContentStyle() {
    options.content.style.position = ''
    options.content.style.top = ''
    options.content.style.bottom = ''
    options.content.style.width = ''
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

    appliedContentClasses = syncClassTokens(options.content, appliedContentClasses, nextTokens)
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
    appliedContentClasses = syncClassTokens(options.content, appliedContentClasses, [])
    appliedMeasureClasses = syncClassTokens(measure, appliedMeasureClasses, [])
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
