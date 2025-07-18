import { Configschema } from '@esa-layouts/types/schemas';
import { wait } from '@esa-layouts/util/helpers';
import type { Tracker } from '@esa-layouts/types';
import { round } from 'lodash';
import type { NeedleResponse } from 'needle';
import needle from 'needle';
import type { DeepWritable } from 'ts-essentials';
import { get as nodecg } from '../util/nodecg';
import { mq } from '../util/rabbitmq';
import { donationTotal } from '../util/replicants';
import { trackerUrl, trackerAdminUrl } from './utils';

export const eventInfo: Tracker.EventInfo[] = [];
const eventConfig = nodecg().bundleConfig.event;
const config = nodecg().bundleConfig.tracker;
const { useTestData } = nodecg().bundleConfig;
let cookies: NeedleResponse['cookies'];
let tiltifyApiBackupTimeout: NodeJS.Timeout | undefined;
const tiltifyApiBackupLength = 5 * 60 * 1000;

/**
 * Returns tracker cookies, if set.
 */
export function getCookies(): NeedleResponse['cookies'] {
  return cookies;
}

/**
 * Translates the short event name into the numerical ID from the tracker, if it exists.
 * @param short Short event name in the tracker.
 */
async function getEventIDFromShort(short: string): Promise<number> {
  const resp = await needle(
    'get',
    trackerUrl(`/api/v2/events/?short=${short}`),
    cookies,
  );

  if (!resp.body.results.length) {
    throw new Error(`Event "${short}" does not exist on the tracker`);
  }

  return resp.body.results[0].id;
}

/**
 * Updates donation total from the API as a backup for the RabbitMQ messages.
 */
async function updateDonationTotalFromAPI(init = false): Promise<void> {
  try {
    let total = 0;
    for (const event of eventInfo) {
      // const resp = await needle('get', trackerUrl(`/event/${event.short}?json`));
      const resp = await needle('get', trackerUrl(`/api/v2/events/${event.id}/?totals=`));
      if (resp.statusCode === 200) {
        const eventTotal = resp.body.amount ? parseFloat(resp.body.amount) : 0;
        event.total = eventTotal;
        total += eventTotal;
      }
    }

    if (init || donationTotal.value < total) {
      total = round(total, 2);
      nodecg().log.info('[Tracker] API donation total changed: $%s', total);
      donationTotal.value = total;
      nodecg().sendMessage('donationTotalUpdated', { total });
    }
  } catch (err) {
    nodecg().log.warn('[Tracker] Error updating donation total from API');
    nodecg().log.debug('[Tracker] Error updating donation total from API:', err);
  }
}

async function updateDonationTotalFromAPITiltify(init = false): Promise<void> {
  try {
    let total = 0;
    // TODO: REMOVE ESAW24 AND URL HARDCODING!
    const resp = await needle('get', 'https://app.esamarathon.com/tiltify/campaigns/team/esaw2024');
    if (resp.statusCode === 200) {
      const eventTotal = resp.body.total_amount_raised.value
        ? parseFloat(resp.body.total_amount_raised.value)
        : 0;
      // event.total = eventTotal; // I hope this isn't important?
      total += eventTotal;
    }
    total = round(total, 2);
    // Wait 10s to just check we're not getting a new total just before a MQ message.
    await wait(10 * 1000);
    if (init || donationTotal.value < total) {
      const oldTotal = donationTotal.value;
      nodecg().sendMessage('donationTotalUpdated', { total });
      nodecg().log.info('[Tracker] API donation total changed: $%s', total);
      donationTotal.value = total;
      // If we checked the donation total on an interval and it was different, the MQ
      // messages may be failing. Using a Discord Webhook to notify someone for ease of use.
      const webhookUrl = nodecg().bundleConfig.tiltify.errorDiscordWebhook;
      const userId = nodecg().bundleConfig.tiltify.errorDiscordWebhookUserIdToPing;
      if (!init && webhookUrl) {
        try {
          await needle(
            'post',
            webhookUrl,
            {
              content: `${userId ? `<@${userId}> ` : ''}There may be an issue with the esa-layouts `
                + 'Tiltify integration with RabbitMQ messages! '
                + `Stored total was ${oldTotal} but API said total was ${total}`
                + ` (sent from stream ${nodecg().bundleConfig.event.thisEvent}`
                + ` at ${(new Date().toISOString())})`,
            },
          );
          nodecg().log.debug('[Tracker] Discord webhook sent');
        } catch (err) {
          nodecg().log.debug('[Tracker] Discord webhook failed:', err);
        }
      }
    }
  } catch (err) {
    nodecg().log.warn('[Tracker] Error updating donation total from API');
    nodecg().log.debug('[Tracker] Error updating donation total from API:', err);
  }
  tiltifyApiBackupTimeout = setTimeout(updateDonationTotalFromAPITiltify, tiltifyApiBackupLength);
}

