import { obsData } from '@esa-layouts/util/replicants';
import { get as nodecg } from '@esa-layouts/util/nodecg';
import { sc } from '@esa-layouts/util/speedcontrol';
import obs, { changeScene } from '@esa-layouts/util/obs';

const config = nodecg().bundleConfig;

// Used to cycle scenes if applicable, usually used by hosts.
// Some of this is copied from obs-data.ts
export default async function actionSceneCycle(): Promise<void> {
  const { disableTransitioning, transitioning, connected } = obsData.value;
  const { scenes } = config.obs.names;

  // If transitioning is disabled, or we *are* transitioning, and OBS is connected,
  // and the timer is not running or paused, we can trigger these actions.
  if (!disableTransitioning && !transitioning && connected
    && !['running', 'paused'].includes(sc.timer.value.state)) {
    // If the current scene is any of the applicable intermission ones, the next scene
    // will be the game layout, so change to it.
    if (obs.isCurrentScene(scenes.commercials)
      || obs.isCurrentScene(scenes.intermission)
      || obs.isCurrentScene(scenes.intermissionCrowd)) {
      await changeScene({ scene: config.obs.names.scenes.gameLayout });
      // If the current scene is the game layout, the next scene will be the intermission,
      // so change to it.
    } else if (obs.isCurrentScene(scenes.gameLayout)) {
      // If the commercial intermission scene exists, use that, if not, use the regular one.
      if (obs.findScene(scenes.commercials)) {
        await changeScene({ scene: scenes.commercials });
      } else {
        await changeScene({ scene: scenes.intermission });
      }
    }
  }
}
