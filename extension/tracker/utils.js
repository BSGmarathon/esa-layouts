"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackerAdminUrl = exports.trackerUrl = void 0;
const nodecg_1 = require("@esa-layouts/util/nodecg");
const config = (0, nodecg_1.get)().bundleConfig.tracker;
function getTrackerBaseUrl() {
    const addr = config.address;
    const proto = addr.startsWith('http') ? '' : 'https://';
    return `${proto}${addr}`;
}
function trackerUrl(path) {
    const addr = getTrackerBaseUrl();
    return `${addr}/tracker${path}`;
}
exports.trackerUrl = trackerUrl;
function trackerAdminUrl(path) {
    const addr = getTrackerBaseUrl();
    return `${addr}/admin${path}`;
}
exports.trackerAdminUrl = trackerAdminUrl;
