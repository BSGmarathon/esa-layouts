import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { test as base, expect, Page, Route } from '@playwright/test';

/** Repository root – parent of `tests/`. */
export const REPO_ROOT = path.resolve(__dirname, '..', '..');
const MOCK_SCRIPT_PATH = path.join(__dirname, 'mock-nodecg.js');

/**
 * Load the `nodecg.mount` array from package.json once per worker so we can
 * mirror NodeCG's asset mounts (e.g. `layout_assets/flags` served at
 * `/bundles/esa-layouts/flags`). Each entry maps an `endpoint` prefix to a
 * `directory` inside the repo.
 */
interface NodeCGMount { directory: string; endpoint: string }
let cachedMounts: NodeCGMount[] | null = null;
function getMounts(): NodeCGMount[] {
  if (cachedMounts) return cachedMounts;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const pkg = require(path.join(REPO_ROOT, 'package.json'));
    const mounts: NodeCGMount[] = Array.isArray(pkg?.nodecg?.mount) ? pkg.nodecg.mount : [];
    cachedMounts = mounts;
  } catch {
    cachedMounts = [];
  }
  return cachedMounts;
}

/**
 * The "inputs" that a layout can receive. Everything is optional; anything
 * you don't specify falls back to schema defaults inside the Vue app.
 */
export interface LayoutInputs {
  /** Overrides of the NodeCG `bundleConfig` (see configschema.json). */
  bundleConfig?: Record<string, unknown>;
  /**
   * Replicant values by namespace. Keys are the namespace (`esa-layouts`,
   * `nodecg-speedcontrol`, ...), and within each namespace the replicant
   * name maps to its value. Asset replicants use the `assets:<name>` key.
   *
   * @example
   * replicants: {
   *   'esa-layouts': {
   *     donationTotal: 12345.67,
   *     'assets:media-box-images': [],
   *   },
   *   'nodecg-speedcontrol': {
   *     runDataArray: [...],
   *   },
   * }
   */
  replicants?: Record<string, Record<string, unknown>>;
}

/** List of all graphics shipped by this bundle. Keep in sync with package.json. */
export const LAYOUTS = {
  omnibar: { file: 'graphics/omnibar/main.html', width: 1920, height: 82 },
  countdown: { file: 'graphics/countdown/main.html', width: 1920, height: 1080 },
  intermission: { file: 'graphics/intermission/main.html', width: 1920, height: 1080 },
  'intermission-hosts': { file: 'graphics/intermission-hosts/main.html', width: 1920, height: 1080 },
  'intermission-player': { file: 'graphics/intermission-player/main.html', width: 1920, height: 1080 },
  'unread-donations': { file: 'graphics/unread-donations/main.html', width: 1920, height: 1080 },
  'tts-player': { file: 'graphics/tts-player/main.html', width: 1920, height: 1080 },
  'player-hud': { file: 'graphics/player-hud/main.html', width: 800, height: 480 },
  'lower-third': { file: 'graphics/lower-third/main.html', width: 1920, height: 1080 },
  'media-box-only': { file: 'graphics/media-box-only/main.html', width: 1920, height: 1080 },
  'game-layout': { file: 'graphics/game-layout/main.html', width: 1920, height: 1080 },
} as const;

export type LayoutName = keyof typeof LAYOUTS;

/** Minimal mime map for the assets this bundle ships. */
const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.map': 'application/json; charset=utf-8',
};

function mimeFor(p: string): string {
  return MIME[path.extname(p).toLowerCase()] || 'application/octet-stream';
}

/**
 * Map a request URL to a file on disk within the repo.
 * Returns `null` if no local file is found, so the test can decide what to do.
 */
