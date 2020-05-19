<template>
  <div
    class="Capture GameCapture Flex"
    :style="{
      'justify-content': finishTimePos.includes('left') ? 'flex-start' : 'flex-end',
      'align-items': finishTimePos.includes('top') ? 'flex-start' : 'flex-end',
      'font-size': '30px',
      'font-weight': 500,
    }"
  >
    <transition name="fade">
      <div
        v-if="typeof slotNo === 'number' && teamFinishTime"
        class="TeamFinishTime"
        :style="{
          padding: '5px 10px',
        }"
      >
        <template v-if="teamFinishTime.state === 'forfeit'">
          🏳️ Forfeit
        </template>
        <template v-else>
          🏁 {{ teamFinishTime.time }}
        </template>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';
import { RunDataActiveRun, Timer } from 'speedcontrol-util/types';
import { TeamFinishTime } from 'nodecg-speedcontrol/types'; // should expose in sc-util

@Component
export default class extends Vue {
  @State('runDataActiveRun') runData!: RunDataActiveRun;
  @State timer!: Timer;
  @Prop(Number) slotNo!: number;
  @Prop({
    default: 'bottomleft',
    validator: (v) => ['topleft', 'topright', 'bottomleft', 'bottomright'].includes(v),
  }) finishTimePos!: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

  get teamFinishTime(): TeamFinishTime | undefined {
    const teamID = this.runData?.teams[this.slotNo]?.id;
    return teamID ? this.timer.teamFinishTimes[teamID] : undefined;
  }
}
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>