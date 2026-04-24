# Placeholder variables injected during Playwright

When a Playwright test runs, `tests/visual/fixtures.ts` installs the mock in
`tests/visual/mock-nodecg.js` into the page **before** any bundle script
loads. The mock reads a single object, `window.__NODECG_MOCK__`, and uses it
to satisfy every `nodecg.bundleConfig` read and every `nodecg.Replicant()`
call made by the Vue layouts.

The defaults below come from
[`tests/visual/inputs/base.ts`](./inputs/base.ts) (`baseInputs`). Any test
can override any subset of these via `layout.goto(name, inputs)` or
`test.use({ inputs })`.

> Tip: `window.__NODECG_MOCK__` is still readable in the DevTools console
> when debugging a test with `pnpm test:visual:ui`.

---

## 1. `nodecg.bundleConfig`

Consumed by the graphics directly through `nodecg.bundleConfig.*`. The
layouts mostly use it for styling/resolution decisions, not display text.

| Path                        | Placeholder                                   | Used by (examples)                                   |
| --------------------------- | --------------------------------------------- | ---------------------------------------------------- |
| `useTestData`               | `true`                                        | Various helpers that short-circuit live-only checks  |
| `event.theme`               | `"bsg"`                                       | `_misc/helpers.ts`, CSS theme picks                  |
| `event.shorts`              | `"TEST"`                                      | Hashtag / branding strings                           |
| `event.thisEvent`           | `1`                                           | Conditional event-specific widgets                   |
| `event.online`              | `false`                                       | Online-only vs on-site behaviour                     |
| `obs.canvasResolution.width`  | `1920`                                      | `game-layout` zoom calc (`getZoomAmountCSS`)         |
| `obs.canvasResolution.height` | `1080`                                      | `game-layout` zoom calc (`getZoomAmountCSS`)         |
| `obs.names`                 | `{}`                                          | Scene name lookup                                    |
| `music.enabled`             | `false`                                       | Music ticker guard                                   |
| `music.address`             | `""`                                          | Music source                                         |
| `music.username`            | `""`                                          | Music source                                         |
| `music.password`            | `""`                                          | Music source                                         |

---

## 2. Replicants — namespace `esa-layouts`

Field lists below only call out the keys the Vue templates actually read.
Anything not listed is still provided as `{}` / `[]` / `null` so schema-
required fields are present but do not display text.

### `donationTotal` — `number`
**Placeholder:** `12345.67`
**Consumed by:** `omnibar/components/Total.vue`, intermission totals,
unread-donations.

### `donationTotalMilestones` — `array`
**Placeholder:** `[]` (no milestones rendered)
**Item fields the templates read:** `id`, `name`, `enabled`, `amount`,
`addition`.

### `upcomingRunID` — `string | null`
**Placeholder:** `"1"` (matches `runDataArray[0].id`)
**Consumed by:** omnibar upcoming-run slot, intermission schedule.

### `mediaBox` — `object`
**Placeholder:**
```ts
{ current: null, paused: null, rotation: [], rotationApplicable: [],
  alertQueue: [], lastIndex: 0 }
```
**Fields used in templates:** `current.type`, `current.id`,
`current.mediaUUID`, `current.index`, `current.timestamp`,
`current.timeElapsed`, `alertQueue[].type`, `alertQueue[].data.name`,
`alertQueue[].data.amount`, `alertQueue[].data.comment`,
`alertQueue[].data.systemMsg`, `alertQueue[].data.message`,
`alertQueue[].data.user`, `alertQueue[].data.productName`,
`alertQueue[].data.imgURL`, `alertQueue[].data.msg`.

### `commentatorsNew` — `array`
**Placeholder:**
```ts
[
  { name: 'Comm Casey', country: 'us', pronouns: 'they/them' },
  { name: 'Comm Chris', country: 'de', pronouns: 'he/him' },
]
```
**Item fields used:** `name`, `country`, `pronouns` (rendered in the
game-layout's `COMM` strip by `CommentatorsScrolling.vue` /
`CommentatorsReader.vue`).

### `countdown` — `object`
**Placeholder:** `{ remaining: 600000, originalDuration: 3600000, timestamp: 0 }`
**Fields used:** `remaining` (ms → formatted) in
`countdown/components/Countdown.vue`.

