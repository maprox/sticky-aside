import { createStickyAside, OFFSET_CLASS } from '@sticky-aside/core'
import type { StickyAsideController, StickyAsideState } from '@sticky-aside/core'

const ROOT = '[data-sticky-aside]'
const CONTENT = '[data-sticky-aside-content]'
const READY = 'data-sticky-aside-ready'

function readFlag(el: HTMLElement, name: string): boolean {
  const value = el.getAttribute(name)

  return value === '' || value === 'true'
}

function readOptions(wrapper: HTMLElement) {
  return {
    topClass: wrapper.getAttribute('data-top-class') || OFFSET_CLASS.top,
    bottomClass: wrapper.getAttribute('data-bottom-class') || OFFSET_CLASS.bottom,
    contentClass: wrapper.getAttribute('data-content-class') || '',
    disabled: readFlag(wrapper, 'data-disabled'),
    locked: readFlag(wrapper, 'data-locked'),
    allowLockedOverflowTop: readFlag(wrapper, 'data-allow-locked-overflow-top'),
    allowLockedOverflowBottom: readFlag(wrapper, 'data-allow-locked-overflow-bottom'),
  }
}

const controllers = new WeakMap<HTMLElement, StickyAsideController>()

function bind(wrapper: HTMLElement): void {
  if (wrapper.hasAttribute(READY)) {
    return
  }
  const content = wrapper.querySelector<HTMLElement>(CONTENT)
  if (!content) {
    return
  }
  wrapper.setAttribute(READY, '')
  const initial = readOptions(wrapper)
  const aside = createStickyAside({
    wrapper,
    content,
    ...initial,
    onStateChange(state: StickyAsideState) {
      wrapper.dispatchEvent(new CustomEvent('sticky-aside-state', {
        detail: state,
        bubbles: true,
      }))
    },
  })
  controllers.set(wrapper, aside)

  const observer = new MutationObserver(() => {
    const next = readOptions(wrapper)
    aside.setLocked(next.locked)
    aside.setDisabled(next.disabled)
    aside.setClasses({
      topClass: next.topClass,
      bottomClass: next.bottomClass,
      contentClass: next.contentClass,
    })
    aside.setAllowLockedOverflow(next.allowLockedOverflowTop, next.allowLockedOverflowBottom)
  })
  observer.observe(wrapper, {
    attributes: true,
    attributeFilter: [
      'data-top-class',
      'data-bottom-class',
      'data-content-class',
      'data-disabled',
      'data-locked',
      'data-allow-locked-overflow-top',
      'data-allow-locked-overflow-bottom',
    ],
  })

  const disconnect = new MutationObserver(() => {
    if (document.contains(wrapper)) {
      return
    }
    observer.disconnect()
    disconnect.disconnect()
    aside.destroy()
    controllers.delete(wrapper)
  })
  disconnect.observe(document.documentElement, { childList: true, subtree: true })
}

export function initStickyAsideRoots(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>(ROOT).forEach(bind)
}
