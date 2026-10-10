import type { MODE, REASON } from '#core/model/constants.ts'

export type StickyMode = (typeof MODE)[keyof typeof MODE]

export type StickyReason = (typeof REASON)[keyof typeof REASON]

export interface Box {
  top: number
  bottom: number
  width: number
  height: number
}

export interface StickyModel {
  mode: StickyMode
  containerTop: number
  locked: boolean
  lockedTop: number | null
}

export interface StickyFrame {
  disabled: boolean
  locked: boolean
  allowLockedOverflowTop: boolean
  allowLockedOverflowBottom: boolean
  scrollingUp: boolean
  scrollY: number
  viewportHeight: number
  documentHeight: number
  wrapper: Box
  content: Box
  measure: Box
  reason: StickyReason
}
