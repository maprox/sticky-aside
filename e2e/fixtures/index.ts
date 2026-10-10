import { test as base, expect } from '@playwright/test'
import { StickyPage } from './sticky-page'

export { expect }

export const test = base.extend<{ stickyPage: StickyPage }>({
  stickyPage: async ({ page }, use) => {
    await use(new StickyPage(page))
  },
})
