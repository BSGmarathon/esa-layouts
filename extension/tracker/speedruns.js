"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpeedrun = void 0;
const needle_1 = __importDefault(require("needle"));
const nodecg_1 = require("../util/nodecg");
const index_1 = require("./index");
const utils_1 = require("./utils");
let speedrunCache = {};
async function updateSpeedrunCache() {
    var _a;
    try {
        const resp = await (0, needle_1.default)('get', (0, utils_1.trackerUrl)(`/api/v2/events/${index_1.eventInfo[0].id}/runs/`), {
            cookies: (0, index_1.getCookies)(),
        });
        if (!resp.statusCode || resp.statusCode >= 300 || resp.statusCode < 200) {
            throw new Error(`status code ${(_a = resp.statusCode) !== null && _a !== void 0 ? _a : 'unknown'} for speedrun fetch`);
        }
        if (!Array.isArray(resp.body.results)) {
            throw new Error('received non-array type');
        }
        const speedruns = resp.body.results;
        speedrunCache = {};
        speedruns.forEach((speedrun) => {
            speedrunCache[speedrun.id] = speedrun;
        });
    }
    catch (err) {
        (0, nodecg_1.get)().log.warn('[Tracker] Error updating speedrun cache');
        (0, nodecg_1.get)().log.debug('[Tracker] Error updating speedrun cache:', err);
    }
}
// eslint-disable-next-line import/prefer-default-export
async function getSpeedrun(runId) {
    if (!(runId in speedrunCache)) {
        await updateSpeedrunCache();
    }
    return speedrunCache[runId];
}
exports.getSpeedrun = getSpeedrun;
