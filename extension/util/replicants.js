"use strict";
/* eslint-disable max-len */
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitchAPIData = exports.videoPlayer = exports.upcomingRunID = exports.twitchSubscribers = exports.ttsVoices = exports.streamDeckData = exports.serverTimestamp = exports.prizes = exports.otherStreamData = exports.obsData = exports.notableDonations = exports.nameCycle = exports.musicData = exports.mediaBox = exports.gameLayouts = exports.donationTotalMilestones = exports.donationTotal = exports.donationsToRead = exports.donationReader = exports.delayedTimer = exports.currentRunDelay = exports.countdown = exports.commentators = exports.capturePositions = exports.bids = exports.assetsVideos = exports.assetsMusic = exports.assetsMediaBoxImages = exports.assetsIntermissionSlides = void 0;
const nodecg_1 = require("./nodecg");
/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
exports.assetsIntermissionSlides = nodecg_1.get().Replicant('assets:intermission-slides');
exports.assetsMediaBoxImages = nodecg_1.get().Replicant('assets:media-box-images');
exports.assetsMusic = nodecg_1.get().Replicant('assets:music');
exports.assetsVideos = nodecg_1.get().Replicant('assets:videos');
exports.bids = nodecg_1.get().Replicant('bids', { persistent: false });
exports.capturePositions = nodecg_1.get().Replicant('capturePositions');
exports.commentators = nodecg_1.get().Replicant('commentators');
exports.countdown = nodecg_1.get().Replicant('countdown');
exports.currentRunDelay = nodecg_1.get().Replicant('currentRunDelay');
exports.delayedTimer = nodecg_1.get().Replicant('delayedTimer');
exports.donationReader = nodecg_1.get().Replicant('donationReader');
exports.donationsToRead = nodecg_1.get().Replicant('donationsToRead', { persistent: false });
exports.donationTotal = nodecg_1.get().Replicant('donationTotal');
exports.donationTotalMilestones = nodecg_1.get().Replicant('donationTotalMilestones');
exports.gameLayouts = nodecg_1.get().Replicant('gameLayouts');
exports.mediaBox = nodecg_1.get().Replicant('mediaBox'); // try to remove and use esa-layout-shared only
exports.musicData = nodecg_1.get().Replicant('musicData');
exports.nameCycle = nodecg_1.get().Replicant('nameCycle', { persistent: false });
exports.notableDonations = nodecg_1.get().Replicant('notableDonations');
exports.obsData = nodecg_1.get().Replicant('obsData', { persistent: false });
exports.otherStreamData = nodecg_1.get().Replicant('otherStreamData');
exports.prizes = nodecg_1.get().Replicant('prizes', { persistent: false });
exports.serverTimestamp = nodecg_1.get().Replicant('serverTimestamp');
exports.streamDeckData = nodecg_1.get().Replicant('streamDeckData');
exports.ttsVoices = nodecg_1.get().Replicant('ttsVoices');
exports.twitchSubscribers = nodecg_1.get().Replicant('twitchSubscribers');
exports.upcomingRunID = nodecg_1.get().Replicant('upcomingRunID');
exports.videoPlayer = nodecg_1.get().Replicant('videoPlayer');
// nodecg-speedcontrol
exports.twitchAPIData = nodecg_1.get().Replicant('twitchAPIData', 'nodecg-speedcontrol');
