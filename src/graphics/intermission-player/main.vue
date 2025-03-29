<script setup lang="ts">
import { RunData } from 'speedcontrol-util/types';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import { computed } from 'vue';
import { useHead } from '@vueuse/head';
import { useIntermissionStore } from '@esa-layouts/graphics/intermission/store';
import { getZoomAmountCSS } from '../_misc/helpers';

useHead({ title: 'Intermission Player' });

const { getRunTotalPlayers } = SpeedcontrolUtilBrowser;
const zoom = getZoomAmountCSS();
const intermissionStore = useIntermissionStore();
const nextRun = computed(() => intermissionStore.nextRuns[0] ?? null);

function formPlayerNamesStr(runData: RunData): string {
  return runData.teams.map((team) => (
    team.name || team.players.map((player) => player.name).join(', ')
  )).join(' vs. ') || 'N/A';
}
</script>

<template>
  <div id="IntermissionPlayer" :style="{
      width: '1920px',
      height: '1080px',
      position: 'fixed',
      zoom,
    }">
    <div
      class="Fixed"
      :style="{
        left: '209px',
        top: '25px',
        width: '1503px',
        height: '845px',
        'background-color': 'black',
      }"
    />
    <div
      class="Fixed Flex UpcomingBar"
      :style="{
        left: '25px',
        top: '895px',
        width: '1870px',
        height: '80px',
      }"
    >
      <div
        class="Flex Header"
        :style="{
          color: 'white', // HARDCODED, BAD!
          'text-transform': 'uppercase',
          height: '100%',
          padding: '0 25px',
          'font-size': '24px',
          'font-weight': 500,
        }"
      >
        <p>Setting Up For</p>
      </div>
      <div
        class="Flex"
        :style="{
          flex: 1,
          'background-color': 'rgba(0, 0, 0, 0.3)',
          height: '100%',
          'font-size': '24px',
          'justify-content': 'space-between',
          'flex-direction': 'row',
          'align-items': 'center',
          padding: '0 27px',
        }"
      >
        <template v-if="nextRun">
          {{ nextRun.game }}
          <span
            class="RunInfoExtra"
            :style="{
              'font-size': '20px',
            }"
          >
            <span v-if="nextRun.category">
              {{ nextRun.category }}
            </span>
            <span v-if="nextRun.system">
              {{ nextRun.system }}
            </span>
            <span v-if="getRunTotalPlayers(nextRun) > 0">
              {{ formPlayerNamesStr(nextRun) }}
            </span>
            <span v-if="nextRun.estimate">
              {{ nextRun.estimate }}
            </span>
          </span>
        </template>
        <template v-else>
          <div class="Flex">
            No More Runs
            <img
              src="./esaOhNo.png"
              :style="{ height: '1.4em', 'margin-left': '10px' }"
            >
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .RunInfoExtra > span:not(:last-child)::after {
    content: ' /';
  }
</style>
