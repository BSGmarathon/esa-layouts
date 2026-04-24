# Visual regression tests

This folder contains [Playwright](https://playwright.dev) based visual
regression tests for the NodeCG graphics shipped by this bundle.

No real NodeCG server is needed: tests serve the built assets directly from
the repo via request interception, and inject a mock `window.nodecg` client
that lets you configure the replicants / config a layout sees.

## Prerequisites

```bash
pnpm install
pnpm exec playwright install chromium
pnpm build   # make sure shared/dist + graphics/*.html exist
```

The graphics' built output (`shared/dist/**` and `graphics/*/main.html`) must
exist on disk – Playwright serves them directly. If you modify source code
in `src/`, rebuild before re-running tests.

## Running

```bash
pnpm test:visual              # run all visual regression tests
pnpm test:visual:update       # update baseline screenshots
pnpm test:visual:ui           # interactive UI mode for debugging
pnpm test:visual:report       # open the last HTML report
```

The first run will write baseline images to
`tests/visual/<spec>.spec.ts-snapshots/`. Commit those alongside the tests.
Subsequent runs diff the current render against the baseline and fail on
mismatch.

### Cross-platform snapshot filenames

By default Playwright appends the current OS (`-linux`, `-darwin`, `-win32`)
to every snapshot filename so that baselines produced on different
operating systems don't collide. We override that via
`snapshotPathTemplate` in `playwright.config.ts` so the same baseline file
is used on **any OS** – files are named
`<name>-chromium-1920x1080.png`, never `…-linux.png`.

This keeps baselines portable between teammates on Linux / macOS /
Windows, but comes with a caveat: native font rendering differs slightly
across operating systems, so small pixel diffs can appear even when the
layout is unchanged. To absorb these the config uses lenient
`toHaveScreenshot` defaults (`threshold: 0.25`, `maxDiffPixelRatio: 0.02`).
If diffs still show up on another OS, regenerate the baselines with
`pnpm test:visual:update` and commit the updated PNGs.

## How the inputs work

Each layout's Vue app receives its data through `useReplicant(...)` /
`useAssetReplicant(...)` from `nodecg-vue-composable`, which in turn calls
`nodecg.Replicant(name, namespace, opts)`.

`tests/visual/mock-nodecg.js` is injected *before* every page script runs.
It replaces `window.nodecg` with a minimal in-memory implementation that:

- Returns `bundleConfig` from an object you supply per-test.
- Returns replicant values from a `{ namespace: { name: value } }` map you
  supply per-test.
- Supports `.on('change', ...)`, `.value = ...`, `readReplicant`,
  `sendMessage`/`sendMessageToBundle` (no-op), etc.

The `LayoutInputs` interface is the single source of truth for what you can
override:

```ts
export interface LayoutInputs {
  bundleConfig?: Record<string, unknown>;
  replicants?: Record<string /* namespace */, Record<string /* replicant */, unknown>>;
}
```

Namespaces you'll typically use:

- `esa-layouts` – bundle replicants (all non-asset state).
- `nodecg-speedcontrol` – run data + timer.
- Asset replicants inside `esa-layouts`: prefix the replicant name with
  `assets:`, e.g. `'assets:media-box-images'`.

### Example: setting inputs per-test

```ts
import { test, expect } from './fixtures';
import { baseInputs } from './inputs/base';

test('intermission with high donation total', async ({ layout }) => {
  await layout.goto('intermission', {
    ...baseInputs,
    replicants: {
      ...baseInputs.replicants,
      'esa-layouts': {
        ...baseInputs.replicants?.['esa-layouts'],
        donationTotal: 1_234_567.89,
      },
    },
  });

  await expect(layout.page).toHaveScreenshot('intermission-high-total.png');
});
```

### Example: updating replicants at runtime

```ts
await layout.goto('intermission', baseInputs);
await layout.setReplicant('donationTotal', 'esa-layouts', 42);
await layout.page.waitForTimeout(100); // let watchers settle
await expect(layout.page).toHaveScreenshot('after-update.png');
```

### Example: sharing inputs across a whole file

```ts
import { test, expect } from './fixtures';
import { baseInputs } from './inputs/base';

test.use({ inputs: baseInputs });

test('game-layout 16x9-1p', async ({ layout }) => {
  await layout.goto('game-layout');
  await expect(layout.page).toHaveScreenshot();
});
```

## Adding new baseline fixtures

Put reusable `LayoutInputs` objects under `tests/visual/inputs/` and import
them from your specs. `inputs/base.ts` is a starting point covering the
most common replicants.

See [`PLACEHOLDERS.md`](./PLACEHOLDERS.md) for a full reference of every
placeholder variable injected at test time (bundleConfig keys, every
replicant and the fields the Vue templates read off them).

## How request interception works

The fixture (`fixtures.ts`) installs `page.route('**/*', ...)` which, for
every request, maps the URL onto a file inside the repo:

- `http://localhost:9090/bundles/esa-layouts/graphics/intermission/main.html`
  → `<repo>/graphics/intermission/main.html`
- `http://localhost:9090/bundles/esa-layouts/shared/dist/assets/foo.js`
  → `<repo>/shared/dist/assets/foo.js`

The fixture also reads the `nodecg.mount` entries from `package.json` and
applies the same `endpoint` → `directory` remapping NodeCG does at runtime:

- `http://localhost:9090/bundles/esa-layouts/flags/us.png`
  → `<repo>/layout_assets/flags/us.png`
- `http://localhost:9090/bundles/esa-layouts/boxart/<file>`
  → `<repo>/boxart/<file>`

So country flags, boxart, and any future mounts render the same way in tests
as they do in a real NodeCG deployment. Add an entry to `nodecg.mount` in
`package.json` and tests will pick it up automatically.

## Troubleshooting

- **Fonts or anti-aliasing cause flaky diffs?** The config sets
  `expect.toHaveScreenshot.threshold` and `maxDiffPixelRatio` to lenient
  defaults; tune them in `playwright.config.ts` if needed.
- **A layout shows an "outdated browser" screen.** The Vite-built HTML
  checks `navigator.userAgent` versions; Playwright's bundled Chromium is
  modern enough. If it does trigger, update the Chromium version
  (`pnpm exec playwright install chromium`).
- **Missing replicant causes a JS error.** Add the missing replicant to
  `inputs/base.ts` (or to the test's inputs).
- **TypeScript errors in tests.** Run `pnpm exec tsc -p tests/visual` to
  type-check the test suite independently.
