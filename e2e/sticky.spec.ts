import { expect, test } from './fixtures'
import { DEFAULT_OFFSET, VIEWPORT_HEIGHT } from './fixtures/sticky-page'

const runtimes = ['vanilla', 'vue', 'react', 'svelte'] as const

test.describe('packed packages', () => {
  for (const runtime of runtimes) {
    test(`${runtime} pins a short panel to the top offset`, async ({ stickyPage }) => {
      await stickyPage.open({ runtime, tall: false })
      await stickyPage.expectState('top')
      expect((await stickyPage.contentBox()).y).toBeCloseTo(DEFAULT_OFFSET, 0)
    })

    test(`${runtime} pins a tall panel to the bottom, then the top`, async ({ stickyPage }) => {
      await stickyPage.open({ runtime, tall: true })
      await stickyPage.expectState('flow')

      await stickyPage.scrollTo(1000)
      await stickyPage.expectState('bottom')
      const bottom = await stickyPage.contentBox()
      expect(bottom.y + bottom.height).toBeCloseTo(VIEWPORT_HEIGHT - DEFAULT_OFFSET, 0)

      await stickyPage.scrollTo(900)
      await stickyPage.expectState('flow')

      await stickyPage.scrollTo(200)
      await stickyPage.expectState('top')
      expect((await stickyPage.contentBox()).y).toBeCloseTo(DEFAULT_OFFSET, 0)
      await expect(stickyPage.states).toHaveText('flow bottom flow top')
    })

    test(`${runtime} moves the pin when the top offset changes`, async ({ stickyPage }) => {
      await stickyPage.open({ runtime, tall: false })
      await stickyPage.setTopOffset(48)
      await expect.poll(async () => (await stickyPage.contentBox()).y).toBeCloseTo(48, 0)
    })

    test(`${runtime} returns a lock into the column and keeps one that may overflow`, async ({ stickyPage }) => {
      await stickyPage.open({ runtime, tall: true })
      await stickyPage.scrollTo(1000)
      await stickyPage.expectState('bottom')
      await stickyPage.lock()
      await stickyPage.expectState('locked')
      const locked = await stickyPage.contentBox()

      await stickyPage.scrollTo(1100)
      expect((await stickyPage.contentBox()).y).toBeCloseTo(locked.y, 0)

      await stickyPage.scrollTo(0)
      await expect.poll(async () => stickyPage.panel.getAttribute('data-sticky-aside')).toBe('flow')
      await stickyPage.expectInsideColumn()

      await stickyPage.allowOverflowTop()
      await stickyPage.expectState('locked')

      await stickyPage.open({ runtime, tall: true })
      await stickyPage.scrollTo(1000)
      await stickyPage.expectState('bottom')
      await stickyPage.scrollTo(900)
      await stickyPage.expectState('flow')
      await stickyPage.scrollTo(200)
      await stickyPage.expectState('top')
      await stickyPage.lock()
      await stickyPage.expectState('locked')

      await stickyPage.scrollTo(1200)
      await expect.poll(async () => stickyPage.panel.getAttribute('data-sticky-aside')).toBe('flow')
      await stickyPage.expectInsideColumn()

      await stickyPage.allowOverflowBottom()
      await stickyPage.expectState('locked')
    })

    test(`${runtime} turns pinning off`, async ({ stickyPage }) => {
      await stickyPage.open({ runtime, tall: false })
      await stickyPage.disable()
      await stickyPage.expectState('off')
      await expect(stickyPage.panel).toHaveCSS('position', 'relative')
    })

    test(`${runtime} matches the fixed width to the column`, async ({ page, stickyPage }) => {
      await stickyPage.open({ runtime, tall: false })
      await page.setViewportSize({ width: 900, height: VIEWPORT_HEIGHT })
      const column = await stickyPage.column.boundingBox()
      const content = await stickyPage.contentBox()
      expect(content.width).toBeCloseTo(column?.width ?? 0, 0)
    })
  }
})
