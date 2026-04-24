import { test, expect, LAYOUTS, LayoutName } from './fixtures';
import { baseInputs } from './inputs/base';

/**
 * Smoke + visual regression suite that screenshots every known graphic
 * using the shared `baseInputs`. Add more focused specs alongside this file
 * to exercise individual states (e.g. countdown running, donation alert
 * playing, ...). See `intermission.spec.ts` for an example.
 */

// `game-layout` is covered exhaustively in `game-layout.spec.ts` (one test
// per sub-layout code), so skip it here to avoid duplication.
const layoutNames = (Object.keys(LAYOUTS) as LayoutName[]).filter(
  (n) => n !== 'game-layout',
);

for (const name of layoutNames) {
  const { width, height } = LAYOUTS[name];

  test.describe(`layout: ${name}`, () => {
    test.use({ viewport: { width, height }, inputs: baseInputs });

    test('renders default state', async ({ layout }) => {
      await layout.goto(name);

      // Give any entrance animations / async data fetches a moment to settle.
      await layout.page.waitForLoadState('networkidle');
      await layout.page.waitForTimeout(500);

      await expect(layout.page).toHaveScreenshot(`${name}.png`, {
        fullPage: false,
      });
    });
  });
}
