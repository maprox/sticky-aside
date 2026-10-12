# Solid and Astro adapters — design

**Date:** 2026-10-12  
**Status:** approved for planning  
**Location:** `docs/specs/` (repo ignores `docs/superpowers/`)  
**Scope:** wave 1 — `@sticky-aside/solid` and `@sticky-aside/astro`  
**Out of scope:** Angular (separate follow-up PR), Lit/Web Component, Preact package

## Goal

Ship two new framework adapters that mirror the existing Vue / React / Svelte public API so docs and demos stay consistent. Solid follows the React-shaped component model. Astro exposes the same props surface via a `.astro` component that initializes `@sticky-aside/core` on the client (variant 1 — mirror API, not a thin core-only docs path).

## Background

- Core API: `createStickyAside({ wrapper, content, … })` plus optional class / lock / disabled options.
- Existing adapters (`packages/vue`, `packages/react`, `packages/svelte`) are thin lifecycle wrappers (~80–100 lines) with the same prop names: `as`, `topClass` / `bottomClass` / `contentClass`, `disabled`, `locked`, `allowLockedOverflowTop` / `allowLockedOverflowBottom`, and a state callback (`onStateChange` or `state-change`).
- The marketing site (`apps/site`) already runs on Astro. Framework tabs today: `vanilla | vue | react | svelte`. Snippets, SEO, routes, and tests are driven by `DemoFramework`.

## Decisions

| Decision | Choice |
|---|---|
| Astro DX | Variant 1 — `@sticky-aside/astro` with the same component props as other adapters |
| Solid DX | Mirror React (`StickyAside` + camelCase props + `onStateChange`) |
| Delivery | One PR for Solid + Astro; Angular later |
| Live demo behavior | Unchanged: interactive panel still uses core via `mount-demo`; new frameworks only add snippet / route / SEO tabs |
| Versioning | Add both packages to the existing changeset **fixed** group with core / vue / react / svelte |

## Public API

Shared prop contract (names as in React; Vue keeps kebab-case in templates as today):

- `as?: 'div' | 'aside' | 'nav' | 'section'` (default `'div'`)
- `topClass?: string` (default core `OFFSET_CLASS.top`)
- `bottomClass?: string` (default core `OFFSET_CLASS.bottom`)
- `contentClass?: string`
- `disabled?: boolean`
- `locked?: boolean`
- `allowLockedOverflowTop?: boolean`
- `allowLockedOverflowBottom?: boolean`
- Default slot / `children` for panel content
- State callback: Solid `onStateChange`; Astro `onStateChange` as an optional client callback is **not** required in v1 if Astro cannot pass functions through the island boundary cleanly — prefer a DOM `CustomEvent` (`sticky-aside-state`) on the root for Astro, documented in the package README. Solid keeps the React-style callback.

### `@sticky-aside/solid`

- Package layout mirrors `packages/react`: `StickyAside.tsx` (or `.tsx` under Solid JSX), tests, `package.json` exports, `tsdown` build.
- peerDependency: `solid-js` (current major, align with Solid 1.x).
- dependency: `@sticky-aside/core` workspace.
- Lifecycle: create controller on mount, `destroy` on cleanup; sync class / lock / disabled / overflow flags when props change (same effect split as React).
- `ref` / element exposure: forward the wrapper element if Solid’s ref pattern allows without extra API surface; otherwise match “root is the wrapper” and document.

### `@sticky-aside/astro`

- Ship `StickyAside.astro` as the primary export (plus a tiny client module if needed for init / deduped multi-instance setup).
- peerDependency: `astro` (compatible with the site’s Astro major).
- dependency: `@sticky-aside/core` workspace.
- Render: dynamic tag from `as`, wrapper class `sticky-aside-root`, inner content wrapper for the slot — same DOM shape as other adapters.
- Serialize boolean / class props to `data-*` (or equivalent) on the root so the client script can call `createStickyAside` after paint.
- Client script: idempotent init for all roots on the page (Astro may dedupe `<script>`). Call `destroy` on `astro:before-swap` / page leave when using View Transitions if the site enables them; minimum v1 is init + destroy on module teardown / element disconnect via `MutationObserver` or `destroyed` when root is removed — pick the smallest reliable approach and cover with a unit or package test.
- **Prop updates after first paint:** Astro props are build/request-time. Document that changing attributes after init is not the primary path; for dynamic lock/disable, consumers use core directly or re-mount. Optional v1 stretch: observe `data-locked` / `data-disabled` and call `setLocked` / `setDisabled`. Prefer implementing attribute observation for `locked` and `disabled` only if cheap; otherwise document limitation.
- State: dispatch `CustomEvent('sticky-aside-state', { detail: state })` on the root (bubbles) so demos/docs can listen without a function prop.

