import { createStickyAside, OFFSET_CLASS } from '@sticky-aside/core'
import type { StickyAsideController, StickyAsideState } from '@sticky-aside/core'
import {
  createEffect,
  mergeProps,
  onCleanup,
  onMount,
  splitProps,
  type JSX,
} from 'solid-js'
import { Dynamic } from 'solid-js/web'

type Tag = 'div' | 'aside' | 'nav' | 'section'

export interface StickyAsideProps extends Omit<JSX.HTMLAttributes<HTMLElement>, 'children'> {
  as?: Tag
  children?: JSX.Element
  topClass?: string
  bottomClass?: string
  contentClass?: string
  disabled?: boolean
  locked?: boolean
  allowLockedOverflowTop?: boolean
  allowLockedOverflowBottom?: boolean
  onStateChange?: (state: StickyAsideState) => void
}

export function StickyAside(rawProps: StickyAsideProps) {
  const props = mergeProps({
    as: 'div' as Tag,
    topClass: OFFSET_CLASS.top,
    bottomClass: OFFSET_CLASS.bottom,
    contentClass: '',
    disabled: false,
    locked: false,
    allowLockedOverflowTop: false,
    allowLockedOverflowBottom: false,
  }, rawProps)
  const [local, rest] = splitProps(props, [
    'as',
    'children',
    'topClass',
    'bottomClass',
    'contentClass',
    'disabled',
    'locked',
    'allowLockedOverflowTop',
    'allowLockedOverflowBottom',
    'onStateChange',
    'class',
  ])

  // eslint-disable-next-line no-unassigned-vars -- Solid assigns refs before onMount
  let wrapper!: HTMLElement
  // eslint-disable-next-line no-unassigned-vars -- Solid assigns refs before onMount
  let content!: HTMLDivElement
  let aside: StickyAsideController | undefined

  onMount(() => {
    aside = createStickyAside({
      wrapper,
      content,
      topClass: local.topClass,
      bottomClass: local.bottomClass,
      contentClass: local.contentClass,
      disabled: local.disabled,
      locked: local.locked,
      allowLockedOverflowTop: local.allowLockedOverflowTop,
      allowLockedOverflowBottom: local.allowLockedOverflowBottom,
      onStateChange(state) {
        local.onStateChange?.(state)
      },
    })
  })

  onCleanup(() => {
    aside?.destroy()
    aside = undefined
  })

  createEffect(() => {
    aside?.setClasses({
      topClass: local.topClass,
      bottomClass: local.bottomClass,
      contentClass: local.contentClass ?? '',
    })
  })
  createEffect(() => {
    aside?.setLocked(local.locked)
  })
  createEffect(() => {
    aside?.setDisabled(local.disabled)
  })
  createEffect(() => {
    aside?.setAllowLockedOverflow(local.allowLockedOverflowTop, local.allowLockedOverflowBottom)
  })

  const className = () => ['sticky-aside-root', local.class].filter(Boolean).join(' ')

  return (
    <Dynamic component={local.as} ref={wrapper} class={className()} {...rest}>
      <div ref={content}>{local.children}</div>
    </Dynamic>
  )
}
