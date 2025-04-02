"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const needle_1 = __importDefault(require("needle"));
const speedruns_1 = require("@esa-layouts/tracker/speedruns");
const _1 = require(".");
const nodecg_1 = require("../util/nodecg");
const replicants_1 = require("../util/replicants");
const utils_1 = require("./utils");
const eventConfig = (0, nodecg_1.get)().bundleConfig.event;
const { useTestData } = (0, nodecg_1.get)().bundleConfig;
const refreshTime = 30 * 1000; // Get bids every 30s.
// TODO: /bids/tree helps with option mapping
// Processes the response from the API.
async function processRawBids(rawBids) {
    var _a;
    const parentBids = {};
    const childBids = [];
    for (const bid of rawBids) {
        // Ignore denied/pending entries.
        if (bid.state === 'DENIED' || bid.state === 'PENDING') {
            // eslint-disable-next-line no-continue
            continue;
        }
        // If parent is set, this is an option for a bid war.
        if (bid.parent) {
            childBids.push(bid);
        }
        else {
            const speedrunForBid = await (0, speedruns_1.getSpeedrun)(bid.speedrun);
            parentBids[bid.id] = {
                description: bid.shortdescription || bid.description || undefined,
                id: bid.id,
                name: bid.name,
                total: bid.total,
                game: speedrunForBid.name,
                category: speedrunForBid.category,
                endTime: bid.close_at
                    ? Date.parse(bid.close_at) : undefined,
                war: !bid.istarget,
                allowUserOptions: !bid.istarget && ((_a = bid.allowuseroptions) !== null && _a !== void 0 ? _a : false),
                options: [],
                goal: bid.goal || undefined,
            };
        }
    }
    childBids.forEach((bid) => {
        // If we have a parent for this child, add it to the parent.
        if (parentBids[bid.parent]) {
            parentBids[bid.parent].options.push({
                id: bid.id,
                parent: bid.parent,
                name: bid.name,
                total: bid.total,
            });
        }
    });
    // Transfer object made above to an array instead.
    const bidsArray = Object.keys(parentBids).map((bidID) => {
        const bid = parentBids[bidID];
        // Sort bid war options from largest to smallest.
        if (bid.options && bid.options.length) {
            bid.options = bid.options.sort((a, b) => {
                // TODO: revert if we want this
                // if (a.total > b.total) {
                //   return -1;
                // }
                // if (a.total < b.total) {
                //   return 1;
                // }
                // return 0;
                if (a.id > b.id) {
                    return 1;
                }
                if (a.id < b.id) {
                    return -1;
                }
                return 0;
            });
        }
        return bid;
    });
    // Sort by earliest first.
    bidsArray.sort((a, b) => {
        if (!a.endTime || !b.endTime || a.endTime < b.endTime) {
            return -1;
        }
        if (a.endTime > b.endTime) {
            return 1;
        }
        return 0;
    });
    // Filter out any bid wars with 0 options that don't allow user options.
    bidsArray.filter((bid) => (!bid.war || (bid.war && (bid.options.length || !bid.allowUserOptions))));
    return bidsArray;
}
// Get the open bids from the API.
async function updateBids() {
    var _a;
    try {
        const resp = await (0, needle_1.default)('get', (0, utils_1.trackerUrl)(`/api/v2/events/${_1.eventInfo[eventConfig.thisEvent - 1].id}/bids/?state=OPENED`), {
            cookies: (0, _1.getCookies)(),
        });
        if (!resp.statusCode || resp.statusCode >= 300 || resp.statusCode < 200) {
            throw new Error(`status code ${(_a = resp.statusCode) !== null && _a !== void 0 ? _a : 'unknown'}`);
        }
        if (!Array.isArray(resp.body.results)) {
            throw new Error('received non-array type');
        }
        const currentBids = await processRawBids(resp.body.results);
        if (!Array.isArray(currentBids)) {
            throw new Error('currentBids result was non-array type');
        }
        (0, nodecg_1.get)().log.debug('[Tracker] Updated bids:', JSON.stringify(currentBids));
        replicants_1.bids.value = currentBids;
    }
    catch (err) {
        (0, nodecg_1.get)().log.warn('[Tracker] Error updating bids');
        (0, nodecg_1.get)().log.debug('[Tracker] Error updating bids:', err);
        replicants_1.bids.value.length = 0; // Clear the array so we do not display incorrect information.
    }
    setTimeout(updateBids, refreshTime);
}
// eslint-disable-next-line import/prefer-default-export
function setup() {
    if (!useTestData) {
        updateBids();
    }
    else {
        // Test Data
        const randGoal = Math.floor(Math.random() * 1000);
        const randBidWarID = Math.floor(Math.random() * 1000);
        const randBidWarAmount = Math.random() * 1000;
        replicants_1.bids.value = [
            {
                id: Math.floor(Math.random() * 1000),
                name: 'Test Goal',
                description: 'This is a test description.',
                total: randGoal / 2,
                goal: randGoal,
                game: 'Test Game',
                category: 'Test Category',
                endTime: Date.now() + 21600000,
                war: false,
                allowUserOptions: false,
                options: [],
            },
            {
                id: randBidWarID,
                name: 'Test Bid War 1',
                description: 'This is a test description.',
                total: randBidWarAmount,
                game: 'Test Game',
                category: 'Test Category',
                endTime: Date.now() + 21600000,
                war: true,
                allowUserOptions: false,
                options: [
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID,
                        name: 'Test Option 1',
                        total: randBidWarAmount * 0.3,
                    },
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID,
                        name: 'Test Option 2',
                        total: randBidWarAmount * 0.7,
                    },
                ],
            },
            {
                id: randBidWarID + 1,
                name: 'Test Bid War 2',
                description: 'This is a test description.',
                total: randBidWarAmount,
                game: 'Test Game',
                category: 'Test Category',
                endTime: Date.now() + 21600000,
                war: true,
                allowUserOptions: true,
                options: [
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID + 1,
                        name: 'Test User Option 1',
                        total: randBidWarAmount * 0.3,
                    },
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID + 1,
                        name: 'Test User Option 2',
                        total: randBidWarAmount * 0.7,
                    },
                ],
            },
            {
                id: randBidWarID + 2,
                name: 'Test Bid War 3',
                description: 'This is a test description.',
                total: randBidWarAmount,
                game: 'Test Game',
                category: 'Test Category',
                endTime: Date.now() + 21600000,
                war: true,
                allowUserOptions: true,
                options: [
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID + 1,
                        name: 'Test Option 1',
                        total: randBidWarAmount * 0.2,
                    },
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID + 1,
                        name: 'Test Option 2',
                        total: randBidWarAmount * 0.2,
                    },
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID + 1,
                        name: 'Test Option 3',
                        total: randBidWarAmount * 0.2,
                    },
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID + 1,
                        name: 'Test Option 4',
                        total: randBidWarAmount * 0.2,
                    },
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID + 1,
                        name: 'Test Option 5',
                        total: randBidWarAmount * 0.1,
                    },
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID + 1,
                        name: 'Test Option 6',
                        total: randBidWarAmount * 0.1,
                    },
                ],
            },
        ];
    }
}
exports.setup = setup;
