import { player } from './intermission-player';
import companion, { ActionHandler } from './util/companion';
import { get as nodecg } from './util/nodecg';
import { assetsVideos, obsData, streamDeckData } from './util/replicants';
import { sc } from './util/speedcontrol';
import actionVideoPlay from './companion/actionVideoPlay';
import actionIntermissionSceneChange from './companion/actionIntermissionSceneChange';
import actionTimerToggle from './companion/actionTimerToggle';
import actionPlayerHudTriggerToggle from './companion/actionPlayerHudTriggerToggle';
import actionTwitchCommercialsDisable from './companion/actionTwitchCommercialsDisable';
import actionSceneCycle from './companion/actionSceneCycle';

// Replicants only applicable to this file from another bundle.
const twitchCommercialsDisabled = nodecg().Replicant<boolean>('disabled', 'esa-commercials');

// Sending replicant data on any changes.
sc.timer.on('change', (value) => companion.send({ name: 'timer', value }));
sc.timerChangesDisabled.on('change', (value) => (
  companion.send({ name: 'timerChangesDisabled', value })));
streamDeckData.on('change', (value) => companion.send({ name: 'streamDeckData', value }));
sc.twitchCommercialTimer.on('change', (value) => (
  companion.send({ name: 'twitchCommercialTimer', value })));
twitchCommercialsDisabled.on('change', (value) => (
  companion.send({ name: 'twitchCommercialsDisabled', value })));
obsData.on('change', (value) => (
  companion.send({ name: 'obsData', value: { ...value, gameLayoutScreenshot: undefined } })));
assetsVideos.on('change', (value) => companion.send({ name: 'videos', value }));

// Sending things on connection.
companion.evt.on('open', (socket) => {
  companion.send({ name: 'timer', value: sc.timer.value }, socket);
  companion.send({ name: 'timerChangesDisabled', value: sc.timerChangesDisabled.value }, socket);
  companion.send({ name: 'streamDeckData', value: streamDeckData.value });
  companion.send({ name: 'twitchCommercialTimer', value: sc.twitchCommercialTimer.value });
  companion.send({ name: 'twitchCommercialsDisabled', value: twitchCommercialsDisabled.value });
  companion.send({ name: 'obsData', value: { ...obsData.value, gameLayoutScreenshot: undefined } });
  companion.send({ name: 'cfgScenes', value: nodecg().bundleConfig.obs.names.scenes });
  companion.send({ name: 'videos', value: assetsVideos.value });
});

const actionMap: { [key: string]: ActionHandler } = {
  timer_toggle: actionTimerToggle,
  player_hud_trigger_toggle: actionPlayerHudTriggerToggle,
  twitch_commercials_disable: actionTwitchCommercialsDisable,
  scene_cycle: actionSceneCycle,
  intermission_scene_change: actionIntermissionSceneChange,
  video_play: actionVideoPlay,
  // Yes, this is still allowed :)
  // anything that takes up more than a single line of code should have its own file.
  video_stop: () => player.endPlaylistEarly(),
};

// Listening for any actions triggered from Companion.
companion.evt.on('action', async (name, value) => {
  if (name in actionMap) {
    await actionMap[name](name, value);
  }
});
