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
    expect(model.articleLines).toHaveLength(8)
    expect(model.articleLines[0]).toBe(
      'A short panel stays at the top of the window. A tall one rides with the page until the edge you scroll toward meets the screen.',
    )
    expect(model.panelCopy).toBe(t('en', 'panel.tall'))
    expect(model.panelItems).toEqual([
      'Drag the lower edge to resize the window.',
      'Toggle the tall panel to compare both modes.',
      'Lock the panel and keep scrolling.',
      'Disable sticky behavior to see the original layout.',
    ])
    expect(new Set([...model.articleLines, ...model.panelItems]).size).toBe(12)
    expect(model.style).toBe('--sticky-aside-top: 16px; --sticky-aside-bottom: 16px')
  })
})
