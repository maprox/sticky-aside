# Solid and Astro Adapters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `@sticky-aside/solid` and `@sticky-aside/astro` with the same StickyAside props surface as React/Vue/Svelte, and expose both on the marketing site (tabs, snippets, SEO).

**Architecture:** Thin adapters over `createStickyAside` from `@sticky-aside/core`. Solid mirrors the React lifecycle component. Astro ships a `.astro` component that renders the same DOM shape and a small client module that idempotently initializes every `[data-sticky-aside]` root. The live demo panel stays on core; site changes are snippets/routes/SEO only.

**Tech Stack:** pnpm workspaces, TypeScript, Vitest + happy-dom, tsdown, Solid 1.x (`solid-js`, `vite-plugin-solid`), Astro 5 (peer; site already on Astro), changesets fixed group, size-limit.

**Spec:** `docs/specs/2026-10-12-solid-astro-adapters-design.md`

## Global Constraints

- Mirror React prop names: `as`, `topClass`, `bottomClass`, `contentClass`, `disabled`, `locked`, `allowLockedOverflowTop`, `allowLockedOverflowBottom`.
- Default `as` is `'div'`; default offset classes come from `OFFSET_CLASS` in core.
- Adapters must not bundle `@sticky-aside/core/offsets.css`; consumers import it (or use custom classes).
- SSR-safe: no `window` / `document` access during render; init only in the browser.
- Do not change core API.
- Angular is out of scope.
- Do not convert the site mini-window demo to Solid/Astro islands.
- Work on a feature branch / worktree off current `main`; do not force-push `main`.
- Plan path is `docs/plans/` because `docs/superpowers/` is gitignored in this repo.
- Pre-commit runs `pnpm lint && pnpm typecheck`; ensure `pnpm` is on `PATH` and `NODE_OPTIONS=--max-old-space-size=4096` if eslint OOMs on `.worktrees`.

---

## File map

| Path | Role |
|---|---|
| `packages/solid/package.json` | Package metadata, peer `solid-js`, build script |
| `packages/solid/tsdown.config.mjs` | ESM build; neverBundle solid + core |
| `packages/solid/LICENSE` | Copy of MIT license (same as react) |
| `packages/solid/README.md` | Install + usage |
| `packages/solid/src/StickyAside.tsx` | Solid component |
| `packages/solid/src/StickyAside.test.tsx` | Unit tests |
| `packages/astro/package.json` | Package metadata, peer `astro` |
| `packages/astro/tsdown.config.mjs` | Build `client.ts` only (for size-limit / types) |
| `packages/astro/LICENSE` | MIT |
| `packages/astro/README.md` | Install + usage + CustomEvent note |
| `packages/astro/src/StickyAside.astro` | Mirror-API Astro component |
| `packages/astro/src/client.ts` | Idempotent `initStickyAsideRoots` |
| `packages/astro/src/client.test.ts` | Client init tests |
| `packages/astro/src/index.ts` | Re-export note if needed; primary export is `.astro` |
| Root `package.json`, `vitest.config.ts`, `.size-limit.json`, `.changeset/config.json`, `scripts/check-packages.mjs`, `scripts/e2e.mjs` | Wire build/test/release |
| `apps/site/src/demo/settings.ts`, `generate-code.ts`, `i18n.ts`, `FrameworkTabs.astro`, related `*.test.ts` | Site frameworks |
| Root `README.md`, `CONTRIBUTING.md`, `packages/core/README.md`, optional `docs/analogs.md` | Docs |

---

### Task 1: `@sticky-aside/solid` package

**Files:**
- Create: `packages/solid/package.json`
- Create: `packages/solid/tsdown.config.mjs`
- Create: `packages/solid/LICENSE` (copy from `packages/react/LICENSE`)
- Create: `packages/solid/README.md`
- Create: `packages/solid/src/StickyAside.tsx`
- Create: `packages/solid/src/StickyAside.test.tsx`
- Modify: `package.json` (root) — add `solid-js`, `vite-plugin-solid` (and `@solidjs/testing-library` if used) as devDependencies; extend `build` filter
- Modify: `vitest.config.ts` — add solid project
- Modify: `tsconfig.json` — allow solid JSX for the solid package (see step below)
- Modify: `.size-limit.json` — solid entry
- Modify: `.changeset/config.json` — add package to fixed group (can wait until Task 3 if preferred; do it here so the package is release-ready)

**Interfaces:**
- Consumes: `createStickyAside`, `OFFSET_CLASS`, types from `@sticky-aside/core`
- Produces: `export function StickyAside(props: StickyAsideProps): JSX.Element` with props matching React (`onStateChange?: (state: StickyAsideState) => void`, etc.)

