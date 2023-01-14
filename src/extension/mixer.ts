import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import { MetaArgument, OscMessage } from 'osc';
import { logError, wait } from './util/helpers';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { currentRunDelay, obsData } from './util/replicants';
import x32 from './util/x32';
import { ChannelDataReplicant } from '../types/replicant-types';

const config = (nodecg().bundleConfig as Configschema);

const channelDefaultValue: ChannelDataReplicant[] = [
  {
    channel: config.x32.channelMapping.player1Game,
    faderUp: false,
    muted: true,
  },
  {
    channel: config.x32.channelMapping.player2Game,
    faderUp: false,
    muted: true,
  },
  {
    channel: config.x32.channelMapping.player3Game,
    faderUp: false,
    muted: true,
  },
  {
    channel: config.x32.channelMapping.player4Game,
    faderUp: false,
    muted: true,
  },
];
const channelStatuses = nodecg().Replicant<ChannelDataReplicant[]>('x32-game-channel-status', {
  defaultValue: channelDefaultValue,
});

const wantedFaders = Object.values(config.x32.channelMapping).map((v) => `/ch/${v}/mix/fader`);
const wantedMutes = Object.values(config.x32.channelMapping).map((v) => `/ch/${v}/mix/on`);

function fetchInitialStatus(): void {
  wantedFaders.forEach((fader) => {
    x32.conn?.send({
      address: fader,
      args: [],
    });
  });

  wantedMutes.forEach((fader) => {
    x32.conn?.send({
      address: fader,
      args: [],
    });
  });
}

function getFaderNr(address: string): string {
  const regex = /\/ch\/([0-9]{2})\/mix\/(?:fader|on)/;

  return address.match(regex)![1];
}

function updateMuteStatus(message: OscMessage): void {
  const fader = getFaderNr(message.address);
  const muted = (message.args as Array<MetaArgument>)[0].value === 0;
  const chIndex = channelStatuses.value.findIndex((x) => x.channel === fader);

  channelStatuses.value[chIndex].muted = muted;

  nodecg().log.debug(`Fader ${fader} muted status`, muted);
}

function updateFaderStatus(message: OscMessage): void {
  const fader = getFaderNr(message.address);
  const faderValue = (message.args as Array<MetaArgument>)[0].value;
  const faderActive = faderValue >= 0.3;
  const chIndex = channelStatuses.value.findIndex((x) => x.channel === fader);

  channelStatuses.value[chIndex].faderUp = faderActive;

  nodecg().log.debug(`Fader ${fader} value ${faderValue}, audible on stream`, faderActive);
}

if (config.x32.enabled) {
  // fetch initial statues for faders and mutes
  x32.conn?.on('ready', () => {
    fetchInitialStatus();
  });

  // /ch/[01…32]/mix/on -> {OFF, ON} -> OFF meaning the channel is muted?
  // /ch/[01…32]/mix/fader -> level in Db [0.0…1.0(+10dB), 1024] -> not sure what the values are
  x32.conn?.on('message', (message) => {
    if (wantedMutes.includes(message.address)) {
      updateMuteStatus(message);
      return;
    }

    if (wantedFaders.includes(message.address)) {
      updateFaderStatus(message);
    }

    // DON'T do this, also triggers for other faderss
    // nodecg.log.info('Unknown OSC command', message);
  });
}

/// <editor-fold desc=="Mixer integration">

function getSceneConfig() {
// These scenes will have the reader audible.
  const readerScenes = [
    obs.findScene(config.obs.names.scenes.commercials),
    obs.findScene(config.obs.names.scenes.gameLayout),
    obs.findScene(config.obs.names.scenes.intermission),
    obs.findScene(config.obs.names.scenes.readerIntroduction),
  ].filter(Boolean) as string[];

  // These scenes will have the game and players audible.
  const gameScenes = [
    obs.findScene(config.obs.names.scenes.gameLayout),
  ].filter(Boolean) as string[];

  return {
    readerScenes,
    gameScenes,
  };
}

function getNonGameScenes(): string[] {
  // These scenes will *not* have "LIVE Game/Mics" DCAs audible.
  return [
    obs.findScene(config.obs.names.scenes.commercials),
    obs.findScene(config.obs.names.scenes.intermission),
    obs.findScene(config.obs.names.scenes.intermissionPlayer),
    obs.findScene(config.obs.names.scenes.countdown),
  ].filter(Boolean) as string[];
}

export function setFaderName(fader: string, name: string): void {
  if (config.x32.enabled) {
    x32.conn?.send({
      address: `${fader}/config/name`,
      args: [{ type: 's', value: name }],
    });
  }
}

