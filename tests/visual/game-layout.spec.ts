import { test, expect } from './fixtures';
import {
  baseInputs,
  demoRunRace2p,
  demoRunRace3p,
  demoRunSolo,
} from './inputs/base';

/**
 * The `game-layout` graphic is special: a single page that renders one of
 * ~26 sub-layouts depending on the `gameLayouts.selected` replicant (Vue
 * Router picks the component by code). This spec snapshots every option
 * exposed in the dashboard's "Game Layout Override" radio group so we
 * catch visual regressions in any of them.
 */

/** Layout codes, must match the `value` attributes of the radio group. */
export const GAME_LAYOUT_CODES = [
  '4x3-1p',
  '4x3-2p',
  '16x9-2p-c',
  '4x3-3p',
  '16x9-1p',
  '16x9-1p-largecam',
  '16x9-2p',
  '16x9-1p-bingo',
  '16x9-2p-bingo',
  '16x9-3p',
  '9x16-1p-2cams',
  'GB-1p',
  'GB-2p',
  'GBA-1p',
  'GBA-2p',
  '3DS-1p',
  '3DSV-1p',
  '3DS-2p',
  'DS-1p',
  'DSV-1p',
  'DS-2p',
  'full-cam',
  '16x9-1p-uksg',
  '16x9-2p-uksg',
  '4x3-1p-uksg',
  '4x3-2p-uksg',
] as const;

/**
 * Pick a run shape with enough teams / players to populate the given layout
 * code. "1p" -> solo, "2p" -> 2-team race, "3p" -> 3-team race, everything
 * else (full-cam, etc.) falls back to the default 3-team race.
 */
function runForCode(code: string) {
  if (/(^|[-/])1p(\b|[-/])/i.test(code)) return demoRunSolo;
  if (/(^|[-/])2p(\b|[-/])/i.test(code)) return demoRunRace2p;
  if (/(^|[-/])3p(\b|[-/])/i.test(code)) return demoRunRace3p;
  return demoRunRace3p;
}

test.describe('game-layout – all layout codes', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  for (const code of GAME_LAYOUT_CODES) {
    test(`renders ${code}`, async ({ layout }) => {
      const run = runForCode(code);

      await layout.goto('game-layout', {
        ...baseInputs,
        replicants: {
          ...baseInputs.replicants,
          'esa-layouts': {
            ...baseInputs.replicants?.['esa-layouts'],
            gameLayouts: { available: [], selected: code, crowdCamera: false },
          },
          'nodecg-speedcontrol': {
            ...baseInputs.replicants?.['nodecg-speedcontrol'],
            runDataActiveRun: run,
          },
        },
      });

      // Give the Vue Router push + layout swap + fonts a moment to settle.
      await layout.page.waitForLoadState('networkidle');
      await layout.page.waitForFunction(
        (expected) => window.location.hash.replace(/^#\//, '') === expected,
        code,
        { timeout: 5_000 },
      ).catch(() => { /* some codes redirect; tolerate */ });
      await layout.page.waitForTimeout(500);

      // File-safe snapshot name (Windows disallows ':' etc. – codes are already safe).
      await expect(layout.page).toHaveScreenshot(`game-layout-${code}.png`);
    });
  }
});
