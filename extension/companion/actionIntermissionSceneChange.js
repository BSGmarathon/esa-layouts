"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_1 = require("@esa-layouts/util/nodecg");
const obs_1 = require("@esa-layouts/util/obs");
const config = (0, nodecg_1.get)().bundleConfig;
// Used to change between intermission scenes using a supplied scene name config key.
async function actionIntermissionSceneChange(name, value) {
    const { scenes } = config.obs.names;
    const val = value;
    const scene = scenes[val];
    await (0, obs_1.changeScene)({ scene, force: true });
}
exports.default = actionIntermissionSceneChange;
