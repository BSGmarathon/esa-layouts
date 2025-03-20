import type { Tracker } from '@esa-layouts/types';
import needle from 'needle';
import { get as nodecg } from '../util/nodecg';
import { donationsToRead } from '../util/replicants';
import { eventInfo, getCookies } from './index';
import { trackerUrl } from './utils';

const eventConfig = nodecg().bundleConfig.event;
const { useTestData } = nodecg().bundleConfig;
const refreshTime = 10 * 1000; // Get donations every 10s.
let updateTimeout: NodeJS.Timeout;

function processToReadDonations(donations: Tracker.Donation[]): Tracker.FormattedDonation[] {
  return donations.map((donation) => ({
    id: donation.id,
    name: donation.donor_name,
    amount: donation.amount,
    comment: (donation.commentstate === 'APPROVED') ? donation.comment : undefined,
    timestamp: Date.parse(donation.timereceived),
  })).sort((a, b) => {
    if (a.timestamp < b.timestamp) {
      return -1;
    }
    if (a.timestamp > b.timestamp) {
      return 1;
    }
    return 0;
  });
}

// Get the donations still to be read from the API.
async function updateToReadDonations(): Promise<void> {
  clearTimeout(updateTimeout); // Clear timeout in case this is triggered from a message.
  try {
    const resp = await needle(
      'get',
      // trackerUrl(`/search/?event=${eventInfo[eventConfig.thisEvent - 1].id}`
      //   + '&type=donation&feed=toread'),
      trackerUrl(`/api/v2/events/${eventInfo[eventConfig.thisEvent - 1].id}/donations/unread`),
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

    const currentDonations = processToReadDonations(resp.body.results);

    if (!Array.isArray(currentDonations)) {
      throw new Error('currentDonations result was non-array type');
    }

    donationsToRead.value = currentDonations;
    nodecg().log.debug(
      '[Tracker] donationsToRead updated (IDs: %s)',
      donationsToRead.value.map((d) => d.id).join(', '),
    );
  } catch (err) {
    nodecg().log.warn('[Tracker] Error updating to read donations');
    nodecg().log.debug('[Tracker] Error updating to read donations:', err);
    donationsToRead.value.length = 0; // Clear the array so we do not display incorrect information.
  }

  updateTimeout = setTimeout(updateToReadDonations, refreshTime);
}

/**
 * Attempts to mark the supplied donation ID as read in the tracker.
 * @param donationID ID of the donation in the tracker.
 *
 * TODO: this needs to be updated to use the new API, when BSG starts using it LOL
 */
export async function markDonationAsRead(donationID: number): Promise<void> {
  try {
    const resp = await needle(
      'get',
      trackerUrl(`/edit/?type=donation&id=${donationID}`
        + '&readstate=READ&commentstate=APPROVED'),
      {
        cookies: getCookies(),
      },
    );
    if (resp.statusCode === 200) {
      nodecg().log.info(`[Tracker] Successfully marked donation ${donationID} as read`);
    } else {
      throw new Error(`Status Code ${resp.statusCode}`);
    }
  } catch (err) {
    nodecg().log.warn(`[Tracker] Error marking donation ${donationID} as read`);
    nodecg().log.debug(`[Tracker] Error marking donation ${donationID} as read:`, err);
  }
  updateToReadDonations();
}

export function setup(): void {
  if (!useTestData) {
    updateToReadDonations();
  } else {
    // Test Data
    donationsToRead.value = [
      {
        id: Math.floor(Math.random() * 1000),
        name: 'Anonymous',
        amount: Math.random() * 1000,
        comment: 'This is a test comment.',
        timestamp: Date.now(),
      },
    ];
  }
}
