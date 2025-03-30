import type { Tracker } from '@esa-layouts/types';
import needle from 'needle';
import { get as nodecg } from '../util/nodecg';
import { eventInfo, getCookies } from './index';
import { trackerUrl } from './utils';

let speedrunCache: { [key: number]: Tracker.Speedrun } = {};

async function updateSpeedrunCache(): Promise<void> {
  try {
    const resp = await needle(
      'get',
      trackerUrl(`/api/v2/events/${eventInfo[0].id}/runs/`),
      {
        cookies: getCookies(),
      },
    );

    if (!resp.statusCode || resp.statusCode >= 300 || resp.statusCode < 200) {
      throw new Error(`status code ${resp.statusCode ?? 'unknown'} for speedrun fetch`);
    }

    if (!Array.isArray(resp.body.results)) {
      throw new Error('received non-array type');
    }

    const speedruns = resp.body.results as Tracker.Speedrun[];
    speedrunCache = {};

    speedruns.forEach((speedrun) => {
      speedrunCache[speedrun.id] = speedrun;
    });
  } catch (err) {
    nodecg().log.warn('[Tracker] Error updating speedrun cache');
    nodecg().log.debug('[Tracker] Error updating speedrun cache:', err);
  }
}

// eslint-disable-next-line import/prefer-default-export
export async function getSpeedrun(runId: number): Promise<Tracker.Speedrun> {
  if (!(runId in speedrunCache)) {
    await updateSpeedrunCache();
  }

  return speedrunCache[runId];
}