// Triggered when a donation total is updated in our tracker.
// THIS WORKS EVEN IF TRACKER CONFIG IS DISABLED! WHICH IS GOOD FOR TILTIFY!
mq.evt.on('donationTotalUpdated', (data) => {
  // HARDCODED FOR NOW!
  if (data.event === 'esaw2024') {
    clearInterval(tiltifyApiBackupTimeout);
    tiltifyApiBackupTimeout = setTimeout(
      updateDonationTotalFromAPITiltify,
      tiltifyApiBackupLength,
    );
    const total = round(data.new_total, 2);
    if (donationTotal.value < total) {
      nodecg().sendMessage('donationTotalUpdated', { total });
      nodecg().log.debug(
        '[Tracker] Updated donation total received: $%s',
        total,
      );
      donationTotal.value = total;
    }
  }
});

/*
const seenDonationIds: number[] = [];
// Fully processed donations for donations targeted towards this stream.
mq.evt.on('donationFullyProcessedStream', (data) => {
  // eslint-disable-next-line no-underscore-dangle
  const id = data._id;
  if (!seenDonationIds.includes(id)) {
    seenDonationIds.push(id);
    nodecg().log.debug('[Tracker] Received new donation with ID %s', id);
    nodecg().sendMessage('newDonation', { amount: data.amount });
    if (data.amount >= 20) { // Notable donations are over $20
      notableDonations.value.unshift({
        event: data.event,
        // eslint-disable-next-line no-underscore-dangle
        _id: data._id,
        donor_visiblename: data.donor_visiblename,
        amount: data.amount,
        comment: data.comment,
      });
      notableDonations.value.length = Math.min(notableDonations.value.length, 20);
    }
  }
});
// Fully processed donations for donations targeted towards the main campaign.
// We only listen for this on stream 1.
if (eventConfig.thisEvent === 1) {
  mq.evt.on('donationFullyProcessedTeam', (data) => {
    // eslint-disable-next-line no-underscore-dangle
    const id = data._id;
    if (!seenDonationIds.includes(id)) {
      seenDonationIds.push(id);
      nodecg().log.debug('[Tracker] Received new donation with ID %s', id);
      nodecg().sendMessage('newDonation', { amount: data.amount });
      if (data.amount >= 20) { // Notable donations are over $20
        notableDonations.value.unshift({
          event: data.event,
          // eslint-disable-next-line no-underscore-dangle
          _id: data._id,
          donor_visiblename: data.donor_visiblename,
          amount: data.amount,
          comment: data.comment,
        });
        notableDonations.value.length = Math.min(notableDonations.value.length, 20);
      }
    }
  });
}
*/

// Used to log messages from the browser.
nodecg().listenFor('donationAlertsLogging', (msg) => {
  nodecg().log.info('[Tracker] %s', msg);
});

