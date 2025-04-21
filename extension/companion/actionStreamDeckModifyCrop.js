"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layouts_1 = require("@esa-layouts/layouts");
const replicants_1 = require("../util/replicants");
async function actionStreamDeckModifyCrop(name, value) {
    if (replicants_1.selectedCropItem.value < 0) {
        return;
    }
    const settings = value;
    if (replicants_1.companionFastCropEnabled.value) {
        settings.inc_dec *= 20;
    }
    await (0, layouts_1.changeCropFromFromStreamDeck)(settings.side, settings.inc_dec);
}
exports.default = actionStreamDeckModifyCrop;
