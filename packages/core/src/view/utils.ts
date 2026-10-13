import type { Box } from '#core/model/types.ts'
import type { ScrollMetrics } from '#core/types.ts'

export function getBox(element: HTMLElement): Box {
  const rect = element.getBoundingClientRect()

  return {
    top: rect.top,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  }
}

export function getMetrics(): ScrollMetrics {
  return {
    scrollY: window.scrollY,
    viewportHeight: window.innerHeight,
    documentHeight: document.body.clientHeight,
  }
}

export function getClassTokens(value: string): string[] {
  return value.split(/\s+/).filter((token) => token.length > 0)
}

export function syncClassTokens(element: HTMLElement, previous: string[], next: string[]): string[] {
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
