# sticky-aside

A short panel stays pinned to the top. A tall panel scrolls with the page, pins to the bottom while you scroll down, and pins to the top while you scroll up.

[![npm](https://img.shields.io/npm/v/@sticky-aside/core)](https://www.npmjs.com/package/@sticky-aside/core)
[![gzip](https://img.shields.io/badge/gzip-2.11%20kB-blue)](https://github.com/maprox/sticky-aside)
[![CI](https://img.shields.io/github/actions/workflow/status/maprox/sticky-aside/ci.yml?branch=main)](https://github.com/maprox/sticky-aside/actions)
[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

## Install

```bash
npm install @sticky-aside/core
```

```ts
import { createStickyAside } from '@sticky-aside/core'
import '@sticky-aside/core/offsets.css'

const aside = createStickyAside({
  wrapper,
  content,
})
```

```css
.layout {
  --sticky-aside-top: 40px;
}
```

`wrapper` is the column. `content` is the panel. The core sets `position: relative` and `height: 100%` on the wrapper. Put the column inside `.layout`, or set the variable on the column itself. The default is `0px`.

```bash
npm install @sticky-aside/vue
npm install @sticky-aside/react
npm install @sticky-aside/svelte
npm install @sticky-aside/solid
npm install @sticky-aside/astro
```

Each adapter depends on `@sticky-aside/core`. The offset is a CSS length. Two ways to set it.

### Your own class

`top-class` replaces `sticky-aside-top`. `bottom-class` replaces `sticky-aside-bottom`. React and Svelte use `topClass` and `bottomClass`. The library measures the gap between those two rules, so both have to exist. This variant leaves out `offsets.css`.

The classes land on an inner element and on a measure node created in script. In Vue a scoped selector needs `:deep`. In Svelte it needs `:global`.

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

```tsx
import { StickyAside } from '@sticky-aside/react'
import './sidebar.css'

export function Sidebar() {
  return (
    <StickyAside as="aside" topClass="top-10" bottomClass="bottom-0">
      <nav>...</nav>
    </StickyAside>
  )
}
```

```css
.top-10 {
  top: 40px;
}

.bottom-0 {
  bottom: 0;
}
```

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

```tsx
import { StickyAside } from '@sticky-aside/solid'
import './sidebar.css'

export function Sidebar() {
  return (
    <StickyAside as="aside" topClass="top-10" bottomClass="bottom-0">
      <nav>...</nav>
    </StickyAside>
  )
}
```

```astro
---
import { StickyAside } from '@sticky-aside/astro'
---

<StickyAside as="aside" topClass="top-10" bottomClass="bottom-0">
  <nav>...</nav>
</StickyAside>
```

### `offsets.css`

Import the stylesheet once. It defines `sticky-aside-top` and `sticky-aside-bottom`. Set `--sticky-aside-top` on an ancestor.

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

```tsx
import { StickyAside } from '@sticky-aside/react'
import '@sticky-aside/core/offsets.css'
import './sidebar.css'

export function Sidebar() {
  return (
    <div className="layout">
      <StickyAside as="aside">
        <nav>...</nav>
      </StickyAside>
    </div>
  )
}
```

```css
.layout {
  --sticky-aside-top: 40px;
}
```

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

```tsx
import { StickyAside } from '@sticky-aside/solid'
import '@sticky-aside/core/offsets.css'
import './sidebar.css'

export function Sidebar() {
  return (
    <div class="layout">
      <StickyAside as="aside">
        <nav>...</nav>
      </StickyAside>
    </div>
  )
}
```

```css
.layout {
  --sticky-aside-top: 40px;
}
```

```astro
---
import { StickyAside } from '@sticky-aside/astro'
import '@sticky-aside/core/offsets.css'
---

<div class="layout">
  <StickyAside as="aside">
    <nav>...</nav>
  </StickyAside>
</div>
```

```css
.layout {
  --sticky-aside-top: 40px;
}
```

`as` is `div`, `aside`, `nav`, or `section`. The default is `div`. The inner element is always a `div`. The wrapper keeps the class `sticky-aside-root`, merged with the class you pass. Vue uses fallthrough `class`. React uses `className`. Svelte, Solid, and Astro use `class`.

## Options

Vue templates use kebab-case. `allowLockedOverflowTop` is `allow-locked-overflow-top`.

| Option | Default | Effect |
| --- | --- | --- |
| `topClass` | `sticky-aside-top` | Class applied while the panel is pinned to the top. |
| `bottomClass` | `sticky-aside-bottom` | Class applied while the panel is pinned to the bottom. |
| `contentClass` | `""` | Extra class on the inner element. |
| `disabled` | `false` | Turns pinning off. State `off`, inner element `position: relative`. |
| `locked` | `false` | Holds the viewport offset from the moment the lock turned on. |
| `allowLockedOverflowTop` | `false` | Keeps that pin when the lock point leaves through the top of the column. |
| `allowLockedOverflowBottom` | `false` | Keeps that pin when the lock point leaves through the bottom of the column. |
| `onStateChange` | | Called after paint when the painted state changes. Vue emits `state-change`. |

The inner element gets `data-sticky-aside`. The value is `flow`, `top`, `bottom`, `locked`, or `off`.

`onStateChange` runs once when the controller is created, then again only when the value changes. It does not run after `destroy()`. `getState()` returns the last painted state, or `off` before the first paint.

```ts
aside.setLocked(true)
aside.setDisabled(false)
aside.setAllowLockedOverflow(true, false)
aside.setClasses({ topClass: 'sticky-aside-top', bottomClass: 'sticky-aside-bottom' })
aside.update('resize')
aside.destroy()
```

## Recipes

### CSS variables

`sticky-aside-top` and `sticky-aside-bottom` read `--sticky-aside-top` and `--sticky-aside-bottom`. Both fall back to `0px`. A breakpoint on the column moves the pin.

```css
@import "@sticky-aside/core/offsets.css";

.layout {
  --sticky-aside-top: 1rem;
  --sticky-aside-bottom: 0px;
}

@media (min-width: 1024px) {
  .layout {
    --sticky-aside-top: 4.125rem;
    --sticky-aside-bottom: 1rem;
  }
}
```

Changing a variable does not resize the panel. The core will not notice until something calls `update('resize')`, or until `window` receives a `resize` event. The adapters listen for that event.

### Tailwind classes

Skip `offsets.css` and pass your own classes. The string splits on whitespace, so `md:top-24` is one token.

```vue
<StickyAside top-class="top-16 md:top-24" bottom-class="bottom-4">
  <nav>...</nav>
</StickyAside>
```

React and Svelte take the same strings as `topClass` and `bottomClass`.

### `display: contents`

On a narrow screen the aside cell should disappear and its children should join the page grid. `display: contents` has to sit on the wrapper and on the inner element. On the wrapper alone, the inner element is still a grid item. When that element becomes `position: fixed`, it leaves the grid and takes the panel with it.

```vue
<StickyAside class="aside" content-class="aside-panel">
  <Profile />
</StickyAside>
```

```css
@media (max-width: 800px) {
  .aside,
  .aside-panel {
    display: contents;
  }
}
```

The wrapper is `height: 100%`. Once the inner element is `fixed`, a percentage height on it is a percentage of the viewport. A `height: 100%` rule in `contentClass` sizes the panel to the viewport.

### Lock

`locked` pins the panel at the viewport offset it had when the lock turned on. Scroll a little and it stays there. If that point leaves the column, the panel drops back into the column and the state becomes `flow`. Turn `allowLockedOverflowTop` or `allowLockedOverflowBottom` on and the pin stays past that edge.

```tsx
<StickyAside locked={locked} allowLockedOverflowTop={overflowTop} onStateChange={setState}>
  <nav>...</nav>
</StickyAside>
```

## Why not `position: sticky`

`position: sticky` pins one edge. A panel taller than the viewport sticks by its top and the rest is clipped, so the bottom of the panel never comes into view. This library lets the tall panel travel with the scroll until the edge you are moving toward meets the offset, then pins that edge.

## Compared with other libraries

`createStickyAside` is 2.11 kB gzip. The headless presenter is 1.26 kB gzip. The adapters leave the core external: React 505 B, Vue 630 B, Svelte 518 B, Solid 638 B, Astro client 630 B.

[react-sticky-box](https://github.com/codecks-io/react-sticky-box) is the same behavior at 3.6 kB gzip, React only, with no lock. [sticky-sidebar](https://github.com/abouolia/sticky-sidebar) is 2.8 kB gzip and has not published since 2017. The numbers and the rest of the table are in [docs/analogs.md](docs/analogs.md). Coming from sticky-sidebar (including the jQuery build): [docs/migrate-from-sticky-sidebar.md](docs/migrate-from-sticky-sidebar.md).

## Limits

The scroll listener is on `window`. Scrolling inside another element leaves the panel where it is.