- [ ] **Step 1: Create the feature branch**

```bash
git fetch origin
git checkout main
git pull --ff-only origin main
git checkout -b feat/solid-astro-adapters
```

- [ ] **Step 2: Write the failing Solid test**

Create `packages/solid/src/StickyAside.test.tsx`:

```tsx
import { createStickyAside } from '@sticky-aside/core'
import { cleanup, render, screen } from '@solidjs/testing-library'
import { renderToString } from 'solid-js/web'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { StickyAside } from '@sticky-aside/solid'

vi.mock('@sticky-aside/core', () => ({
  OFFSET_CLASS: {
    top: 'sticky-aside-top',
    bottom: 'sticky-aside-bottom',
  },
  createStickyAside: vi.fn(() => ({
    update: vi.fn(),
    setLocked: vi.fn(),
    setDisabled: vi.fn(),
    setClasses: vi.fn(),
    setAllowLockedOverflow: vi.fn(),
    destroy: vi.fn(),
    getState: vi.fn(() => 'top'),
    getModel: vi.fn(),
  })),
}))

afterEach(cleanup)

describe('StickyAside', () => {
  it('renders the requested tag and merges the class', () => {
    render(() => (
      <StickyAside as="aside" class="toc" aria-label="Contents">
        item
      </StickyAside>
    ))
    const aside = screen.getByRole('complementary', { name: 'Contents' })
    expect(aside.tagName).toBe('ASIDE')
    expect(aside.className).toContain('sticky-aside-root')
    expect(aside.className).toContain('toc')
  })

  it('destroys the controller on unmount', () => {
    const { unmount } = render(() => <StickyAside>item</StickyAside>)
    const controller = vi.mocked(createStickyAside).mock.results.at(-1)?.value
    unmount()
    expect(controller.destroy).toHaveBeenCalledOnce()
  })

  it('renders on the server without touching the window', () => {
    const html = renderToString(() => <StickyAside as="aside">item</StickyAside>)
    expect(html).toContain('sticky-aside-root')
    expect(html).toContain('item')
  })
})
```

- [ ] **Step 3: Wire vitest + deps so the test can run (still expect FAIL on missing export)**

Root `package.json` — add to `devDependencies` (exact versions resolve via `pnpm add -Dw`):

```bash
pnpm add -Dw solid-js vite-plugin-solid @solidjs/testing-library
```

Add vitest project in `vitest.config.ts`:

```ts
import solid from 'vite-plugin-solid'
// ...
{
  plugins: [solid()],
  resolve: {
    conditions: ['browser'],
  },
  test: {
    name: 'solid',
    environment: 'happy-dom',
    include: ['packages/solid/src/**/*.test.tsx'],
  },
},
```

Create minimal `packages/solid/package.json` so the import name resolves (exports pointing at `./src/StickyAside.tsx` even before implementation exists — or create a stub that throws). Prefer creating package.json + empty failing module:

`packages/solid/package.json`:

```json
{
  "name": "@sticky-aside/solid",
  "version": "1.0.0",
  "description": "Solid adapter for @sticky-aside/core.",
  "keywords": ["sticky", "sidebar", "aside", "scroll", "solid"],
  "license": "MIT",
  "author": "maprox",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/maprox/sticky-aside.git",
    "directory": "packages/solid"
  },
  "homepage": "https://github.com/maprox/sticky-aside#readme",
  "bugs": "https://github.com/maprox/sticky-aside/issues",
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": "./src/StickyAside.tsx"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "types": "./dist/StickyAside.d.ts",
        "import": "./dist/StickyAside.js"
      }
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "pnpm --dir ../.. exec tsdown --config packages/solid/tsdown.config.mjs"
  },
  "dependencies": {
    "@sticky-aside/core": "workspace:^"
  },
  "peerDependencies": {
    "solid-js": "^1.9.0"
  }
}
```

- [ ] **Step 4: Run the Solid test — expect FAIL**

```bash
pnpm exec vitest run --project solid
```

Expected: FAIL (module missing export / cannot resolve `StickyAside`, or component undefined).

- [ ] **Step 5: Implement `StickyAside.tsx`**

