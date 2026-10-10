# @sticky-aside/vue

Vue 3 adapter for [@sticky-aside/core](https://github.com/maprox/sticky-aside#readme).

```bash
npm install @sticky-aside/vue
```

The offset is a CSS length. Two ways to set it.

### Your own class

`top-class` replaces `sticky-aside-top`. `bottom-class` replaces `sticky-aside-bottom`. The library measures the gap between those two rules, so both have to exist. This variant leaves out `offsets.css`.

The classes land on an inner element and on a measure node created in script. A scoped selector has to use `:deep` to reach them.

```vue
<script setup lang="ts">
import { StickyAside } from '@sticky-aside/vue'
</script>

<template>
  <StickyAside as="aside" top-class="top-10" bottom-class="bottom-0">
    <nav>...</nav>
  </StickyAside>
</template>

<style scoped>
:deep(.top-10) {
  top: 40px;
}

:deep(.bottom-0) {
  bottom: 0;
}
</style>
```

### `offsets.css`

Import the stylesheet once. It defines `sticky-aside-top` and `sticky-aside-bottom`. Set `--sticky-aside-top` on an ancestor. The default is `0px`.

```vue
<script setup lang="ts">
import { StickyAside } from '@sticky-aside/vue'
import '@sticky-aside/core/offsets.css'
</script>

<template>
  <div class="layout">
    <StickyAside as="aside">
      <nav>...</nav>
    </StickyAside>
  </div>
</template>

<style scoped>
.layout {
  --sticky-aside-top: 40px;
}
</style>
```
