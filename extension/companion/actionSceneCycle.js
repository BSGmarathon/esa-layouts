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
Object.defineProperty(exports, "__esModule", { value: true });
const replicants_1 = require("@esa-layouts/util/replicants");
const nodecg_1 = require("@esa-layouts/util/nodecg");
const speedcontrol_1 = require("@esa-layouts/util/speedcontrol");
const obs_1 = __importStar(require("@esa-layouts/util/obs"));
const config = (0, nodecg_1.get)().bundleConfig;
// Used to cycle scenes if applicable, usually used by hosts.
// Some of this is copied from obs-data.ts
async function actionSceneCycle() {
    const { disableTransitioning, transitioning, connected } = replicants_1.obsData.value;
    const { scenes } = config.obs.names;
    // If transitioning is disabled, or we *are* transitioning, and OBS is connected,
    // and the timer is not running or paused, we can trigger these actions.
    if (!disableTransitioning && !transitioning && connected
        && !['running', 'paused'].includes(speedcontrol_1.sc.timer.value.state)) {
        // If the current scene is any of the applicable intermission ones, the next scene
        // will be the game layout, so change to it.
        if (obs_1.default.isCurrentScene(scenes.commercials)
            || obs_1.default.isCurrentScene(scenes.intermission)
            || obs_1.default.isCurrentScene(scenes.intermissionCrowd)) {
            await (0, obs_1.changeScene)({ scene: config.obs.names.scenes.gameLayout });
            // If the current scene is the game layout, the next scene will be the intermission,
            // so change to it.
        }
        else if (obs_1.default.isCurrentScene(scenes.gameLayout)) {
            // If the commercial intermission scene exists, use that, if not, use the regular one.
            if (obs_1.default.findScene(scenes.commercials)) {
                await (0, obs_1.changeScene)({ scene: scenes.commercials });
            }
            else {
                await (0, obs_1.changeScene)({ scene: scenes.intermission });
            }
        }
    }
}
exports.default = actionSceneCycle;
