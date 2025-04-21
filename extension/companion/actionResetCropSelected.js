"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const replicants_1 = require("@esa-layouts/util/replicants");
const layouts_1 = require("@esa-layouts/layouts");
let timeout;
async function actionResetCropSelected() {
    if (replicants_1.selectedCropItem.value < 0) {
        return;
    }
    if (!replicants_1.companionWaitingSingleCropConfirm.value) {
        replicants_1.companionWaitingSingleCropConfirm.value = true;
        // reset after 10 seconds in case of accidental press
        timeout = setTimeout(() => {
            replicants_1.companionWaitingSingleCropConfirm.value = false;
        }, 10 * 1000);
        return;
    }
    clearTimeout(timeout);
    timeout = undefined;
    replicants_1.companionWaitingSingleCropConfirm.value = false;
    await (0, layouts_1.changeCropFromFromStreamDeck)(undefined, undefined);
}
exports.default = actionResetCropSelected;
