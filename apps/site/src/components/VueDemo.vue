<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { StickyAside } from '@sticky-aside/vue'
import { articleLines, paragraphs } from '../demo/copy'

const offsetTop = ref(16)
const offsetBottom = ref(16)
const locked = ref(false)
const tall = ref(true)

watch([offsetTop, offsetBottom], async () => {
  await nextTick()
  window.dispatchEvent(new Event('resize'))
})
</script>

<template>
  <h2 class="sandbox-title">Vue</h2>
  <div class="demo">
    <article class="article">
      <p v-for="(line, index) in articleLines" :key="index">{{ line }}</p>
    </article>
    <div
      class="rail"
      :style="{
        '--sticky-aside-top': `${offsetTop}px`,
        '--sticky-aside-bottom': `${offsetBottom}px`
      }"
    >
      <StickyAside :locked="locked">
        <div class="panel">
          <div>
            <span class="clip" />
            <p class="panel-kicker">Vue</p>
            <p v-if="tall">Панель выше окна. Крутите страницу в обе стороны.</p>
            <p v-else>Панель короче окна и остаётся сверху.</p>
            <ol v-if="tall">
              <li v-for="(line, index) in paragraphs.slice(0, 8)" :key="index">{{ line }}</li>
            </ol>
          </div>
          <div class="controls">
            <label>Отступ сверху <input v-model.number="offsetTop" type="number" min="0" /></label>
            <label>Отступ снизу <input v-model.number="offsetBottom" type="number" min="0" /></label>
            <label><input v-model="locked" type="checkbox" /> Замок</label>
            <label><input v-model="tall" type="checkbox" /> Длинная панель</label>
          </div>
        </div>
      </StickyAside>
    </div>
  </div>
</template>
