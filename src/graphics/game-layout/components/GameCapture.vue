<script setup lang="ts">
import { ChannelDataReplicant as ChanData } from '@esa-layouts/types/replicant-types';
import { defineProps, ref, onMounted, computed, watch } from 'vue';
import { delayedTimer, gameLayouts, runDataActiveRun } from '@esa-layouts/browser_shared/replicant_store';
import { useReplicant } from 'nodecg-vue-composable';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';

const x32GameAudio = useReplicant<ChanData[]>('x32-game-channel-status', 'esa-layouts')!;

const props = withDefaults(defineProps<{
  slotNo: number;
  finishTimePos?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
}>(), {
  finishTimePos: 'bottomleft',
  slotNo: 0,
});

const showSpeakerIcon = ref(false);
const player = computed(() => {
  const team = runDataActiveRun.data?.teams[props.slotNo || 0] || null;

  return (team ? team.players[0] : null) || null;
});
const teamFinishTime = computed(() => {
  const timer = delayedTimer.data;
  const runData = runDataActiveRun.data;

  if (!timer || (runData?.teams.length || 0) < 2) {
    return undefined;
  }

  const teamID = runData?.teams[props.slotNo]?.id;
  return teamID ? timer.teamFinishTimes[teamID] : undefined;
});

function onX32GameAudioChange(newVal: ChanData[]) {
  if (gameLayouts.data?.selected?.includes('-1p')) {
    showSpeakerIcon.value = false;
    return;
  }

  let chosenSlot = props.slotNo || 0;
  const playerVal = player.value;

  if (playerVal && playerVal.customData.audioChannelOverride) {
    let overrideChannel = parseInt(playerVal.customData.audioChannelOverride, 10);

    if (overrideChannel > 0) {
      overrideChannel -= 1;
    }

    chosenSlot = Math.max(0, Math.min(3, overrideChannel));
  }

  const mixerConfig = newVal[chosenSlot];

  showSpeakerIcon.value = !mixerConfig.muted && mixerConfig.faderUp;
}

watch(() => x32GameAudio.data!, (newVal: ChanData[]) => onX32GameAudioChange(newVal));

onMounted(async () => {
  await waitForReplicant(x32GameAudio, delayedTimer, runDataActiveRun);

  onX32GameAudioChange(x32GameAudio.data!);
});
</script>

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
          padding: '3px 10px',
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
  /*width: 100%; - not sure when this changed, causes wierd stuff with the finish time*/
}
</style>
