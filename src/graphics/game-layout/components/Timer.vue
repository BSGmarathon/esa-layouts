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
  <div
    class="TimerParent Flex"
    :style="{
      'box-sizing': 'border-box',
      'justify-content': 'center',
      // 'border-top': borderTop ? '5px solid var(--bsg-color)' : 'unset',
      // [borderLocation]: lineBottom ? '5px solid var(--bsg-color)' : 'unset',
      // 'border-bottom': lineBottom ? '5px solid var(--bsg-color)' : 'unset',
      // 'height': '100%',
    }"
  >
    <div
      class="TimerContainer Flex"
      :style="{
        'align-self': 'center',
        'box-sizing': 'border-box',
        'border-right': lineRight ? '5px solid var(--slide-color)' : '5px solid rgba(0,0,0,0)',
        'border-left': lineLeft ? '5px solid var(--slide-color)' : '5px solid rgba(0,0,0,0)',
        'justify-content': 'center',
        width: 'calc(100% - 14px)',
        height: 'calc(100% - 23px)',
     }"
    >
      <div
        :class="`Flex Timer${timerState}`"
        :style="{
        'text-align': 'center',
        'margin-top': topMargin,
        transition: '500ms',
        height: '100%',
        'font-family': 'LiquidCrystal',
        'font-weight': 300,
        'font-size': '65pt',
        'align-content': 'center',
        'justify-content': 'center',
      }"
      >
      <span
        v-for="(char, i) in timeStr"
        :key="i"
        :style="{
          // display: 'inline-block',
          // replace 0.22em with undefined for better styling
          // width: ([2, 5].includes(i)) ? undefined : '0.75em',
          // 'text-align': 'center',
          // Make the colon appear more towards the centre.
          // width: '50px',
          'margin-top': ([2, 5].includes(i)) ? '-0.2em' : undefined,
        }"
      >
        {{ char }}
      </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
span {
  font-variant-numeric: tabular-nums;
}
</style>
