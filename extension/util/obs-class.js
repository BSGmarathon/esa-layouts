"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const events_1 = require("events");
const obs_websocket_js_1 = __importDefault(require("obs-websocket-js"));
const string_similarity_1 = require("string-similarity");
class OBS extends events_1.EventEmitter {
    constructor(nodecg, config) {
        super();
        this.conn = new obs_websocket_js_1.default();
        this.sceneList = [];
        this.connected = false;
        this.nodecg = nodecg;
        this.config = config;
        if (config.enabled) {
            nodecg.log.info('[OBS] Setting up connection');
            this.connect();
            this.conn.on('ConnectionClosed', () => {
                this.connected = false;
                this.emit('connectionStatusChanged', this.connected);
                nodecg.log.warn('[OBS] Connection lost, retrying in 5 seconds');
                setTimeout(() => this.connect(), 5000);
            });
            this.conn.on('CurrentProgramSceneChanged', (data) => {
                const lastScene = this.currentScene;
                if (lastScene !== data.sceneName) {
                    this.currentScene = data.sceneName;
                    this.emit('currentSceneChanged', this.currentScene, lastScene);
                }
            });
            this.conn.on('SceneListChanged', async ({ scenes }) => {
                this.sceneList = scenes
                    .sort((s, b) => b.sceneIndex - s.sceneIndex)
                    .map((s) => s.sceneName);
                this.emit('sceneListChanged', this.sceneList);
            });
            this.conn.on('StreamStateChanged', ({ outputActive }) => {
                this.streaming = outputActive;
                this.emit('streamingStatusChanged', this.streaming, !this.streaming);
            });
            this.conn.on('ConnectionError', (err) => {
                nodecg.log.warn('[OBS] Connection error');
                nodecg.log.debug('[OBS] Connection error:', err);
            });
            // @ts-expect-error better types are needed.
            this.conn.on('SceneTransitionStarted', (data) => {
                this.emit('transitionStarted', data.toScene, data.fromScene);
            });
            this.conn.on('Identified', () => {
                // wait a few seconds to make sure OBS is properly loaded.
                // Otherwise, we'll get "OBS is not ready to perform the request"
                setTimeout(() => {
                    this.emit('ready');
                }, 5 * 1000);
            });
        }
    }
    async connect() {
        try {
            let addr = this.config.address;
            if (!addr.startsWith('ws://')) {
                addr = `ws://${addr}`;
            }
            await this.conn.connect(addr, this.config.password);
            this.connected = true;
            const scenes = await this.conn.call('GetSceneList');
            // Get current scene on connection.
            const lastScene = this.currentScene;
            if (lastScene !== scenes.currentProgramSceneName) {
                this.currentScene = scenes.currentProgramSceneName;
            }
            // Get scene list on connection.
            const oldList = (0, clone_1.default)(this.sceneList);
            const newList = scenes.scenes
                .sort((s, b) => b.sceneIndex - s.sceneIndex)
                .map((s) => s.sceneName);
            if (JSON.stringify(newList) !== JSON.stringify(oldList)) {
                this.sceneList = newList;
            }
            // Get streaming status on connection.
            const streamingStatus = await this.conn.call('GetStreamStatus');
            const lastStatus = this.streaming;
            if (streamingStatus.outputActive !== lastStatus) {
                this.streaming = streamingStatus.outputActive;
            }
            // Emit changes after everything start up related has finished.
            this.emit('connectionStatusChanged', this.connected);
            if (lastScene !== scenes.currentProgramSceneName) {
                this.emit('currentSceneChanged', this.currentScene, lastScene);
            }
            if (JSON.stringify(newList) !== JSON.stringify(oldList)) {
                this.emit('sceneListChanged', this.sceneList);
            }
            if (streamingStatus.outputActive !== lastStatus) {
                this.emit('streamingStatusChanged', this.streaming, lastStatus);
            }
            this.nodecg.log.info('[OBS] Connection successful');
        }
        catch (err) {
            this.conn.disconnect();
            this.nodecg.log.warn('[OBS] Connection error');
            this.nodecg.log.debug('[OBS] Connection error:', err);
        }
    }
    /**
     * Find scene based on string; at least the start of the name should be supplied.
     * @param name Name of scene, at least starting of name.
     */
    findScene(name) {
        let match;
        const matches = this.sceneList.filter((s) => s.startsWith(name));
        if (matches.length > 1) {
            const bestMatches = (0, string_similarity_1.findBestMatch)(name, matches);
            match = bestMatches.bestMatch.target;
        }
        else if (matches.length === 1) {
            [match] = matches;
        }
        return match;
    }
    /**
     * Check if we are on a specified scene; at least the start of the name should be supplied.
     * @param name Name of scene to check we are on, at least starting of name.
     */
    isCurrentScene(name) {
        return !!this.currentScene && this.currentScene === this.findScene(name);
    }
    /**
     * Change to the OBS scene with the closest matched name.
     * @param name Name of the scene.
     */
    async changeScene(name) {
        if (!this.config.enabled || !this.connected) {
            // OBS not enabled, don't even try to set.
            throw new Error('No OBS connection available');
        }
        try {
            const scene = this.findScene(name);
            if (scene) {
                await this.conn.call('SetCurrentProgramScene', {
                    sceneName: scene,
                });
            }
            else {
                throw new Error('Scene could not be found');
            }
        }
        catch (err) {
            this.nodecg.log.warn(`[OBS] Cannot change scene [${name}]`);
            this.nodecg.log.debug(`[OBS] Cannot change scene [${name}]: ${err.error || err}`);
            throw err;
        }
    }
    /**
     * Get named source's current settings.
     * @param sourceName Name of the source.
     */
    async getSourceSettings(sourceName) {
        if (!this.config.enabled || !this.connected) {
            // OBS not enabled, don't even try to set.
            throw new Error('No connection available');
        }
        try {
            const resp = await this.conn.call('GetInputSettings', {
                inputName: sourceName,
            });
            return {
                inputKind: resp.inputKind,
                sourceSettings: resp.inputSettings,
            };
        }
        catch (err) {
            this.nodecg.log.warn(`[OBS] Cannot get source settings [${sourceName}]`);
            this.nodecg.log.debug(`[OBS] Cannot get source settings [${sourceName}]: `
                + `${err.error || err}`);
            throw err;
        }
    }
    /**
     * Modify a sources settings.
     * @param sourceName Name of the source.
     * @param sourceType Source type (has the be the internal name, not the display name).
     * @param sourceSettings Settings you wish to pass to OBS to change.
     */
    // eslint-disable-next-line max-len
    async setSourceSettings(sourceName, sourceSettings) {
        if (!this.config.enabled || !this.connected) {
            // OBS not enabled, don't even try to set.
            throw new Error('No connection available');
        }
        try {
            await this.conn.call('SetInputSettings', {
                inputName: sourceName,
                inputSettings: sourceSettings,
            });
        }
        catch (err) {
            this.nodecg.log.warn(`[OBS] Cannot set source settings [${sourceName}]`);
            this.nodecg.log.debug(`[OBS] Cannot set source settings [${sourceName}]: `
                + `${err.error || err}`);
            throw err;
        }
    }
    async getSceneItemSettings(scene, item) {
        // None of this is properly documented btw.
        // I had to search their discord for this information.
        const response = await this.conn.callBatch([
            {
                requestType: 'GetSceneItemId',
                requestData: {
                    sceneName: scene,
                    sourceName: item,
                },
                // @ts-expect-error This is valid, just undocumented and not typed in obs-ws-js.
                outputVariables: {
                    sceneItemIdVariable: 'sceneItemId',
                },
            },
            {
                requestType: 'GetSceneItemTransform',
                // @ts-expect-error the sceneItemId var is optional cuz of the input vars
                requestData: {
                    sceneName: scene,
                },
                inputVariables: {
                    sceneItemId: 'sceneItemIdVariable',
                },
            },
            {
                requestType: 'GetSceneItemEnabled',
                // @ts-expect-error the sceneItemId var is optional cuz of the input vars
                requestData: {
                    sceneName: scene,
                },
                inputVariables: {
                    sceneItemId: 'sceneItemIdVariable',
                },
            },
        ]);
        const transformRes = response[1].responseData;
        const enabledRes = response[2].responseData;
        return {
            sceneItemTransform: transformRes.sceneItemTransform,
            sceneItemEnabled: enabledRes.sceneItemEnabled,
        };
    }
    /**
     * Resets the scene item, then sets some properties if possible.
     * @param scene Name of scene that item is in
     * @param item Name of item
     * @param area Area object (as used in capturePositions): x, y, width, height
     * @param crop Crop object: top, bottom, left, right
     * @param visible If the source should be visible or not
     */
    async configureSceneItem(scene, item, area, crop, visible) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        try {
            if (!this.config.enabled || !this.connected) {
                // OBS not enabled, don't even try to set.
                throw new Error('No connection available');
            }
            // None of this is properly documented btw.
            // I had to search their discord for this information.
            await this.conn.callBatch([
                {
                    requestType: 'GetSceneItemId',
                    requestData: {
                        sceneName: scene,
                        sourceName: item,
                    },
                    // @ts-expect-error This is valid, just undocumented and not typed in obs-ws-js.
                    outputVariables: {
                        sceneItemIdVariable: 'sceneItemId',
                    },
                },
                {
                    requestType: 'SetSceneItemTransform',
                    // @ts-expect-error the sceneItemId var is optional cuz of the input vars
                    requestData: {
                        sceneName: scene,
                        sceneItemTransform: {
                            boundsHeight: (_a = area === null || area === void 0 ? void 0 : area.height) !== null && _a !== void 0 ? _a : null,
                            boundsType: 'OBS_BOUNDS_STRETCH',
                            boundsWidth: (_b = area === null || area === void 0 ? void 0 : area.width) !== null && _b !== void 0 ? _b : null,
                            positionX: (_c = area === null || area === void 0 ? void 0 : area.x) !== null && _c !== void 0 ? _c : null,
                            positionY: (_d = area === null || area === void 0 ? void 0 : area.y) !== null && _d !== void 0 ? _d : null,
                            cropBottom: (_e = crop === null || crop === void 0 ? void 0 : crop.bottom) !== null && _e !== void 0 ? _e : null,
                            cropLeft: (_f = crop === null || crop === void 0 ? void 0 : crop.left) !== null && _f !== void 0 ? _f : null,
                            cropRight: (_g = crop === null || crop === void 0 ? void 0 : crop.right) !== null && _g !== void 0 ? _g : null,
                            cropTop: (_h = crop === null || crop === void 0 ? void 0 : crop.top) !== null && _h !== void 0 ? _h : null,
                        },
                    },
                    inputVariables: {
                        sceneItemId: 'sceneItemIdVariable',
                    },
                },
                {
                    requestType: 'SetSceneItemEnabled',
                    // @ts-expect-error the sceneItemId var is optional cuz of the input vars
                    requestData: {
                        sceneName: scene,
                        sceneItemEnabled: visible !== null && visible !== void 0 ? visible : false,
                    },
                    inputVariables: {
                        sceneItemId: 'sceneItemIdVariable',
                    },
                },
            ]);
        }
        catch (err) {
            this.nodecg.log.warn(`[OBS] Cannot configure scene item [${scene}: ${item}]`);
            this.nodecg.log.debug(`[OBS] Cannot configure scene item [${scene}: ${item}]: `
                + `${err.error || err}`);
            throw err;
        }
    }
}
exports.default = OBS;