### `omnibar` — `object`
**Placeholder:**
```ts
{
  current: { type: 'UpcomingRun', id: 'upcoming-run-1' },
  rotation: [], alertQueue: [], pin: null,
  miniCredits: { runSubs: [], runCheers: [], runDonations: [] },
}
```
**Fields used in templates:** `current.type` (enum `GenericMsg` /
`UpcomingRun` / `Prize` / `Bid` / `Milestone` / `MusicTrack` / `Tweet` /
`CrowdControl` / `MiniCredits`), `current.id`, `current.props.*`,
`pin.type`, `pin.id`, `miniCredits.runSubs/runCheers/runDonations`.

### `bigbuttonPlayerMap` — `object`
**Placeholder:** `{}`
**Shape:** `{ [tagId]: Array<{ flagcarrier, user.displayName, raw }> }`

### `bids` — `array`
**Placeholder:** `[]`
**Item fields used:** `id`, `name`, `description`, `total`, `goal`,
`war`, `allowUserOptions`, `options[].id`, `options[].name`,
`options[].total`, `endTime` (omnibar bid / war / goal tickers).

### `prizes` — `array`
**Placeholder:** `[]`
**Item fields used:** `id`, `name`, `provided`, `minimumBid`, `image`,
`startTime`, `endTime` (intermission prize slide, omnibar prize ticker).

### `musicData` — `object`
**Placeholder:** `{ connected: false, playing: false, track: { title: '', artist: '', position: 0, duration: 0 } }`
**Fields used:** `playing`, `track.title`, `track.artist` (omnibar
`MusicTrack.vue`).

### `currentRunDelay` — `object`
**Placeholder:** `{ audio: 0, video: 0 }`
**Fields used:** audio/video delay display (player-hud, intermission).

### `delayedTimer` — `Timer`
**Placeholder:** `{ state: 'stopped', time: '00:00:00', milliseconds: 0, timestamp: 0, teamFinishTimes: {} }`

### `donationAlerts` — `array` — **Placeholder:** `[]`
### `donationReaderNew` — `object` (the **host**)
**Placeholder:** `{ name: 'Host Hanna', country: 'gb', pronouns: 'she/her' }`
**Fields used:** `name`, `country`, `pronouns`. Rendered in the
game-layout's `HOST` strip (`CommentatorsReader.vue` with
`showReader: true`) and in `intermission/components/DonationReader.vue`.

### `donationsToRead` — `array`
**Placeholder:** `[]`
**Item fields used:** `id`, `name`, `amount`, `comment`, `timestamp`
(unread-donations graphic).

### `fullScreenVideoPlayer` — `object`
**Placeholder:** `{ playlist: [], current: null, playing: false, estimatedFinishTimestamp: 0, plays: {}, finishScene: 'intermission' }`

### `gameLayouts` — `object`
**Placeholder:** `{ available: [], selected: '16x9-1p', crowdCamera: false }`
**Fields used:** `selected` controls which sub-layout `game-layout`
renders (see `game-layout.spec.ts` for all 26 codes).

### `intermissionSlides` — `object`
**Placeholder:** `{ rotation: [], current: null }`
**Fields used:** `current.type` (`UpcomingRuns` | `RandomBid` |
`RandomPrize` | `Media`), `current.bidId`, `current.prizeId`.

### `lowerThird` — `object`
**Placeholder:** `{ visible: false, transitioning: false, names: [] }`
**Fields used:** `visible`, `names` — lower-third graphic.

### `notableDonations` — `array`
**Placeholder:** `[]`
**Item fields used:** `_id`, `donor_visiblename`, `amount`, `comment`,
`time_received`.

### `nameCycle` — `number`
**Placeholder:** `0`
**Consumed by:** `game-layout/components/Player.vue` — `0` shows player
name, `1` shows Twitch/YouTube handle.

### `obsData` — `object`
**Placeholder:** `{ connected: false, scene: '', sceneList: [], transitioning: false, streaming: false, disableTransitioning: false, transitionTimestamp: 0 }`

### `otherStreamData` — `object`
**Placeholder:** `{ show: false, runData: null }`

### `readerIntroduction` — `object`
**Placeholder:** `{ current: null }`
**Fields used:** `current` (`"RunInfo"` / asset name / `null`).

### `serverTimestamp` — `number`
**Placeholder:** `1767276000000` (=`2026-01-01T12:00:00Z`)

