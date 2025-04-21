"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const speedcontrol_1 = require("@esa-layouts/util/speedcontrol");
const nodecg_1 = require("@esa-layouts/util/nodecg");
// Replicants only applicable to this file from another bundle.
const twitchCommercialsDisabled = (0, nodecg_1.get)().Replicant('disabled', 'esa-commercials');
// Used to disable the Twitch commercials for the remainder of a run.
function actionTwitchCommercialsDisable() {
    if (!twitchCommercialsDisabled.value
        && !['stopped', 'finished'].includes(speedcontrol_1.sc.timer.value.state)) {
        // Sends a message to the esa-commercials bundle.
        // Because we are using server-to-server messages, no confirmation yet.
        (0, nodecg_1.get)().sendMessageToBundle('disable', 'esa-commercials');
    }
}
exports.default = actionTwitchCommercialsDisable;
