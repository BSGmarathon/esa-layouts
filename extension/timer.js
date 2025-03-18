"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
const config = (0, nodecg_1.get)().bundleConfig;
// This code keeps a delayed copy of the timer synced to a delay value from external sources.
// If no delay is present (if not an online marathon), we just make a straight copy.
const timerDelayTO = [];
replicants_1.delayedTimer.value = (0, clone_1.default)(speedcontrol_1.sc.timer.value);
replicants_1.currentRunDelay.on('change', (newVal, oldVal) => {
    var _a;
    if (newVal.video !== (oldVal === null || oldVal === void 0 ? void 0 : oldVal.video) && timerDelayTO.length) {
        // Reset delayed timer to the same as normal timer.
        replicants_1.delayedTimer.value = (0, clone_1.default)(speedcontrol_1.sc.timer.value);
        // Clear all the irrelevant timeouts currently active.
        const timeouts = [];
        for (let i = 0; i < timerDelayTO.length;) {
            if (timerDelayTO[i] && timerDelayTO[i].delay !== newVal.video) {
                timeouts.push((_a = timerDelayTO.shift()) === null || _a === void 0 ? void 0 : _a.timeout);
            }
            else {
                i += 1;
            }
        }
        timeouts.forEach((timeout) => clearTimeout(timeout));
    }
});
speedcontrol_1.sc.timer.on('change', (val) => {
    const timerFreeze = (0, clone_1.default)(val);
    if (replicants_1.currentRunDelay.value.video === 0) {
        replicants_1.delayedTimer.value = timerFreeze;
    }
    else {
        timerDelayTO.push({
            delay: replicants_1.currentRunDelay.value.video,
            timeout: setTimeout(() => {
                replicants_1.delayedTimer.value = Object.assign(Object.assign({}, timerFreeze), { timestamp: Date.now() });
            }, replicants_1.currentRunDelay.value.video),
        });
    }
});
(0, nodecg_1.get)().listenFor('buttonPressed', async (buttonId, ack) => {
    const run = speedcontrol_1.sc.getCurrentRun();
    if (!run) {
        return;
    }
    const teamIndex = Math.max(0, Math.min(buttonId - 1, run.teams.length - 1));
    // Just in case
    if (teamIndex < 0) {
        return;
    }
    try {
        // Note: the nodecg-speedcontrol bundle will check if it *can* do these actions,
        // we do not need to check that here.
        switch (speedcontrol_1.sc.timer.value.state) {
            case 'stopped':
            case 'paused':
                await speedcontrol_1.sc.startTimer();
                break;
            case 'running':
                // Only allow stop command to work if timer is more than 10s.
                if (speedcontrol_1.sc.timer.value.milliseconds > 10 * 1000) {
                    await speedcontrol_1.sc.stopTimer(teamIndex);
                }
                break;
            default:
                break;
        }
    }
    catch (err) {
        (0, nodecg_1.get)().log.error('[Timer] Error changing timer state on buttonPressed event:', err);
    }
    if (ack && !ack.handled) {
        ack(null);
    }
});
(0, nodecg_1.get)().listenFor('resetTimer', async (data, ack) => {
    try {
        await speedcontrol_1.sc.resetTimer();
        if (ack && !ack.handled) {
            ack(null);
        }
    }
    catch (e) {
        if (ack && !ack.handled) {
            ack(e);
        }
    }
});
// Enable/disable nodecg-speedcontrol timer changes if on/not on a game layout scene.
obs_1.default.on('currentSceneChanged', (current) => {
    if (current) {
        if (obs_1.default.isCurrentScene(config.obs.names.scenes.gameLayout)) {
            speedcontrol_1.sc.enableTimerChanges();
        }
        else {
            speedcontrol_1.sc.disableTimerChanges();
        }
    }
});
