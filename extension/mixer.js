"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
function fetchInitialFaderMuteStatus() {
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
    const reMatch = address.match(regex);
    if (!reMatch) {
        return null;
    }
    return reMatch[1];
}
function updateMuteStatus(message) {
    const fader = getFaderNr(message.address);
    if (!fader) {
        (0, nodecg_1.get)().log.warn('Failed to match fader for', message.address);
        return;
    }
    const muted = message.args[0].value === 0;
    const chIndex = channelStatuses.value.findIndex((x) => x.channel === fader);
    channelStatuses.value[chIndex].muted = muted;
    (0, nodecg_1.get)().log.debug(`Fader ${fader} muted status`, muted);
}
function updateFaderStatus(message) {
    const fader = getFaderNr(message.address);
    if (!fader) {
        (0, nodecg_1.get)().log.warn('Failed to match fader for', message.address);
        return;
    }
    const faderValue = message.args[0].value;
    const faderActive = faderValue >= 0.3;
    const chIndex = channelStatuses.value.findIndex((x) => x.channel === fader);
    channelStatuses.value[chIndex].faderUp = faderActive;
    (0, nodecg_1.get)().log.debug(`Fader ${fader} value ${faderValue}, audible on stream`, faderActive);
}
// /ch/[01…32]/mix/on -> {OFF, ON} -> OFF meaning the channel is muted?
// /ch/[01…32]/mix/fader -> level in Db [0.0…1.0(+10dB), 1024] -> not sure what the values are
x32_1.default.on('message', (message) => {
    if (message.address.includes('/fader')) {
        (0, nodecg_1.get)().log.debug('OSC command from mixer', message);
    }
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
/// <editor-fold desc="DCA Automation">
function getSceneConfig() {
    // These scenes will have the reader audible.
    const readerScenes = [
        obs_1.default.findScene(config.obs.names.scenes.commercials),
        obs_1.default.findScene(config.obs.names.scenes.gameLayout),
        obs_1.default.findScene(`${config.obs.names.scenes.gameLayout} (custom)`),
        obs_1.default.findScene(config.obs.names.scenes.intermission),
        obs_1.default.findScene(config.obs.names.scenes.intermissionCrowd),
        obs_1.default.findScene(config.obs.names.scenes.readerIntroduction),
    ].filter(Boolean);
    // These scenes will have the game and players audible.
    const gameScenes = [
        obs_1.default.findScene(config.obs.names.scenes.gameLayout),
        obs_1.default.findScene(`${config.obs.names.scenes.gameLayout} (custom)`),
    ].filter(Boolean);
    const interviewScenes = [
        obs_1.default.findScene(config.obs.names.scenes.interview),
    ].filter(Boolean);
    return {
        readerScenes,
        gameScenes,
        interviewScenes,
    };
}
function getNonGameScenes() {
    // These scenes will *not* have "LIVE Game/Mics" DCAs audible.
    return [
        obs_1.default.findScene(config.obs.names.scenes.commercials),
        obs_1.default.findScene(config.obs.names.scenes.intermission),
        obs_1.default.findScene(config.obs.names.scenes.intermissionPlayer),
        obs_1.default.findScene(config.obs.names.scenes.intermissionCrowd),
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
let init = false;
async function setInitialFaders() {
    await (0, helpers_1.wait)(1000); // Waiting 1s as a workaround to make sure the OBS helper has all info.
    if (!init && obs_1.default.connected && x32_1.default.ready) {
        init = true;
        (0, nodecg_1.get)().log.info('Initializing DCAs');
        x32_1.default.setFader('/dca/4/fader', 0.75); // Setup Helper
        // On-Site
        if (!config.event.online) {
            const { readerScenes, gameScenes, interviewScenes } = getSceneConfig();
            if (readerScenes.includes(obs_1.default.currentScene || '')) {
                x32_1.default.setFader('/dca/2/fader', 0.75); // LIVE Readers
                (0, nodecg_1.get)().log.info('Reader DCAs ON');
            }
            else {
                x32_1.default.setFader('/dca/2/fader', 0); // LIVE Readers
                (0, nodecg_1.get)().log.info('Reader DCAs OFF');
            }
            if (gameScenes.includes(obs_1.default.currentScene || '')) {
                x32_1.default.setFader('/dca/1/fader', 0.75); // LIVE Runners
                x32_1.default.setFader('/dca/3/fader', 0.75); // LIVE Games
                (0, nodecg_1.get)().log.info('Game DCAs ON');
            }
            else {
                x32_1.default.setFader('/dca/1/fader', 0); // LIVE Runners
                x32_1.default.setFader('/dca/3/fader', 0); // LIVE Games
                (0, nodecg_1.get)().log.info('Game DCAs Off');
            }
            if (interviewScenes.includes(obs_1.default.currentScene || '')) {
                x32_1.default.setFader('/dca/5/fader', 0.75); // Live Interview
                (0, nodecg_1.get)().log.info('Interview DCAs ON');
            }
            else {
                x32_1.default.setFader('/dca/5/fader', 0); // Live Interview
                (0, nodecg_1.get)().log.info('Interview DCAs ON');
            }
        }
    }
}
x32_1.default.on('ready', async () => {
    await setInitialFaders();
    // fetch initial statues for faders and mutes
    fetchInitialFaderMuteStatus();
});
obs_1.default.on('ready', async () => {
    await setInitialFaders();
});
obs_1.default.on('transitionStarted', async (current, last) => {
    if (config.x32.enabled) {
        const data = {
            'to-scene': current,
            'from-scene': last,
        };
        // On-Site
        if (!config.event.online) {
            const { readerScenes, gameScenes, interviewScenes } = getSceneConfig();
            toggleFadeHelper('/dca/1/fader', gameScenes, data, false); // LIVE Runners
            toggleFadeHelper('/dca/2/fader', readerScenes, data, false); // LIVE Readers
            toggleFadeHelper('/dca/3/fader', gameScenes, data, false); // LIVE Games
            toggleFadeHelper('/dca/5/fader', interviewScenes, data, false); // Live Interview
            // Online
        }
        else if (config.event.online === true || config.event.online === 'full') {
            const nonGameScenes = getNonGameScenes(); // These scenes will *not* have "LIVE" DCAs audible.
            const intermissionScenes = [
                obs_1.default.findScene(config.obs.names.scenes.commercials),
                obs_1.default.findScene(config.obs.names.scenes.intermission),
            ];
            toggleFadeHelper('/dca/1/fader', nonGameScenes, data);
            if (replicants_1.currentRunDelay.value.audio > 0) {
                setTimeout(() => {
                    toggleFadeHelper('/dca/2/fader', nonGameScenes, data, true, true);
                }, 1500);
            }
            else {
                toggleFadeHelper('/dca/2/fader', nonGameScenes, data);
            }
            toggleFadeHelper('/dca/3/fader', intermissionScenes, data, false);
        }
    }
});
/// </editor-fold>
