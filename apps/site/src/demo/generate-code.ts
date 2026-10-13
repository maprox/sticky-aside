import { t } from '#site/demo/i18n.ts'
import type { DemoLocale, DemoSettings } from '#site/demo/settings.ts'

function bool(isOn: boolean): string {
  return isOn ? 'true' : 'false'
}

function styleVars(settings: DemoSettings): { top: string, bottom: string } {
  return {
    top: `${settings.top}px`,
    bottom: `${settings.bottom}px`,
  }
}

function firstSentence(text: string): string {
  const end = text.indexOf('. ')
  if (end === -1) {
    return text
  }

  return text.slice(0, end + 1)
}

function vanillaMarkup(settings: DemoSettings, locale: DemoLocale): string {
  const copy = t(locale, settings.tall ? 'panel.tall' : 'panel.short')
  const list = settings.tall
    ? `
    <ol>
      <li>${firstSentence(t(locale, 'article.p1'))}</li>
      <li>${firstSentence(t(locale, 'article.p2'))}</li>
      <li>…</li>
    </ol>`
    : ''

  return `<article>
  <p>${t(locale, 'article.p1')}</p>
  <p>…</p>
</article>
<div id="wrapper">
  <aside id="content">
    <p>${copy}</p>${list}
  </aside>
</div>`
}

function vanilla(settings: DemoSettings, locale: DemoLocale): string {
  const vars = styleVars(settings)

  return `${vanillaMarkup(settings, locale)}

<script type="module">
import { createStickyAside } from '@sticky-aside/core'
import '@sticky-aside/core/offsets.css'

const wrapper = document.querySelector('#wrapper')
const content = document.querySelector('#content')

wrapper.style.setProperty('--sticky-aside-top', '${vars.top}')
wrapper.style.setProperty('--sticky-aside-bottom', '${vars.bottom}')

const aside = createStickyAside({
  wrapper,
  content,
  locked: ${bool(settings.locked)},
  disabled: ${bool(settings.disabled)},
  allowLockedOverflowTop: ${bool(settings.allowLockedOverflowTop)},
  allowLockedOverflowBottom: ${bool(settings.allowLockedOverflowBottom)},
})
</script>`
}

function vue(settings: DemoSettings): string {
  const vars = styleVars(settings)

  return `<script setup lang="ts">
import { StickyAside } from '@sticky-aside/vue'
import '@sticky-aside/core/offsets.css'
</script>

<template>
  <StickyAside
    as="aside"
    :locked="${bool(settings.locked)}"
    :disabled="${bool(settings.disabled)}"
    :allow-locked-overflow-top="${bool(settings.allowLockedOverflowTop)}"
    :allow-locked-overflow-bottom="${bool(settings.allowLockedOverflowBottom)}"
    style="--sticky-aside-top: ${vars.top}; --sticky-aside-bottom: ${vars.bottom}"
  >
    ...
  </StickyAside>
</template>`
}

function react(settings: DemoSettings): string {
  const vars = styleVars(settings)

  return `import { StickyAside } from '@sticky-aside/react'
import '@sticky-aside/core/offsets.css'

<StickyAside
  as="aside"
  locked={${bool(settings.locked)}}
  disabled={${bool(settings.disabled)}}
  allowLockedOverflowTop={${bool(settings.allowLockedOverflowTop)}}
  allowLockedOverflowBottom={${bool(settings.allowLockedOverflowBottom)}}
  style={{
    '--sticky-aside-top': '${vars.top}',
    '--sticky-aside-bottom': '${vars.bottom}',
  }}
>
  ...
</StickyAside>`
}

function svelte(settings: DemoSettings): string {
  const vars = styleVars(settings)

  return `<script lang="ts">
  import { StickyAside } from '@sticky-aside/svelte'
  import '@sticky-aside/core/offsets.css'
</script>

<StickyAside
  as="aside"
  locked={${bool(settings.locked)}}
  disabled={${bool(settings.disabled)}}
  allowLockedOverflowTop={${bool(settings.allowLockedOverflowTop)}}
  allowLockedOverflowBottom={${bool(settings.allowLockedOverflowBottom)}}
  style="--sticky-aside-top: ${vars.top}; --sticky-aside-bottom: ${vars.bottom}"
>
  ...
</StickyAside>`
}

function solid(settings: DemoSettings): string {
  const vars = styleVars(settings)

  return `import { StickyAside } from '@sticky-aside/solid'
import '@sticky-aside/core/offsets.css'

<StickyAside
  as="aside"
  locked={${bool(settings.locked)}}
  disabled={${bool(settings.disabled)}}
  allowLockedOverflowTop={${bool(settings.allowLockedOverflowTop)}}
  allowLockedOverflowBottom={${bool(settings.allowLockedOverflowBottom)}}
  style={{
    '--sticky-aside-top': '${vars.top}',
    '--sticky-aside-bottom': '${vars.bottom}',
  }}
>
  ...
</StickyAside>`
}

function angular(settings: DemoSettings): string {
  const vars = styleVars(settings)

  return `import { StickyAside } from '@sticky-aside/angular'
import '@sticky-aside/core/offsets.css'

<sticky-aside
  as="aside"
  [locked]="${bool(settings.locked)}"
  [disabled]="${bool(settings.disabled)}"
  [allowLockedOverflowTop]="${bool(settings.allowLockedOverflowTop)}"
  [allowLockedOverflowBottom]="${bool(settings.allowLockedOverflowBottom)}"
  style="--sticky-aside-top: ${vars.top}; --sticky-aside-bottom: ${vars.bottom}"
>
  ...
</sticky-aside>`
}

function astro(settings: DemoSettings, locale: DemoLocale): string {
  const vars = styleVars(settings)
  const markup = vanillaMarkup(settings, locale)

  return `---
import '@sticky-aside/core/offsets.css'
---

${markup}

<script>
import { createStickyAside } from '@sticky-aside/astro'

const wrapper = document.querySelector('#wrapper')
const content = document.querySelector('#content')

wrapper.style.setProperty('--sticky-aside-top', '${vars.top}')
wrapper.style.setProperty('--sticky-aside-bottom', '${vars.bottom}')

createStickyAside({
  wrapper,
  content,
  locked: ${bool(settings.locked)},
  disabled: ${bool(settings.disabled)},
  allowLockedOverflowTop: ${bool(settings.allowLockedOverflowTop)},
  allowLockedOverflowBottom: ${bool(settings.allowLockedOverflowBottom)},
})
</script>`
}

export function generateDemoCode(settings: DemoSettings, locale: DemoLocale = 'en'): string {
  if (settings.framework === 'vue') {
    return vue(settings)
  }
  if (settings.framework === 'react') {
    return react(settings)
  }
  if (settings.framework === 'svelte') {
    return svelte(settings)
  }
  if (settings.framework === 'solid') {
    return solid(settings)
  }
  if (settings.framework === 'astro') {
    return astro(settings, locale)
  }
  if (settings.framework === 'angular') {
    return angular(settings)
  }

  return vanilla(settings, locale)
}
