<script setup lang="ts">
import { donationReaderNew } from '@esa-layouts/browser_shared/replicant_store';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import { RunData } from 'speedcontrol-util/types';
import { computed } from 'vue';
import { useHead } from '@vueuse/head';
import ParticipantInfo from '../_misc/components/ParticipantInfo.vue';
import { getZoomAmountCSS } from '../_misc/helpers';

useHead({ title: 'Intermission Hosts' });

const { getRunTotalPlayers } = SpeedcontrolUtilBrowser;
const zoom = getZoomAmountCSS();

const donationReader = computed(() => donationReaderNew.data);
const nextRun: RunData | null = null;

function formPlayerNamesStr(runData: RunData): string {
  return runData.teams.map((team) => (
    team.name || team.players.map((player) => player.name).join(', ')
  )).join(' vs. ') || 'N/A';
}
</script>

<template>
  <div
    id="IntermissionHosts"
    class="Layout FlexColumn"
    :style="{
      'box-sizing': 'border-box',
      height: '1000px',
      'justify-content': 'flex-end',
      'align-items': 'center',
      padding: '50px',
      gap: '20px',
      zoom,
    }"
  >
    <ParticipantInfo
      v-if="donationReader"
      type="reader"
      :name="donationReader.name"
      :pronouns="donationReader.pronouns"
      :country="donationReader.country"
      :style="{
        zoom: '1.5',
      }"
    />
    <div
      class="Flex UpcomingBar"
      :style="{
        width: '100%',
        height: '80px',
      }"
    >
      <div
        class="Flex Header"
        :style="{
          color: 'white',
          'text-transform': 'uppercase',
          height: '100%',
          padding: '0 25px',
          'font-size': '45px',
          'font-weight': 500,
        }"
      >
        Setting Up For
      </div>
      <div
        class="Flex"
        :style="{
          flex: 1,
          'background-color': 'rgba(0, 0, 0, 0.3)',
          height: '100%',
          'font-size': '40px',
          'justify-content': 'space-between',
          padding: '0 27px',
        }"
      >
        <template v-if="nextRun">
          {{ nextRun.game }}
          <span
            class="RunInfoExtra"
            :style="{
              'font-size': '33px',
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

<style>
  @import url('../_misc/themes/esaw24.theme.css');
</style>

<style scoped>
  .RunInfoExtra > span:not(:last-child)::after {
    content: ' /';
  }
</style>