```tsx
import { createStickyAside, OFFSET_CLASS } from '@sticky-aside/core'
import type { StickyAsideController, StickyAsideState } from '@sticky-aside/core'
import { createEffect, mergeProps, onCleanup, onMount, splitProps, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'

type Tag = 'div' | 'aside' | 'nav' | 'section'

export interface StickyAsideProps extends Omit<JSX.HTMLAttributes<HTMLElement>, 'children'> {
  as?: Tag
  children?: JSX.Element
  topClass?: string
  bottomClass?: string
  contentClass?: string
  disabled?: boolean
  locked?: boolean
  allowLockedOverflowTop?: boolean
  allowLockedOverflowBottom?: boolean
  onStateChange?: (state: StickyAsideState) => void
}

export function StickyAside(rawProps: StickyAsideProps) {
  const props = mergeProps({
    as: 'div' as Tag,
    topClass: OFFSET_CLASS.top,
    bottomClass: OFFSET_CLASS.bottom,
    contentClass: '',
    disabled: false,
    locked: false,
    allowLockedOverflowTop: false,
    allowLockedOverflowBottom: false,
  }, rawProps)
  const [local, rest] = splitProps(props, [
    'as',
    'children',
    'topClass',
    'bottomClass',
    'contentClass',
    'disabled',
    'locked',
    'allowLockedOverflowTop',
    'allowLockedOverflowBottom',
    'onStateChange',
    'class',
  ])

  let wrapper!: HTMLElement
  let content!: HTMLDivElement
  let aside: StickyAsideController | undefined

  onMount(() => {
    aside = createStickyAside({
      wrapper,
      content,
      topClass: local.topClass,
      bottomClass: local.bottomClass,
      contentClass: local.contentClass,
      disabled: local.disabled,
      locked: local.locked,
      allowLockedOverflowTop: local.allowLockedOverflowTop,
      allowLockedOverflowBottom: local.allowLockedOverflowBottom,
      onStateChange(state) {
        local.onStateChange?.(state)
      },
    })
  })

  onCleanup(() => {
    aside?.destroy()
    aside = undefined
  })

  createEffect(() => {
    aside?.setClasses({
      topClass: local.topClass,
      bottomClass: local.bottomClass,
      contentClass: local.contentClass ?? '',
    })
  })
  createEffect(() => {
    aside?.setLocked(local.locked)
  })
  createEffect(() => {
    aside?.setDisabled(local.disabled)
  })
  createEffect(() => {
    aside?.setAllowLockedOverflow(local.allowLockedOverflowTop, local.allowLockedOverflowBottom)
  })

  const className = () => ['sticky-aside-root', local.class].filter(Boolean).join(' ')

  return (
    <Dynamic component={local.as} ref={wrapper} class={className()} {...rest}>
      <div ref={content}>{local.children}</div>
    </Dynamic>
  )
}
```

Adjust JSX settings if the solid vitest project needs `"jsxImportSource": "solid-js"` via the vite-plugin-solid (plugin usually handles this). If root `tsc` complains about solid JSX in `packages/solid`, add a `packages/solid/tsconfig.json` referenced only for the package, or set vitest-only transform and exclude solid tests from root `tsc` include — prefer making root typecheck pass: add to root `tsconfig` a path or use `jsxImportSource` only inside the solid vitest project. Practical approach used by many monorepos: keep solid sources as `.tsx` and add:

```json
// packages/solid/tsconfig.json — for editors; root tsc may skip via exclude
```

If root `tsc --noEmit` fails on solid JSX, exclude `packages/solid/src/**` from root include and rely on the solid vitest/tsdown build for type safety — document that in the commit message. Prefer fixing properly with `vite-plugin-solid` for tests and tsdown `jsxImportSource: 'solid-js'` for build.

`packages/solid/tsdown.config.mjs`:

```js
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown'

const cwd = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  cwd,
  entry: ['src/StickyAside.tsx'],
  platform: 'browser',
  target: 'es2022',
  format: 'esm',
  dts: true,
  minify: false,
  clean: true,
  hash: false,
  sourcemap: true,
  deps: {
    neverBundle: ['@sticky-aside/core', 'solid-js', 'solid-js/web'],
  },
})
```

- [ ] **Step 6: Run Solid tests — expect PASS**

```bash
pnpm exec vitest run --project solid
```

Expected: PASS

- [ ] **Step 7: Build solid + size-limit entry**

Add to `.size-limit.json`:

```json
{
  "name": "solid",
  "path": "packages/solid/dist/StickyAside.js",
  "import": "{ StickyAside }",
  "ignore": ["solid-js", "solid-js/web", "@sticky-aside/core"],
  "gzip": true,
  "limit": "700 B"
}
```

Update root `build` script filters to include `@sticky-aside/solid`.

```bash
pnpm --filter @sticky-aside/solid build
```

Expected: `dist/StickyAside.js` + `.d.ts` exist.

Write `packages/solid/README.md` mirroring react README (install + offsets + custom class examples with Solid JSX).

