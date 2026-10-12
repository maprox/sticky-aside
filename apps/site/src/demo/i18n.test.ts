import { describe, expect, it } from 'vitest'

import {
  frameworkFromPath,
  frameworkPath,
  localePath,
  messages,
  stateReadout,
  switchLocalePath,
} from '#site/demo/i18n.ts'

describe('i18n', () => {
  it('keeps the same keys in en and ru', () => {
    expect(Object.keys(messages.en).sort()).toEqual(Object.keys(messages.ru).sort())
  })

  it('switches locale prefixes', () => {
    expect(switchLocalePath('en', '/')).toBe('/ru/')
    expect(switchLocalePath('ru', '/ru/')).toBe('/')
    expect(switchLocalePath('en', '/vue')).toBe('/ru/vue')
    expect(switchLocalePath('ru', '/ru/react')).toBe('/react')
  })

  it('describes the panel in a sentence', () => {
    expect(stateReadout('en', 'flow', false, false)).toBe('Riding with the page')
    expect(stateReadout('en', 'flow', true, false)).toBe('Scrolling down, still free')
    expect(stateReadout('en', 'flow', true, true)).toBe('Scrolling up, still free')
    expect(stateReadout('en', 'top', true, false)).toBe('Pinned to the top of the window')
    expect(stateReadout('en', 'bottom', true, true)).toBe('Pinned to the bottom of the window')
    expect(stateReadout('en', 'locked', false, false)).toBe('Held where you locked it')
    expect(stateReadout('en', 'off', true, false)).toBe('Sticky is off')
    expect(stateReadout('ru', 'flow', false, false)).toBe('Едет вместе со страницей')
    expect(stateReadout('ru', 'bottom', false, false)).toBe('Прижата к низу окна')
  })

  it('maps framework tabs to paths', () => {
    expect(frameworkPath('vanilla')).toBe('/')
    expect(frameworkPath('vue')).toBe('/vue')
    expect(localePath('ru', frameworkPath('svelte'))).toBe('/ru/svelte')
    expect(frameworkFromPath('/vue')).toBe('vue')
    expect(frameworkFromPath('/ru/react/')).toBe('react')
    expect(frameworkFromPath('/ru/')).toBe('vanilla')
  })
})
