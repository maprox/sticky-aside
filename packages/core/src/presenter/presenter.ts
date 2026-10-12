import { REASON } from '#core/model/constants.ts'
import { getInitialStickyModel, getNewStickyModel } from '#core/model/step.ts'
import type { StickyReason } from '#core/model/types.ts'
import { getSession, getStickyFrame, getStickyPaint } from '#core/presenter/utils.ts'
import type {
  StickyAsideClasses,
  StickyAsideController,
  StickyAsidePresenterOptions,
  StickyAsideState,
  StickyAsideView,
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
  let lastScrollY = view.read().metrics.scrollY

  function report(state: StickyAsideState) {
    if (isStopped || state === painted) {
      return
    }

    painted = state
    options.onStateChange?.(state)
  }

  function apply(reason: StickyReason) {
    if (isStopped) {
      return
    }

    const previousState = painted
    view.paintMeasure()
    const reading = view.read()
    model = getNewStickyModel(model, getStickyFrame(session, reading, isScrollingUp, reason))
    const paint = getStickyPaint(model, session, reading.wrapper.width)
    view.paint(paint)
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

  function onScroll() {
    const scrollY = view.read().metrics.scrollY
    isScrollingUp = scrollY < lastScrollY
    lastScrollY = scrollY
    apply(REASON.scroll)
  }

  function onResize() {
    apply(REASON.resize)
  }

  function update(reason: Extract<StickyReason, 'scroll' | 'resize'> = REASON.resize) {
    apply(reason)
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
    scroll: onScroll,
    resize: onResize,
  })

  function destroy() {
    if (isStopped) {
      return
    }

    isStopped = true
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
