# @sticky-aside/core

## 1.1.3

### Patch Changes

- 33b6470: Skip unchanged sticky paints and coalesce window scroll/resize into one animation frame. Tree-shaken `createStickyAside` grows from 2.14 kB to 2.30 kB gzip.

## 1.1.2

### Patch Changes

- 3a97d12: Remove the undocumented `readRect` and `getScrollMetrics` options from `createStickyAside`. Measurement uses `getBoundingClientRect` and the window scroll position.

## 1.1.1

### Patch Changes

- Republish after a broken 1.1.0 registry staging/tarball state.


## 1.1.0

### Minor Changes

- 7d7dfaf: Add Angular adapter with the shared StickyAside API.
- 4ee06df: Add Solid and Astro adapters with the shared StickyAside API.

## 1.0.1

### Patch Changes

- Pin a tall panel to the top on resize when its top already covers the offset, so changing `--sticky-aside-top` moves the pin.
