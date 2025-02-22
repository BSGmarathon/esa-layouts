"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const replicants_1 = require("@esa-layouts/util/replicants");
const obs_1 = require("@esa-layouts/util/obs");
const nodecg_1 = require("@esa-layouts/util/nodecg");
const helpers_1 = require("@esa-layouts/util/helpers");
const intermission_player_1 = require("@esa-layouts/intermission-player");
const config = (0, nodecg_1.get)().bundleConfig;
let videoPlayPressedRecently = false;
// Used to play back a single video in the "Intermission Player" scene,
// intended to be used by hosts.
async function actionVideoPlay(name, value) {
    if (!videoPlayPressedRecently && !replicants_1.videoPlayer.value.playing
        && (0, obs_1.canChangeScene)({ scene: config.obs.names.scenes.intermissionPlayer, force: true })) {
        videoPlayPressedRecently = true;
        setTimeout(() => { videoPlayPressedRecently = false; }, 1000);
        const val = value;
        (0, nodecg_1.get)().log.debug('[Companion] Message received to play video (sum: %s)', val);
        const videos = replicants_1.assetsVideos.value.filter((v) => v.sum === val);
        if (videos.length > 1) {
            // VIDEO WAS FOUND TWICE, MAKES NO SENSE!
            (0, nodecg_1.get)().log.debug('[Companion] Multiple videos with the same sum found!');
        }
        else if (!videos.length) {
            // VIDEO WAS NOT FOUND
            (0, nodecg_1.get)().log.debug('[Companion] No videos found with that sum!');
        }
        else {
            (0, nodecg_1.get)().log.debug('[Companion] Video found matching sum: %s', videos[0].name);
            replicants_1.videoPlayer.value.playlist = [
                {
                    sum: videos[0].sum,
                    length: 0,
                    commercial: false,
                },
            ];
            // TODO: this was never awaited in the original code, did it ever work?
            await (0, helpers_1.wait)(500); // Safety wait
            await (0, intermission_player_1.startPlaylist)();
        }
    }
}
exports.default = actionVideoPlay;
