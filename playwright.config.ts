import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for visual regression testing of the
 * esa-layouts NodeCG graphics.
 *
 * No real NodeCG server is started: tests serve the bundle's built assets
 * via request interception and inject a mock `window.nodecg` client whose
 * replicants are populated from per-test input fixtures. See
 * `tests/visual/README.md` for details.
 */
export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],

  /**
   * OS-agnostic snapshot filenames. Playwright's default template appends
   * the current `{platform}` (e.g. `-linux`, `-darwin`, `-win32`) so that
   * baselines don't collide between machines whose font rendering differs.
   * We intentionally drop `{platform}` so developers on Linux / macOS /
   * Windows all share the *same* baseline image. To keep that viable the
   * `toHaveScreenshot` threshold below is somewhat lenient – tweak the
   * diff numbers if you see flakiness.
   */
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}',

  /* Visual regression expectations. Tune to your liking. */
  expect: {
    toHaveScreenshot: {
      // Tiny differences should not fail the build (anti-aliasing, fonts, etc.)
      maxDiffPixelRatio: 0.02,
      threshold: 0.25,
      animations: 'disabled',
      caret: 'hide',
    },
  },

  use: {
    // Dummy base URL – actual requests are intercepted in the fixtures.
    baseURL: 'http://localhost:9090',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    colorScheme: 'light',
    locale: 'en-GB',
    timezoneId: 'Europe/Amsterdam',
  },

  projects: [
    {
      name: 'chromium-1920x1080',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
      },
    },
  ],
});
