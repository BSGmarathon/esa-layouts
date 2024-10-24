import { sc } from '@esa-layouts/util/speedcontrol';
import { get as nodecg } from '@esa-layouts/util/nodecg';

// Replicants only applicable to this file from another bundle.
const twitchCommercialsDisabled = nodecg().Replicant<boolean>('disabled', 'esa-commercials');

// Used to disable the Twitch commercials for the remainder of a run.
export default function actionTwitchCommercialsDisable(): void {
  if (!twitchCommercialsDisabled.value
    && !['stopped', 'finished'].includes(sc.timer.value.state)) {
    // Sends a message to the esa-commercials bundle.
    // Because we are using server-to-server messages, no confirmation yet.
    nodecg().sendMessageToBundle('disable', 'esa-commercials');
  }
}