- [ ] **Step 8: Commit**

```bash
git add packages/solid package.json pnpm-lock.yaml vitest.config.ts tsconfig.json .size-limit.json
git commit -m "$(cat <<'EOF'
Add @sticky-aside/solid adapter mirroring the React API.

EOF
)"
```

---

### Task 2: `@sticky-aside/astro` client + component

**Files:**
- Create: `packages/astro/package.json`
- Create: `packages/astro/tsdown.config.mjs`
- Create: `packages/astro/LICENSE`
- Create: `packages/astro/README.md`
- Create: `packages/astro/src/client.ts`
- Create: `packages/astro/src/client.test.ts`
- Create: `packages/astro/src/StickyAside.astro`
- Modify: `vitest.config.ts` — astro/client project (happy-dom, no Astro compiler required)
- Modify: root `package.json` `build` filter
- Modify: `.size-limit.json` — measure built client module

**Interfaces:**
- Consumes: `createStickyAside`, `OFFSET_CLASS` from `@sticky-aside/core`
- Produces:
  - `export function initStickyAsideRoots(root?: ParentNode): void`
  - `StickyAside.astro` props: same mirror set; state via `CustomEvent('sticky-aside-state', { detail: StickyAsideState })` on the root (bubbles: true)
  - Data attributes on root: `data-sticky-aside`, `data-top-class`, `data-bottom-class`, `data-content-class`, `data-disabled`, `data-locked`, `data-allow-locked-overflow-top`, `data-allow-locked-overflow-bottom`
  - Inner: `[data-sticky-aside-content]`
  - Ready marker: `data-sticky-aside-ready` after init

- [ ] **Step 1: Write failing client tests**

`packages/astro/src/client.test.ts`:

```ts
import { createStickyAside } from '@sticky-aside/core'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { initStickyAsideRoots } from './client.ts'

vi.mock('@sticky-aside/core', () => ({
  OFFSET_CLASS: {
    top: 'sticky-aside-top',
    bottom: 'sticky-aside-bottom',
  },
  createStickyAside: vi.fn(() => ({
    update: vi.fn(),
    setLocked: vi.fn(),
    setDisabled: vi.fn(),
    setClasses: vi.fn(),
    setAllowLockedOverflow: vi.fn(),
    destroy: vi.fn(),
    getState: vi.fn(() => 'top'),
    getModel: vi.fn(),
  })),
}))

afterEach(() => {
  document.body.innerHTML = ''
  vi.mocked(createStickyAside).mockClear()
})

function mountRoot(attrs: Record<string, string> = {}) {
  const wrapper = document.createElement('aside')
  wrapper.className = 'sticky-aside-root'
  wrapper.setAttribute('data-sticky-aside', '')
  for (const [key, value] of Object.entries(attrs)) {
    wrapper.setAttribute(key, value)
  }
  const content = document.createElement('div')
  content.setAttribute('data-sticky-aside-content', '')
  content.textContent = 'item'
  wrapper.append(content)
  document.body.append(wrapper)
  return wrapper
}

describe('initStickyAsideRoots', () => {
  it('creates a controller for each uninitialized root', () => {
    mountRoot({
      'data-top-class': 'top-10',
      'data-bottom-class': 'bottom-0',
      'data-locked': 'true',
    })
    initStickyAsideRoots()
    expect(createStickyAside).toHaveBeenCalledOnce()
    const options = vi.mocked(createStickyAside).mock.calls[0][0]
    expect(options.topClass).toBe('top-10')
    expect(options.bottomClass).toBe('bottom-0')
    expect(options.locked).toBe(true)
  })

  it('is idempotent for the same root', () => {
    mountRoot()
    initStickyAsideRoots()
    initStickyAsideRoots()
    expect(createStickyAside).toHaveBeenCalledOnce()
  })

  it('skips roots without a content node', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute('data-sticky-aside', '')
    document.body.append(wrapper)
    initStickyAsideRoots()
    expect(createStickyAside).not.toHaveBeenCalled()
  })

  it('dispatches sticky-aside-state on the root', () => {
    const wrapper = mountRoot()
    const seen: string[] = []
    wrapper.addEventListener('sticky-aside-state', ((event: CustomEvent<string>) => {
      seen.push(event.detail)
    }) as EventListener)

    initStickyAsideRoots()
    const options = vi.mocked(createStickyAside).mock.calls[0][0]
    options.onStateChange?.('bottom')
    expect(seen).toEqual(['bottom'])
  })

  it('updates lock when data-locked changes', () => {
    const wrapper = mountRoot({ 'data-locked': 'false' })
    initStickyAsideRoots()
    const controller = vi.mocked(createStickyAside).mock.results[0].value
    wrapper.setAttribute('data-locked', 'true')
    // observer is async microtask / mutation — flush
    return Promise.resolve().then(() => {
      expect(controller.setLocked).toHaveBeenCalledWith(true)
    })
  })
})
```

