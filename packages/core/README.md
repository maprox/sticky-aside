# @sticky-aside/core

A short panel stays pinned to the top. A tall panel scrolls with the page, pins to the bottom while you scroll down, and pins to the top while you scroll up.

```bash
npm install @sticky-aside/core
```

```html
<aside class="column">
  <div class="panel">…</div>
</aside>
```

```ts
import { createStickyAside } from '@sticky-aside/core'
import '@sticky-aside/core/offsets.css'

const wrapper = document.querySelector('.column')
const content = document.querySelector('.panel')

const aside = createStickyAside({ wrapper, content })
```

`wrapper` is the column that stays in the layout. `content` is the panel that moves and pins. The core sets `position: relative` and `height: 100%` on the wrapper.

`offsets.css` defines `sticky-aside-top` and `sticky-aside-bottom`. Set the gap with CSS variables on an ancestor (default `0px`):

```css
.column {
  --sticky-aside-top: 40px;
  --sticky-aside-bottom: 16px;
}
```

Or skip that stylesheet and pass your own `topClass` / `bottomClass` to `createStickyAside` / `setClasses`.

Vue, React, Svelte, Solid, and Astro adapters are `@sticky-aside/vue`, `@sticky-aside/react`, `@sticky-aside/svelte`, `@sticky-aside/solid`, and `@sticky-aside/astro`. The full guide is in the [repository README](https://github.com/maprox/sticky-aside#readme).