Example (target DX):

```astro
---
import { StickyAside } from '@sticky-aside/astro'
import '@sticky-aside/core/offsets.css'
---

<StickyAside as="aside" topClass="top-10" bottomClass="bottom-0">
  <nav>…</nav>
</StickyAside>
```

## Monorepo / release wiring

- `packages/solid`, `packages/astro` under existing `pnpm-workspace.yaml` (`packages/*`).
- Root `package.json` `build` filter: include solid and astro.
- `.changeset/config.json` `fixed` group: append `@sticky-aside/solid` and `@sticky-aside/astro`.
- `.size-limit.json`: add entries with limits in line with react/vue (~600–700 B gzip for the adapter surface; Astro may measure the client init module rather than the `.astro` file if size-limit cannot treat Astro as JS — document the measured path).
- `scripts/check-packages.mjs` / publint / attw: follow whatever pattern existing adapters use; extend allowlists if needed.
- Package READMEs + root README install/usage sections for Solid and Astro.
- `CONTRIBUTING.md`: mention the expanded fixed group.
- `docs/analogs.md`: optional one-line size note after first measured build.

## Site (`apps/site`)

Extend `DemoFramework` and `DEMO_FRAMEWORKS` with `'solid'` and `'astro'`.

Update in lockstep:

- `generate-code.ts` — Solid and Astro snippets matching the mirror API
- `initial-shell` / framework path helpers / tabs UI
- SEO copy (`i18n.ts` + `seo*.test.ts`) for en/ru
- Routes: `[framework].astro` / `ru/[framework].astro` already dynamic — ensure new segments are accepted
- Tests that assert import paths and SEO strings

Do **not** change the live sticky runtime to mount Solid/Astro islands for the mini-window; keep core-driven demo behavior.

## Testing

| Package | Tests |
|---|---|
| solid | Component mount: creates controller shape (mock or spy on `createStickyAside`), updates lock/disabled, cleans up on unmount — mirror `packages/react/src/StickyAside.test.tsx` |
| astro | Prefer testing the client init module in Vitest (DOM + `createStickyAside` mock). Full `.astro` compile test only if the repo already has an Astro component test pattern; do not add a heavy Astro test harness solely for this |
| site | Extend existing generate-code / initial-shell / seo unit tests |
| e2e | Optional: add a solid or astro fixture only if e2e pack pipeline already packs every adapter; otherwise defer e2e fixtures to a follow-up so wave 1 stays focused |

## Error handling / edge cases

- Missing wrapper/content nodes: do not call `createStickyAside`; no throw in Astro init for empty pages.
- Multiple `StickyAside` on one Astro page: one shared client module initializes each uninitialized root once (mark with a data flag or WeakSet).
- SSR: Solid and Astro must render stable markup without touching `window` during SSR; init only in browser.
- CSS: consumers still import `@sticky-aside/core/offsets.css` (or custom classes) — adapters do not bundle offsets CSS (same as today).

## Non-goals (wave 1)

- `@sticky-aside/angular`
- Changing core API
- Preact-specific package
- Making the site demo’s interactive panel a framework island

## Success criteria

1. `pnpm --filter @sticky-aside/solid build` and `pnpm --filter @sticky-aside/astro build` succeed and packages are publishable with the fixed changeset group.
2. Unit tests for Solid (and Astro client init) pass in CI with existing `pnpm test`.
3. Site tabs include Solid and Astro with working snippets and SEO strings (en/ru).
4. Root README documents install + minimal usage for both.
5. Size-limit budgets added and green.

## Follow-up

**Angular adapter** — separate design/PR: standalone or NgModule component, signals-friendly inputs, SSR-safe init/destroy, peer on `@angular/core` for the supported major. Not started in this wave.
