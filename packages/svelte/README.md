# @sticky-aside/svelte

Svelte 5 adapter for [@sticky-aside/core](https://github.com/maprox/sticky-aside#readme).

```bash
npm install @sticky-aside/svelte
```

The offset is a CSS length. Two ways to set it.

### Your own class

`topClass` replaces `sticky-aside-top`. `bottomClass` replaces `sticky-aside-bottom`. The library measures the gap between those two rules, so both have to exist. This variant leaves out `offsets.css`.

The classes land on an inner element and on a measure node created in script. A scoped selector has to use `:global` to reach them.

```svelte
<script lang="ts">
  import { StickyAside } from '@sticky-aside/svelte'
</script>

<div class="layout">
  <StickyAside as="aside" topClass="top-10" bottomClass="bottom-0">
    <nav>...</nav>
  </StickyAside>
</div>

<style>
  .layout :global(.top-10) {
    top: 40px;
  }

  .layout :global(.bottom-0) {
    bottom: 0;
  }
</style>
```

### `offsets.css`

Import the stylesheet once. It defines `sticky-aside-top` and `sticky-aside-bottom`. Set `--sticky-aside-top` on an ancestor. The default is `0px`.

```svelte
<script lang="ts">
  import { StickyAside } from '@sticky-aside/svelte'
  import '@sticky-aside/core/offsets.css'
</script>

<div class="layout">
  <StickyAside as="aside">
    <nav>...</nav>
  </StickyAside>
</div>

<style>
  .layout {
    --sticky-aside-top: 40px;
  }
</style>
```
