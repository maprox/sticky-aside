import type { StickyAsidePresenterOptions } from '#core/types.ts'

export type Session = Required<Omit<StickyAsidePresenterOptions, 'onStateChange'>>
