"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const nodecg_1 = require("./nodecg");
const obs_1 = __importDefault(require("./obs"));
const rabbitmq_1 = require("./rabbitmq");
/**
 * Calculates the absolute file path to one of our local replicant schemas.
 * @param schemaName The replicant/schema filename.
 */
function buildSchemaPath(schemaName) {
    return path_1.default.resolve(__dirname, '../../../schemas', `${encodeURIComponent(schemaName)}.json`);
}
class MediaBox {
    constructor(nodecg, evt, obs, obsCfg) {
        this.nodecg = nodecg;
        this.obs = obs;
        this.obsCfg = obsCfg;
        this.mediaBox = nodecg.Replicant('mediaBox', { schemaPath: buildSchemaPath('mediaBox') });
        this.prizes = nodecg.Replicant('prizes', {
            schemaPath: buildSchemaPath('prizes'),
            persistent: false,
        });
        this.assetsMediaBoxImages = nodecg.Replicant('assets:media-box-images');
        // ALL OF THESE DISABLED FOR NOW (ESAW24).
        // Manages received donations/subscriptions/cheers.
        /* evt.on('donationFullyProcessed', (data) => {
          if (data.comment_state === 'APPROVED') {
            // eslint-disable-next-line no-underscore-dangle
            this.nodecg.log.debug('[Media Box] Received new donation with ID %s', data._id);
            this.mediaBox.value.alertQueue.push({
              type: 'donation',
              id: uuid(),
              data: {
                name: data.donor_visiblename.replace('(Anonymous)', 'Anonymous'),
                amount: data.amount,
                comment: data.comment || undefined,
              },
            });
          }
        });
        evt.on('newScreenedSub', (data) => {
          this.nodecg.log.debug('[Media Box] Received new subscription');
          this.mediaBox.value.alertQueue.push({
            type: 'subscription',
            id: uuid(),
            data: {
              systemMsg: data.message.tags['system-msg'].replace(/\\s/g, ' '),
              message: data.message.trailing,
            },
          });
        });
        evt.on('newScreenedCheer', (data) => {
          this.nodecg.log.debug('[Media Box] Received new cheer');
          this.mediaBox.value.alertQueue.push({
            type: 'cheer',
            id: uuid(),
            data: {
              name: data.message.tags['display-name'],
              amount: Number(data.message.tags.bits),
              message: data.message.trailing,
            },
          });
        });
    
        nodecg.listenFor('therunggMessage', (msg: string) => {
          this.nodecg.log.debug('[Media Box] Received new therun.gg message');
          this.mediaBox.value.alertQueue.push({
            type: 'therungg',
            id: uuid(),
            data: {
              msg,
            },
          });
        }); */
        this.update();
        setInterval(() => this.update(), 1000);
    }
    pushMerchPurchase({ user, productName, imgURL }) {
        this.nodecg.log.debug('[Media Box] Received new merch purchase');
        this.mediaBox.value.alertQueue.push({
            type: 'merch',
            id: (0, uuid_1.v4)(),
            data: { user, productName, imgURL },
        });
    }
    /**
     * Checks if the supplied type is that of an alert.
     * @param type Type of alert
     */
    isAlertType(type) {
        return ['donation', 'subscription', 'cheer', 'merch', 'therungg'].includes(type);
    }
    /**
     * Get the length in milliseconds a piece of media should remain,
     * -1 if we cannot find any relevant length.
     * @param media media box object, usually from "current" property.
     */
    getLength(media) {
        var _a;
        if (media && this.isAlertType(media.type)) {
            return 15 * 1000; // Alerts have a hardcoded 15 second length for now.
        }
        const length = (_a = this.mediaBox.value.rotationApplicable.find((i) => i.id === (media === null || media === void 0 ? void 0 : media.id))) === null || _a === void 0 ? void 0 : _a.seconds;
        return length ? length * 1000 : -1;
    }
    /**
     * Get the index of the next piece of media in the rotation,
     * 0 if for some reason nothing can be located correctly.
     */
    getNextIndex() {
        const indexID = this.mediaBox.value.rotationApplicable
            .findIndex((i) => { var _a; return i.id === ((_a = this.mediaBox.value.current) === null || _a === void 0 ? void 0 : _a.id); });
        if (indexID >= 0) {
            return indexID + 1;
        }
        return typeof this.mediaBox.value.lastIndex === 'number'
            ? this.mediaBox.value.lastIndex + 1 : 0;
    }
    /**
     * Returns if a prize should be shown or not.
     * @param prize Formatted prize object from the tracker.
     */
    isPrizeApplicable(prize) {
        if (!(prize === null || prize === void 0 ? void 0 : prize.startTime) && !(prize === null || prize === void 0 ? void 0 : prize.endTime))
            return true;
        return !!(prize && prize.startTime && prize.endTime
            && Date.now() > prize.startTime && Date.now() < prize.endTime);
    }
    /**
     * Returns a random applicable prize if one is available.
     */
    getRandomPrize() {
        const applicablePrizes = this.prizes.value.filter((p) => this.isPrizeApplicable(p));
        return applicablePrizes[Math.floor(Math.random() * applicablePrizes.length)];
    }
    /**
     * Handles the cycling of of the current media.
     * @param pause If we should be attempted to "pause" the current media for an alert.
     */
    cycle(pause = false) {
        var _a;
        // If the alert queue has anything in it, we need to handle those first.
        if (this.mediaBox.value.alertQueue.length) {
            if (pause) { // Pause current media element.
                this.mediaBox.value.paused = (0, clone_1.default)(this.mediaBox.value.current);
            }
            this.mediaBox.value.current = {
                type: this.mediaBox.value.alertQueue[0].type,
                id: (0, uuid_1.v4)(),
                mediaUUID: this.mediaBox.value.alertQueue[0].id,
                index: -1,
                timestamp: Date.now(),
                timeElapsed: 0,
            };
            return;
        }
        if (this.mediaBox.value.rotationApplicable.length) {
            // Resume paused media element if applicable.
            if (this.mediaBox.value.paused) {
                const toResume = (0, clone_1.default)(this.mediaBox.value.paused);
                toResume.timestamp = Date.now();
                this.mediaBox.value.current = toResume;
                this.mediaBox.value.paused = null;
                return;
            }
            const index = this.getNextIndex() < this.mediaBox.value.rotationApplicable.length
                ? this.getNextIndex() : 0;
            const media = this.mediaBox.value.rotationApplicable[index];
            const mUUID = media.type === 'prize_generic'
                ? (((_a = this.getRandomPrize()) === null || _a === void 0 ? void 0 : _a.id.toString()) || '-1') : media.mediaUUID;
            this.mediaBox.value.current = {
                type: media.type,
                id: media.id,
                mediaUUID: mUUID,
                index,
                timestamp: Date.now(),
                timeElapsed: 0,
            };
            return;
        }
        this.nodecg.log.debug('[Media Box] No media in rotation to cycle to, will wait');
        this.mediaBox.value.current = null;
        this.mediaBox.value.paused = null;
    }
    /**
     * This runs every second, all of the time.
     */
    update() {
        // Filters rotation for items only applicable/available at this moment.
        const rotationApplicableLengthOld = this.mediaBox.value.rotationApplicable.length;
        this.mediaBox.value.rotationApplicable = this.mediaBox.value.rotation.filter((m) => {
            // If the item is set to *not* appear on the intermission,
            // exclude it if we're on an intermission scene.
            const { scenes } = this.obsCfg.names;
            const intermissionScenes = [
                (scenes === null || scenes === void 0 ? void 0 : scenes.commercials) ? this.obs.findScene(scenes.commercials) : undefined,
                (scenes === null || scenes === void 0 ? void 0 : scenes.intermission) ? this.obs.findScene(scenes.intermission) : undefined,
            ].filter(Boolean);
            if (!m.showOnIntermission && intermissionScenes.includes(this.obs.currentScene)) {
                return false;
            }
            // Only rotate to image if the asset actually exists.
            if (m.type === 'image') {
                return !!this.assetsMediaBoxImages.value.find((i) => i.sum === m.mediaUUID);
            }
            // Only show the generic prize element if there are applicable prizes to fill it with.
            if (m.type === 'prize_generic') {
                return !!this.prizes.value.filter((p) => this.isPrizeApplicable(p)).length;
            }
            // Only show prize if applicable right now.
            if (m.type === 'prize') {
                return this.isPrizeApplicable(this.prizes.value
                    .find((p) => p.id.toString() === m.mediaUUID));
            }
            // Always show text.
            return m.type === 'text';
        });
        if (this.mediaBox.value.rotationApplicable.length !== rotationApplicableLengthOld) {
            this.nodecg.log.debug('[Media Box] Applicable rotation length changed');
        }
        // If we have no piece of media, check if there is anything to show.
        if (!this.mediaBox.value.current) {
            if (this.mediaBox.value.rotationApplicable.length || this.mediaBox.value.alertQueue.length) {
                this.nodecg.log.debug('[Media Box] '
                    + `${this.mediaBox.value.alertQueue.length ? 'Alert' : 'Media'} available, will cycle`);
                this.cycle();
            }
            return;
        }
        // If we have a current piece of media, need to check if it still should be shown.
        const addedTime = Date.now() - this.mediaBox.value.current.timestamp;
        const timeElapsed = this.mediaBox.value.current.timeElapsed + addedTime;
        const index = this.mediaBox.value.rotationApplicable
            .findIndex((i) => { var _a; return i.id === ((_a = this.mediaBox.value.current) === null || _a === void 0 ? void 0 : _a.id); });
        // Cycle if it is time to remove the current media.
        if ((index < 0 && !this.isAlertType(this.mediaBox.value.current.type))
            || this.getLength(this.mediaBox.value.current) <= timeElapsed) {
            // If this is an alert, we also need to remove that one from the queue.
            if (this.isAlertType(this.mediaBox.value.current.type)) {
                const alertIndex = this.mediaBox.value.alertQueue
                    .findIndex((a) => { var _a; return a.id === ((_a = this.mediaBox.value.current) === null || _a === void 0 ? void 0 : _a.mediaUUID); });
                if (alertIndex >= 0) {
                    this.mediaBox.value.alertQueue.splice(alertIndex, 1);
                }
            }
            else {
                this.mediaBox.value.lastIndex = this.mediaBox.value.current.index;
            }
            this.nodecg.log.debug('[Media Box] Current media time finished, will cycle');
            this.cycle();
            return;
        }
        if (!this.isAlertType(this.mediaBox.value.current.type)) {
            this.mediaBox.value.current.index = index;
        }
        this.mediaBox.value.current.timestamp = Date.now();
        this.mediaBox.value.current.timeElapsed = timeElapsed;
        // If there are any alerts to show, we should do that now.
        if (!this.isAlertType(this.mediaBox.value.current.type) && this.mediaBox.value.alertQueue.length) {
            this.nodecg.log.debug('[Media Box] Alert available, will cycle');
            this.cycle(true);
        }
    }
}
const mb = new MediaBox((0, nodecg_1.get)(), rabbitmq_1.mq.evt, obs_1.default, (0, nodecg_1.get)().bundleConfig.obs);
exports.default = mb;