let isFirstLogin = true;
async function loginToTracker(): Promise<void> {
  if (isFirstLogin) nodecg().log.info('[Tracker] Logging in');
  else nodecg().log.info('[Tracker] Refreshing session');

  const loginURL = trackerAdminUrl('/login/');
  try {
    // Access login page to get CSRF token.
    const resp1 = await needle('get', loginURL);

    if (resp1.statusCode !== 200) {
      throw new Error('Could not access the tracker log in page');
    }

    // POST using the CSRF token alongside the username/password.
    const resp2 = await needle(
      'post',
      loginURL,
      {
        username: config.username,
        password: config.password,
        csrfmiddlewaretoken: (resp1.cookies) ? resp1.cookies.csrftoken : undefined,
      },
      {
        cookies: resp1.cookies,
        headers: {
          referer: loginURL,
        },
      },
    );

    nodecg().log.debug('[Tracker] Login response:', {
      status: resp2.statusCode,
      body: resp2.body,
      headers: resp2.headers,
      cookies: resp2.cookies,
    });

    // If we're not being redirected or there's no session token, the login failed.
    if (resp2.statusCode !== 302 || (resp2.cookies && !resp2.cookies.tracker_session)) {
      throw new Error('Log in was unsuccessful, is your username/password correct?');
    }

    // Store cookie for later use.
    cookies = resp2.cookies;

    if (isFirstLogin) {
      isFirstLogin = false;
      nodecg().log.info('[Tracker] Successfully logged in');
    } else {
      nodecg().log.info('[Tracker] Successfully refreshed session');
    }

    // Tracker logins expire every 2 hours (apparently?). Re-login every 90 minutes.
    setTimeout(loginToTracker, 90 * 60 * 1000);
  } catch (err) {
    // nodecg().log.warn('[Tracker] Error authenticating');
    nodecg().log.error('[Tracker] Error authenticating:', err);
    if (!isFirstLogin) {
      setTimeout(loginToTracker, 60 * 1000);
    } else {
      throw new Error('Could not log in successfully');
    }
  }
}

async function setup(): Promise<void> {
  if (!eventConfig.shorts.length) {
    nodecg().log.warn('[Tracker] No events found in configuration to query for');
    return;
  }
  try {
    nodecg().log.info('[Tracker] Setting up');

    // Log into the tracker first.
    if (!useTestData) await loginToTracker();

    // Go through all events and compile the important info for them.
    const events = (() => {
      const cfg = (eventConfig as DeepWritable<Configschema['event']>).shorts;
      return (Array.isArray(cfg)) ? cfg : [cfg];
    })();
    for (const [index, short] of events.entries()) {
      const id = !useTestData ? await getEventIDFromShort(short) : index + 1;
      eventInfo.push({
        id,
        short,
        total: !useTestData ? 0 : Math.random() * 1000,
      });
    }

    if (!useTestData) {
      // Get initial total from API and set an interval as a fallback.
      updateDonationTotalFromAPI(true);
      setInterval(updateDonationTotalFromAPI, 60 * 1000);
    } else {
      donationTotal.value = eventInfo.reduce((p, e) => p + e.total, 0);
    }

    /* eslint-disable @typescript-eslint/no-var-requires, global-require */
    require('./bids').setup();
    require('./prizes').setup();
    require('./donations').setup();

    // Update the donation total to a random number while testing
    if (useTestData) {
      setInterval(() => {
        let newDonoAmount = donationTotal.value + (Math.random() * 1000);

        if (newDonoAmount > 70_000) {
          newDonoAmount = 0;
        }

        donationTotal.value = newDonoAmount;
        nodecg().sendMessage('donationTotalUpdated', { total: donationTotal.value });
      }, 10 * 1000);
    }
    /* eslint-enable */
  } catch (err) {
    nodecg().log.warn('[Tracker] Error setting up');
    nodecg().log.debug('[Tracker] Error setting up:', err);
  }
}

if (config.enabled) {
  setup();
} else {
  // FOR TILTIFY USE!
  // Get initial total from API (function also sets a timeout as a fallback).
  updateDonationTotalFromAPITiltify(true);
}
