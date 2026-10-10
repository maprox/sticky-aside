<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createStickyAside, OFFSET_CLASS } from '@sticky-aside/core'
import type { StickyAsideController, StickyAsideState } from '@sticky-aside/core'

interface Props {
  as?: 'div' | 'aside' | 'nav' | 'section'
  topClass?: string
  bottomClass?: string
  contentClass?: string
  disabled?: boolean
  locked?: boolean
  allowLockedOverflowTop?: boolean
  allowLockedOverflowBottom?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  topClass: OFFSET_CLASS.top,
  bottomClass: OFFSET_CLASS.bottom,
  contentClass: '',
  disabled: false,
  locked: false,
  allowLockedOverflowTop: false,
  allowLockedOverflowBottom: false,
})

const emit = defineEmits<{ 'state-change': [state: StickyAsideState] }>()

const element = ref<HTMLElement>()
const content = ref<HTMLElement>()
let aside: StickyAsideController | undefined

defineExpose({ element })

onMounted(() => {
  aside = createStickyAside({
    wrapper: element.value!,
    content: content.value!,
    topClass: props.topClass,
    bottomClass: props.bottomClass,
    contentClass: props.contentClass,
    disabled: props.disabled,
    locked: props.locked,
    allowLockedOverflowTop: props.allowLockedOverflowTop,
    allowLockedOverflowBottom: props.allowLockedOverflowBottom,
    onStateChange(state) {
      emit('state-change', state)
    },
  })
})

onBeforeUnmount(() => {
  aside?.destroy()
})

watch(() => props.locked, (locked) => aside?.setLocked(locked))
watch(() => props.disabled, (disabled) => aside?.setDisabled(disabled))
watch(() => props.topClass, (topClass) => aside?.setClasses({ topClass }))
watch(() => props.bottomClass, (bottomClass) => aside?.setClasses({ bottomClass }))
watch(() => props.contentClass, (contentClass) => aside?.setClasses({ contentClass }))
watch(
  () => [props.allowLockedOverflowTop, props.allowLockedOverflowBottom] as const,
  ([allowTop, allowBottom]) => aside?.setAllowLockedOverflow(allowTop, allowBottom),
)
</script>

<template>
  <component :is="as" ref="element" class="sticky-aside-root">
    <div ref="content">
      <slot />
    </div>
  </component>
</template>
