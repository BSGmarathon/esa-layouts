<script setup lang="ts">
import { wait } from '@esa-layouts/graphics/_misc/helpers';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import { RunData } from 'speedcontrol-util/types';
import { computed, onMounted } from 'vue';

interface UpcomingRunProps {
  seconds: number;
  run: RunData;
}

dayjs.extend(relativeTime);
dayjs.extend(utc);

const emit = defineEmits<{ end: [] }>();
const { getRunTotalPlayers } = SpeedcontrolUtilBrowser;
const { seconds, run } = withDefaults(defineProps<UpcomingRunProps>(), {
  seconds: 25,
});
const when = computed(() => (run.scheduledS && run.scheduledS > (Date.now() / 1000)
  ? `in about ${dayjs.utc().to(dayjs.unix(run.scheduledS), true)}`
  : 'soon'));

function formPlayerNamesStr(runData: RunData): string {
  return runData.teams.map((team) => (
    team.name || team.players.map((player) => player.name).join(', ')
  )).join(' vs. ') || 'N/A';
}

onMounted(async () => {
  await wait(seconds * 1000); // Wait the specified length.
  emit('end');
});
</script>

<template>
  <div
    class="Flex"
    :style="{
      padding: '0 17px',
      'padding-top': '10px',
      height: '100%',
      'font-weight': 500,
      'flex-direction': 'column',
      'align-items': 'flex-start',
    }"
  >
    <div :style="{ 'font-size': '25px' }">
      {{ when }}
    </div>
    <div :style="{ 'font-size': '35px' }">
      <span v-if="getRunTotalPlayers(run) > 0">
        {{ formPlayerNamesStr(run) }}
        play<span v-if="getRunTotalPlayers(run) === 1">s</span> {{ run.game }}
      </span>
      <span v-else>
        {{ run.game }}
      </span>
    </div>
  </div>
</template>
