import clone from 'clone';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { currentRunDelay, delayedTimer } from './util/replicants';
import { sc } from './util/speedcontrol';

const config = nodecg().bundleConfig;

// This code keeps a delayed copy of the timer synced to a delay value from external sources.
// If no delay is present (if not an online marathon), we just make a straight copy.
const timerDelayTO: { delay: number, timeout: NodeJS.Timeout }[] = [];
delayedTimer.value = clone(sc.timer.value);
currentRunDelay.on('change', (newVal, oldVal) => {
  if (newVal.video !== oldVal?.video && timerDelayTO.length) {
    // Reset delayed timer to the same as normal timer.
    delayedTimer.value = clone(sc.timer.value);

    // Clear all the irrelevant timeouts currently active.
    const timeouts: NodeJS.Timeout[] = [];
    for (let i = 0; i < timerDelayTO.length;) {
      if (timerDelayTO[i] && timerDelayTO[i].delay !== newVal.video) {
        timeouts.push(timerDelayTO.shift()?.timeout as NodeJS.Timeout);
      } else {
        i += 1;
      }
    }
    timeouts.forEach((timeout) => clearTimeout(timeout));
  }
});
sc.timer.on('change', (val) => {
  const timerFreeze = clone(val);
  if (currentRunDelay.value.video === 0) {
    delayedTimer.value = timerFreeze;
  } else {
    timerDelayTO.push({
      delay: currentRunDelay.value.video,
      timeout: setTimeout(() => {
        delayedTimer.value = {
          ...timerFreeze,
          timestamp: Date.now(),
        };
      }, currentRunDelay.value.video),
    });
  }
});

nodecg().listenFor('buttonPressed', async (buttonId: number, ack) => {
  const run = sc.getCurrentRun();

  if (!run) {
    return;
  }

  const teamIndex = Math.max(0, Math.min(buttonId - 1, run.teams.length - 1));

  // Just in case
  if (teamIndex < 0) {
    return;
  }

  try {
    // Note: the nodecg-speedcontrol bundle will check if it *can* do these actions,
    // we do not need to check that here.
    switch (sc.timer.value.state) {
      case 'stopped':
      case 'paused':
        await sc.startTimer();
        break;
      case 'running':
        // Only allow stop command to work if timer is more than 10s.
        if (sc.timer.value.milliseconds > 10 * 1000) {
          await sc.stopTimer(teamIndex);
        }
        break;
      default:
        break;
    }
  } catch (err) {
    nodecg().log.error('[Timer] Error changing timer state on buttonPressed event:', err);
  }

  if (ack && !ack.handled) {
    ack(null);
  }
});

nodecg().listenFor('resetTimer', async (data, ack) => {
  try {
    await sc.resetTimer();

    if (ack && !ack.handled) {
      ack(null);
    }
  } catch (e) {
    if (ack && !ack.handled) {
      ack(e);
    }
  }
});

// Enable/disable nodecg-speedcontrol timer changes if on/not on a game layout scene.
obs.on('currentSceneChanged', (current) => {
  if (current) {
    if (obs.isCurrentScene(config.obs.names.scenes.gameLayout)) {
      sc.enableTimerChanges();
    } else {
      sc.disableTimerChanges();
    }
  }
});
