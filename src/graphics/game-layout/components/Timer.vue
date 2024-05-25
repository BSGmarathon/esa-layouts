<template>
  <div
    class="TimerParent Flex"
    :style="{
      'box-sizing': 'border-box',
      'justify-content': 'center',
      'border-top': borderTop ? '5px solid var(--bsg-color)' : 'unset',
      // [borderLocation]: lineBottom ? '5px solid var(--bsg-color)' : 'unset',
      'border-bottom': lineBottom ? '5px solid var(--bsg-color)' : 'unset',
      // 'height': '100%',
    }"
  >
    <div class="TimerContainer Flex"
         :style="{
            'align-self': 'center',
            'box-sizing': 'border-box',
            'border-right': lineRight ? '5px solid var(--slide-color)' : '5px solid rgba(0,0,0,0)',
            'border-left': lineLeft ? '5px solid var(--slide-color)' : '5px solid rgba(0,0,0,0)',
            'justify-content': 'center',
            width: 'calc(100% - 14px)',
            height: 'calc(100% - 12px)',
         }">
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
        // 'font-size': fontSize,
        // 'align-items': 'center',
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
          'margin-top': ([2, 5].includes(i)) ? '-0.2em' : '-4px',
        }"
      >
        {{ char }}
      </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Timer } from 'speedcontrol-util/types';
import { DelayedTimer } from '@esa-layouts/types/schemas';
import { msToTimeStr } from '../../_misc/helpers';

@Component
export default class extends Vue {
  @Prop({ type: String, default: '0em' }) topMargin!: string;
  @Prop({ type: String, default: '65pt' }) fontSize!: string;
  @Prop({ type: Boolean, default: false }) lineLeft!: string;
  @Prop({ type: Boolean, default: false }) lineRight!: string;
  // TODO: better border properties for v2
  @Prop({ type: Boolean, default: false }) borderTop!: string;
  @Prop({ type: Boolean, default: true }) lineBottom!: string;
  @State('timer') originalTimer!: Timer;
  @State('delayedTimer') timer!: DelayedTimer;
  timeStr = '00:00:00';
  backupTimerTO: number | undefined;

  /**
   * Backup timer that takes over if the connection to the server is lost.
   * Based on the last timestamp that was received.
   * When the connection is restored, the server timer will recover and take over again.
   */
  backupTimer(): void {
    this.backupTimerTO = window.setTimeout(() => this.backupTimer(), 200);
    if (this.timer.state === 'running') {
      const missedTime = Date.now() - this.timer.timestamp;
      const timeOffset = this.timer.milliseconds + missedTime;
      this.timeStr = msToTimeStr(timeOffset);
    }
  }

  // Use original non-delayed timer to keep track of if we need to run the backup.
  @Watch('originalTimer', { immediate: true })
  onOriginalTimerChange(): void {
    // Backup timer (see above).
    clearTimeout(this.backupTimerTO);
    this.backupTimerTO = window.setTimeout(() => this.backupTimer(), 1000);
  }

  get borderLocation(): string {
    return this.borderTop ? 'border-top' : 'border-bottom';
  }

  @Watch('timer', { immediate: true })
  onTimerChange(val: Timer): void {
    this.timeStr = val.time;
  }

  get timerState(): string {
    if (!this.timer) {
      return 'Stopped';
    }
    return this.timer.state.charAt(0).toUpperCase() + this.timer.state.slice(1);
  }
}
</script>

<style lang="scss" scoped>
span {
  display: inline-flex;
  font-variant-numeric: tabular-nums;
  font-stretch: condensed;
}
</style>
