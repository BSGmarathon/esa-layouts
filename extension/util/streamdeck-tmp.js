"use strict";
// TODO: replace this file when new version is released.
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
const stream_1 = require("stream");
const util = __importStar(require("util"));
// eslint-disable-next-line import/no-extraneous-dependencies
const socket_io_1 = require("socket.io");
/* eslint-enable */
class StreamDeck extends stream_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.debug = false;
        this.buttonLocations = new Map();
        // Can be 0, 1 or 2 depending on what initialisation step we are at.
        this.initStates = new Map();
        this.log = {
            /* eslint-disable no-console */
            shared: (...msg) => {
                console.log(`[node-streamdeck-util] ${msg[0]}`, ...msg.slice(1));
            },
            debug: (...msg) => { if (this.debug)
                this.log.shared(...msg); },
            info: (...msg) => { this.log.shared(...msg); },
            /* eslint-enable */
        };
    }
    /**
     * Start listening for connections from the Stream Deck plugin.
     * @param opts Options object (see below).
     * @param opts.key Secret key that will be used to connect to this server.
     * @param opts.port Port that this server will listen on for connections.
     * @param opts.debug Turn on debug logging to help development.
     */
    listen(opts = { key: 'DEFAULT_KEY', port: 9091, debug: false }) {
        if (this.wss) {
            this.wss.close(); // If server is already active, close it
            this.wss.removeAllListeners();
        }
        this.wss = new socket_io_1.Server(opts.port); // Create WebSocket server
        this.debug = opts.debug || false;
        this.log.debug('WebSocket server created on port %s', opts.port);
        this.wss.use((socket, next) => {
            const { key } = socket.handshake.auth;
            if (key)
                this.log.debug('WebSocket client used key %s', key);
            // Disconnect client if key invalid.
            if (!key || key !== opts.key) {
                this.log.debug('WebSocket client connection refused due to incorrect key');
                socket.disconnect(true);
                return next(new Error('Key is invalid'));
            }
            return next();
        });
        // Triggered when client connects.
        this.wss.on('connection', (socket) => {
            this.log.debug('WebSocket client connected');
            this.initStates.set(socket.id, 0);
            this.emit('open', socket.id);
            socket.on('message', (message) => {
                const msg = JSON.parse(message.toString());
                if (msg.type === 'init') {
                    // Use plugin message.data.pluginUUID instead (somehow, it's not set anywhere else)
                    let initState = this.initStates.get(socket.id) || 0;
                    this.log.debug('WebSocket received plugin UUID: %s', socket.id);
                    if (initState < 2) {
                        initState += 1;
                        this.initStates.set(socket.id, initState);
                        if (initState >= 2)
                            this.emit('init', socket.id);
                    }
                }
                if (msg.type === 'buttonLocationsUpdated') {
                    let initState = this.initStates.get(socket.id) || 0;
                    this.log.debug('WebSocket received updated button locations');
                    this.buttonLocations.set(socket.id, msg.data.buttonLocations);
                    if (initState < 2) {
                        initState += 1;
                        this.initStates.set(socket.id, initState);
                        if (initState >= 2)
                            this.emit('init', socket.id);
                    }
                }
                if (msg.type === 'rawSD') {
                    this.log.debug('WebSocket received raw Stream Deck message:\n%s', util.inspect(msg.data, { depth: null }));
                    this.emit(msg.data.event, socket.id, msg.data);
                    this.emit('message', socket.id, msg.data);
                }
            });
            socket.on('error', (err) => {
                this.log.debug('WebSocket client connection error (%s)', err);
                this.emit('error', socket.id, err);
            });
            socket.once('close', (code, reason) => {
                this.log.debug('WebSocket client connection closed (%s)', `${code}${(reason) ? `, ${reason}` : ''}`);
                this.buttonLocations.delete(socket.id);
                this.initStates.delete(socket.id);
                socket.removeAllListeners();
                this.emit('close', socket.id, code, reason);
            });
        });
    }
    /**
     * Gets all buttonLocations object as received from the Stream Deck plugin.
     */
    getButtonLocations() {
        return this.buttonLocations;
    }
    /**
     * Gets the buttonLocations object as received from the Stream Deck plugin.
     */
    getButtonLocationsFor(socket) {
        return this.buttonLocations.get(socket) || {};
    }
    /**
     * Sends message to the Stream Deck WebSocket connection.
     * as documented on https://docs.elgato.com/sdk/plugins/events-sent
     * Data will be stringified for you.
     * Will return true/false depending on if message was able to be sent.
     * @param data Object formatted to send to the Stream Deck WebSocket connection.
     */
    send(data) {
        if (this.wss) {
            this.wss.send(JSON.stringify(data));
            return true;
        }
        return false;
    }
    /**
     * Get raw WebSocket connection to the plugin backend if available.
     */
    getSocket() {
        return this.wss;
    }
    /**
     * Get an array of all the buttons that are the specified action.
     * @param action Name of the action you're looking for.
     */
    findButtonsWithAction(action) {
        const buttons = [];
        for (const location of this.buttonLocations.values()) {
            Object.keys(location).forEach((device) => {
                Object.keys(location[device]).forEach((row) => {
                    Object.keys(location[device][row]).forEach((column) => {
                        const button = location[device][row][column];
                        if (button && button.action === action) {
                            buttons.push(button);
                        }
                    });
                });
            });
        }
        return buttons;
    }
    /**
     * Update a button's text by it's context.
     * @param context Context of the button.
     * @param text What you want to change the text to.
     */
    updateButtonText(context, text) {
        this.send({
            context,
            event: 'setTitle',
            payload: {
                title: text,
            },
        });
    }
    /**
     * Update the text on all buttons of a cetain action.
     * @param action Name of the action you're looking for.
     * @param text What you want to change the text to.
     */
    setTextOnAllButtonsWithAction(action, text) {
        const buttons = this.findButtonsWithAction(action);
        buttons.forEach((button) => {
            this.updateButtonText(button.context, text);
        });
    }
}
module.exports = StreamDeck;
