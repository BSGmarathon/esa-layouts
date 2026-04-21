import clone from 'clone';
import sharp from 'sharp';
import { wait } from '@esa-layouts/util/helpers';
import { startPlaylist } from './intermission-player';
import * as mqLogging from './util/mq-logging';
import { get as nodecg } from './util/nodecg';
import obs, { changeScene } from './util/obs';
import offsite from './util/offsite';
import { autorecord, obsData, readerIntroduction, videoPlayer } from './util/replicants';
import { sc } from './util/speedcontrol';

const evtConfig = nodecg().bundleConfig.event;
const config = nodecg().bundleConfig.obs;
const autorecordConfig = config.autorecord;

/**
 * Generate the text needed to be displayed on the "Scene Cycle" button.
 * @param linebreaks If you wish to include linebreaks in the text for Stream Deck purposes.
 * @returns String with title to use.
 */
function generateSceneCyclerTitle(linebreaks: boolean): string {
  const { disableTransitioning, transitioning, connected } = obsData.value;
  let text = (() => {
    if (disableTransitioning || transitioning || !connected
    || ['running', 'paused'].includes(sc.timer.value.state)
    || (obs.isCurrentScene(config.names.scenes.readerIntroduction)
    && readerIntroduction.value.current !== 'RunInfo')
    || obs.isCurrentScene(config.names.scenes.countdown)) {
      return '⚠\nCannot\nChange\nScene';
    }
    if (obs.isCurrentScene(config.names.scenes.intermission)) {
      return 'Go to\nIntro\nScene';
    }
    if (obs.isCurrentScene(config.names.scenes.readerIntroduction)) {
      return 'Go to\nGame\nScene';
    }
    if (obs.isCurrentScene(config.names.scenes.gameLayout)) {
      return 'Go to\nInter-\nmission';
    }
    return '⌛\nWaiting\nfor\nTech';
  })();
  if (!linebreaks) {
    text = text.replace(/\n/g, ' ');
    text = text.replace('Inter- ', 'Inter');
  }
  return text;
}

/**
 * Correctly changes the title text on the offsite "Scene Cycle" buttons.
 */
function changeSceneCyclerOffsiteTitle(): void {
  const title = generateSceneCyclerTitle(false);
  offsite.emit('title', { name: 'sceneCycle', title });
}

/**
 * Tries to start video playlist, if playlist is empty then acts as if there isn't one.
 */
async function startIntermission(): Promise<void> {
  if (videoPlayer.value.playlist.length) {
    await startPlaylist();
  } else if (obs.findScene(config.names.scenes.commercials)) {
    await changeScene({ scene: config.names.scenes.commercials });
  } else {
    await changeScene({ scene: config.names.scenes.intermission });
  }
}

let gameLayoutScreenshotInterval: NodeJS.Timeout;
async function takeGameLayoutScreenshot(): Promise<void> {
  try {
    const gameLayoutScreenshot = await obs.conn.call('GetSourceScreenshot', {
      sourceName: config.names.scenes.gameLayout,
      imageFormat: 'png',
      imageHeight: 360,
    });
    const compressed = await sharp(
      Buffer.from(gameLayoutScreenshot.imageData.split(',')[1], 'base64'),
    ).jpeg({ mozjpeg: true }).toBuffer();
    obsData.value.gameLayoutScreenshot = `data:image/jpeg;base64,${compressed.toString('base64')}`;
  } catch (err) {
    nodecg().log.debug('[OBS Data] Cannot take screenshot of game layout:', err);
  }
}

obs.on('connectionStatusChanged', (connected) => {
  obsData.value.connected = connected;
  if (connected) {
    if (evtConfig.online) {
      takeGameLayoutScreenshot();
      gameLayoutScreenshotInterval = setInterval(takeGameLayoutScreenshot, 1 * 1000);
    }
  } else {
    clearInterval(gameLayoutScreenshotInterval);
  }
});

obs.on('streamingStatusChanged', (streaming) => {
  obsData.value.streaming = streaming;
  mqLogging.logStreamingStatusChange(streaming);
});

obs.on('recordingStatusChanged', (recording) => {
  obsData.value.recording = recording;
});

obs.on('currentSceneChanged', (current, last) => {
  obsData.value.scene = current;
  // Slightly hacky way of not sending ".gamescene" at the end of a RabbitMQ routing key
  // if we are going between 2 different "game scenes", needed for VodManager.
  let currentIsGameScene = current === obs.findScene(config.names.scenes.gameLayout);
  // || current === obs.findScene(config.names.scenes.readerIntroduction);
  let lastIsGameScene = last === obs.findScene(config.names.scenes.gameLayout);
  // || last === obs.findScene(config.names.scenes.readerIntroduction);
  if (currentIsGameScene && lastIsGameScene) {
    currentIsGameScene = false;
    lastIsGameScene = false;
  }
  if (last) {
    mqLogging.logSceneSwitch(last, 'end', lastIsGameScene);
  }
  if (current) {
    mqLogging.logSceneSwitch(current, 'start', currentIsGameScene);
  }
});

