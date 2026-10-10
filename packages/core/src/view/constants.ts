export const OFFSET_CLASS = {
  top: 'sticky-aside-top',
  bottom: 'sticky-aside-bottom',
} as const

export const DATASET = {
  measure: 'stickyMeasure',
  aside: 'stickyAside',
} as const

export const ASIDE_STATE = {
  off: 'off',
  flow: 'flow',
  bottom: 'bottom',
  locked: 'locked',
  top: 'top',
} as const

export const MEASURE_STYLE = {
  position: 'fixed',
  visibility: 'hidden',
  pointerEvents: 'none',
  left: '0',
  width: '0',
} as const

export const WRAPPER_STYLE = {
  position: 'relative',
  height: '100%',
} as const
