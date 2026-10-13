# Migrate from sticky-sidebar

[abouolia/sticky-sidebar](https://github.com/abouolia/sticky-sidebar) and `@sticky-aside/core` implement the same both-edges behavior: a short panel pins to the top; a tall panel scrolls with the page and pins the edge you are moving toward. sticky-sidebar last published in 2017. sticky-aside is smaller (2.14 kB gzip), TypeScript-first, and has Vue 3, React, Svelte 5, Solid, and Angular adapters.

## Markup

Keep the same shape sticky-sidebar already wants — a column and an inner panel you own (do not rely on an auto-created wrapper):

```html
<div id="main-content">
  <div id="sidebar" class="sidebar">
    <div class="sidebar__inner">…</div>
  </div>
  <div id="content">…</div>
</div>
```

`#sidebar` is `wrapper`. `.sidebar__inner` is `content`. The tag on the column (`div` or `aside`) does not matter.

## Vanilla

Before:

```js
var sidebar = new StickySidebar('#sidebar', {
  containerSelector: '#main-content',
  innerWrapperSelector: '.sidebar__inner',
  topSpacing: 20,
  bottomSpacing: 20,
})
```

After:

```ts
import { createStickyAside } from '@sticky-aside/core'
import '@sticky-aside/core/offsets.css'

const wrapper = document.querySelector('#sidebar')
const content = document.querySelector('.sidebar__inner')

const aside = createStickyAside({ wrapper, content })
```

```css
#main-content {
  --sticky-aside-top: 20px;
  --sticky-aside-bottom: 20px;
}
```

The main column (`#main-content`) should still wrap both the aside and the page content so the panel stays inside that layout. sticky-aside does not take a `containerSelector`; the wrapper’s parent layout is the boundary.

Replace `sidebar.updateSticky()` with `aside.update('resize')`. Replace `sidebar.destroy()` with `aside.destroy()`.

## jQuery / Zepto

There is no jQuery plugin. Drop `jquery.sticky-sidebar.js` and call the core directly:

```js
$('#sidebar').stickySidebar({ topSpacing: 60, bottomSpacing: 60 })
```

```ts
import { createStickyAside } from '@sticky-aside/core'
import '@sticky-aside/core/offsets.css'

const wrapper = document.querySelector('#sidebar')
const content = wrapper.querySelector('.sidebar__inner')

createStickyAside({ wrapper, content })
```

Set `--sticky-aside-top` / `--sticky-aside-bottom` in CSS instead of pixel options. Framework apps can use `@sticky-aside/vue`, `@sticky-aside/react`, `@sticky-aside/svelte`, `@sticky-aside/solid`, `@sticky-aside/angular`, or `@sticky-aside/astro` instead of a jQuery plugin.

## Options map

| sticky-sidebar | sticky-aside |
| --- | --- |
| `topSpacing` / `bottomSpacing` | CSS: `--sticky-aside-top` / `--sticky-aside-bottom` via `offsets.css`, or your own `topClass` / `bottomClass` |
| `containerSelector` | Parent layout around the column; no separate option |
| `innerWrapperSelector` | Pass that element as `content` |
| `resizeSensor` | Call `update('resize')` after DOM size changes; adapters also listen to `window` `resize` |
| `stickyClass` (`is-affixed`) | `data-sticky-aside` on the inner element (`flow` \| `top` \| `bottom` \| `locked` \| `off`) and `onStateChange` |
| `minWidth` | Media query plus `disabled: true` / `setDisabled(true)` below the breakpoint |
| Affix DOM events | `onStateChange(state)` (fires on create, then only when the painted state changes) |
| `updateSticky()` | `update('resize')` |
| `destroy()` | `destroy()` |

## What does not map 1:1

- **Per-affix event names** (`affix.top.stickySidebar`, `affixed.container-bottom.stickySidebar`, …) — one `onStateChange` callback covers state changes.
- **ResizeSensor.js** — not bundled; trigger `update('resize')` yourself when the panel or column height changes without a window resize.
- **IE9** — not a target.
- **Nested scroll containers** — scroll is on `window` only in 1.0.0 (same as upstream sticky-sidebar; forks like sticky-sidebar-v2 add a scroll root).
- **Lock** — sticky-aside can hold a viewport offset with `locked` / `setLocked`; sticky-sidebar has no equivalent.

For size and feature tables against other libraries, see [analogs.md](./analogs.md).