obs.on('sceneListChanged', (list) => {
  // Don't include scenes after the first that starts with "---".
  const stopIndex = list.findIndex((s) => s.startsWith('---'));
  obsData.value.sceneList = clone(list).slice(0, stopIndex >= 0 ? stopIndex : undefined);
});

function shouldStartRecording(toScene: string): boolean {
  return autorecordConfig.recordStartSceneNames.some(
    (scene) => toScene.startsWith(scene),
  ) && autorecord.value.enabled;
}

function shouldStopRecording(toScene: string): boolean {
  return autorecordConfig.recordStopSceneNames.some(
    (scene) => toScene.startsWith(scene),
  );
}

let stopTimeout: NodeJS.Timeout | undefined;

async function transitionLogic(toScene: string) {
  if (shouldStartRecording(toScene)) {
    if (stopTimeout) {
      clearTimeout(stopTimeout);
    }

    // delay and start
    await wait(autorecordConfig.recordStartDelaySec * 1000);
    await obs.startRecording();
  } else if (shouldStopRecording(toScene)) {
    if (autorecord.value.ignoreNextStop) {
      autorecord.value.ignoreNextStop = false;
      return;
    }

    // delay and stop
    stopTimeout = setTimeout(() => {
      obs.stopRecording().catch((e) => {
        nodecg().log.error('Record stop failed', e);
      });
    }, autorecordConfig.recordStopDelaySec * 1000);
  }
}

obs.on('transitionStarted', async (toScene) => {
  obsData.value.transitioning = true;

  try {
    await transitionLogic(toScene);
  } catch (e: unknown) {
    nodecg().log.error('transition logic failed', e);
  }
});

// NOTE: This is apparently called even if the transition is not a video,
// which is very useful in case it's not, but could be sometimes.
obs.conn.on('SceneTransitionVideoEnded', () => {
  obsData.value.transitioning = false;
});

// Disable transitioning when commercials are running and no videos are playing.
// (Intermission player controls this itself, so don't want to touch it during that).
sc.twitchCommercialTimer.on('change', async (newVal) => {
  if (!videoPlayer.value.playing) {
    obsData.value.disableTransitioning = newVal.secondsRemaining > 0;
  }
});

// Triggered via button in "OBS Control" dashboard panel.
nodecg().listenFor('startIntermission', async () => {
  await startIntermission();
});

// Triggers a Stream Deck title text update when certain replicants change.
obsData.on('change', (newVal, oldVal) => {
  if (newVal.disableTransitioning !== oldVal?.disableTransitioning
  || newVal.transitioning !== oldVal.transitioning
  || newVal.scene !== oldVal.scene
  || newVal.connected !== oldVal.connected) {
    changeSceneCyclerOffsiteTitle();
  }
});
sc.timer.on('change', (newVal, oldVal) => {
  if (newVal.state !== oldVal?.state) {
    changeSceneCyclerOffsiteTitle();
  }
});
readerIntroduction.on('change', (newVal, oldVal) => {
  if (newVal.current !== oldVal?.current) {
    changeSceneCyclerOffsiteTitle();
  }
});

/**
 * Tries to cycle to the next scene to be shown if possible according to other factors.
 * @returns Boolean for if scene was able to cycle or not.
 */
async function cycleScene(): Promise<boolean> {
  const { disableTransitioning, transitioning, connected } = obsData.value;
  if (disableTransitioning || transitioning || !connected
  || ['running', 'paused'].includes(sc.timer.value.state)) {
    return false;
  }
  if (obs.isCurrentScene(config.names.scenes.intermission)) {
    const success = await changeScene({ scene: config.names.scenes.readerIntroduction });
    return success;
  }
  if (obs.isCurrentScene(config.names.scenes.readerIntroduction)
  && readerIntroduction.value.current === 'RunInfo') {
    const success = await changeScene({ scene: config.names.scenes.gameLayout });
    return success;
  }
  if (obs.isCurrentScene(config.names.scenes.gameLayout)) {
    // TODO: Confirm this worked before sending "showOk".
    await startIntermission();
    return true;
  }
  return false;
}

offsite.on('authenticated', () => {
  changeSceneCyclerOffsiteTitle();
});

offsite.on('sceneCycle', async () => {
  const success = await cycleScene();
  offsite.emit('ack', { name: 'sceneCycle', success, title: generateSceneCyclerTitle(false) });
});
