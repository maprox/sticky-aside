import { createStickyAsidePresenter } from '#core/presenter/presenter.ts'
import type { StickyAsideController, StickyAsideOptions } from '#core/types.ts'
import { createBrowserView } from '#core/view/browser-view.ts'

export function createStickyAside(options: StickyAsideOptions): StickyAsideController {
  return createStickyAsidePresenter(createBrowserView(options), options)
}
