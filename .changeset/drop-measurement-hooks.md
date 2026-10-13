---
"@sticky-aside/core": patch
"@sticky-aside/vue": patch
"@sticky-aside/react": patch
"@sticky-aside/svelte": patch
"@sticky-aside/solid": patch
"@sticky-aside/astro": patch
"@sticky-aside/angular": patch
---

Remove the undocumented `readRect` and `getScrollMetrics` options from `createStickyAside`. Measurement uses `getBoundingClientRect` and the window scroll position.
