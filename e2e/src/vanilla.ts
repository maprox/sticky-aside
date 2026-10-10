import { createStickyAside } from '@sticky-aside/core'

import { record } from './record.ts'

export function mount(column: HTMLElement) {
  const wrapper = document.createElement('div')
  const content = document.createElement('div')
  const panel = document.createElement('div')
  panel.className = 'panel'
  content.append(panel)
  wrapper.append(content)
  column.append(wrapper)

  const aside = createStickyAside({
    wrapper,
    content,
    onStateChange: record,
  })

  let locked = false
  let disabled = false
  let overflowTop = false
  let overflowBottom = false

  document.querySelector('#lock')?.addEventListener('click', () => {
    locked = !locked
    aside.setLocked(locked)
  })
  document.querySelector('#disable')?.addEventListener('click', () => {
    disabled = !disabled
    aside.setDisabled(disabled)
  })
  document.querySelector('#overflow-top')?.addEventListener('click', () => {
    overflowTop = !overflowTop
    aside.setAllowLockedOverflow(overflowTop, overflowBottom)
  })
  document.querySelector('#overflow-bottom')?.addEventListener('click', () => {
    overflowBottom = !overflowBottom
    aside.setAllowLockedOverflow(overflowTop, overflowBottom)
  })
}
