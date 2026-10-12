# Analogs

Snapshot from registry.npmjs.org, the GitHub API, and Bundlephobia on 5 October 2026.

Size is the minified bundle and its gzip size. Peer dependencies such as React and Vue are not included. `theia-sticky-sidebar` is the published UMD file, 7,392 bytes minified and 2,461 bytes gzipped. Bundlephobia did not return a size for it. Its `main` field points at `dist/theia-sticky-sidebar.js`, and that file is not in the package. The ES build is 8,976 / 2,736 bytes.

`@sticky-aside/core` does one specific thing. If the panel is shorter than the viewport, it stays at the top. If it is taller, it moves with the page until the edge you are scrolling toward hits the viewport, then pins there. Scroll the other way and it pins to the opposite edge. `position: sticky` alone does not do this: a tall box stays clipped.

## Name

The published names are `@sticky-aside/core`, `@sticky-aside/vue`, `@sticky-aside/react`, `@sticky-aside/svelte`, `@sticky-aside/solid`, and `@sticky-aside/astro`. The unscoped name `sticky-aside` is left unpublished.

`sticky-panel` is taken. npm has `sticky-panel@1.0.1` (3 January 2019, about 5 downloads a week): a React component that sticks a panel to the top of the screen. GitHub also has [donnyv/sticky-panel](https://github.com/donnyv/sticky-panel), a jQuery plugin from 2015 that does the same simple affix. The words already mean "stick to the top", not a tall panel that switches edges.

`sticky-sidebar` is the search term, and it is the package with about 16,000 downloads a week. `sticky-box` is free, but `react-sticky-box` owns that phrase. `sticky-rail` and `sticky-column` are free. Rail is layout jargon. Column is vague.

The repository is [maprox/sticky-aside](https://github.com/maprox/sticky-aside).

## Libraries

| Library | Behavior | Min / gzip | Weekly downloads | Latest npm | Last repo push | Stars |
| --- | --- | --- | --- | --- | --- | --- |
| [@sticky-aside/core](https://github.com/maprox/sticky-aside) | Same behavior | — / 2.11 KB | — | 1.0.0 | — | — |
| [react-sticky-box](https://github.com/codecks-io/react-sticky-box) | Same | 4.1 / 3.6 KB | 167,318 | 2.0.5, Oct 2023 | Apr 2026 | 503 |
| [sticky-sidebar](https://github.com/abouolia/sticky-sidebar) | Same | 9.2 / 2.8 KB | 15,755 | 3.3.1, Nov 2017 | Aug 2024 | 2,221 |
| [theia-sticky-sidebar](https://github.com/WeCodePixels/theia-sticky-sidebar) | Same | 7.4 / 2.5 KB | 915 | 2.0.0, Apr 2025 | Sep 2026 | 581 |
| [hc-sticky](https://github.com/somewebmedia/hc-sticky) | Same when `followScroll` is on (the default) | 8.9 / 3.5 KB | 2,349 | 2.3.0, Mar 2026 | Mar 2026 | 461 |
| [sticky-sidebar-v2](https://github.com/blixhavn/sticky-sidebar-v2) | Same, plus a nested scroll container | 10.4 / 3.0 KB | 2,964 | 1.1.1, Oct 2021 | Apr 2025 | 56 |
| [vue-sticky-sidebar](https://github.com/Alucard17/vue-sticky-sidebar) | Wrapper over a fork of v2. Vue 2. Repository archived | 12.0 / 3.6 KB | 303 | 1.0.5, Jul 2020 | Dec 2022 | 8 |
| [react-stickynode](https://github.com/yahoo/react-stickynode) | Different. Pins the top until a bottom boundary | 17.2 / 6.1 KB | 115,623 | 5.0.2, Feb 2025 | Feb 2026 | 1,338 |
| CSS `position: sticky` | Different. One edge. A tall box is clipped | 0 | — | — | — | — |

Download figures move. Stars do not say a package is maintained: `sticky-sidebar` has the most stars and has not published since 2017.

## Our size

size-limit, minified and gzipped, on the 1.0.0 build:

| Entry | Gzip |
| --- | --- |
| `@sticky-aside/core`, `createStickyAside` | 2.11 KB |
| `@sticky-aside/core/headless`, `createStickyAsidePresenter` | 1.26 KB |
| `@sticky-aside/vue`, core external | 630 B |
| `@sticky-aside/react`, core external | 505 B |
| `@sticky-aside/svelte`, the component file | 518 B |
| `@sticky-aside/solid`, core external | 638 B |
| `@sticky-aside/astro`, `initStickyAsideRoots` client | 630 B |

The core is window scroll, both edges, lock, and an internal measure element. Offsets are CSS classes, not pixel props. A scroll-root option is not in 1.0.0. Adding one would not approach the 9 KB of `sticky-sidebar`.

## Features

| Library | Both edges | Scroll root | Lock in place | Vue 3 | React | Runtime dependencies |
| --- | --- | --- | --- | --- | --- | --- |
| @sticky-aside/core | yes | `window` only | yes | yes | yes | none. Adapters peer Vue 3, React, Svelte 5, Solid, or Astro |
| react-sticky-box | yes | nearest scroll parent, via `position: sticky` | no | no | yes | none, peer `react` |
| sticky-sidebar | yes | `window` | no | no | no | none. Optional jQuery build and ResizeSensor |
| theia-sticky-sidebar | yes | `window` | no | no | no | none in 2.0.0 |
| hc-sticky | yes, `followScroll` | `window`. `stickTo` sets the height limit, not the scroller | no | no | no | none. Optional jQuery |
| sticky-sidebar-v2 | yes | `window` or `scrollContainer` | no | no | no | none |
| vue-sticky-sidebar | yes | inherited from v2 | no | no, Vue 2 | no | git dependency on a sticky-sidebar-v2 fork |
| react-stickynode | no | `window` | yes, a freeze callback | no | yes | React peers |
| CSS `position: sticky` | no | nearest scrollport | no | — | — | none |

Offsets are the classes `sticky-aside-top` and `sticky-aside-bottom`. They read `--sticky-aside-top` and `--sticky-aside-bottom`. The other libraries take pixel numbers (`topSpacing`, `offsetTop`, `offsetBottom`).

## Gap

React already has a living library: `react-sticky-box`, used inside Codecks, with a docs site. Vanilla already has `sticky-sidebar`, widely installed and barely released. Vue 3 has no maintained package for this behavior. `vue-sticky-sidebar` is Vue 2 and the repository is archived.

`@sticky-aside/core` has no runtime dependencies. The Vue 3, React, Svelte 5, Solid, and Astro adapters are thin bindings over that core, and the lock mode is one the popular packages do not expose.
