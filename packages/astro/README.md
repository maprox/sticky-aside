# @sticky-aside/astro

Astro adapter for [@sticky-aside/core](https://github.com/maprox/sticky-aside#readme).

```bash
npm install @sticky-aside/astro
```

The offset is a CSS length. Two ways to set it.

### Your own class

`topClass` replaces `sticky-aside-top`. `bottomClass` replaces `sticky-aside-bottom`. The library measures the gap between those two rules, so both have to exist. This variant leaves out `offsets.css`.

```astro
---
import { StickyAside } from '@sticky-aside/astro'
---

<StickyAside as="aside" topClass="top-10" bottomClass="bottom-0">
  <nav>...</nav>
</StickyAside>
```

```css
.top-10 {
  top: 40px;
}

.bottom-0 {
  bottom: 0;
}
```

### `offsets.css`

Import the stylesheet once. It defines `sticky-aside-top` and `sticky-aside-bottom`. Set `--sticky-aside-top` on an ancestor. The default is `0px`.

```astro
---
import { StickyAside } from '@sticky-aside/astro'
import '@sticky-aside/core/offsets.css'
---

<StickyAside as="aside" locked={true}>…</StickyAside>
```

```css
.layout {
  --sticky-aside-top: 40px;
}
```

### State changes

Sticky position state is exposed as a bubbling `CustomEvent` on the root element (no function prop required):

```astro
<StickyAside id="sidebar">…</StickyAside>

<script>
  document.getElementById('sidebar')?.addEventListener('sticky-aside-state', (event) => {
    console.log(event.detail) // 'top' | 'bottom' | ...
  })
</script>
```

For manual init (multiple roots or custom timing), import `@sticky-aside/astro/client` and call `initStickyAsideRoots()`.
