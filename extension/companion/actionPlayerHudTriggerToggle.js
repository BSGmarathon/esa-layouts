"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const replicants_1 = require("@esa-layouts/util/replicants");
// Used to toggle the "Player HUD Trigger" type.
function actionPlayerHudTriggerToggle(name, value) {
    const val = value;
    if (replicants_1.streamDeckData.value.playerHUDTriggerType === val) {
        delete replicants_1.streamDeckData.value.playerHUDTriggerType;
    }
    else {
        replicants_1.streamDeckData.value.playerHUDTriggerType = val;
    }
}
exports.default = actionPlayerHudTriggerToggle;
