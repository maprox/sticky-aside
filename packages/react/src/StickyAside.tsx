import { createStickyAside, OFFSET_CLASS } from '@sticky-aside/core'
import type { StickyAsideController, StickyAsidePresenterOptions, StickyAsideState } from '@sticky-aside/core'
import { forwardRef, useEffect, useRef } from 'react'
import type { HTMLAttributes, ReactNode, Ref } from 'react'

type Tag = 'div' | 'aside' | 'nav' | 'section'

export interface StickyAsideProps extends StickyAsidePresenterOptions, Omit<HTMLAttributes<HTMLElement>, 'children'> {
  as?: Tag
  children?: ReactNode
  topClass?: string
  bottomClass?: string
  contentClass?: string
  onStateChange?: (state: StickyAsideState) => void
}

export const StickyAside = forwardRef<HTMLElement, StickyAsideProps>(function StickyAside({
  as = 'div',
  children,
  topClass = OFFSET_CLASS.top,
  bottomClass = OFFSET_CLASS.bottom,
  contentClass,
  disabled: isDisabled = false,
  locked: isLocked = false,
  allowLockedOverflowTop: isAllowLockedOverflowTop = false,
  allowLockedOverflowBottom: isAllowLockedOverflowBottom = false,
  onStateChange,
  className,
  ...rest
}, forwardedRef) {
  const wrapperRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const asideRef = useRef<StickyAsideController | null>(null)
  const onStateChangeRef = useRef(onStateChange)
  onStateChangeRef.current = onStateChange

  useEffect(() => {
    asideRef.current = createStickyAside({
      wrapper: wrapperRef.current!,
      content: contentRef.current!,
      topClass,
      bottomClass,
      contentClass,
      disabled: isDisabled,
      locked: isLocked,
      allowLockedOverflowTop: isAllowLockedOverflowTop,
      allowLockedOverflowBottom: isAllowLockedOverflowBottom,
      onStateChange(state) {
        onStateChangeRef.current?.(state)
      },
    })

    return () => {
      asideRef.current?.destroy()
      asideRef.current = null
    }
  }, [])

  useEffect(() => {
    asideRef.current?.setClasses({
      topClass,
      bottomClass,
      contentClass: contentClass ?? '',
    })
  }, [topClass, bottomClass, contentClass])

  useEffect(() => {
    asideRef.current?.setLocked(isLocked)
  }, [isLocked])

  useEffect(() => {
    asideRef.current?.setDisabled(isDisabled)
  }, [isDisabled])

  useEffect(() => {
    asideRef.current?.setAllowLockedOverflow(isAllowLockedOverflowTop, isAllowLockedOverflowBottom)
  }, [isAllowLockedOverflowTop, isAllowLockedOverflowBottom])

  function setRefs(node: HTMLElement | null) {
    wrapperRef.current = node
    if (typeof forwardedRef === 'function') {
      forwardedRef(node)
    } else if (forwardedRef) {
      forwardedRef.current = node
    }
  }

  const TagName = as

  return (
    <TagName
      ref={setRefs as Ref<HTMLDivElement>}
      className={['sticky-aside-root', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <div ref={contentRef}>{children}</div>
    </TagName>
  )
})