- [ ] **Step 2: Run client tests — expect FAIL**

```bash
pnpm exec vitest run packages/astro/src/client.test.ts
```

(or `--project astro` after wiring). Expected: FAIL cannot find module / `initStickyAsideRoots` undefined.

- [ ] **Step 3: Implement `client.ts`**

```ts
import { createStickyAside, OFFSET_CLASS } from '@sticky-aside/core'
import type { StickyAsideController, StickyAsideState } from '@sticky-aside/core'

const ROOT = '[data-sticky-aside]'
const CONTENT = '[data-sticky-aside-content]'
const READY = 'data-sticky-aside-ready'

function readFlag(el: HTMLElement, name: string): boolean {
  const value = el.getAttribute(name)
  return value === '' || value === 'true'
}

function readOptions(wrapper: HTMLElement) {
  return {
    topClass: wrapper.getAttribute('data-top-class') || OFFSET_CLASS.top,
    bottomClass: wrapper.getAttribute('data-bottom-class') || OFFSET_CLASS.bottom,
    contentClass: wrapper.getAttribute('data-content-class') || '',
    disabled: readFlag(wrapper, 'data-disabled'),
    locked: readFlag(wrapper, 'data-locked'),
    allowLockedOverflowTop: readFlag(wrapper, 'data-allow-locked-overflow-top'),
    allowLockedOverflowBottom: readFlag(wrapper, 'data-allow-locked-overflow-bottom'),
  }
}

const controllers = new WeakMap<HTMLElement, StickyAsideController>()

function bind(wrapper: HTMLElement): void {
  if (wrapper.hasAttribute(READY)) {
    return
  }
  const content = wrapper.querySelector<HTMLElement>(CONTENT)
  if (!content) {
    return
  }
  wrapper.setAttribute(READY, '')
  const initial = readOptions(wrapper)
  const aside = createStickyAside({
    wrapper,
    content,
    ...initial,
    onStateChange(state: StickyAsideState) {
      wrapper.dispatchEvent(new CustomEvent('sticky-aside-state', {
        detail: state,
        bubbles: true,
      }))
    },
  })
  controllers.set(wrapper, aside)

  const observer = new MutationObserver(() => {
    const next = readOptions(wrapper)
    aside.setLocked(next.locked)
    aside.setDisabled(next.disabled)
    aside.setClasses({
      topClass: next.topClass,
      bottomClass: next.bottomClass,
      contentClass: next.contentClass,
    })
    aside.setAllowLockedOverflow(next.allowLockedOverflowTop, next.allowLockedOverflowBottom)
  })
  observer.observe(wrapper, {
    attributes: true,
    attributeFilter: [
      'data-top-class',
      'data-bottom-class',
      'data-content-class',
      'data-disabled',
      'data-locked',
      'data-allow-locked-overflow-top',
      'data-allow-locked-overflow-bottom',
    ],
  })

  const disconnect = new MutationObserver(() => {
    if (document.contains(wrapper)) {
      return
    }
    observer.disconnect()
    disconnect.disconnect()
    aside.destroy()
    controllers.delete(wrapper)
  })
  disconnect.observe(document.documentElement, { childList: true, subtree: true })
}

export function initStickyAsideRoots(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>(ROOT).forEach(bind)
}
```

Add vitest project `astro` including `packages/astro/src/**/*.test.ts`.

- [ ] **Step 4: Run client tests — expect PASS**

```bash
pnpm exec vitest run --project astro
```

Expected: PASS. If the MutationObserver test is flaky, use `await vi.waitFor(() => expect(controller.setLocked).toHaveBeenCalledWith(true))`.

- [ ] **Step 5: Add `StickyAside.astro` + package metadata**

`packages/astro/src/StickyAside.astro`:

