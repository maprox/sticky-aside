<script lang="ts">
  import { onMount } from 'svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { createStickyAside, OFFSET_CLASS } from '@sticky-aside/core'
  import type { StickyAsideController, StickyAsidePresenterOptions, StickyAsideState } from '@sticky-aside/core'

  interface Props extends StickyAsidePresenterOptions, HTMLAttributes<HTMLElement> {
    as?: 'div' | 'aside' | 'nav' | 'section'
    children?: Snippet
    topClass?: string
    bottomClass?: string
    contentClass?: string
    onStateChange?: (state: StickyAsideState) => void
    element?: HTMLElement
  }

  let {
    as = 'div',
    topClass = OFFSET_CLASS.top,
    bottomClass = OFFSET_CLASS.bottom,
    contentClass = '',
    disabled = false,
    locked = false,
    allowLockedOverflowTop = false,
    allowLockedOverflowBottom = false,
    onStateChange,
    element = $bindable(),
    children,
    class: className,
    ...rest
  }: Props = $props()

  let content: HTMLDivElement | undefined = $state()
  let aside: StickyAsideController | undefined

  onMount(() => {
    aside = createStickyAside({
      wrapper: element!,
      content: content!,
      topClass,
      bottomClass,
      contentClass,
      disabled,
      locked,
      allowLockedOverflowTop,
      allowLockedOverflowBottom,
      onStateChange(state) {
        onStateChange?.(state)
      },
    })

    return () => aside?.destroy()
  })

  $effect(() => {
    aside?.setClasses({
      topClass,
      bottomClass,
      contentClass,
    })
  })

  $effect(() => {
    aside?.setLocked(locked)
  })

  $effect(() => {
    aside?.setDisabled(disabled)
  })

  $effect(() => {
    aside?.setAllowLockedOverflow(allowLockedOverflowTop, allowLockedOverflowBottom)
  })
</script>

<svelte:element this={as} bind:this={element} class={['sticky-aside-root', className]} {...rest}>
  <div bind:this={content}>
    {@render children?.()}
  </div>
</svelte:element>
