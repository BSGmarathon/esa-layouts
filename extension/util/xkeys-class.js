"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const xkeys_1 = require("xkeys");
class XKeysClass extends events_1.EventEmitter {
    initPanel() {
        if (!this.panel)
            return;
        this.nodecg.log.info('[XKeys] Panel successfully found');
        this.panel.on('error', (err) => {
            this.nodecg.log.debug('[XKeys] Panel error:', err);
        });
        // Turn off all lights.
        this.panel.setAllBacklights(false);
        // Set intensity to full.
        this.panel.setBacklightIntensity(255);
        // Set flashing frequency.
        this.panel.setFrequency(50);
        this.panel.on('down', (keyIndex) => {
            this.nodecg.log.debug('[XKeys] Key pressed:', keyIndex);
            this.emit('down', keyIndex);
        });
        this.panel.on('up', (keyIndex) => {
            this.nodecg.log.debug('[XKeys] Key released:', keyIndex);
            this.emit('up', keyIndex);
        });
        this.panel.on('jog', (index, position) => {
            this.nodecg.log.debug(`[XKeys] Jog ${index} moved:`, position);
            this.emit('jog', index, position);
        });
        this.panel.on('shuttle', (index, position) => {
            this.nodecg.log.debug(`[XKeys] Shuttle ${index} moved:`, position);
            this.emit('shuttle', index, position);
        });
        this.panel.on('disconnected', () => {
            this.nodecg.log.debug('[XKeys] Panel disconnected');
        });
        this.panel.on('reconnected', () => {
            this.nodecg.log.debug('[XKeys] Panel reconnected');
        });
    }
    constructor(nodecg, config) {
        super();
        this.nodecg = nodecg;
        this.config = config;
        if (config.enabled) {
            const watcher = new xkeys_1.XKeysWatcher();
            this.nodecg.log.info('[XKeys] Watching for panel');
            watcher.on('connected', (xkeysPanel) => {
                this.panel = xkeysPanel;
                this.initPanel();
            });
            watcher.on('error', (err) => {
                this.nodecg.log.debug('[XKeys] Watcher error:', err);
            });
        }
    }
    setBacklight(keyIndex, on = true, redLight, flashing) {
        // XKeys not enabled, don't even try to set.
        if (!this.config.enabled)
            return;
        if (!this.panel) {
            this.nodecg.log.warn(`[XKeys] Cannot set backlight on ${keyIndex}, panel not connected`);
            return;
        }
        if (!Number.isNaN(Number(keyIndex))) {
            const colour = redLight ? 'red' : 'blue';
            this.panel.setBacklight(Number(keyIndex), on ? colour : false, flashing);
        }
    }
}
exports.default = XKeysClass;
