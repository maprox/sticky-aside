export const MODE = {
  relative: 'relative',
  fixedTop: 'fixed-top',
  fixedBottom: 'fixed-bottom',
  fixedLocked: 'fixed-locked',
} as const

export const REASON = {
  scroll: 'scroll',
  resize: 'resize',
  lock: 'lock',
  unlock: 'unlock',
} as const
