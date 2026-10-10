# @sticky-aside/svelte

Svelte 5 adapter for [@sticky-aside/core](https://github.com/maprox/sticky-aside#readme).

```bash
npm install @sticky-aside/svelte
```

```svelte
<script lang="ts">
  import { StickyAside } from '@sticky-aside/svelte'
  import '@sticky-aside/core/offsets.css'
</script>

<StickyAside as="aside" topClass="top-16">
  <nav>...</nav>
</StickyAside>
```
