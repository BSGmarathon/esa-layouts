"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const needle_1 = __importDefault(require("needle"));
const path_1 = __importDefault(require("path"));
const stream_1 = require("stream");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
/**
 * Calculates the absolute file path to one of our local replicant schemas.
 * @param schemaName The replicant/schema filename.
 */
function buildSchemaPath(schemaName) {
    return path_1.default.resolve(__dirname, '../../../schemas', `${encodeURIComponent(schemaName)}.json`);
}
class Music {
    constructor(nodecg, config, obs) {
        this.positionTimestamp = 0;
        this.positionInitial = 0;
        this.nodecg = nodecg;
        this.config = config;
        this.obs = obs;
        this.auth = (config.username && config.password)
            ? `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`
            : undefined;
        this.headers = this.auth ? { Authorization: this.auth } : undefined;
        this.musicData = nodecg.Replicant('musicData', { schemaPath: buildSchemaPath('musicData') });
        this.musicData.value.connected = false;
        if (config.enabled) {
            this.setup();
        }
    }
    /**
     * Make a request to the Beefweb foobar2000 plugin.
     * @param method Required HTTP method.
     * @param endpoint The endpoint to request.
     */
    async request(method, endpoint) {
        var _a;
        this.nodecg.log.debug(`[Music] API ${method.toUpperCase()} request processing on ${endpoint}`);
        const resp = await (0, needle_1.default)(method, `http://${this.config.address}/api${endpoint}`, {
            headers: this.headers,
        });
        if (![200, 204].includes((_a = resp.statusCode) !== null && _a !== void 0 ? _a : 0)) {
            const text = await resp.body;
            this.nodecg.log
                .debug(`[Music] API ${method.toUpperCase()} request error on ${endpoint}:`, text);
            throw new Error(text);
        }
        this.nodecg.log.debug(`[Music] API ${method.toUpperCase()} request successful on ${endpoint}`);
        return resp;
    }
    /**
     * Updates the stored position of the current track every second.
     */
    updatePosition() {
        if (this.musicData.value.track && this.musicData.value.playing) {
            this.musicData.value.track.position = ((Date.now() - this.positionTimestamp) / 1000)
                + this.positionInitial;
        }
        else if (this.positionInterval) {
            clearInterval(this.positionInterval);
        }
    }
    /**
     * Sends a "play" command to foobar2000.
     */
    async play() {
        if (!this.config.enabled)
            return;
        try {
            await this.request('post', '/player/play');
            this.nodecg.log.info('[Music] Successfully playing');
        }
        catch (err) {
            this.nodecg.log.warn('[Music] Error playing');
            this.nodecg.log.debug('[Music] Error playing:', err);
        }
    }
    /**
     * Sends a "pause" command to foobar2000.
     */
    async pause() {
        if (!this.config.enabled)
            return;
        try {
            await this.request('post', '/player/pause');
            this.nodecg.log.info('[Music] Successfully paused');
        }
        catch (err) {
            this.nodecg.log.warn('[Music] Error pausing');
            this.nodecg.log.debug('[Music] Error pausing:', err);
        }
    }
    /**
     * Sets up the constant connection to foobar2000.
     */
    async setup() {
        try {
            this.nodecg.log.info('[Music] Attempting connection');
            const resp = await this.request('get', '/query?player=true&trcolumns=%artist%,%title%');
            this.musicData.value.connected = true;
            this.nodecg.log.info('[Music] Connection successful');
            if (!resp.body) {
                throw new Error('body was null');
            }
            const readable = stream_1.Readable.from(resp.body);
            readable.on('data', (chunk) => {
                let msg;
                try {
                    const cleaned = chunk.toString().slice(6).replace(/(\r\n|\n|\r)/gm, '');
                    msg = JSON.parse(cleaned);
                }
                catch (err) {
                    this.nodecg.log.warn('[Music] Error parsing message on connection');
                    this.nodecg.log.debug('[Music] Error parsing message on connection:', err);
                }
                if (!msg || !msg.player) {
                    return;
                }
                if (this.positionInterval) {
                    clearInterval(this.positionInterval);
                }
                const isPlaying = msg.player.playbackState === 'playing';
                this.musicData.value.playing = isPlaying;
                if (msg.player.playbackState === 'stopped') {
                    delete this.musicData.value.track;
                    return;
                }
                if (msg.player.activeItem.duration > 0) {
                    this.musicData.value.track = {
                        artist: msg.player.activeItem.columns[0] || undefined,
                        title: msg.player.activeItem.columns[1] || undefined,
                        position: msg.player.activeItem.position,
                        duration: msg.player.activeItem.duration,
                    };
                    if (isPlaying) {
                        this.positionInitial = msg.player.activeItem.position;
                        this.positionTimestamp = Date.now();
                        this.positionInterval = setInterval(() => this.updatePosition(), 1000);
                    }
                }
            });
            readable.on('close', () => {
                this.nodecg.log.warn('[Music] Connection closed');
            });
            readable.on('error', (err) => {
                this.nodecg.log.warn('[Music] Connection error');
                this.nodecg.log.debug('[Music] Connection error:', err);
            });
            readable.on('end', () => {
                this.musicData.value.connected = false;
                this.nodecg.log.warn('[Music] Connection ended, retrying in 5 seconds');
                setTimeout(() => this.setup(), 5 * 1000);
            });
            // Listen to OBS transitions to play/pause correctly.
            this.obs.conn.on('TransitionBegin', (data) => {
                if (data['to-scene']) {
                    if (data['to-scene'].includes('[M]')) {
                        this.play();
                    }
                    else {
                        this.pause();
                    }
                }
            });
        }
        catch (err) {
            this.musicData.value.connected = false;
            this.nodecg.log.warn('[Music] Connection failed, retrying in 5 seconds');
            this.nodecg.log.debug('[Music] Connection failed, retrying in 5 seconds:', err);
            setTimeout(() => this.setup(), 5 * 1000);
        }
    }
}
const config = (0, nodecg_1.get)().bundleConfig.music;
const music = new Music((0, nodecg_1.get)(), config, obs_1.default); // eslint-disable-line @typescript-eslint/no-unused-vars, max-len
