import { generateDemoCode } from '#site/demo/generate-code.ts'
import { articleLines, t } from '#site/demo/i18n.ts'
import { clampDemoSettings, DEFAULT_DEMO_SETTINGS } from '#site/demo/settings.ts'
import type { DemoFramework, DemoLocale, DemoSettings } from '#site/demo/settings.ts'

export function initialDemoSettings(framework: DemoFramework): DemoSettings {
  return clampDemoSettings({ ...DEFAULT_DEMO_SETTINGS, framework })
}

export function initialSnippetText(locale: DemoLocale, framework: DemoFramework): string {
  return generateDemoCode(initialDemoSettings(framework), locale)
}

export function initialViewportModel(locale: DemoLocale, framework: DemoFramework) {
  const settings = initialDemoSettings(framework)

  return {
    articleLines: [...articleLines(locale), ...articleLines(locale)],
    panelCopy: t(locale, settings.tall ? 'panel.tall' : 'panel.short'),
    panelItems: settings.tall ? articleLines(locale) : [],
    style: `--sticky-aside-top: ${settings.top}px; --sticky-aside-bottom: ${settings.bottom}px`,
  }
}