function resolveRequestPath(urlStr: string): string | null {
  const url = new URL(urlStr);
  // NodeCG-style paths: /bundles/esa-layouts/<whatever>
  let p = url.pathname.replace(/^\/bundles\/esa-layouts\//, '');
  // Strip any leading slashes, remove query fragments.
  p = p.replace(/^\/+/, '');
  if (!p) return null;

  // Apply NodeCG `mount` remaps (e.g. `flags/us.png` -> `layout_assets/flags/us.png`).
  for (const m of getMounts()) {
    const prefix = `${m.endpoint.replace(/^\/+|\/+$/g, '')}/`;
    if (p === m.endpoint || p.startsWith(prefix)) {
      const rest = p.slice(prefix.length);
      p = path.posix.join(m.directory, rest);
      break;
    }
  }

  // Prevent escaping the repo root.
  const resolved = path.resolve(REPO_ROOT, p);
  if (!resolved.startsWith(REPO_ROOT)) return null;
  return resolved;
}

async function tryFulfillFromRepo(route: Route) {
  const request = route.request();
  const localPath = resolveRequestPath(request.url());
  if (!localPath) return route.continue();
  try {
    const body = await readFile(localPath);
    return route.fulfill({
      status: 200,
      headers: {
        'content-type': mimeFor(localPath),
        'cache-control': 'no-store',
      },
      body,
    });
  } catch {
    return route.fulfill({ status: 404, body: `Not found: ${request.url()}` });
  }
}

/**
 * Reasonable defaults that keep graphics happy without a real NodeCG.
 * Extend this in your tests via the `inputs` argument.
 */
export const DEFAULT_BUNDLE_CONFIG = {
  useTestData: true,
  event: {
    theme: 'bsg',
    shorts: 'TEST',
    thisEvent: 1,
    online: false,
  },
  obs: {
    canvasResolution: { width: 1920, height: 1080 },
    names: {},
  },
  music: { enabled: false, address: '', username: '', password: '' },
};

function mergeInputs(a: LayoutInputs, b: LayoutInputs): LayoutInputs {
  return {
    bundleConfig: { ...(a.bundleConfig ?? {}), ...(b.bundleConfig ?? {}) },
    replicants: mergeReplicants(a.replicants, b.replicants),
  };
}

function mergeReplicants(
  a: LayoutInputs['replicants'],
  b: LayoutInputs['replicants'],
): LayoutInputs['replicants'] {
  const out: NonNullable<LayoutInputs['replicants']> = {};
  for (const src of [a, b]) {
    if (!src) continue;
    for (const [ns, reps] of Object.entries(src)) {
      out[ns] = { ...(out[ns] ?? {}), ...reps };
    }
  }
  return out;
}

/** Read the mock script once per worker – it's pure JS we inject into pages. */
let cachedMockScript: string | null = null;
async function getMockScript(): Promise<string> {
  if (!cachedMockScript) cachedMockScript = await readFile(MOCK_SCRIPT_PATH, 'utf8');
  return cachedMockScript;
}

export interface NodeCGPage {
  /** Underlying Playwright page. */
  page: Page;
  /** Configure inputs *before* navigating. Merges with defaults. */
  setInputs(inputs: LayoutInputs): Promise<void>;
  /** Navigate to a layout by name (or path) and wait for it to render. */
  goto(layout: LayoutName | string, inputs?: LayoutInputs): Promise<void>;
  /**
   * Update a replicant value at runtime (after the page has loaded) and
   * fire its `change` listeners. Useful to test transitions/animations.
   */
  setReplicant(name: string, namespace: string, value: unknown): Promise<void>;
}

export const test = base.extend<{ layout: NodeCGPage; inputs: LayoutInputs }>({
  /** Baseline inputs. Override per-test: `test.use({ inputs: { ... } })`. */
  inputs: [{}, { option: true }],

  layout: async ({ page, inputs }, use) => {
    let currentInputs: LayoutInputs = mergeInputs(
      { bundleConfig: DEFAULT_BUNDLE_CONFIG },
      inputs,
    );

    // Intercept every request and serve from the repo's filesystem.
    await page.route('**/*', tryFulfillFromRepo);

    const mockScript = await getMockScript();

    async function installInitScripts() {
      // Order matters: first expose the configured state globals, then the shim.
      await page.addInitScript((serialised) => {
        // @ts-expect-error – attaching to window for the mock to read.
        window.__NODECG_MOCK__ = JSON.parse(serialised);
      }, JSON.stringify({
        bundleName: 'esa-layouts',
        bundleConfig: currentInputs.bundleConfig ?? {},
        replicants: currentInputs.replicants ?? {},
      }));
      await page.addInitScript({ content: mockScript });
    }

    const api: NodeCGPage = {
      page,
      async setInputs(newInputs) {
        currentInputs = mergeInputs(currentInputs, newInputs);
      },
      async goto(layout, extra) {
        if (extra) currentInputs = mergeInputs(currentInputs, extra);
        // Re-install init scripts after each input change – `addInitScript`
        // appends, so we start from a clean page context.
        await installInitScripts();

        const def = (LAYOUTS as Record<string, { file: string }>)[layout as string];
        // Fallback: treat unregistered names as `graphics/<name>/main.html` so
        // `layout.goto('foo')` works even if we forgot to add it to `LAYOUTS`.
        const relFile = def?.file
          ?? (/\.html?$/.test(layout as string) || String(layout).includes('/')
            ? (layout as string)
            : `graphics/${layout}/main.html`);
        const url = `http://localhost:9090/bundles/esa-layouts/${relFile}`;
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.waitForFunction(
          () => !!document.querySelector('#app')?.children.length,
          undefined,
          { timeout: 10_000 },
        ).catch(() => { /* some layouts render outside #app; ignore */ });
      },
      async setReplicant(name, namespace, value) {
        await page.evaluate(
          ({ n, ns, v }) => {
            const ncg = (window as unknown as { nodecg: { __setReplicant: Function } }).nodecg;
            ncg.__setReplicant(n, ns, v);
          },
          { n: name, ns: namespace, v: value },
        );
      },
    };

    await use(api);
  },
});

export { expect };
