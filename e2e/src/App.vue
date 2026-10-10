<script setup lang="ts">
import { ref } from 'vue'
import { StickyAside } from '@sticky-aside/vue'

import { record } from './record.ts'

const locked = ref(false)
const disabled = ref(false)
const overflowTop = ref(false)
const overflowBottom = ref(false)

document.querySelector('#lock')?.addEventListener('click', () => {
  locked.value = !locked.value
})
document.querySelector('#disable')?.addEventListener('click', () => {
  disabled.value = !disabled.value
})
document.querySelector('#overflow-top')?.addEventListener('click', () => {
  overflowTop.value = !overflowTop.value
})
document.querySelector('#overflow-bottom')?.addEventListener('click', () => {
  overflowBottom.value = !overflowBottom.value
})
</script>

<template>
  <StickyAside
    :locked="locked"
    :disabled="disabled"
    :allow-locked-overflow-top="overflowTop"
    :allow-locked-overflow-bottom="overflowBottom"
    @state-change="record"
  >
    <div class="panel"></div>
  </StickyAside>
</template>
