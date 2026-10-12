import { MODE, REASON } from '#core/model/constants.ts'
import type { Box, StickyFrame, StickyModel } from '#core/model/types.ts'
import {
  getClearedLockModel,
  getLockedStickyModel,
  getPinnedStickyModel,
  getRelativeStickyModel,
  getStickyModelAtEdges,
  isCoveringTopOffset,
  isFixed,
  isFullyVisible,
  isMeasureInside,
  isOutsideViewport,
  isScrollingOpposite,
} from '#core/model/utils.ts'

export type { Box, StickyFrame, StickyModel }

export function getInitialStickyModel(): StickyModel {
  return {
    mode: MODE.relative,
    containerTop: 0,
    locked: false,
    lockedTop: null,
  }
}

export function getNewStickyModel(model: StickyModel, frame: StickyFrame): StickyModel {
  if (frame.disabled) {
    return model
  }

  if (frame.reason === REASON.unlock) {
    return getRelativeStickyModel({ model: getClearedLockModel(model), frame })
  }

  if (frame.reason === REASON.lock) {
    return getLockedStickyModel({
      model: {
        ...model,
        locked: true,
        lockedTop: frame.content.top,
      },
      frame,
    })
  }

  if (frame.locked) {
    return getLockedStickyModel({ model, frame })
  }

  if (frame.reason === REASON.resize) {
    if (isMeasureInside(frame)) {
      if (isFullyVisible(frame) || isCoveringTopOffset(frame)) {
        return getPinnedStickyModel(model, 'top')
      }

      return model
    }

    return getRelativeStickyModel({ model: getClearedLockModel(model), frame })
  }

  if (isFixed(model)) {
    const isReleasing =
      (!isMeasureInside(frame) && !isOutsideViewport(frame)) ||
      (!isFullyVisible(frame) && isScrollingOpposite({ model, frame }))

    return isReleasing ? getRelativeStickyModel({ model: getClearedLockModel(model), frame }) : model
  }

  if (isMeasureInside(frame)) {
    if (isFullyVisible(frame)) {
      return getPinnedStickyModel(model, 'top')
    }

    if (frame.scrollingUp && frame.content.top > frame.measure.top) {
      return getPinnedStickyModel(model, 'top')
    }

    if (!frame.scrollingUp && frame.content.bottom < frame.measure.bottom) {
      return getPinnedStickyModel(model, 'bottom')
    }

    return model
  }

  return getStickyModelAtEdges({ model, frame })
}
