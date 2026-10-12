export type DemoFramework = 'vanilla' | 'vue' | 'react' | 'svelte' | 'solid' | 'astro'
export type DemoLocale = 'en' | 'ru'

export interface DemoSettings {
  tall: boolean
  top: number
  bottom: number
  locked: boolean
  allowLockedOverflowTop: boolean
  allowLockedOverflowBottom: boolean
  disabled: boolean
  viewportHeight: number
  framework: DemoFramework
}

export const DEFAULT_DEMO_SETTINGS: DemoSettings = {
  tall: true,
  top: 16,
  bottom: 16,
  locked: false,
  allowLockedOverflowTop: false,
  allowLockedOverflowBottom: false,
  disabled: false,
  viewportHeight: 420,
  framework: 'vanilla',
}

export const DEMO_FRAMEWORKS: DemoFramework[] = [
  'vanilla', 'vue', 'react', 'svelte', 'solid', 'astro',
]

export const VIEWPORT_HEIGHT_MIN = 240
export const VIEWPORT_HEIGHT_MAX = 1600
/** Initial window height is this share of the screen, and never more. */
export const VIEWPORT_HEIGHT_SCREEN_RATIO = 0.8

export function initialViewportHeight(screenHeight: number, occupied = 0): number {
  if (!Number.isFinite(screenHeight) || screenHeight <= 0) {
    return DEFAULT_DEMO_SETTINGS.viewportHeight
  }
  const byScreen = Math.round(screenHeight * VIEWPORT_HEIGHT_SCREEN_RATIO)
  const byRoom = occupied > 0 ? Math.floor(screenHeight - occupied) : byScreen
  const target = Math.min(byScreen, byRoom)

  return Math.min(VIEWPORT_HEIGHT_MAX, Math.max(VIEWPORT_HEIGHT_MIN, target))
}

export function clampDemoSettings(settings: DemoSettings): DemoSettings {
  return {
    ...settings,
    top: Math.max(0, Math.round(settings.top)),
    bottom: Math.max(0, Math.round(settings.bottom)),
    viewportHeight: Math.min(VIEWPORT_HEIGHT_MAX, Math.max(VIEWPORT_HEIGHT_MIN, Math.round(settings.viewportHeight))),
  }
}
