import { describe, expect, it } from 'vitest'

import { generateDemoCode } from '#site/demo/generate-code.ts'
import { articleLines, t } from '#site/demo/i18n.ts'
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
    expect(initialSnippetText('ru', 'vue')).toBe(
      generateDemoCode(initialDemoSettings('vue'), 'ru'),
    )
  })

  it('describes the tall panel viewport markup for SSR', () => {
    const model = initialViewportModel('en', 'vanilla')
    expect(model.articleLines).toEqual([...articleLines('en'), ...articleLines('en')])
    expect(model.panelCopy).toBe(t('en', 'panel.tall'))
    expect(model.panelItems).toEqual(articleLines('en'))
    expect(model.style).toBe('--sticky-aside-top: 16px; --sticky-aside-bottom: 16px')
  })
})
