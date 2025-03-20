import type { Tracker } from '@esa-layouts/types';
import needle from 'needle';
import { eventInfo, getCookies } from '.';
import { get as nodecg } from '../util/nodecg';
import { bids } from '../util/replicants';
import { trackerUrl } from './utils';

const eventConfig = nodecg().bundleConfig.event;
const { useTestData } = nodecg().bundleConfig;
const refreshTime = 30 * 1000; // Get bids every 30s.

// TODO: /bids/tree helps with option mapping
// Processes the response from the API.
function processRawBids(rawBids: Tracker.Bid[]): Tracker.FormattedBid[] {
  const parentBids: { [k: string]: Tracker.FormattedBid } = {};
  const childBids: Tracker.BidChild[] = [];

  rawBids.forEach((bid) => {
    // Ignore denied/pending entries.
    if (bid.state === 'DENIED' || bid.state === 'PENDING') {
      return;
    }

    // If parent is set, this is an option for a bid war.
    if (bid.parent) {
      childBids.push(bid as Tracker.BidChild);
    } else {
      parentBids[bid.id] = {
        description: bid.shortdescription || bid.description || undefined,
        id: bid.id,
        name: bid.name,
        total: bid.total,
        game: '', // TODO: fetch these?
        category: '',
        endTime: bid.close_at
          ? Date.parse(bid.close_at) : undefined,
        war: !bid.istarget,
        allowUserOptions: !bid.istarget && (bid.allowuseroptions ?? false),
        options: [],
        goal: bid.goal || undefined,
      };
    }
  });

  childBids.forEach((bid) => {
    // If we have a parent for this child, add it to the parent.
    if (parentBids[bid.parent]) {
      parentBids[bid.parent].options.push({
        id: bid.id,
        parent: bid.parent,
        name: bid.name,
        total: bid.total,
      });
    }
  });

  // Transfer object made above to an array instead.
  const bidsArray = Object.keys(parentBids).map((bidID) => {
    const bid = parentBids[bidID];
    // Sort bid war options from largest to smallest.
    if (bid.options && bid.options.length) {
      bid.options = bid.options.sort((a, b) => {
        // TODO: revert if we want this
        // if (a.total > b.total) {
        //   return -1;
        // }
        // if (a.total < b.total) {
        //   return 1;
        // }
        // return 0;

        if (a.id > b.id) {
          return 1;
        }

        if (a.id < b.id) {
          return -1;
        }

        return 0;
      });
    }
    return bid;
  });

  // Sort by earliest first.
  bidsArray.sort((a, b) => {
    if (!a.endTime || !b.endTime || a.endTime < b.endTime) {
      return -1;
    }
    if (a.endTime > b.endTime) {
      return 1;
    }
    return 0;
  });

  // Filter out any bid wars with 0 options that don't allow user options.
  bidsArray.filter((bid) => (
    !bid.war || (bid.war && (bid.options.length || !bid.allowUserOptions))
  ));

  return bidsArray;
}

// Get the open bids from the API.
async function updateBids(): Promise<void> {
  try {
    const resp = await needle(
      'get',
      trackerUrl(`/api/v2/events/${eventInfo[eventConfig.thisEvent - 1].id}/bids`
        + '?state=OPENED'),
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

    const currentBids = processRawBids(resp.body.results);

    if (!Array.isArray(currentBids)) {
      throw new Error('currentBids result was non-array type');
    }

    nodecg().log.debug('[Tracker] Updated bids:', JSON.stringify(currentBids));
    bids.value = currentBids;
  } catch (err) {
    nodecg().log.warn('[Tracker] Error updating bids');
    nodecg().log.debug('[Tracker] Error updating bids:', err);
    bids.value.length = 0; // Clear the array so we do not display incorrect information.
  }

  setTimeout(updateBids, refreshTime);
}

// eslint-disable-next-line import/prefer-default-export
export function setup(): void {
  if (!useTestData) {
    updateBids();
  } else {
    // Test Data
    const randGoal = Math.floor(Math.random() * 1000);
    const randBidWarID = Math.floor(Math.random() * 1000);
    const randBidWarAmount = Math.random() * 1000;
    bids.value = [
      {
        id: Math.floor(Math.random() * 1000),
        name: 'Test Goal',
        description: 'This is a test description.',
        total: randGoal / 2,
        goal: randGoal,
        game: 'Test Game',
        category: 'Test Category',
        endTime: Date.now() + 21600000, // Now + 6 hours
        war: false,
        allowUserOptions: false,
        options: [],
      },
      {
        id: randBidWarID,
        name: 'Test Bid War 1',
        description: 'This is a test description.',
        total: randBidWarAmount,
        game: 'Test Game',
        category: 'Test Category',
        endTime: Date.now() + 21600000, // Now + 6 hours
        war: true,
        allowUserOptions: false,
        options: [
          {
            id: Math.floor(Math.random() * 1000),
            parent: randBidWarID,
            name: 'Test Option 1',
            total: randBidWarAmount * 0.3,
          },
          {
            id: Math.floor(Math.random() * 1000),
            parent: randBidWarID,
            name: 'Test Option 2',
            total: randBidWarAmount * 0.7,
          },
        ],
      },
      {
        id: randBidWarID + 1,
        name: 'Test Bid War 2',
        description: 'This is a test description.',
        total: randBidWarAmount,
        game: 'Test Game',
        category: 'Test Category',
        endTime: Date.now() + 21600000, // Now + 6 hours
        war: true,
        allowUserOptions: true,
        options: [
          {
            id: Math.floor(Math.random() * 1000),
            parent: randBidWarID + 1,
            name: 'Test User Option 1',
            total: randBidWarAmount * 0.3,
          },
          {
            id: Math.floor(Math.random() * 1000),
            parent: randBidWarID + 1,
            name: 'Test User Option 2',
            total: randBidWarAmount * 0.7,
          },
        ],
      },
      {
        id: randBidWarID + 2,
        name: 'Test Bid War 3',
        description: 'This is a test description.',
        total: randBidWarAmount,
        game: 'Test Game',
        category: 'Test Category',
        endTime: Date.now() + 21600000, // Now + 6 hours
        war: true,
        allowUserOptions: true,
        options: [
          {
            id: Math.floor(Math.random() * 1000),
            parent: randBidWarID + 1,
            name: 'Test Option 1',
            total: randBidWarAmount * 0.2,
          },
          {
            id: Math.floor(Math.random() * 1000),
            parent: randBidWarID + 1,
            name: 'Test Option 2',
            total: randBidWarAmount * 0.2,
          },
          {
            id: Math.floor(Math.random() * 1000),
            parent: randBidWarID + 1,
            name: 'Test Option 3',
            total: randBidWarAmount * 0.2,
          },
          {
            id: Math.floor(Math.random() * 1000),
            parent: randBidWarID + 1,
            name: 'Test Option 4',
            total: randBidWarAmount * 0.2,
          },
          {
            id: Math.floor(Math.random() * 1000),
            parent: randBidWarID + 1,
            name: 'Test Option 5',
            total: randBidWarAmount * 0.1,
          },
          {
            id: Math.floor(Math.random() * 1000),
            parent: randBidWarID + 1,
            name: 'Test Option 6',
            total: randBidWarAmount * 0.1,
          },
        ],
      },
    ];
  }
}
