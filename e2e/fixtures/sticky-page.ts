import { expect, type Locator, type Page } from '@playwright/test'

export const DEFAULT_OFFSET = 16
export const VIEWPORT_HEIGHT = 800

export type StickyRuntime = 'vanilla' | 'vue' | 'react' | 'svelte'

export type OpenOptions = {
  runtime: StickyRuntime | string
  tall?: boolean
  top?: number
  bottom?: number
}

export class StickyPage {
  readonly panel: Locator
  readonly column: Locator
  readonly lockButton: Locator
  readonly disableButton: Locator
  readonly overflowTopButton: Locator
  readonly overflowBottomButton: Locator
  readonly states: Locator

  constructor(private readonly page: Page) {
    this.panel = page.locator('[data-sticky-aside]')
    this.column = page.locator('.column')
    this.lockButton = page.locator('#lock')
    this.disableButton = page.locator('#disable')
    this.overflowTopButton = page.locator('#overflow-top')
    this.overflowBottomButton = page.locator('#overflow-bottom')
    this.states = page.locator('#states')
  }

  async open(options: OpenOptions): Promise<void> {
    const params = new URLSearchParams()
    params.set('runtime', options.runtime)
    if (options.tall !== undefined) {
      params.set('tall', options.tall ? '1' : '0')
    }
    if (options.top !== undefined) {
      params.set('top', String(options.top))
    }
    if (options.bottom !== undefined) {
      params.set('bottom', String(options.bottom))
    }
    await this.page.goto(`/?${params}`)
    await expect(this.panel).toBeVisible()
  }

  async scrollTo(y: number): Promise<void> {
    await this.page.evaluate((next) => window.scrollTo(0, next), y)
  }

  async contentBox() {
    const box = await this.panel.boundingBox()
    if (!box) {
      throw new Error('Missing sticky box')
    }
    return box
  }

  async expectState(state: string): Promise<void> {
    await expect(this.panel).toHaveAttribute('data-sticky-aside', state)
  }

  async expectInsideColumn(): Promise<void> {
    const content = await this.contentBox()
    const column = await this.column.boundingBox()
    const top = column?.y ?? 0
    const bottom = top + (column?.height ?? 0)
    expect(content.y).toBeGreaterThanOrEqual(top - 1)
    expect(content.y + content.height).toBeLessThanOrEqual(bottom + 1)
  }

  async setTopOffset(px: number): Promise<void> {
    await this.page.evaluate((value) => {
      document.querySelector<HTMLElement>('.column')?.style.setProperty('--sticky-aside-top', `${value}px`)
      window.dispatchEvent(new Event('resize'))
    }, px)
  }

  async lock(): Promise<void> {
    await this.lockButton.click()
  }

  async disable(): Promise<void> {
    await this.disableButton.click()
  }

  async allowOverflowTop(): Promise<void> {
    await this.overflowTopButton.click()
  }

  async allowOverflowBottom(): Promise<void> {
    await this.overflowBottomButton.click()
  }
}
