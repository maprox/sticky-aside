import { MODE } from '#core/model/constants.ts'
import type { StickyFrame, StickyModel, StickyReason } from '#core/model/types.ts'
import { DEFAULTS } from '#core/presenter/constants.ts'
import type { Session } from '#core/presenter/types.ts'
import type { StickyAsidePresenterOptions, StickyPaint, StickyReading } from '#core/types.ts'

export function getSession(options: StickyAsidePresenterOptions): Session {
  return {
    disabled: options.disabled ?? DEFAULTS.disabled,
    locked: options.locked ?? DEFAULTS.locked,
    allowLockedOverflowTop: options.allowLockedOverflowTop ?? DEFAULTS.allowLockedOverflowTop,
    allowLockedOverflowBottom: options.allowLockedOverflowBottom ?? DEFAULTS.allowLockedOverflowBottom,
  }
}

export function getStickyFrame(
  session: Session,
  reading: StickyReading,
  isScrollingUp: boolean,
  reason: StickyReason,
): StickyFrame {
  return {
    disabled: session.disabled,
    locked: session.locked,
    allowLockedOverflowTop: session.allowLockedOverflowTop,
    allowLockedOverflowBottom: session.allowLockedOverflowBottom,
    scrollingUp: isScrollingUp,
    scrollY: reading.metrics.scrollY,
    viewportHeight: reading.metrics.viewportHeight,
    documentHeight: reading.metrics.documentHeight,
    wrapper: reading.wrapper,
    content: reading.content,
    measure: reading.measure,
    reason,
  }
}

export function getStickyPaint(model: StickyModel, session: Session, wrapperWidth: number): StickyPaint {
  if (session.disabled) {
    return {
      state: 'off',
    }
  }

  if (model.mode === MODE.relative) {
    return {
      state: 'flow',
      top: model.containerTop,
    }
  }

  if (model.mode === MODE.fixedBottom) {
    return {
      state: 'bottom',
      width: wrapperWidth,
    }
  }

  if (model.mode === MODE.fixedLocked) {
    return {
      state: 'locked',
      top: model.lockedTop ?? 0,
      width: wrapperWidth,
    }
  }

  return {
    state: 'top',
    width: wrapperWidth,
  }
}
