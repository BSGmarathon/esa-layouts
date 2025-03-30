<script setup lang="ts">
import MediaBox from '@esa-layouts/graphics/_misc/components/mediabox';
import { runDataActiveRun, commentatorsNew, donationReaderNew } from '@esa-layouts/browser_shared/replicant_store';
import { computed, defineProps } from 'vue';
import ParticipantInfo from '../_misc/components/ParticipantInfo.vue';
import DonationBar from './components/DonationBar.vue';
import GameCapture from './components/GameCapture.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';

defineProps<{
  gameLeft?: string;
  gameWidth?: string;
  gameHeight?: string;
  cameraWidth?: string;
  cameraHeight?: string;
  participantsHeight?: string;
  participantsZoom?: string;
  participantsBorderBottom: string | boolean;
  gameInfoMediaBoxTop?: string;
  gameInfoMediaBoxHeight?: string;
  donationBarTop?: string;
  donationBarWidth?: string;
  donationBarHeight?: string;
  donationBarBoxPadding?: string;
  donationBarBoxFontSize?: string;
}>();

const players = computed(() => {
  const runData = runDataActiveRun.data;

  if (!runData) return [];

  if (runData.relay) {
    const team = runData?.teams[0];
    const player = team?.players.find((p) => p.id === team.relayPlayerID);
    return player ? [player] : [];
  }

  return runData.teams.map((t) => t.players).flat(1);
});
</script>

<template>
  <div>
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      class="BorderLeft BorderBottom"
      :style="{
        left: gameLeft || '533px',
        top: '0px',
        width: gameWidth || '1387px',
        height: gameHeight || '780px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Flex"
      :style="{
        left: '0px',
        top: '0px',
        width: cameraWidth || '533px',
        height: cameraHeight || '780px',
      }"
    />

    <!-- Participants -->
    <div
      :class="{
        Flex: true,
        BorderBottom: participantsBorderBottom,
      }"
      :style="{
        left: '0px',
        top: '0px',
        width: cameraWidth || '533px',
        height: participantsHeight || '780px',
        'align-items': 'flex-end',
      }"
    >
      <div
        class="Flex"
        :style="{
          width: '100%',
          // background: 'rgba(0, 0, 0, 0.5)',
          'align-items': 'flex-end',
          padding: '25px',
          'padding-bottom': '25px',
          zoom: participantsZoom || 1,
        }
      ">
        <div
          class="Flex"
          :style="{
            gap: '10px',
            // flex-direction and flex-wrap are used in conjunction with a reversed element order
            // so we can have more participant names on the bottom than on top.
            'flex-direction': 'row-reverse',
            'flex-wrap': 'wrap-reverse',
          }"
        >
          <!-- So that we can style it so that participant names are properly weighted
          to the bottom (more on bottom than on top) we actually add the elements
          in reverse order -->
          <ParticipantInfo
            v-if="donationReaderNew.data"
            type="reader"
            :name="donationReaderNew.data.name"
            :pronouns="donationReaderNew.data.pronouns"
            :country="donationReaderNew.data.country"
          />
          <ParticipantInfo
            v-for="commentator of commentatorsNew.data!.slice(0).reverse()"
            :key="commentator.name"
            type="commentator"
            :name="commentator.name"
            :pronouns="commentator.pronouns"
            :country="commentator.country"
          />
          <ParticipantInfo
            v-for="player of players.slice(0).reverse()"
            :key="player.id"
            type="player"
            :name="player.name"
            :pronouns="player.pronouns"
            :country="player.country"
          />
        </div>
      </div>
    </div>

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed Flex"
      :style="{
        left: '0px',
        top: gameInfoMediaBoxTop || '780px',
        width: '1346px',
        height: gameInfoMediaBoxHeight || '160px',
      }"
    >
      <RunInfo
        :style="{
          'font-size': '45px',
          'width': '959px',
          height: '100%',
        }"
      />
      <Timer
        :style="{
          'width': '387px',
          height: '100%',
        }"
      />
    </div>

    <!-- Media Box -->
    <MediaBox
      class="BorderLeft"
      :font-size="40"
      :style="{
        left: '1346px',
        top: gameInfoMediaBoxTop || '780px',
        width: '574px',
        height: gameInfoMediaBoxHeight || '160px',
      }"
    />

    <!-- Donation Bar -->
    <DonationBar
      :padding="donationBarBoxPadding || 15"
      :style="{
        left: '0px',
        top: donationBarTop || '940px',
        width: donationBarWidth || '1920px',
        height: donationBarHeight || '60px',
        'font-size': donationBarBoxFontSize || '30px',
      }"
    />
  </div>
</template>

<style>
  @import url('../_misc/themes/esaw24.theme.css');
</style>
