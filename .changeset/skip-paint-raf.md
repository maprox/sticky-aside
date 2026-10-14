---
"@sticky-aside/core": patch
"@sticky-aside/vue": patch
"@sticky-aside/react": patch
"@sticky-aside/svelte": patch
"@sticky-aside/solid": patch
"@sticky-aside/astro": patch
"@sticky-aside/angular": patch
---

Skip unchanged sticky paints and coalesce window scroll/resize into one animation frame. Tree-shaken `createStickyAside` grows from 2.14 kB to 2.30 kB gzip.
