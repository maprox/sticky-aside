import { describe, expect, it } from 'vitest'

import { landingContent } from '#site/demo/landing-content.ts'
import { DEMO_FRAMEWORKS, type DemoFramework } from '#site/demo/settings.ts'

const packages: Record<DemoFramework, string> = {
  vanilla: '@sticky-aside/core',
  vue: '@sticky-aside/vue',
  react: '@sticky-aside/react',
  svelte: '@sticky-aside/svelte',
  solid: '@sticky-aside/solid',
  astro: '@sticky-aside/astro',
  angular: '@sticky-aside/angular',
}

const packageDirectories: Record<DemoFramework, string> = {
  vanilla: 'core',
  vue: 'vue',
  react: 'react',
  svelte: 'svelte',
  solid: 'solid',
  astro: 'astro',
  angular: 'angular',
}

describe('landingContent', () => {
  it.each(['en', 'ru'] as const)('provides complete installation and usage content in %s', (locale) => {
    for (const framework of DEMO_FRAMEWORKS) {
      const content = landingContent(locale, framework)
      const packageName = packages[framework]

      expect(content.installation.command).toBe(`npm install ${packageName}`)
      expect(content.installation.body.length).toBeGreaterThan(40)
      expect(content.explanation.paragraphs).toHaveLength(2)
      expect(content.explanation.paragraphs.every((paragraph) => paragraph.length > 80)).toBe(true)
      expect(content.limitations.items).toHaveLength(3)
      expect(content.limitations.items.join(' ')).toMatch(/nested|вложен/i)
      expect(content.integration.docsHref).toBe(
        `https://github.com/maprox/sticky-aside/tree/main/packages/${packageDirectories[framework]}#readme`,
      )
      expect(content.integration.npmHref).toBe(`https://www.npmjs.com/package/${packageName}`)
    }
  })

  it('gives each framework its own integration guidance in both locales', () => {
    for (const locale of ['en', 'ru'] as const) {
      const bodies = DEMO_FRAMEWORKS.map((framework) => (
        landingContent(locale, framework).integration.body
      ))

      expect(new Set(bodies).size).toBe(DEMO_FRAMEWORKS.length)
      expect(bodies.every((body) => body.length > 80)).toBe(true)
    }
  })
})
