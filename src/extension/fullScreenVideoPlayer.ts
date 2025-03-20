import { FullScreenVideoPlayer } from '@esa-layouts/types/schemas';
import type NodeCGTypes from '@nodecg/types';
import { TwitchCommercialTimer } from 'speedcontrol-util/types/schemas';
import { v4 as uuid } from 'uuid';
import Player from './util/video-player';
import { logError } from './util/helpers';
import * as mqLogging from './util/mq-logging';
import { get as nodecg } from './util/nodecg';
import obs, { changeScene } from './util/obs';
import { assetsVideos, obsData, fullScreenVideoPlayer } from './util/replicants';
import { sc } from './util/speedcontrol';

const config = nodecg().bundleConfig;
export const player = new Player(nodecg(), config.obs, obs, config.obs.names.sources.fullScreenVideoPlayer);

// Reset replicant values on startup.
fullScreenVideoPlayer.value.playing = false;
fullScreenVideoPlayer.value.current = null;
