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

Vue, React, and Svelte adapters are `@sticky-aside/vue`, `@sticky-aside/react`, and `@sticky-aside/svelte`. The full guide is in the [repository README](https://github.com/maprox/sticky-aside#readme).
