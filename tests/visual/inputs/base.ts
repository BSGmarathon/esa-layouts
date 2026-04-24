import type { LayoutInputs } from '../fixtures';

/**
 * Baseline replicant / bundleConfig values shared across most tests.
 *
 * These are the "placeholder variables" injected into the Vue layouts when
 * Playwright runs – see `tests/visual/PLACEHOLDERS.md` for a field-by-field
 * description of what each of these feeds.
 *
 * Extend or override in individual test specs via `layout.goto(name,
 * { replicants: { ... } })` or `test.use({ inputs: { ... } })`.
 */

const FIXED_ISO = '2026-01-01T12:00:00.000Z';
const FIXED_UNIX_MS = new Date(FIXED_ISO).getTime();
const FIXED_UNIX_S = Math.floor(FIXED_UNIX_MS / 1000);

/** A single reusable player record used to compose teams. */
function makePlayer(i: number, opts: {
  twitch?: string;
  youtube?: string;
  country: string;
  pronouns: string;
  name: string;
}) {
  return {
    id: `p${i}`,
    name: opts.name,
    teamID: `t${i}`,
    country: opts.country,
    pronouns: opts.pronouns,
    social: {
      twitch: opts.twitch,
      ...(opts.youtube ? { youtube: opts.youtube } : {}),
    },
  };
}

const runner1 = makePlayer(1, { name: 'Runner One', twitch: 'runner_one', country: 'us', pronouns: 'they/them' });
const runner2 = makePlayer(2, { name: 'Runner Two', twitch: 'runner_two', country: 'nl', pronouns: 'she/her' });
const runner3 = makePlayer(3, { name: 'Runner Three', twitch: 'runner_three', country: 'se', pronouns: 'he/him' });

const raceTeams = [
  { id: 't1', name: 'Team Alpha', players: [runner1] },
  { id: 't2', name: 'Team Bravo', players: [runner2] },
  { id: 't3', name: 'Team Charlie', players: [runner3] },
];

/**
 * Default active run: a 3-way race (3 teams, 1 player each). This populates
 * slot 0 / 1 / 2 for the `game-layout`'s `Player` component, so 1P, 2P *and*
 * 3P layouts all render meaningfully out of the box.
 */
export const demoRunRace3p = {
  id: '1',
  game: 'Placeholder Quest',
  gameTwitch: 'Placeholder Quest',
  system: 'PC',
  region: 'USA',
  release: '2026',
  category: 'Any%',
  estimate: '00:30:00',
  estimateS: 1800,
  setupTime: '00:05:00',
  setupTimeS: 300,
  scheduled: FIXED_ISO,
  scheduledS: FIXED_UNIX_S,
  teams: raceTeams,
};

/** 2-team race variant. */
export const demoRunRace2p = {
  ...demoRunRace3p,
  id: '2',
  teams: raceTeams.slice(0, 2),
};

/** 1-team / 1-player variant – useful for specs that want a single runner. */
export const demoRunSolo = {
  ...demoRunRace3p,
  id: '3',
  teams: raceTeams.slice(0, 1),
};

/** Co-op: one team, multiple players – use for `coop` layouts if needed. */
export const demoRunCoop2p = {
  ...demoRunRace3p,
  id: '4',
  teams: [
    {
      id: 't1',
      name: 'Co-op Team',
      players: [runner1, runner2],
    },
  ],
};

export const demoRunCoop3p = {
  ...demoRunRace3p,
  id: '5',
  teams: [
    {
      id: 't1',
      name: 'Co-op Team',
      players: [runner1, runner2, runner3],
    },
  ],
};

const upcomingRun = {
  ...demoRunRace3p,
  id: '10',
  game: 'Next Up Game',
  gameTwitch: 'Next Up Game',
  category: '100%',
  system: 'SNES',
  release: '1994',
  estimate: '01:00:00',
  estimateS: 3600,
  scheduled: '2026-01-01T12:35:00.000Z',
  scheduledS: Math.floor(new Date('2026-01-01T12:35:00.000Z').getTime() / 1000),
  teams: [
    { id: 't10', name: 'Team Delta', players: [makePlayer(4, { name: 'Runner Four', twitch: 'runner_four', country: 'jp', pronouns: 'they/them' })] },
  ],
};

