# Contributing

```bash
pnpm install
pnpm test
pnpm test:e2e
pnpm build
pnpm changeset
```

`pnpm test` runs the unit tests. `pnpm test:e2e` builds the four packages, installs the packed tarballs, and runs the scroll scenarios in Chromium. `pnpm lint` and `pnpm typecheck` run in CI as well.

`pnpm changeset` records a release note. `@sticky-aside/core`, `@sticky-aside/vue`, `@sticky-aside/react`, `@sticky-aside/svelte`, `@sticky-aside/solid`, and `@sticky-aside/astro` are one fixed group, so a changeset names all six.

`.changeset/release-1.md` is the note for 1.0.0. The packages are already at that version. Do not run `pnpm changeset version` before 1.0.0 is published. That command would move them to 2.0.0.