```astro
---
import { OFFSET_CLASS } from '@sticky-aside/core'

interface Props {
  as?: 'div' | 'aside' | 'nav' | 'section'
  topClass?: string
  bottomClass?: string
  contentClass?: string
  disabled?: boolean
  locked?: boolean
  allowLockedOverflowTop?: boolean
  allowLockedOverflowBottom?: boolean
  class?: string
}

const {
  as: Tag = 'div',
  topClass = OFFSET_CLASS.top,
  bottomClass = OFFSET_CLASS.bottom,
  contentClass = '',
  disabled = false,
  locked = false,
  allowLockedOverflowTop = false,
  allowLockedOverflowBottom = false,
  class: className,
} = Astro.props
---

<Tag
  class:list={['sticky-aside-root', className]}
  data-sticky-aside
  data-top-class={topClass}
  data-bottom-class={bottomClass}
  data-content-class={contentClass || undefined}
  data-disabled={disabled ? 'true' : undefined}
  data-locked={locked ? 'true' : undefined}
  data-allow-locked-overflow-top={allowLockedOverflowTop ? 'true' : undefined}
  data-allow-locked-overflow-bottom={allowLockedOverflowBottom ? 'true' : undefined}
>
  <div data-sticky-aside-content>
    <slot />
  </div>
</Tag>

<script>
  import { initStickyAsideRoots } from './client.ts'
  initStickyAsideRoots()
</script>
```

`packages/astro/package.json`:

```json
{
  "name": "@sticky-aside/astro",
  "version": "1.0.0",
  "description": "Astro adapter for @sticky-aside/core.",
  "keywords": ["sticky", "sidebar", "aside", "scroll", "astro"],
  "license": "MIT",
  "author": "maprox",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/maprox/sticky-aside.git",
    "directory": "packages/astro"
  },
  "homepage": "https://github.com/maprox/sticky-aside#readme",
  "bugs": "https://github.com/maprox/sticky-aside/issues",
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": "./src/StickyAside.astro",
    "./client": "./src/client.ts"
  },
  "publishConfig": {
    "exports": {
      ".": "./src/StickyAside.astro",
      "./client": {
        "types": "./dist/client.d.ts",
        "import": "./dist/client.js"
      }
    },
    "files": ["src/StickyAside.astro", "src/client.ts", "dist"]
  },
  "files": ["src/StickyAside.astro", "src/client.ts", "dist"],
  "scripts": {
    "build": "pnpm --dir ../.. exec tsdown --config packages/astro/tsdown.config.mjs"
  },
  "dependencies": {
    "@sticky-aside/core": "workspace:^"
  },
  "peerDependencies": {
    "astro": "^5.0.0"
  }
}
```

`tsdown.config.mjs` entry: `src/client.ts`; neverBundle `@sticky-aside/core`.

Size-limit entry for `packages/astro/dist/client.js`, import `{ initStickyAsideRoots }`, ignore core, limit `~700 B`.

README must document:

```astro
---
import { StickyAside } from '@sticky-aside/astro'
import '@sticky-aside/core/offsets.css'
---
<StickyAside as="aside" locked={true}>…</StickyAside>
```

and the `sticky-aside-state` CustomEvent.

- [ ] **Step 6: Build astro client**

```bash
pnpm --filter @sticky-aside/astro build
```

Expected: `dist/client.js` exists.

- [ ] **Step 7: Commit**

```bash
git add packages/astro vitest.config.ts package.json pnpm-lock.yaml .size-limit.json
git commit -m "$(cat <<'EOF'
Add @sticky-aside/astro component and client init module.

EOF
)"
```

---

### Task 3: Monorepo release wiring

**Files:**
- Modify: `package.json` — `build` includes solid + astro (if not already)
- Modify: `.changeset/config.json` — fixed group includes both new packages
- Modify: `scripts/check-packages.mjs` — add solid (full publint+attw); add astro with publint only (skip attw on `.astro` entry, or attw only the `./client` tarball entrypoint if feasible)
- Modify: `scripts/e2e.mjs` — pack solid + astro tarballs for consistency even without new e2e apps (or pack only if e2e package.json will depend on them; **spec says defer e2e fixtures** — still pack in `e2e.mjs` only if you also add unused deps; prefer **not** changing e2e fixtures this wave, but keep `check-packages` covering both)
- Modify: `CONTRIBUTING.md` — fixed group list

**Interfaces:**
- Consumes: packages from Tasks 1–2
- Produces: release-ready workspace

- [ ] **Step 1: Update changeset fixed group**

```json
"fixed": [[
  "@sticky-aside/core",
  "@sticky-aside/vue",
  "@sticky-aside/react",
  "@sticky-aside/svelte",
  "@sticky-aside/solid",
  "@sticky-aside/astro"
]]
```

- [ ] **Step 2: Extend `check-packages.mjs`**

```js
{
  name: '@sticky-aside/solid',
  dir: 'packages/solid',
  attwArgs: [],
},
{
  name: '@sticky-aside/astro',
  dir: 'packages/astro',
  // Astro primary export is .astro — skip attw; still run publint
  skipAttw: true,
  attwArgs: [],
},
```

Update the loop to honor `skipAttw`.

