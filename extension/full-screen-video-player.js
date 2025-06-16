"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startPlaylist = exports.player = void 0;
const uuid_1 = require("uuid");
const video_player_1 = __importDefault(require("./util/video-player"));
const helpers_1 = require("./util/helpers");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importStar(require("./util/obs"));
const replicants_1 = require("./util/replicants");
const config = (0, nodecg_1.get)().bundleConfig;
exports.player = new video_player_1.default((0, nodecg_1.get)(), config.obs, obs_1.default, config.obs.names.sources.fullScreenVideoPlayer);
// Reset replicant values on startup.
replicants_1.fullScreenVideoPlayer.value.playing = false;
replicants_1.fullScreenVideoPlayer.value.current = null;
// Converts our current playlist to shared format.
function generatePlaylist() {
    return replicants_1.fullScreenVideoPlayer.value.playlist.map((sum) => ({
        id: (0, uuid_1.v4)(),
        video: replicants_1.assetsVideos.value.find((v) => v.sum === sum),
    }));
}
function getFinishScene() {
    const sceneId = replicants_1.fullScreenVideoPlayer.value.finishScene;
    return config.obs.names.scenes[sceneId];
}
// eslint-disable-next-line import/prefer-default-export
async function startPlaylist() {
    try {
        const playlist = generatePlaylist();
        exports.player.loadPlaylist(playlist);
        replicants_1.fullScreenVideoPlayer.value.playing = true;
        // Switch to correct scene depending on if first element has a video or not.
        if (playlist[0].video) {
            await (0, obs_1.changeScene)({ scene: config.obs.names.scenes.fullScreenVideoPlayer, force: true });
        }
        else {
            // Does not work if first element is not a video and we're already on the
            // intermission player scene, but waitForCommercialEnd handles that.
            // TODO: Support this? We don't use "force" here for some reason, but as of
            //       writing this comment, not sure why.
            await (0, obs_1.changeScene)({ scene: getFinishScene() });
        }
        replicants_1.obsData.value.disableTransitioning = true;
        await exports.player.playNext();
        // Calculates when this playlist should end.
        replicants_1.fullScreenVideoPlayer.value.estimatedFinishTimestamp = Date.now() + (await exports.player.calculatePlaylistLength() * 1000);
    }
    catch (err) {
        (0, helpers_1.logError)('[Full Screen Player] Could not be started', err);
        // Return to the final scene if there was an issue starting the playlist.
        await new Promise((res) => { setTimeout(res, 5000); });
        await (0, obs_1.changeScene)({ scene: getFinishScene(), force: true });
    }
}
exports.startPlaylist = startPlaylist;
// Used if a user manually switches to the intermission player scene in OBS.
obs_1.default.conn.on('TransitionBegin', async (data) => {
    if (obs_1.default.findScene(config.obs.names.scenes.fullScreenVideoPlayer) === data['to-scene']
        && !replicants_1.fullScreenVideoPlayer.value.playing) {
        await startPlaylist();
    }
    if (obs_1.default.findScene(config.obs.names.scenes.fullScreenVideoPlayer) === data['from-scene']) {
        await exports.player.endPlaylistEarly();
    }
});
// Triggered from the intermission player control to stop early.
(0, nodecg_1.get)().listenFor('stopFullScreenVideoPlayerEarly', () => {
    exports.player.endPlaylistEarly();
});
exports.player.on('videoStarted', async (item) => {
    var _a;
    replicants_1.fullScreenVideoPlayer.value.current = ((_a = item.video) === null || _a === void 0 ? void 0 : _a.sum) || null;
    // Change to intermission player scene if needed and not done already.
    if (item.video) {
        await (0, obs_1.changeScene)({ scene: config.obs.names.scenes.fullScreenVideoPlayer, force: true });
    }
    else {
        await (0, obs_1.changeScene)({ scene: getFinishScene(), force: true });
    }
});
exports.player.on('videoEnded', async (item) => {
    // Update video play count.
    if (item.video) {
        if (!replicants_1.fullScreenVideoPlayer.value.plays[item.video.sum]) {
            replicants_1.fullScreenVideoPlayer.value.plays[item.video.sum] = 1;
        }
        else {
            replicants_1.fullScreenVideoPlayer.value.plays[item.video.sum] += 1;
        }
    }
    try {
        await exports.player.playNext();
    }
    catch (err) {
        (0, helpers_1.logError)('[Full Screen Player] Could not play next video', err);
        exports.player.endPlaylistEarly();
    }
});
exports.player.on('playlistEnded', async (early) => {
    replicants_1.fullScreenVideoPlayer.value.playing = false;
    replicants_1.fullScreenVideoPlayer.value.current = null;
    if (!early) {
        replicants_1.fullScreenVideoPlayer.value.playlist.length = 0;
    }
    replicants_1.fullScreenVideoPlayer.value.estimatedFinishTimestamp = 0;
    replicants_1.obsData.value.disableTransitioning = false;
    await (0, obs_1.changeScene)({ scene: getFinishScene(), force: true });
});
