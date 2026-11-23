import { describe, expect, it } from 'vitest'

import { generateDemoCode } from '#site/demo/generate-code.ts'
import { t } from '#site/demo/i18n.ts'
import {
  initialDemoSettings,
  initialSnippetText,
  initialViewportModel,
} from '#site/demo/initial-shell.ts'

describe('initial demo shell (SSG)', () => {
  it('uses default knobs and the framework from the page URL', () => {
    expect(initialDemoSettings('react')).toMatchObject({
      tall: true,
      top: 16,
      bottom: 16,
      framework: 'react',
    })
  })

  it('emits framework-specific plain snippet text for each route', () => {
    expect(initialSnippetText('en', 'vanilla')).toContain("from '@sticky-aside/core'")
    expect(initialSnippetText('en', 'vue')).toContain("from '@sticky-aside/vue'")
    expect(initialSnippetText('en', 'react')).toContain("from '@sticky-aside/react'")
    expect(initialSnippetText('en', 'svelte')).toContain("from '@sticky-aside/svelte'")
    expect(initialSnippetText('en', 'solid')).toContain("from '@sticky-aside/solid'")
    expect(initialSnippetText('en', 'astro')).toContain("from '@sticky-aside/astro'")
    expect(initialSnippetText('ru', 'vue')).toBe(
      generateDemoCode(initialDemoSettings('vue'), 'ru'),
    )
  })

  it('describes the tall panel viewport markup for SSR', () => {
    const model = initialViewportModel('en', 'vanilla')
    expect(model.articleLines).toHaveLength(12)
    expect(model.articleLines[0]).toBe(
      'A short panel stays at the top of the window. A tall one rides with the page until the edge you scroll toward meets the screen.',
    )
    expect(model.panelCopy).toBe(t('en', 'panel.tall'))
    expect(model.panelItems).toEqual([
      'Scroll down: the panel pins its bottom edge to the window.',
      'Scroll up: it releases and pins its top edge instead.',
      'Between those moments the panel just rides with the page.',
      'Drag the lower edge of the window to change its height.',
      'Turn off the tall switch to compare with a short panel.',
      'Lock holds the panel at the height where you turned it on.',
      'Keep scrolling after the bottom edge lands: the article moves while the panel stays put.',
      'Reverse direction near the bottom to watch the panel travel before its top edge catches.',
      'The top and bottom offsets leave breathing room around the panel while it is pinned.',
      'A locked panel ignores the usual edge rules until you release the lock.',
      'Disabling sticky returns the panel to its ordinary place in the column.',
      'Resizing the window changes only its frame; the panel keeps its natural content height.',
    ])
    expect(new Set([...model.articleLines, ...model.panelItems]).size).toBe(24)
    expect(model.style).toBe('--sticky-aside-top: 16px; --sticky-aside-bottom: 16px')
  })
})