### `soloedBidID` — `number | null` — **Placeholder:** `null`

### `streamDeckData` — `object`
**Placeholder:** `{}`
**Fields used:** `playerHUDTriggerType`.

### `ttsVoices` — `object`
**Placeholder:** `{ available: [] }`

### `videoPlayer` — `object`
**Placeholder:** `{ playlist: [], current: null, playing: false, estimatedFinishTimestamp: 0, plays: {} }`

### `additionalDonations` — `array`
**Placeholder:** `[]`
**Item fields used:** `key`, `active`.

### Asset replicants (inside `esa-layouts`)

Exposed through `useAssetReplicant(...)`. Mocked as empty arrays so image
lookups return nothing and the graphics fall back to placeholders:

- `assets:donation-alert-assets`
- `assets:intermission-slides`
- `assets:media-box-images`
- `assets:reader-introduction-images`
- `assets:videos`

Each asset item has the usual NodeCG shape:
`{ name, ext, url, sum, category, namespace, base }`.

---

## 3. Replicants — namespace `nodecg-speedcontrol`

### `runDataArray` — `RunData[]`
**Placeholder:** 2 demo runs – the current 3-team race (`id: '1'`,
`game: 'Placeholder Quest'`) and an upcoming solo run
(`id: '10'`, `game: 'Next Up Game'`). Each run carries:

- `game`, `gameTwitch`, `category`, `system`, `region`, `release`,
  `estimate`, `estimateS`, `setupTime`, `setupTimeS`, `scheduled`,
  `scheduledS`.
- `teams[].id`, `teams[].name`, `teams[].relayPlayerID`.
- `teams[].players[].id`, `name`, `teamID`, `country`, `pronouns`,
  `social.twitch`, `social.youtube`.

Displayed by `game-layout/components/RunInfo.vue` and `Player.vue`
(game name, category, system, release, estimate, team name, player
name/Twitch/country flag/pronouns).

### `runDataActiveRun` — `RunData | null`
**Placeholder:** the 3-team race run (`demoRunRace3p`) — three teams with
one player each (`Runner One/us/they-them`, `Runner Two/nl/she-her`,
`Runner Three/se/he-him`). This fills slots 0, 1 *and* 2 so 1P, 2P and
3P `game-layout` variants all render populated out of the box.

`inputs/base.ts` also exports these preset run shapes for specs that
need a specific number of players:

| Export | Teams × players | Good for |
| --- | --- | --- |
| `demoRunSolo` | 1 × 1 | `*-1p` layouts |
| `demoRunRace2p` | 2 × 1 | `*-2p` race layouts |
| `demoRunRace3p` | 3 × 1 | `*-3p` layouts (default) |
| `demoRunCoop2p` | 1 × 2 | 2-player co-op |
| `demoRunCoop3p` | 1 × 3 | 3-player co-op |

`game-layout.spec.ts` auto-picks the right one per layout code
(`1p → Solo`, `2p → Race2p`, `3p → Race3p`).

### `runDataActiveRunSurrounding` — `object`
**Placeholder:** `{ previous: null, current: '1', next: '2' }`

### `timer` — `Timer`
**Placeholder:** `{ state: 'stopped', time: '00:00:00', milliseconds: 0, timestamp: 0, teamFinishTimes: {} }`
Displayed by `game-layout/uksg/components/TimerElem.vue`.

### `twitchCommercialTimer` — `object`
**Placeholder:** `{ originalDuration: 0, secondsRemaining: 0, timestamp: 0 }`

---

## 4. Injection mechanism (one-line summary)

```ts
window.__NODECG_MOCK__ = {
  bundleName: 'esa-layouts',
  bundleConfig: baseInputs.bundleConfig,
  replicants: baseInputs.replicants,
};
// mock-nodecg.js then builds window.nodecg around this object.
```

When the layouts call `nodecg.Replicant('donationTotal', 'esa-layouts')`,
they get back a replicant whose `.value` is the placeholder from the
table above, and whose `.on('change', fn)` fires once with that value on
the next microtask (matching NodeCG's real behaviour).

---

## 5. Adding your own placeholders

1. Add the field to `tests/visual/inputs/base.ts` (or a sibling fixture).
2. Reference the fixture in your spec via `test.use({ inputs: ... })`
   or `layout.goto(name, inputs)`.
3. Update this document if the new placeholder is one other tests should
   rely on.
