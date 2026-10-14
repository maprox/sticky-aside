import { REASON } from '#core/model/constants.ts'
import { getInitialStickyModel, getNewStickyModel } from '#core/model/step.ts'
import type { StickyReason } from '#core/model/types.ts'
import { getSession, getStickyFrame, getStickyPaint, isSameStickyPaint } from '#core/presenter/utils.ts'
import type {
  StickyAsideClasses,
  StickyAsideController,
  StickyAsidePresenterOptions,
  StickyAsideState,
  StickyAsideView,
  StickyPaint,
} from '#core/types.ts'

export function createStickyAsidePresenter(
  view: StickyAsideView,
  options: StickyAsidePresenterOptions,
): StickyAsideController {
  const session = getSession(options)
  let model = getInitialStickyModel()
  let isScrollingUp = false
  let isStopped = false
  let painted: StickyAsideState | undefined
  let lastPaint: StickyPaint | undefined
  let shouldForcePaint = false
  let lastScrollY = view.read().metrics.scrollY
  let frameId: number | undefined
  let pendingReason: typeof REASON.scroll | typeof REASON.resize | undefined

  function report(state: StickyAsideState) {
    if (isStopped || state === painted) {
      return
    }

    painted = state
    options.onStateChange?.(state)
  }

  function apply(reason: StickyReason, shouldTrackScrollDirection = false) {
    if (isStopped) {
      return
    }

    const previousState = painted
    view.paintMeasure()
    const reading = view.read()
    if (shouldTrackScrollDirection) {
      isScrollingUp = reading.metrics.scrollY < lastScrollY
      lastScrollY = reading.metrics.scrollY
    }

    model = getNewStickyModel(model, getStickyFrame(session, reading, isScrollingUp, reason))
    const paint = getStickyPaint(model, session, reading.wrapper.width)
    if (shouldForcePaint || !isSameStickyPaint(lastPaint, paint)) {
      shouldForcePaint = false
      lastPaint = paint
      view.paint(paint)
    }
    report(paint.state)

    const didReleaseToFlow = reason === REASON.scroll &&
      previousState !== undefined &&
      previousState !== 'flow' &&
      previousState !== 'off' &&
      paint.state === 'flow'
    if (didReleaseToFlow) {
      apply(REASON.scroll)
    }
  }

  function flushPending() {
    frameId = undefined
    const reason = pendingReason
    pendingReason = undefined
    if (reason !== undefined) {
      apply(reason, reason === REASON.scroll)
    }
  }

  function schedule(reason: typeof REASON.scroll | typeof REASON.resize) {
    pendingReason = reason === REASON.resize || pendingReason === REASON.resize
      ? REASON.resize
      : REASON.scroll
    frameId ??= requestAnimationFrame(flushPending)
  }

  function update(reason: Extract<StickyReason, 'scroll' | 'resize'> = REASON.resize) {
    apply(reason, reason === REASON.scroll)
  }

  function setLocked(isLocked: boolean) {
    if (isStopped || isLocked === session.locked) {
      return
    }

    session.locked = isLocked
    apply(isLocked ? REASON.lock : REASON.unlock)
  }

  function setDisabled(isDisabled: boolean) {
    if (isStopped || isDisabled === session.disabled) {
      return
    }

    session.disabled = isDisabled
    apply(REASON.resize)
  }

  function setClasses(next: StickyAsideClasses) {
    if (isStopped) {
      return
    }

    view.setClasses(next)
    shouldForcePaint = true
    apply(REASON.resize)
  }

  function setAllowLockedOverflow(isAllowTop: boolean, isAllowBottom: boolean) {
    if (isStopped) {
      return
    }

    session.allowLockedOverflowTop = isAllowTop
    session.allowLockedOverflowBottom = isAllowBottom
    apply(REASON.resize)
  }

  function getState() {
    return painted ?? 'off'
  }

  function getModel() {
    return model
  }

  const unsubscribe = view.subscribe({
    scroll: () => schedule(REASON.scroll),
    resize: () => schedule(REASON.resize),
  })

  function destroy() {
    if (isStopped) {
      return
    }

    isStopped = true
    if (frameId !== undefined) {
      cancelAnimationFrame(frameId)
    }
    pendingReason = undefined
    unsubscribe()
    view.destroy()
  }

  apply(session.locked ? REASON.lock : REASON.resize)

  return {
    update,
    setLocked,
    setDisabled,
    setClasses,
    setAllowLockedOverflow,
    destroy,
    getState,
    getModel,
  }
}
