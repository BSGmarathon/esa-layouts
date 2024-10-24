import { assetsVideos, videoPlayer } from '@esa-layouts/util/replicants';
import { canChangeScene } from '@esa-layouts/util/obs';
import { get as nodecg } from '@esa-layouts/util/nodecg';
import { wait } from '@esa-layouts/util/helpers';
import { startPlaylist } from '@esa-layouts/intermission-player';

const config = nodecg().bundleConfig;
let videoPlayPressedRecently = false;

// Used to play back a single video in the "Intermission Player" scene,
// intended to be used by hosts.
export default async function actionVideoPlay(name: string, value: unknown): Promise<void> {
  if (!videoPlayPressedRecently && !videoPlayer.value.playing
    && canChangeScene({ scene: config.obs.names.scenes.intermissionPlayer, force: true })) {
    videoPlayPressedRecently = true;
    setTimeout(() => { videoPlayPressedRecently = false; }, 1000);
    const val = value as string;
    nodecg().log.debug('[Companion] Message received to play video (sum: %s)', val);
    const videos = assetsVideos.value.filter((v) => v.sum === val);
    if (videos.length > 1) {
      // VIDEO WAS FOUND TWICE, MAKES NO SENSE!
      nodecg().log.debug('[Companion] Multiple videos with the same sum found!');
    } else if (!videos.length) {
      // VIDEO WAS NOT FOUND
      nodecg().log.debug('[Companion] No videos found with that sum!');
    } else {
      nodecg().log.debug('[Companion] Video found matching sum: %s', videos[0].name);
      videoPlayer.value.playlist = [
        {
          sum: videos[0].sum,
          length: 0,
          commercial: false,
        },
      ];
      // TODO: this was never awaited in the original code, did it ever work?
      await wait(500); // Safety wait
      await startPlaylist();
    }
  }
}
