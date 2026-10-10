import { describe, expect, it } from 'vitest'

import * as headless from '#core/headless.ts'
import * as core from '#core/index.ts'

describe('public exports', () => {
  it('exports only the documented core surface', () => {
    expect(Object.keys(core).sort()).toEqual(['OFFSET_CLASS', 'createStickyAside'])
  })

  it('exports the headless surface', () => {
    expect(Object.keys(headless).sort()).toEqual([
      'createStickyAsidePresenter',
      'getInitialStickyModel',
      'getNewStickyModel',
    ])
  })
})
