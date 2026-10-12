import { MODE, REASON } from '#core/model/constants.ts'
import type { StickyFrame, StickyModel } from '#core/model/types.ts'

export interface StickyStep {
  model: StickyModel
  frame: StickyFrame
}

export function getClearedLockModel(model: StickyModel): StickyModel {
  return {
    ...model,
    locked: false,
    lockedTop: null,
  }
}

export function getPinnedStickyModel(model: StickyModel, edge: 'top' | 'bottom'): StickyModel {
  return {
    ...model,
    mode: edge === 'top' ? MODE.fixedTop : MODE.fixedBottom,
    locked: false,
  }
}

export function getLockedStickyModel({ model, frame }: StickyStep): StickyModel {
  const lockedTop = model.lockedTop ?? frame.content.top
  const isPastTop = !frame.allowLockedOverflowTop && frame.wrapper.top > lockedTop
  const isPastBottom = !frame.allowLockedOverflowBottom &&
    lockedTop + frame.content.height > frame.wrapper.top + frame.wrapper.height

  if (isPastTop || isPastBottom) {
    return getRelativeStickyModel({
      model: {
        ...model,
        locked: true,
        lockedTop,
      },
      frame,
    })
  }

  return {
    ...model,
    mode: MODE.fixedLocked,
    locked: true,
    lockedTop,
  }
}

export function getRelativeStickyModel({ model, frame }: StickyStep): StickyModel {
  let containerTop = Math.max(frame.content.top - frame.wrapper.top, 0)
  if (!allowsBottomGap(frame)) {
    containerTop = getClampedContainerTop(containerTop, frame)
  }

  return {
    mode: MODE.relative,
    containerTop,
    locked: model.locked,
    lockedTop: model.locked ? model.lockedTop : null,
  }
}

export function getStickyModelAtEdges({ model, frame }: StickyStep): StickyModel {
  const isMeasureBelow = frame.measure.bottom > frame.wrapper.bottom
  const isAlreadyAtBottom = Math.round(frame.content.bottom) === Math.round(frame.wrapper.bottom)
  const isAlreadyAtTop = frame.content.top === 0

  if ((isMeasureBelow && isAlreadyAtBottom) || (!isMeasureBelow && isAlreadyAtTop)) {
    return model
  }

  const containerTop = getClampedContainerTop(isMeasureBelow ? frame.wrapper.height : 0, frame)

  return {
    mode: MODE.relative,
    containerTop,
    locked: false,
    lockedTop: null,
  }
}

export function isFullyVisible(frame: StickyFrame): boolean {
  return frame.measure.height >= frame.content.height
}

export function isCoveringTopOffset(frame: StickyFrame): boolean {
  return frame.content.top >= 0 && frame.content.top < frame.measure.top
}

export function isMeasureInside(frame: StickyFrame): boolean {
  return frame.measure.top >= frame.wrapper.top && frame.measure.bottom <= frame.wrapper.bottom
}

export function isOutsideViewport(frame: StickyFrame): boolean {
  return frame.scrollY < 0 || frame.scrollY > frame.documentHeight - frame.viewportHeight
}

export function isFixed(model: StickyModel): boolean {
  return model.mode !== MODE.relative
}

export function isScrollingOpposite({ model, frame }: StickyStep): boolean {
  const isFixedTop = model.mode === MODE.fixedTop || model.mode === MODE.fixedLocked

  return (frame.scrollingUp && !isFixedTop) || (!frame.scrollingUp && isFixedTop)
}

function allowsBottomGap(frame: StickyFrame): boolean {
  return frame.reason === REASON.unlock && frame.allowLockedOverflowBottom
}

function getClampedContainerTop(containerTop: number, frame: StickyFrame): number {
  const bottomGap = frame.wrapper.height - (containerTop + frame.content.height)
  let next = containerTop
  if (bottomGap < 0) {
    next += bottomGap
  }

  return next < 0 ? 0 : next
}
