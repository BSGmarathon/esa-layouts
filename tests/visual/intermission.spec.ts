import { test, expect } from './fixtures';
import { baseInputs } from './inputs/base';

/**
 * Example spec showing how to configure inputs per-scenario and take
 * multiple screenshots of the same layout in different states.
 */
test.describe('intermission – scenarios', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('high donation total', async ({ layout }) => {
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

    await layout.page.waitForTimeout(500);
    await expect(layout.page).toHaveScreenshot('intermission-high-total.png');
  });

  test('reacts to runtime replicant updates', async ({ layout }) => {
    await layout.goto('intermission', baseInputs);

    // Change the donation total after the page loaded – listeners fire.
    await layout.setReplicant('donationTotal', 'esa-layouts', 42);
    await layout.page.waitForTimeout(250);

    await expect(layout.page).toHaveScreenshot('intermission-donation-42.png');
  });
});
