# @sticky-aside/astro

Astro-oriented entry for [@sticky-aside/core](https://github.com/maprox/sticky-aside#readme). Same API as vanilla: call `createStickyAside` from a client `<script>`.

```bash
npm install @sticky-aside/astro
```

```astro
---
import '@sticky-aside/core/offsets.css'
---

<aside id="wrapper">
  <div id="content">
    <nav>...</nav>
  </div>
</aside>

<script>
  import { createStickyAside } from '@sticky-aside/astro'

  createStickyAside({
    wrapper: document.querySelector('#wrapper'),
    content: document.querySelector('#content'),
  })
</script>
```

```css
#wrapper {
  --sticky-aside-top: 40px;
}
```

Or skip `offsets.css` and pass your own `topClass` / `bottomClass` to `createStickyAside`. The full option list is in the [repository README](https://github.com/maprox/sticky-aside#readme).
