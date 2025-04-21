"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
/**
 * Calculates the absolute file path to one of our local replicant schemas.
 * @param schemaName The replicant/schema filename.
 */
function buildSchemaPath(schemaName) {
    return path_1.default.resolve(__dirname, '../../../schemas', `${encodeURIComponent(schemaName)}.json`);
}
class CountdownClass {
    constructor(nodecg) {
        this.countdown = nodecg.Replicant('countdown', { schemaPath: buildSchemaPath('countdown') });
        nodecg.listenFor('startCountdown', (time) => {
            if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
                return;
            }
            const now = new Date();
            const then = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(time.split(':')[0]), Number(time.split(':')[1]));
            if (this.countdownTimeout)
                clearTimeout(this.countdownTimeout);
            const diff = then.getTime() - now.getTime();
            if (diff <= 0)
                return;
            this.countdown.value = {
                originalDuration: diff,
                remaining: diff,
                timestamp: Date.now(),
            };
            this.updateCountdownTimer();
        });
        this.updateCountdownTimer();
    }
    updateCountdownTimer() {
        const cdTimer = this.countdown.value;
        const remaining = cdTimer.originalDuration - (Date.now() - cdTimer.timestamp);
        if (remaining > 0) {
            this.countdown.value.remaining = remaining;
            this.countdownTimeout = setTimeout(() => this.updateCountdownTimer(), 1000);
        }
        else {
            this.countdown.value.remaining = 0;
        }
    }
}
exports.default = CountdownClass;
