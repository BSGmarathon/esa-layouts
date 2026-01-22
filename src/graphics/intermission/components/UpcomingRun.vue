<script setup lang="ts">
import { RunData } from 'speedcontrol-util/types';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { computed } from 'vue';
import { useIntermissionStore } from '@esa-layouts/graphics/intermission/store';
import Container from './Container.vue';

dayjs.extend(relativeTime);
dayjs.extend(utc);

const props = defineProps<{
  runData: RunData | undefined;
  slotNo: number;
}>();
const intermissionStore = useIntermissionStore();

const { getRunTotalPlayers } = SpeedcontrolUtilBrowser;

function formPlayerNamesStr(runData: RunData): string {
  return runData.teams.map((team) => (
    team.name || team.players.map((player) => player.name).join(', ')
  )).join(' vs. ') || 'N/A';
}

const etaUntil = computed(() => {
  if (props.slotNo === 0) {
    return 'Coming Up Next';
  }

  const prevTime = intermissionStore.nextRuns
    .slice(0, props.slotNo) // This gets all runs before this one.
    .reduce((prev, run) => prev + (run.estimateS || 0) + (run.setupTimeS || 0), 0);
  return `Coming Up In About ${dayjs().to(dayjs.unix((Date.now() / 1000) + prevTime), true)}`;
});
</script>

<template>
  <Container
    v-if="runData"
    :style="{ width: '100%', height: '199px' }"
  >
    <template v-slot:header>
      {{ etaUntil }}
    </template>
    <template v-slot:content>
      <div>
        {{ runData.game }}
      </div>
      <div
        class="RunInfoExtra"
        :style="{ 'font-size': '30px' }"
      >
        <span v-if="runData.category">
          {{ runData.category }}
        </span>
        <span v-if="runData.system">
          {{ runData.system }}
        </span>
        <span v-if="getRunTotalPlayers(runData) > 0">
          {{ formPlayerNamesStr(runData) }}
        </span>
        <span v-if="runData.estimate">
          {{ runData.estimate }}
        </span>
      </div>
    </template>
  </Container>
</template>

<style scoped>
  .RunInfoExtra > span:not(:last-child)::after {
    content: ' / ';
  }
</style>
