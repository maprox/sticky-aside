import { vi } from 'vitest'

export function domRect(top: number, height: number, width = 240, left = 0): DOMRect {
  return new DOMRect(left, top, width, height)
}

export function mockBoundingClientRect(read: (element: HTMLElement) => DOMRect) {
  return vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    return read(this)
  })
}