- [ ] **Step 3: Run package checks**

```bash
pnpm build
pnpm check:packages
pnpm size
```

Expected: all green. Raise size-limit slightly only if measured gzip exceeds budget after a real build (keep limits honest).

- [ ] **Step 4: Commit**

```bash
git add .changeset/config.json scripts/check-packages.mjs package.json CONTRIBUTING.md .size-limit.json
git commit -m "$(cat <<'EOF'
Wire solid and astro into release checks and the fixed changeset group.

EOF
)"
```

---

### Task 4: Site tabs, snippets, SEO

**Files:**
- Modify: `apps/site/src/demo/settings.ts` — extend `DemoFramework` + `DEMO_FRAMEWORKS`
- Modify: `apps/site/src/demo/generate-code.ts` — solid + astro snippet generators
- Modify: `apps/site/src/demo/generate-code.test.ts`
- Modify: `apps/site/src/demo/i18n.ts` — `frameworkFromPath` + SEO strings en/ru
- Modify: `apps/site/src/demo/seo.test.ts`
- Modify: `apps/site/src/demo/initial-shell.test.ts`
- Modify: `apps/site/src/components/FrameworkTabs.astro`
- Modify: `apps/site/package.json` — optional workspace deps on solid/astro (not required for snippets-only; skip unless site imports the packages)

**Interfaces:**
- Consumes: package names `@sticky-aside/solid`, `@sticky-aside/astro`
- Produces: `DemoFramework` includes `'solid' | 'astro'`

- [ ] **Step 1: Failing site tests first**

Extend `settings.ts` type in the test expectations before implementation by updating tests:

In `generate-code.test.ts` add:

```ts
it('prints solid camelCase options', () => {
  const code = generateDemoCode({
    ...base,
    framework: 'solid',
    locked: true,
    top: 40,
  })
  expect(code).toContain("from '@sticky-aside/solid'")
  expect(code).toContain('locked={true}')
  expect(code).toContain("'--sticky-aside-top': '40px'")
})

it('prints astro component usage', () => {
  const code = generateDemoCode({
    ...base,
    framework: 'astro',
    disabled: true,
    bottom: 24,
  })
  expect(code).toContain("from '@sticky-aside/astro'")
  expect(code).toContain('disabled={true}')
  expect(code).toContain('--sticky-aside-bottom: 24px')
})
```

In `seo.test.ts` assert English titles for solid/astro once strings exist (write expected final copy in the test, then implement i18n to match).

In `initial-shell.test.ts` assert snippet imports for solid/astro.

Update `frameworkFromPath` tests if any assert the allow-list.

- [ ] **Step 2: Run site tests — expect FAIL**

```bash
pnpm exec vitest run --project site
```

Expected: type errors and/or failing assertions.

- [ ] **Step 3: Implement settings + generate-code**

```ts
export type DemoFramework = 'vanilla' | 'vue' | 'react' | 'svelte' | 'solid' | 'astro'
export const DEMO_FRAMEWORKS: DemoFramework[] = [
  'vanilla', 'vue', 'react', 'svelte', 'solid', 'astro',
]
```

Solid snippet (camelCase, style object like React):

```ts
function solid(settings: DemoSettings): string {
  const vars = styleVars(settings)
  return `import { StickyAside } from '@sticky-aside/solid'
import '@sticky-aside/core/offsets.css'

<StickyAside
  as="aside"
  locked={${bool(settings.locked)}}
  disabled={${bool(settings.disabled)}}
  allowLockedOverflowTop={${bool(settings.allowLockedOverflowTop)}}
  allowLockedOverflowBottom={${bool(settings.allowLockedOverflowBottom)}}
  style={{
    '--sticky-aside-top': '${vars.top}',
    '--sticky-aside-bottom': '${vars.bottom}',
  }}
>
  ...
</StickyAside>`
}
```

Astro snippet (frontmatter + component):

```ts
function astro(settings: DemoSettings): string {
  const vars = styleVars(settings)
  return `---
import { StickyAside } from '@sticky-aside/astro'
import '@sticky-aside/core/offsets.css'
---