function toggleFadeHelper(
  address: string,
  scenes: (string | undefined)[],
  data: { 'from-scene'?: string, 'to-scene': string },
  mute = true,
  nofade = false,
): void {
  try {
    let scene1 = scenes.includes(data['to-scene']);
    let scene2 = scenes.includes(data['from-scene']);
    if (!mute) {
      scene1 = scenes.includes(data['from-scene']);
      scene2 = scenes.includes(data['to-scene']);
    }
    if (scene1 && !scene2) {
      if (nofade) {
        x32.setFader(address, 0);
      } else {
        x32.fade(address, 0.75, 0, 1000);
      }
    } else if (!scene1 && scene2) {
      if (nofade) {
        x32.setFader(address, 0.75);
      } else {
        x32.fade(address, 0, 0.75, 1000);
      }
    }
  } catch (err) {
    logError(
      '[Mixer] Error toggling fader [address: %s, scenes: %s, data: %s]',
      err,
      address,
      scenes,
      data,
    );
  }
}

export function toggleLiveMics(scene: string): void {
  const nonGameScenes = getNonGameScenes();
  const fromScene = obsData.value.scene;
  const toScene = obs.findScene(scene);
  if (fromScene && toScene) {
    toggleFadeHelper('/dca/2/fader', nonGameScenes, {
      'from-scene': fromScene, 'to-scene': toScene,
    });
  }
}

let init = false;
async function setInitialFaders(): Promise<void> {
  await wait(1000); // Waiting 1s as a workaround to make sure the OBS helper has all info.
  if (!init && obs.connected && x32.ready) {
    init = true;
    // On-Site
    if (!config.event.online) {
      const { readerScenes, gameScenes } = getSceneConfig();

      if (readerScenes.includes(obs.currentScene || '')) {
        x32.setFader('/dca/2/fader', 0.75); // LIVE Readers
      } else {
        x32.setFader('/dca/2/fader', 0); // LIVE Readers
      }
      if (gameScenes.includes(obs.currentScene || '')) {
        x32.setFader('/dca/1/fader', 0.75); // LIVE Runners
        x32.setFader('/dca/3/fader', 0.75); // LIVE Games
      } else {
        x32.setFader('/dca/1/fader', 0); // LIVE Runners
        x32.setFader('/dca/3/fader', 0); // LIVE Games
      }
    }
  }
}

x32.on('ready', async () => {
  await setInitialFaders();
});
obs.conn.on('AuthenticationSuccess', async () => {
  await setInitialFaders();
});

obs.conn.on('TransitionBegin', async (data) => {
  if (config.x32.enabled) {
    // On-Site
    if (!config.event.online) {
      const { readerScenes, gameScenes } = getSceneConfig();

      toggleFadeHelper('/dca/1/fader', gameScenes, data, false); // LIVE Runners
      toggleFadeHelper('/dca/2/fader', readerScenes, data, false); // LIVE Readers
      toggleFadeHelper('/dca/3/fader', gameScenes, data, false); // LIVE Games
    // Souls Winter Charity Fest
    } else if (config.event.shorts === 'swcf') {
      // DCA1: Mics - audible on Intermission/Game Layout/Tournament Bracket scenes.
      toggleFadeHelper('/dca/1/fader', [
        obs.findScene(config.obs.names.scenes.intermission),
        obs.findScene(config.obs.names.scenes.gameLayout),
        obs.findScene('Tournament Bracket'),
      ], data, false);
      // DCA2: Games - audible only on Game Layout scene
      toggleFadeHelper('/dca/2/fader', [
        obs.findScene(config.obs.names.scenes.gameLayout),
      ], data, false);
    // Online
    } else if (config.event.online === true || config.event.online === 'full') {
      const nonGameScenes = getNonGameScenes(); // These scenes will *not* have "LIVE" DCAs audible.
      const intermissionScenes = [ // These scenes *will* have "Intrmsn Mics" DCA audible.
        obs.findScene(config.obs.names.scenes.commercials),
        obs.findScene(config.obs.names.scenes.intermission),
      ];
      toggleFadeHelper('/dca/1/fader', nonGameScenes, data);
      if (currentRunDelay.value.audio > 0) {
        setTimeout(() => { // Delayed hard cut as backup!
          toggleFadeHelper('/dca/2/fader', nonGameScenes, data, true, true);
        }, 1500);
      } else {
        toggleFadeHelper('/dca/2/fader', nonGameScenes, data);
      }
      toggleFadeHelper('/dca/3/fader', intermissionScenes, data, false);
    }
  }
});

/// </editor-fold>
