import type { Tracker } from '@esa-layouts/types';
import needle from 'needle';
import { eventInfo, getCookies } from '.';
import { get as nodecg } from '../util/nodecg';
import { prizes } from '../util/replicants';
import { trackerUrl } from './utils';

const { useTestData } = nodecg().bundleConfig;
const refreshTime = 60 * 1000; // Get prizes every 60s.

// Processes the response from the API above.
function processRawPrizes(rawPrizes: Tracker.Prize[]): Tracker.FormattedPrize[] {
  // Somehow the the state is gone LMAO
  return rawPrizes/* .filter((prize) => prize.fields.state === 'ACCEPTED') */.map((prize) => {
    const startTime = prize.starttime;
    const endTime = prize.endtime;
    return {
      id: prize.id,
      name: prize.name,
      provided: prize.provider || undefined,
      minimumBid: prize.minimumbid,
      image: prize.altimage || prize.image || undefined,
      startTime: startTime ? Date.parse(startTime) : undefined,
      endTime: endTime ? Date.parse(endTime) : undefined,
    };
  });
}

// Get the prizes from the API.
// We always get these from the first listed event, in the case of multiple tracker events.
async function updatePrizes(): Promise<void> {
  try {
    const resp = await needle(
      'get',
      // trackerUrl(`/search/?event=${eventInfo[0].id}&type=prize&feed=current`),
      trackerUrl(`/api/v2/events/${eventInfo[0].id}/prizes/?feed=current`),
      {
        cookies: getCookies(),
      },
    );

    if (!resp.statusCode || resp.statusCode >= 300 || resp.statusCode < 200) {
      throw new Error(`status code ${resp.statusCode ?? 'unknown'}`);
    }

    if (!Array.isArray(resp.body.results)) {
      throw new Error('received non-array type');
    }

    const currentPrizes = processRawPrizes(resp.body.results);

    if (!Array.isArray(currentPrizes)) {
      throw new Error('currentPrizes result was non-array type');
    }

    prizes.value = currentPrizes;
  } catch (err) {
    nodecg().log.warn('[Tracker] Error updating prizes');
    nodecg().log.debug('[Tracker] Error updating prizes:', err);
    prizes.value.length = 0; // Clear the array so we do not display incorrect information.
  }

  setTimeout(updatePrizes, refreshTime);
}

// eslint-disable-next-line import/prefer-default-export
export function setup(): void {
  if (!useTestData) {
    updatePrizes()
      .catch((e) => nodecg().log.error('Failed to update prizes:', e));
  } else {
    // Test Data
    prizes.value = [
      {
        id: 624,
        name: 'Test Prize Name (Old)',
        provided: 'Anonymous',
        minimumBid: Math.floor(Math.random() * 50),
        // eslint-disable-next-line max-len
        image: 'https://web.archive.org/web/20100620045843/https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
        startTime: Date.now() - 43200000, // Now - 12 hours
        endTime: Date.now() - 21600000, // Now + 6 hours
      },
      {
        id: 32,
        name: 'Test Prize Name (Active)',
        provided: 'Anonymous',
        minimumBid: Math.floor(Math.random() * 50),
        // eslint-disable-next-line max-len
        image: 'https://web.archive.org/web/20100620045843/https://homepages.cae.wisc.edu/~ece533/images/cat.png',
        startTime: Date.now(),
        endTime: Date.now() + 21600000, // Now + 6 hours
      },
      {
        id: 878,
        name: 'Test Prize Name (Future)',
        provided: 'Anonymous',
        minimumBid: Math.floor(Math.random() * 50),
        // eslint-disable-next-line max-len
        image: 'https://web.archive.org/web/20100620045843/https://homepages.cae.wisc.edu/~ece533/images/tulips.png',
        startTime: Date.now() + 21600000, // Now + 6 hours
        endTime: Date.now() + 43200000, // Now + 12 hours
      },
    ];
  }
}