<StickyAside
  as="aside"
  locked={${bool(settings.locked)}}
  disabled={${bool(settings.disabled)}}
  allowLockedOverflowTop={${bool(settings.allowLockedOverflowTop)}}
  allowLockedOverflowBottom={${bool(settings.allowLockedOverflowBottom)}}
  style={\`--sticky-aside-top: ${vars.top}; --sticky-aside-bottom: ${vars.bottom}\`}
>
  ...
</StickyAside>`
}
```

Wire both in `generateDemoCode`.

- [ ] **Step 4: i18n + tabs + frameworkFromPath**

`frameworkFromPath`: accept `solid` and `astro`.

SEO copy (en examples — keep same modern-browsers tone as existing):

- `seo.solid.title`: `Solid sticky sidebar — sticky-aside`
- `seo.solid.description`: `Solid sticky sidebar adapter over a tiny modern core. Both-edge pin, lock, CSS offsets. Current browsers only.`
- `seo.astro.title`: `Astro sticky sidebar — sticky-aside`
- `seo.astro.description`: `Astro sticky sidebar component with the same API as the other adapters. Pins to the edge you scroll toward. Small ESM core for modern browsers.`

Add matching Russian strings.

`FrameworkTabs.astro`:

```ts
const items = ['vanilla', 'vue', 'react', 'svelte', 'solid', 'astro'] as const
const labels = {
  vanilla: 'Vanilla',
  vue: 'Vue',
  react: 'React',
  svelte: 'Svelte',
  solid: 'Solid',
  astro: 'Astro',
}
```

Also update any copy that says “Vue, React, and Svelte” in `i18n` article/seo vanilla blurb to include Solid and Astro if those strings list frameworks.

- [ ] **Step 5: Run site tests — expect PASS**

```bash
pnpm exec vitest run --project site
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/site
git commit -m "$(cat <<'EOF'
Add Solid and Astro demo tabs, snippets, and SEO copy.

EOF
)"
```

---

### Task 5: Root documentation + changeset + verify

**Files:**
- Modify: `README.md` — install lines + usage samples for Solid and Astro (offsets + custom class sections)
- Modify: `packages/core/README.md` — mention solid/astro adapters
- Modify: `docs/analogs.md` — published names + optional size row after measured
- Create: `.changeset/<slug>.md` — minor bump for the fixed group describing the new adapters

**Interfaces:** none beyond docs

- [ ] **Step 1: Update README install block**

```bash
npm install @sticky-aside/vue
npm install @sticky-aside/react
npm install @sticky-aside/svelte
npm install @sticky-aside/solid
npm install @sticky-aside/astro
```

Add Solid JSX and Astro frontmatter examples next to the existing framework samples (same structure as React / Svelte blocks).

- [ ] **Step 2: Update core README + analogs + CONTRIBUTING if not done**

- [ ] **Step 3: Add changeset**

```md
---
"@sticky-aside/core": minor
"@sticky-aside/vue": minor
"@sticky-aside/react": minor
"@sticky-aside/svelte": minor
"@sticky-aside/solid": minor
"@sticky-aside/astro": minor
---

Add Solid and Astro adapters with the shared StickyAside API.
```

- [ ] **Step 4: Full verification**

```bash
export NODE_OPTIONS=--max-old-space-size=4096
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm size
pnpm check:packages
```

Expected: all pass.

- [ ] **Step 5: Commit docs + changeset**

```bash
git add README.md packages/core/README.md docs/analogs.md CONTRIBUTING.md .changeset
git commit -m "$(cat <<'EOF'
Document Solid and Astro adapters and add the release changeset.

EOF
)"
```

- [ ] **Step 6: Finish branch**

Push and open a PR into `main` (do not wait for CI):

```bash
git push -u origin HEAD
gh pr create --title "Add Solid and Astro adapters" --body "$(cat <<'EOF'
## Summary
- Add `@sticky-aside/solid` and `@sticky-aside/astro` mirroring the existing StickyAside API
- Wire release checks, size-limit, and the fixed changeset group
- Extend the site with Solid/Astro tabs, snippets, and SEO

## Test plan
- [ ] `pnpm test` (incl. solid + astro + site projects)
- [ ] `pnpm build && pnpm size && pnpm check:packages`
- [ ] Spot-check `/solid/` and `/astro/` (and `/ru/…`) on the site

EOF
)"
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|---|---|
| `@sticky-aside/solid` mirror React API | Task 1 |
| `@sticky-aside/astro` mirror API + client init | Task 2 |
| CustomEvent for Astro state | Task 2 |
| Attribute observation for lock/disable (cheap path) | Task 2 client MutationObserver |
| Changeset fixed group | Task 3 |
| size-limit | Tasks 1–2 |
| check-packages / publint | Task 3 |
| Site frameworks, snippets, SEO | Task 4 |
| README / docs | Task 5 |
| No Angular / no demo island rewrite / no core API change | Global constraints |
| e2e fixtures deferred | Task 3 notes — no new e2e apps |

No TBD placeholders remain. Prop names are consistent across tasks (`topClass`, `onStateChange`, `sticky-aside-state`).
