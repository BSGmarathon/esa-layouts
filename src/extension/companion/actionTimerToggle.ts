import { sc } from '../util/speedcontrol';

// Controls the nodecg-speedcontrol timer.
// Currently the "Stop Timer" state works if there's only 1 team.
// TODO: Add team support.
export default async function actionTimerToggle(): Promise<void> {
  try {
    // Note: the nodecg-speedcontrol bundle will check if it *can* do these actions,
    // we do not need to check that here.
    switch (sc.timer.value.state) {
      case 'stopped':
      case 'paused':
        await sc.startTimer();
        break;
      case 'running':
        await sc.stopTimer();
        break;
      case 'finished':
        await sc.resetTimer();
        break;
      default:
        // Don't do anything
        break;
    }
  } catch (err) {
    // Drop for now
  }
}
