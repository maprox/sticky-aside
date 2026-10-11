# @sticky-aside/react

React adapter for [@sticky-aside/core](https://github.com/maprox/sticky-aside#readme).

```bash
npm install @sticky-aside/react
```

The offset is a CSS length. Two ways to set it.

### Your own class

`topClass` replaces `sticky-aside-top`. `bottomClass` replaces `sticky-aside-bottom`. The library measures the gap between those two rules, so both have to exist. This variant leaves out `offsets.css`.

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

### `offsets.css`

Import the stylesheet once. It defines `sticky-aside-top` and `sticky-aside-bottom`. Set `--sticky-aside-top` on an ancestor. The default is `0px`.

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
