<script setup lang="ts">
import { Timer } from 'speedcontrol-util/types';
import { DelayedTimer } from '@esa-layouts/types/schemas';
import { computed, ref, watch } from 'vue';
import { timer as originalTimer } from '@esa-layouts/browser_shared/replicant_store';
import { useReplicant } from 'nodecg-vue-composable';
import { msToTimeStr } from '../../_misc/helpers';

interface TimerProps {
  topMargin: string;
  fontSize: string;
  lineLeft: boolean;
  lineRight: boolean;
  borderTop: boolean;
  lineBottom: boolean;
}

withDefaults(defineProps<TimerProps>(), {
  topMargin: '0em',
  fontSize: '65pt',
  lineLeft: false,
  lineRight: false,
  borderTop: false,
  lineBottom: true,
});

const timer = useReplicant<DelayedTimer>('delayedTimer', 'esa-layouts')!;
const timeStr = ref('00:00:00');
const backupTimerTO = ref<number | undefined>(undefined);
// const borderLocation = computed(() => (props.borderTop ? 'border-top' : 'border-bottom'));
const timerState = computed(() => {
  if (!timer.data) {
    return 'Stopped';
  }

  return timer.data.state.charAt(0).toUpperCase() + timer.data.state.slice(1);
});

/**
 * Backup timer that takes over if the connection to the server is lost.
 * Based on the last timestamp that was received.
 * When the connection is restored, the server timer will recover and take over again.
 */
function backupTimer(): void {
  backupTimerTO.value = window.setTimeout(() => backupTimer(), 200);

  if (timer.data!.state === 'running') {
    const missedTime = Date.now() - timer.data!.timestamp;
    const timeOffset = timer.data!.milliseconds + missedTime;
    timeStr.value = msToTimeStr(timeOffset);
  }
}

watch(() => originalTimer.data, () => {
  // Backup timer (see above).
  clearTimeout(backupTimerTO.value);
  backupTimerTO.value = window.setTimeout(() => backupTimer(), 1000);
}, { immediate: true });

watch(() => timer.data!, (newTimer?: Timer) => {
  if (newTimer) {
    timeStr.value = newTimer.time;
  }
}, { immediate: true, deep: true });
</script>

<template>
  <div class="TimerParent Flex">
    <div class="TimerContainer Flex">
      <div class="Flex TimerLines" :class="{ 'line-right': lineRight, 'line-left': lineLeft }" />

      <div :class="`Flex TimerDigits Timer${timerState}`">
        <!-- TODO: probably don't have to do the splitting anymore -->
        <span v-for="(char, i) in timeStr" :key="i">
          {{ char }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.TimerParent {
  --bg-colour: rgba(0, 0, 0, 0.3);
  --size: 10px;
  background-size: var(--size) var(--size);
  background-image:
    linear-gradient(to right, var(--bg-colour) 1px, transparent 1px),
    linear-gradient(to bottom, var(--bg-colour) 1px, transparent 1px);
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  //height: 100%;
}

.TimerContainer {
  align-self: center;
  box-sizing: border-box;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.TimerLines {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: calc(100% - 14px);
  height: calc(100% - 12px);
  border-left: 5px solid rgba(0,0,0,0);
  border-right: 5px solid rgba(0,0,0,0);

  //background: rgba(0, 128, 0, 0.44);

  &.line-left {
    border-left-color: var(--slide-color);
  }

  &.line-right {
    border-right-color: var(--slide-color);
  }
}

.TimerDigits {
  --timer-glow: 10px;
  //--timer-glow: 0px;

  transition: 500ms;
  font-family: DS_DIGITAL, sans-serif;
  font-weight: 300;
  font-size: 65pt;
  align-items: center;
  justify-content: center;
  //text-align: center;

  //background: red;

  //width: 100%;
  height: 100%;
  //position: absolute;
  //left: 50%;
  //top: 50%;
  //transform: translate(-50%,-50%);
}

.TimerStopped, .TimerPaused {
  --timer-color: #BCBCBC;
}

.TimerRunning {
  /*--timer-color: #d7d7d7;*/
  --timer-color: #FFFFFF;
}

.TimerFinished {
  /*--timer-color: #AAFAC8;*/
  --timer-color: #fffacc;

  animation-name: timer-blink;
  animation-duration: 500ms;
  animation-iteration-count: 3;
}

.TimerForfeit {
  --timer-color: #ff6767;
}

span {
  color: var(--timer-color);
  text-shadow: 0 0 var(--timer-glow) var(--timer-color);
  /*box-shadow: 0 0 10px var(--timer-color);*/

  font-variant-numeric: tabular-nums;
}

@keyframes timer-blink {
  0% {
    /*opacity: 0.5;*/
    /*--timer-color: #dad8c3;*/
  }
  25% {
    /*opacity: 0;*/
    --timer-color: #BCBCBC;
    --timer-glow: 0;
  }
  50% {
    /*opacity: 0;*/
    --timer-color: #BCBCBC;
    --timer-glow: 0;
  }

  75% {
    /*opacity: 1;*/
    --timer-color: #fffacc;
  }

  100% {
    /*opacity: 1;*/
    --timer-color: #fffacc;
  }

}
</style>
