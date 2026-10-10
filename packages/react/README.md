# @sticky-aside/react

React adapter for [@sticky-aside/core](https://github.com/maprox/sticky-aside#readme).

```bash
npm install @sticky-aside/react
```

```tsx
import { StickyAside } from '@sticky-aside/react'
import '@sticky-aside/core/offsets.css'

export function Sidebar() {
  return (
    <StickyAside as="aside" topClass="top-16">
      <nav>...</nav>
    </StickyAside>
  )
}
```
