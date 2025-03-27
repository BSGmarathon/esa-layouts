<script setup lang="ts">
import MediaBox from '@esa-layouts/graphics/_misc/components/mediabox';
import { computed } from 'vue';
import { runDataActiveRun, commentatorsNew, donationReaderNew } from '@esa-layouts/browser_shared/replicant_store';
import ParticipantInfo from '../_misc/components/ParticipantInfo.vue';
import DonationBar from './components/DonationBar.vue';
import GameCapture from './components/GameCapture.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';

const players = computed(() => runDataActiveRun.value?.teams.map((t) => t.players).flat(1) ?? []);
</script>

<template>
  <div>
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      class="BorderLeft BorderBottom"
      :style="{
        left: '533px',
        top: '0px',
        width: '1387px',
        height: '780px',
      }"
    />
    <GameCapture
      id="GameCapture2"
      :style="{
        left: '0px',
        top: '455px',
        width: '533px',
        height: '485px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Flex"
      :style="{
        left: '0px',
        top: '0px',
        width: '533px',
        // height: '940px',
        height: '455px',
      }"
    />

    <!-- Participants -->
    <div
      :class="{
        Flex: true,
        BorderBottom: true,
      }"
      :style="{
        left: '0px',
        top: '0px',
        width: '533px',
        // height: '940px',
        height: '455px',
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
          zoom: 0.75,
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
            v-if="donationReaderNew"
            type="reader"
            :name="donationReaderNew.name"
            :pronouns="donationReaderNew.pronouns"
            :country="donationReaderNew.country"
          />
          <ParticipantInfo
            v-for="commentator of commentatorsNew.slice(0).reverse()"
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
      class="Fixed Flex BorderLeft"
      :style="{
        left: '533px',
        top: '780px',
        width: '967px',
        height: '160px',
      }"
    >
      <RunInfo
        :style="{
          'font-size': '45px',
          'width': '580px',
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
        left: '1500px',
        top: '780px',
        width: '420px',
        height: '160px',
      }"
    />

    <!-- Donation Bar -->
    <DonationBar
      :padding="15"
      :style="{
        left: '0px',
        top: '940px',
        width: '1920px',
        height: '60px',
        'font-size': '30px',
      }"
    />
  </div>
</template>

<style>
  @import url('../_misc/themes/esaw24.theme.css');
</style>