export const baseInputs: LayoutInputs = {
  bundleConfig: {
    useTestData: true,
    event: { theme: 'bsg', shorts: 'TEST', thisEvent: 1, online: false },
    obs: {
      canvasResolution: { width: 1920, height: 1080 },
      names: {},
    },
    music: { enabled: false, address: '', username: '', password: '' },
  },
  replicants: {
    'esa-layouts': {
      donationTotal: 12_345.67,
      donationTotalMilestones: [],
      upcomingRunID: '10',
      mediaBox: {
        current: null,
        paused: null,
        rotation: [],
        rotationApplicable: [],
        alertQueue: [],
        lastIndex: 0,
      },
      // Host (donationReaderNew) + two commentators. The game-layout shows
      // the reader in the "HOST" strip and commentators in the "COMM" strip.
      donationReaderNew: { name: 'Host Hanna', country: 'gb', pronouns: 'she/her' },
      commentatorsNew: [
        { name: 'Comm Casey', country: 'us', pronouns: 'they/them' },
        { name: 'Comm Chris', country: 'de', pronouns: 'he/him' },
      ],
      countdown: { remaining: 600_000, originalDuration: 3_600_000, timestamp: 0 },
      omnibar: {
        current: { type: 'UpcomingRun', id: 'upcoming-run-1' },
        rotation: [],
        alertQueue: [],
        pin: null,
        miniCredits: { runSubs: [], runCheers: [], runDonations: [] },
      },
      bigbuttonPlayerMap: {},
      bids: [],
      prizes: [],
      musicData: {
        connected: false,
        playing: false,
        track: { title: '', artist: '', position: 0, duration: 0 },
      },
      currentRunDelay: { audio: 0, video: 0 },
      delayedTimer: {
        state: 'stopped',
        time: '00:00:00',
        milliseconds: 0,
        timestamp: 0,
        teamFinishTimes: {},
      },
      donationAlerts: [],
      donationsToRead: [],
      fullScreenVideoPlayer: {
        playlist: [],
        finishScene: 'intermission',
        current: null,
        playing: false,
        estimatedFinishTimestamp: 0,
        plays: {},
      },
      gameLayouts: { available: [], selected: '16x9-1p', crowdCamera: false },
      intermissionSlides: { rotation: [], current: null },
      lowerThird: { visible: false, transitioning: false, names: [] },
      nameCycle: 0,
      notableDonations: [],
      obsData: {
        connected: false,
        scene: '',
        sceneList: [],
        transitioning: false,
        streaming: false,
        disableTransitioning: false,
        transitionTimestamp: 0,
      },
      otherStreamData: { show: false, runData: null },
      readerIntroduction: { current: null },
      serverTimestamp: FIXED_UNIX_MS,
      soloedBidID: null,
      streamDeckData: {},
      ttsVoices: { available: [] },
      videoPlayer: {
        playlist: [],
        current: null,
        playing: false,
        estimatedFinishTimestamp: 0,
        plays: {},
      },
      additionalDonations: [],
      'assets:donation-alert-assets': [],
      'assets:intermission-slides': [],
      'assets:media-box-images': [],
      'assets:reader-introduction-images': [],
      'assets:videos': [],
    },
    'nodecg-speedcontrol': {
      runDataArray: [demoRunRace3p, upcomingRun],
      runDataActiveRun: demoRunRace3p,
      runDataActiveRunSurrounding: { previous: null, current: '1', next: '10' },
      timer: {
        state: 'stopped',
        time: '00:00:00',
        milliseconds: 0,
        timestamp: 0,
        teamFinishTimes: {},
      },
      twitchCommercialTimer: { originalDuration: 0, secondsRemaining: 0, timestamp: 0 },
      runFinishTimes: {},
      timerChangesDisabled: false,
    },
  },
};
