# @sticky-aside/vue

Vue 3 adapter for [@sticky-aside/core](https://github.com/maprox/sticky-aside#readme).

```bash
npm install @sticky-aside/vue
```

```vue
<script setup lang="ts">
import { StickyAside } from '@sticky-aside/vue'
import '@sticky-aside/core/offsets.css'
</script>

<template>
  <StickyAside as="aside" top-class="top-16">
    <nav>...</nav>
  </StickyAside>
</template>
```
