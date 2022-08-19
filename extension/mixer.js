"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLiveMics = exports.setFaderName = void 0;
const helpers_1 = require("./util/helpers");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const replicants_1 = require("./util/replicants");
const x32_1 = __importDefault(require("./util/x32"));
const config = (0, nodecg_1.get)().bundleConfig;
const channelDefaultValue = [
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
const channelStatuses = (0, nodecg_1.get)().Replicant('x32-game-channel-status', {
    defaultValue: channelDefaultValue,
});
const wantedFaders = Object.values(config.x32.channelMapping).map((v) => `/ch/${v}/mix/fader`);
const wantedMutes = Object.values(config.x32.channelMapping).map((v) => `/ch/${v}/mix/on`);
function fetchInitialStatus() {
    wantedFaders.forEach((fader) => {
        var _a;
        (_a = x32_1.default.conn) === null || _a === void 0 ? void 0 : _a.send({
            address: fader,
            args: [],
        });
    });
    wantedMutes.forEach((fader) => {
        var _a;
        (_a = x32_1.default.conn) === null || _a === void 0 ? void 0 : _a.send({
            address: fader,
            args: [],
        });
    });
}
function getFaderNr(address) {
    const regex = /\/ch\/([0-9]{2})\/mix\/(?:fader|on)/;
    return address.match(regex)[1];
}
function updateMuteStatus(message) {
    const fader = getFaderNr(message.address);
    const muted = message.args[0].value === 0;
    const chIndex = channelStatuses.value.findIndex((x) => x.channel === fader);
    channelStatuses.value[chIndex].muted = muted;
    (0, nodecg_1.get)().log.debug(`Fader ${fader} muted status`, muted);
}
function updateFaderStatus(message) {
    const fader = getFaderNr(message.address);
    const faderValue = message.args[0].value;
    const faderActive = faderValue >= 0.3;
    const chIndex = channelStatuses.value.findIndex((x) => x.channel === fader);
    channelStatuses.value[chIndex].faderUp = faderActive;
    (0, nodecg_1.get)().log.debug(`Fader ${fader} value ${faderValue}, audible on stream`, faderActive);
}
if (config.x32.enabled) {
    // fetch initial statues for faders and mutes
    (_a = x32_1.default.conn) === null || _a === void 0 ? void 0 : _a.on('ready', () => {
        fetchInitialStatus();
    });
    // /ch/[01…32]/mix/on -> {OFF, ON} -> OFF meaning the channel is muted?
    // /ch/[01…32]/mix/fader -> level in Db [0.0…1.0(+10dB), 1024] -> not sure what the values are
    (_b = x32_1.default.conn) === null || _b === void 0 ? void 0 : _b.on('message', (message) => {
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
function getNonGameScenes() {
    // These scenes will *not* have "LIVE Game/Mics" DCAs audible.
    return [
        obs_1.default.findScene(config.obs.names.scenes.commercials),
        obs_1.default.findScene(config.obs.names.scenes.intermission),
        obs_1.default.findScene(config.obs.names.scenes.intermissionPlayer),
        obs_1.default.findScene(config.obs.names.scenes.countdown),
    ].filter(Boolean);
}
function setFaderName(fader, name) {
    var _a;
    if (config.x32.enabled) {
        (_a = x32_1.default.conn) === null || _a === void 0 ? void 0 : _a.send({
            address: `${fader}/config/name`,
            args: [{ type: 's', value: name }],
        });
    }
}
exports.setFaderName = setFaderName;
function toggleFadeHelper(address, scenes, data, mute = true, nofade = false) {
    try {
        let scene1 = scenes.includes(data['to-scene']);
        let scene2 = scenes.includes(data['from-scene']);
        if (!mute) {
            scene1 = scenes.includes(data['from-scene']);
            scene2 = scenes.includes(data['to-scene']);
        }
        if (scene1 && !scene2) {
            if (nofade) {
                x32_1.default.setFader(address, 0);
            }
            else {
                x32_1.default.fade(address, 0.75, 0, 1000);
            }
        }
        else if (!scene1 && scene2) {
            if (nofade) {
                x32_1.default.setFader(address, 0.75);
            }
            else {
                x32_1.default.fade(address, 0, 0.75, 1000);
            }
        }
    }
    catch (err) {
        (0, helpers_1.logError)('[Mixer] Error toggling fader [address: %s, scenes: %s, data: %s]', err, address, scenes, data);
    }
}
function toggleLiveMics(scene) {
    const nonGameScenes = getNonGameScenes();
    const fromScene = replicants_1.obsData.value.scene;
    const toScene = obs_1.default.findScene(scene);
    if (fromScene && toScene) {
        toggleFadeHelper('/dca/2/fader', nonGameScenes, {
            'from-scene': fromScene, 'to-scene': toScene,
        });
    }
}
exports.toggleLiveMics = toggleLiveMics;
// no auto fading for us pls :)
/*
let init = false;
async function setInitialFaders(): Promise<void> {
  await wait(1000); // Waiting 1s as a workaround to make sure the OBS helper has all info.
  if (!init && obs.connected && x32.ready) {
    init = true;
    // On-Site
    if (!config.event.online) {
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
      toggleFadeHelper('/dca/1/fader', gameScenes, data, false); // LIVE Runners
      toggleFadeHelper('/dca/2/fader', readerScenes, data, false); // LIVE Readers
      toggleFadeHelper('/dca/3/fader', gameScenes, data, false); // LIVE Games
    // Online
    } if (config.event.online === true || config.event.online === 'full') {
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
*/
