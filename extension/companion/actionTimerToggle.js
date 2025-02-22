"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const speedcontrol_1 = require("../util/speedcontrol");
// Controls the nodecg-speedcontrol timer.
// Currently the "Stop Timer" state works if there's only 1 team.
// TODO: Add team support.
async function actionTimerToggle() {
    try {
        // Note: the nodecg-speedcontrol bundle will check if it *can* do these actions,
        // we do not need to check that here.
        switch (speedcontrol_1.sc.timer.value.state) {
            case 'stopped':
            case 'paused':
                await speedcontrol_1.sc.startTimer();
                break;
            case 'running':
                await speedcontrol_1.sc.stopTimer();
                break;
            case 'finished':
                await speedcontrol_1.sc.resetTimer();
                break;
            default:
                // Don't do anything
                break;
        }
    }
    catch (err) {
        // Drop for now
    }
}
exports.default = actionTimerToggle;
