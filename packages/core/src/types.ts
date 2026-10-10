import type { Box, StickyModel, StickyReason } from '#core/model/types.ts'

export interface ScrollMetrics {
  scrollY: number
  viewportHeight: number
  documentHeight: number
}

export type StickyAsideState = 'flow' | 'top' | 'bottom' | 'locked' | 'off'

export interface StickyAsidePresenterOptions {
  disabled?: boolean
  locked?: boolean
  allowLockedOverflowTop?: boolean
  allowLockedOverflowBottom?: boolean
  onStateChange?: (state: StickyAsideState) => void
}

export interface StickyAsideClasses {
  topClass?: string
  bottomClass?: string
  contentClass?: string
}

export interface StickyAsideOptions extends StickyAsidePresenterOptions {
  wrapper: HTMLElement
  content: HTMLElement
  topClass?: string
  bottomClass?: string
  contentClass?: string
  getScrollMetrics?: () => ScrollMetrics
  readRect?: (element: HTMLElement) => Box
}

export interface StickyReading {
  metrics: ScrollMetrics
  wrapper: Box
  content: Box
  measure: Box
}

export interface StickyPaintOff {
  state: 'off'
}

export interface StickyPaintFlow {
  state: 'flow'
  top: number
}

export interface StickyPaintTop {
  state: 'top'
  width: number
}

export interface StickyPaintBottom {
  state: 'bottom'
  width: number
}

export interface StickyPaintLocked {
  state: 'locked'
  top: number
  width: number
}

export type StickyPaint =
  StickyPaintOff |
  StickyPaintFlow |
  StickyPaintTop |
  StickyPaintBottom |
  StickyPaintLocked

export interface StickyAsideHandlers {
  scroll(): void
  resize(): void
}

export interface StickyAsideView {
  read(): StickyReading
  setClasses(classes: StickyAsideClasses): void
  paintMeasure(): void
  paint(paint: StickyPaint): void
  subscribe(handlers: StickyAsideHandlers): () => void
  destroy(): void
}

export interface StickyAsideController {
  update: (reason?: Extract<StickyReason, 'scroll' | 'resize'>) => void
  setLocked: (isLocked: boolean) => void
  setDisabled: (isDisabled: boolean) => void
  setClasses: (classes: StickyAsideClasses) => void
  setAllowLockedOverflow: (isAllowTop: boolean, isAllowBottom: boolean) => void
  destroy: () => void
  getState: () => StickyAsideState
  getModel: () => StickyModel
}
