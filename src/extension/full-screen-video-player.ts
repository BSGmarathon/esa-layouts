import type NodeCGTypes from '@nodecg/types';
import { v4 as uuid } from 'uuid';
import Player from './util/video-player';
import { logError } from './util/helpers';
import { get as nodecg } from './util/nodecg';
import obs, { changeScene } from './util/obs';
import { assetsVideos, obsData, fullScreenVideoPlayer } from './util/replicants';

const config = nodecg().bundleConfig;
export const player = new Player(nodecg(), config.obs, obs, config.obs.names.sources.fullScreenVideoPlayer);

// Reset replicant values on startup.
fullScreenVideoPlayer.value.playing = false;
fullScreenVideoPlayer.value.current = null;

// Converts our current playlist to shared format.
function generatePlaylist(): {
  id: string,
  video?: NodeCGTypes.AssetFile,
  length?: number,
  commercial?: boolean,
}[] {
  return fullScreenVideoPlayer.value.playlist.map((sum) => ({
    id: uuid(),
    video: assetsVideos.value.find((v) => v.sum === sum),
  }));
}

function getFinishScene() {
  const sceneId = fullScreenVideoPlayer.value.finishScene;

  return config.obs.names.scenes[sceneId];
}

// eslint-disable-next-line import/prefer-default-export
export async function startPlaylist(): Promise<void> {
  try {
    const playlist = generatePlaylist();
    player.loadPlaylist(playlist);
    fullScreenVideoPlayer.value.playing = true;
    // Switch to correct scene depending on if first element has a video or not.
    if (playlist[0].video) {
      await changeScene({ scene: config.obs.names.scenes.fullScreenVideoPlayer, force: true });
    } else {
      // Does not work if first element is not a video and we're already on the
      // intermission player scene, but waitForCommercialEnd handles that.
      // TODO: Support this? We don't use "force" here for some reason, but as of
      //       writing this comment, not sure why.
      await changeScene({ scene: getFinishScene() });
    }
    obsData.value.disableTransitioning = true;
    await player.playNext();
    // Calculates when this playlist should end.
    fullScreenVideoPlayer.value.estimatedFinishTimestamp = Date.now() + (await player.calculatePlaylistLength() * 1000);
  } catch (err) {
    logError('[Full Screen Player] Could not be started', err);
    // Return to the final scene if there was an issue starting the playlist.
    await new Promise((res) => { setTimeout(res, 5000); });

    await changeScene({ scene: getFinishScene(), force: true });
  }
}

// Used if a user manually switches to the intermission player scene in OBS.
obs.on('transitionStarted', async (current, last) => {
  if (obs.findScene(config.obs.names.scenes.fullScreenVideoPlayer) === current
    && !fullScreenVideoPlayer.value.playing) {
    await startPlaylist();
  }

  if (obs.findScene(config.obs.names.scenes.fullScreenVideoPlayer) === last) {
    await player.endPlaylistEarly();
  }
});

// Triggered from the intermission player control to stop early.
nodecg().listenFor('stopFullScreenVideoPlayerEarly', () => {
  player.endPlaylistEarly();
});

player.on('videoStarted', async (item) => {
  fullScreenVideoPlayer.value.current = item.video?.sum || null;
  // Change to intermission player scene if needed and not done already.
  if (item.video) {
    await changeScene({ scene: config.obs.names.scenes.fullScreenVideoPlayer, force: true });
  } else {
    await changeScene({ scene: getFinishScene(), force: true });
  }
});

player.on('videoEnded', async (item) => {
  // Update video play count.
  if (item.video) {
    if (!fullScreenVideoPlayer.value.plays[item.video.sum]) {
      fullScreenVideoPlayer.value.plays[item.video.sum] = 1;
    } else {
      fullScreenVideoPlayer.value.plays[item.video.sum] += 1;
    }
  }

  try {
    await player.playNext();
  } catch (err) {
    logError('[Full Screen Player] Could not play next video', err);
    player.endPlaylistEarly();
  }
});

player.on('playlistEnded', async (early: boolean) => {
  fullScreenVideoPlayer.value.playing = false;
  fullScreenVideoPlayer.value.current = null;

  if (!early) {
    fullScreenVideoPlayer.value.playlist.length = 0;
  }

  fullScreenVideoPlayer.value.estimatedFinishTimestamp = 0;
  obsData.value.disableTransitioning = false;
  await changeScene({ scene: getFinishScene(), force: true });
});
