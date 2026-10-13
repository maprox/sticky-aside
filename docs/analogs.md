# Analogs

Snapshot from registry.npmjs.org, the GitHub API, and Bundlephobia on 12 October 2026.

Size in the Libraries table is Bundlephobia’s minified bundle and its gzip size (peers such as React and Vue are not included). Tree-shaken size-limit numbers for our entries — the ones on the README badge — are in [Our size](#our-size).

`theia-sticky-sidebar@2.0.1` publishes a UMD build at 7,393 bytes raw and about 2.5 KB gzipped; Bundlephobia reports 6.7 / 2.1 KB for the package entry it resolves. The ES build in the tarball is 8,976 / ~2.7 KB.

`@sticky-aside/core` does one specific thing. If the panel is shorter than the viewport, it stays at the top. If it is taller, it moves with the page until the edge you are scrolling toward hits the viewport, then pins there. Scroll the other way and it pins to the opposite edge. `position: sticky` alone does not do this: a tall box stays clipped.

Published packages: `@sticky-aside/core`, `@sticky-aside/vue`, `@sticky-aside/react`, `@sticky-aside/svelte`, `@sticky-aside/solid`, `@sticky-aside/angular`, `@sticky-aside/astro`. Repository: [maprox/sticky-aside](https://github.com/maprox/sticky-aside).

## Libraries

| Library | Behavior | Min / gzip | Weekly downloads | Latest npm | Last repo push | Stars |
| --- | --- | --- | --- | --- | --- | --- |
| [@sticky-aside/core](https://github.com/maprox/sticky-aside) | Same behavior | 6.6 / 2.2 KB | 321 | 1.0.0, Oct 2026 | Oct 2026 | 1 |
| [react-sticky-box](https://github.com/codecks-io/react-sticky-box) | Same | 4.0 / 3.6 KB | 128,281 | 2.0.5, Oct 2023 | Apr 2026 | 503 |
| [sticky-sidebar](https://github.com/abouolia/sticky-sidebar) | Same | 9.0 / 2.8 KB | 12,934 | 3.3.1, Nov 2017 | Aug 2024 | 2,223 |
| [theia-sticky-sidebar](https://github.com/WeCodePixels/theia-sticky-sidebar) | Same | 6.7 / 2.1 KB | 9,906 | 2.0.1, Sep 2026 | Sep 2026 | 581 |
| [hc-sticky](https://github.com/somewebmedia/hc-sticky) | Same when `followScroll` is on (the default) | 8.7 / 3.4 KB | 1,446 | 2.3.0, Mar 2026 | Mar 2026 | 461 |
| [sticky-sidebar-v2](https://github.com/blixhavn/sticky-sidebar-v2) | Same, plus a nested scroll container | 12.7 / 3.6 KB | 3,420 | 1.3.0, Oct 2026 | Oct 2026 | 56 |
| [vue-sticky-sidebar](https://github.com/Alucard17/vue-sticky-sidebar) | Wrapper over a fork of v2. Vue 2. Repository archived | 11.8 / 3.5 KB | 302 | 1.0.5, Jul 2020 | Dec 2022 | 8 |
| [react-stickynode](https://github.com/yahoo/react-stickynode) | Different. Pins the top until a bottom boundary | 16.8 / 6.0 KB | 81,458 | 5.0.2, Feb 2025 | Feb 2026 | 1,339 |
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
| `@sticky-aside/angular`, core external | 1.44 KB |
| `@sticky-aside/astro`, re-export of `createStickyAside` | 50 B |

The core is window scroll, both edges, lock, and an internal measure element. Offsets are CSS classes, not pixel props. A scroll-root option is not in 1.0.0.

## Features

| Library | Both edges | Scroll root | Lock in place | Vue 3 | React | Runtime dependencies |
| --- | --- | --- | --- | --- | --- | --- |
| @sticky-aside/core | yes | `window` only | yes | yes | yes | none. Adapters peer Vue 3, React, Svelte 5, Solid, or Angular 19; Astro re-exports core |
| react-sticky-box | yes | nearest scroll parent, via `position: sticky` | no | no | yes | none, peer `react` |
| sticky-sidebar | yes | `window` | no | no | no | none. Optional jQuery build and ResizeSensor |
| theia-sticky-sidebar | yes | `window` | no | no | no | none in 2.0.1 |
| hc-sticky | yes, `followScroll` | `window`. `stickTo` sets the height limit, not the scroller | no | no | no | none. Optional jQuery |
| sticky-sidebar-v2 | yes | `window` or `scrollContainer` | no | no | no | none |
| vue-sticky-sidebar | yes | inherited from v2 | no | no, Vue 2 | no | git dependency on a sticky-sidebar-v2 fork |
| react-stickynode | no | `window` | yes, a freeze callback | no | yes | React peers |
| CSS `position: sticky` | no | nearest scrollport | no | — | — | none |

Offsets are the classes `sticky-aside-top` and `sticky-aside-bottom`. They read `--sticky-aside-top` and `--sticky-aside-bottom`. The other libraries take pixel numbers (`topSpacing`, `offsetTop`, `offsetBottom`).

Coming from sticky-sidebar (vanilla or jQuery): [migrate-from-sticky-sidebar.md](./migrate-from-sticky-sidebar.md).
