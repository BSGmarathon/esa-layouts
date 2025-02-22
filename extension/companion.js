"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionStreamDeckModifyCrop_1 = __importDefault(require("@esa-layouts/companion/actionStreamDeckModifyCrop"));
const actionResetCropSelected_1 = __importDefault(require("@esa-layouts/companion/actionResetCropSelected"));
const actionResetCropAll_1 = __importDefault(require("@esa-layouts/companion/actionResetCropAll"));
const intermission_player_1 = require("./intermission-player");
const companion_1 = __importDefault(require("./util/companion"));
const nodecg_1 = require("./util/nodecg");
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
const actionVideoPlay_1 = __importDefault(require("./companion/actionVideoPlay"));
const actionIntermissionSceneChange_1 = __importDefault(require("./companion/actionIntermissionSceneChange"));
const actionTimerToggle_1 = __importDefault(require("./companion/actionTimerToggle"));
const actionPlayerHudTriggerToggle_1 = __importDefault(require("./companion/actionPlayerHudTriggerToggle"));
const actionTwitchCommercialsDisable_1 = __importDefault(require("./companion/actionTwitchCommercialsDisable"));
const actionSceneCycle_1 = __importDefault(require("./companion/actionSceneCycle"));
// Replicants only applicable to this file from another bundle.
const twitchCommercialsDisabled = (0, nodecg_1.get)().Replicant('disabled', 'esa-commercials');
// Sending replicant data on any changes.
speedcontrol_1.sc.timer.on('change', (value) => companion_1.default.send({ name: 'timer', value }));
speedcontrol_1.sc.timerChangesDisabled.on('change', (value) => (companion_1.default.send({ name: 'timerChangesDisabled', value })));
replicants_1.streamDeckData.on('change', (value) => companion_1.default.send({ name: 'streamDeckData', value }));
speedcontrol_1.sc.twitchCommercialTimer.on('change', (value) => (companion_1.default.send({ name: 'twitchCommercialTimer', value })));
twitchCommercialsDisabled.on('change', (value) => (companion_1.default.send({ name: 'twitchCommercialsDisabled', value })));
replicants_1.obsData.on('change', (value) => (companion_1.default.send({ name: 'obsData', value: Object.assign(Object.assign({}, value), { gameLayoutScreenshot: undefined }) })));
replicants_1.assetsVideos.on('change', (value) => companion_1.default.send({ name: 'videos', value }));
replicants_1.companionFastCropEnabled.on('change', (value) => companion_1.default.send({ name: 'fastCropOn', value }));
replicants_1.selectedCropItem.on('change', (value) => companion_1.default.send({ name: 'selectedCropItem', value }));
replicants_1.companionWaitingSingleCropConfirm.on('change', (value) => companion_1.default.send({ name: 'waitingForSingleCropConfirm', value }));
replicants_1.companionWaitingAllCropConfirm.on('change', (value) => companion_1.default.send({ name: 'waitingForAllCropConfirm', value }));
// Sending things on connection.
companion_1.default.evt.on('open', (socket) => {
    companion_1.default.send({ name: 'timer', value: speedcontrol_1.sc.timer.value }, socket);
    companion_1.default.send({ name: 'timerChangesDisabled', value: speedcontrol_1.sc.timerChangesDisabled.value }, socket);
    companion_1.default.send({ name: 'streamDeckData', value: replicants_1.streamDeckData.value });
    companion_1.default.send({ name: 'twitchCommercialTimer', value: speedcontrol_1.sc.twitchCommercialTimer.value });
    companion_1.default.send({ name: 'twitchCommercialsDisabled', value: twitchCommercialsDisabled.value });
    companion_1.default.send({ name: 'obsData', value: Object.assign(Object.assign({}, replicants_1.obsData.value), { gameLayoutScreenshot: undefined }) });
    companion_1.default.send({ name: 'cfgScenes', value: (0, nodecg_1.get)().bundleConfig.obs.names.scenes });
    companion_1.default.send({ name: 'videos', value: replicants_1.assetsVideos.value });
    companion_1.default.send({ name: 'fastCropOn', value: replicants_1.companionFastCropEnabled.value });
    companion_1.default.send({ name: 'selectedCropItem', value: replicants_1.selectedCropItem.value });
    companion_1.default.send({
        name: 'waitingForSingleCropConfirm',
        value: replicants_1.companionWaitingSingleCropConfirm.value,
    });
    companion_1.default.send({
        name: 'waitingForAllCropConfirm',
        value: replicants_1.companionWaitingAllCropConfirm.value,
    });
});
const actionMap = {
    timer_toggle: actionTimerToggle_1.default,
    player_hud_trigger_toggle: actionPlayerHudTriggerToggle_1.default,
    twitch_commercials_disable: actionTwitchCommercialsDisable_1.default,
    scene_cycle: actionSceneCycle_1.default,
    intermission_scene_change: actionIntermissionSceneChange_1.default,
    video_play: actionVideoPlay_1.default,
    // Yes, this is still allowed :)
    // anything that takes up more than a single line of code should have its own file.
    video_stop: () => intermission_player_1.player.endPlaylistEarly(),
    fast_crop_toggle: () => {
        replicants_1.companionFastCropEnabled.value = !replicants_1.companionFastCropEnabled.value;
    },
    // TODO: move this to own file?
    select_crop_item: (n, value) => {
        const numval = value;
        if (replicants_1.selectedCropItem.value === numval) {
            replicants_1.selectedCropItem.value = -1;
        }
        else {
            replicants_1.selectedCropItem.value = numval;
        }
    },
    modify_crop: actionStreamDeckModifyCrop_1.default,
    reset_crop_selected: actionResetCropSelected_1.default,
    reset_crop_all: actionResetCropAll_1.default,
};
// Listening for any actions triggered from Companion.
companion_1.default.evt.on('action', async (name, value) => {
    if (name in actionMap) {
        await actionMap[name](name, value);
    }
});
