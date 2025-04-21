"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_1 = require("./nodecg");
const osc_1 = __importDefault(require("osc"));
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
class X32 extends tiny_typed_emitter_1.TypedEmitter {
    constructor(config) {
        super();
        this.ready = false;
        this.faders = {};
        this.fadersExpected = {};
        this.fadersInterval = {};
        this.config = config;
        if (config.enabled) {
            (0, nodecg_1.get)().log.info('[X32] Setting up connection');
            this.conn = new osc_1.default.UDPPort({
                localAddress: '0.0.0.0',
                localPort: config.localPort,
                remoteAddress: config.ip,
                remotePort: config.xr18 ? 10024 : 10023,
                metadata: true,
            });
            this.conn.on('error', (err) => {
                (0, nodecg_1.get)().log.warn('[X32] Error on connection');
                (0, nodecg_1.get)().log.debug('[X32] Error on connection:', err);
                this.emit('error', err);
            });
            this.conn.on('message', (message) => {
                this.handleFaderEvent(message);
                this.emit('message', message);
            });
            this.conn.on('close', () => {
                (0, nodecg_1.get)().log.info('[X32] Connection closed');
                this.ready = false;
            });
            this.conn.on('open', () => {
                (0, nodecg_1.get)().log.info('[X32] Connection opened');
            });
            this.conn.on('ready', () => {
                (0, nodecg_1.get)().log.info('[X32] Connection ready');
                // Subscribe/renew to updates (must be done every <10 seconds).
                if (this.conn) {
                    this.conn.send({ address: '/xremote', args: [] });
                }
                setInterval(() => {
                    if (this.conn) {
                        this.conn.send({ address: '/xremote', args: [] });
                    }
                }, 8 * 1000);
                this.ready = true;
                this.emit('ready');
            });
            this.conn.open();
        }
    }
    /**
     * Just set a specific fader to the supplied value.
     * @param name Full name of fader (example: /dca/1/fader).
     * @param value Value to set (0.0 - 1.0).
     */
    setFader(name, value) {
        if (!this.config.enabled || !this.conn) {
            throw new Error('No connection available');
        }
        (0, nodecg_1.get)().log.debug(`[X32] Attempting to set fader on ${name} to ${value}`);
        this.conn.send({
            address: '/subscribe',
            args: [{ type: 's', value: name }, { type: 'i', value: 0 }],
        });
        this.conn.send({ address: name, args: [{ type: 'f', value }] });
    }
    /**
     * Fades up/down the supplied fader using the specified settings.
     * @param name Full name of fader (example: /dca/1/fader).
     * @param startValue Value to start at (0.0 - 1.0).
     * @param endValue Value to end at (0.0 - 1.0).
     * @param length Milliseconds to spend doing fade.
     */
    fade(name, startValue, endValue, length) {
        if (!this.config.enabled || !this.conn) {
            throw new Error('No connection available');
        }
        // Will stop doing a fade if we receive another one while the old one is running, for safety.
        if (this.fadersExpected[name]) {
            clearInterval(this.fadersInterval[name]);
            delete this.fadersExpected[name];
        }
        (0, nodecg_1.get)().log.debug(`[X32] Attempting to fade ${name} `
            + `(${startValue} => ${endValue}) for ${length}ms`);
        let currentValue = startValue;
        const increase = startValue < endValue;
        const stepCount = length / 100;
        const stepSize = (endValue - startValue) / stepCount;
        this.fadersExpected[name] = { value: endValue, increase, seenOnce: false };
        this.conn.send({
            address: '/subscribe',
            args: [{ type: 's', value: name }, { type: 'i', value: 0 }],
        });
        this.fadersInterval[name] = setInterval(() => {
            if ((increase && currentValue >= endValue) || (!increase && currentValue <= endValue)) {
                clearInterval(this.fadersInterval[name]);
                delete this.fadersExpected[name];
            }
            if (this.conn) {
                this.conn.send({ address: name, args: [{ type: 'f', value: currentValue }] });
            }
            currentValue += stepSize;
            if ((increase && currentValue > endValue) || (!increase && currentValue < endValue)) {
                currentValue = endValue;
            }
        }, 100);
    }
    handleFaderEvent(message) {
        // I don't trust myself with all posibilities, so wrapping this up.
        try {
            if (message.address.endsWith('/fader')) {
                const args = message.args[0];
                this.faders[message.address] = args.value;
                // Check if we're done fading and clear intervals if needed.
                if (this.fadersExpected[message.address]) {
                    const exp = this.fadersExpected[message.address];
                    // Sometimes we receive a delayed message, so we wait until
                    // we've at least seen 1 value in the correct range.
                    if ((exp.increase && exp.value > args.value)
                        || (!exp.increase && exp.value < args.value)) {
                        exp.seenOnce = true;
                    }
                    if (exp.seenOnce && ((exp.increase && exp.value <= args.value)
                        || (!exp.increase && exp.value >= args.value))) {
                        if (this.conn) {
                            this.conn.send({
                                address: message.address,
                                args: [{ type: 'f', value: exp.value }],
                            });
                        }
                        clearInterval(this.fadersInterval[message.address]);
                        delete this.fadersExpected[message.address];
                    }
                }
            }
        }
        catch (err) {
            (0, nodecg_1.get)().log.warn('[X32] Error parsing message');
            (0, nodecg_1.get)().log.debug('[X32] Error parsing message:', err);
        }
    }
}
const x32 = new X32((0, nodecg_1.get)().bundleConfig.x32);
exports.default = x32;
