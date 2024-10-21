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
    <div class="Flex itemContainer">
      <transition-group name="fade">
        <div
          v-if="typeof slotNo === 'number' && teamFinishTime"
          key="end-time"
          class="TeamFinishTime"
          :style="{
          padding: '5px 10px',
          'font-size': '25pt',
          'font-family': 'Bahnschrift',
        }"
        >
          <template v-if="teamFinishTime.state === 'forfeit'">
            🏳️ Forfeit
          </template>
          <template v-else>
            🏁 {{ teamFinishTime.time }}
          </template>
        </div>
        <div v-else key="empty-end-time"/>
      </transition-group>
      <transition-group name="fade" :style="{
        order: finishTimePos.includes('left') ? 0 : -1,
      }">
        <div class="TeamFinishTime"
             v-if="showSpeakerIcon"
             key="speaker"
             :style="{
               padding: '5px 10px',
             }"
        >
          <div key="audioLive"
               class="PlayerAudioLive Icon NormalIcon"
               style="width: 36px; height: 36px;"/>
        </div>
        <div key="emptyspeaker" v-else />
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { CurrentRunDelay, DelayedTimer, GameLayouts } from '@esa-layouts/types/schemas';
import { RunDataActiveRun, RunDataPlayer, TeamFinishTime } from 'speedcontrol-util/types';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { ChannelDataReplicant as ChanData } from '@esa-layouts/types/replicant-types';

@Component
export default class extends Vue {
  @State('runDataActiveRun') runData!: RunDataActiveRun | undefined;
  @State('delayedTimer') timer!: DelayedTimer;
  @State('gameLayouts') gameLayouts!: GameLayouts;
  @State('x32GameAudio') x32GameAudio!: ChanData[];
  @State currentRunDelay!: CurrentRunDelay;
  @Prop(Number) slotNo!: number;
  @Prop({
    default: 'bottomleft',
    validator: (v: string) => ['topleft', 'topright', 'bottomleft', 'bottomright'].includes(v),
  }) finishTimePos!: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
  showSpeakerIcon = false;

  get teamFinishTime(): TeamFinishTime | undefined {
    if (!this.timer || (this.runData?.teams.length || 0) < 2) {
      return undefined;
    }
    const teamID = this.runData?.teams[this.slotNo]?.id;
    return teamID ? this.timer.teamFinishTimes[teamID] : undefined;
  }

  get player(): RunDataPlayer | null {
    const team = this.runData?.teams[this.slotNo || 0] || null;

    return (team ? team.players[0] : null) || null;
  }

  created() {
    // initial setting of the icon
    this.onX32GameAudioChange(this.x32GameAudio);
  }

  @Watch('x32GameAudio')
  onX32GameAudioChange(newVal: ChanData[]): void {
    if (this.gameLayouts?.selected?.includes('-1p')) {
      this.showSpeakerIcon = false;
      return;
    }

    let chosenSlot = this.slotNo || 0;

    if (this.player && this.player.customData.audioChannelOverride) {
      let overrideChannel = parseInt(this.player.customData.audioChannelOverride, 10);

      if (overrideChannel > 0) {
        overrideChannel -= 1;
      }

      chosenSlot = Math.max(0, Math.min(3, overrideChannel));
    }

    const mixerConfig = newVal[chosenSlot];

    this.showSpeakerIcon = !mixerConfig.muted && mixerConfig.faderUp;
  }

  @Watch('runData')
  async onRunDataChange(): Promise<void> {
    await Vue.nextTick();
    this.onX32GameAudioChange(this.x32GameAudio);
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.TeamFinishTime {
  height: 40px;
}

.itemContainer {
  align-content: space-between;
  justify-content: space-between;
  width: 100%;
}
</style>
