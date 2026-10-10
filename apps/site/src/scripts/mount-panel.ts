import { createStickyAside } from '@sticky-aside/core'
import type { StickyAsideController } from '@sticky-aside/core'

import { paragraphs } from '#site/demo/copy'

export interface MountOptions {
  tall?: boolean
  controls?: boolean
}

export function mountPanel(rail: HTMLElement, options: MountOptions = {}): () => void {
  const wrapper = document.createElement('div')
  wrapper.className = 'sticky-aside-root'
  const content = document.createElement('div')
  const panel = document.createElement('div')
  panel.className = 'panel'
  panel.append(panelBody(options.tall !== false))
  content.append(panel)
  wrapper.append(content)
  rail.append(wrapper)
  wrapper.style.setProperty('--sticky-aside-top', '16px')
  wrapper.style.setProperty('--sticky-aside-bottom', '16px')

  const aside: StickyAsideController = createStickyAside({
    wrapper,
    content,
  })

  const cleanups: Array<() => void> = []

  if (options.controls !== false) {
    const controls = document.createElement('div')
    controls.className = 'controls'
    controls.innerHTML = `
      <label>Отступ сверху <input data-top type="number" min="0" value="16" /></label>
      <label>Отступ снизу <input data-bottom type="number" min="0" value="16" /></label>
      <label><input data-lock type="checkbox" /> Замок</label>
      <label><input data-tall type="checkbox" checked /> Длинная панель</label>
    `
    panel.append(controls)

    const top = controls.querySelector<HTMLInputElement>('[data-top]')!
    const bottom = controls.querySelector<HTMLInputElement>('[data-bottom]')!
    const lock = controls.querySelector<HTMLInputElement>('[data-lock]')!
    const tall = controls.querySelector<HTMLInputElement>('[data-tall]')!

    const onOffsets = () => {
      wrapper.style.setProperty('--sticky-aside-top', `${Number(top.value) || 0}px`)
      wrapper.style.setProperty('--sticky-aside-bottom', `${Number(bottom.value) || 0}px`)
      aside.update('resize')
    }
    const onLock = () => aside.setLocked(lock.checked)
    const onTall = () => {
      const body = panel.querySelector('[data-panel-body]')
      body?.replaceWith(panelBody(tall.checked))
      aside.update('resize')
    }

    top.addEventListener('input', onOffsets)
    bottom.addEventListener('input', onOffsets)
    lock.addEventListener('change', onLock)
    tall.addEventListener('change', onTall)
    cleanups.push(() => {
      top.removeEventListener('input', onOffsets)
      bottom.removeEventListener('input', onOffsets)
      lock.removeEventListener('change', onLock)
      tall.removeEventListener('change', onTall)
    })
  }

  return () => {
    cleanups.forEach((fn) => fn())
    aside.destroy()
    wrapper.remove()
  }
}

function panelBody(isTall: boolean): HTMLElement {
  const body = document.createElement('div')
  body.dataset.panelBody = ''
  const clip = document.createElement('span')
  clip.className = 'clip'
  const title = document.createElement('p')
  title.className = 'panel-kicker'
  title.textContent = 'sticky-aside'
  const text = document.createElement('p')
  text.textContent = isTall
    ? 'Панель выше окна. Крутите страницу в обе стороны.'
    : 'Панель короче окна и остаётся сверху.'
  body.append(clip, title, text)

  if (isTall) {
    const list = document.createElement('ol')
    paragraphs.slice(0, 8).forEach((line) => {
      const item = document.createElement('li')
      item.textContent = line
      list.append(item)
    })
    body.append(list)
  }

  return body
}

export function articleMarkup(): string {
  return paragraphs.map((line) => `<p>${line}</p>`).join('')
}
