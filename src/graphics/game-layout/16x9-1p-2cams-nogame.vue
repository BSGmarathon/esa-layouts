<script setup lang="ts">
import MediaBox from '@esa-layouts/graphics/_misc/components/mediabox';
import { computed } from 'vue';
import { gameLayouts } from '@esa-layouts/browser_shared/replicant_store';
import CommentatorsReader from './components/CommentatorsReader.vue';
import DonationBar from './components/DonationBar.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';

const { online } = nodecg.bundleConfig.event;
const crowdCam = computed(() => gameLayouts.data?.crowdCamera ?? false);
</script>

<template>
  <div>
    <!-- Crowd Camera Capture -->
    <div
      v-if="!online && crowdCam"
      id="CameraCaptureCrowd"
      class="Capture BorderBottom"
      :style="{
        left: '0px',
        top: '0px',
        width: '533px',
        height: '150px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '0px',
        top: !online && crowdCam ? '150px' : '0px',
        width: '533px',
        height: !online && crowdCam ? '400px' : '550px',
      }"
    />
    <div
      id="CameraCapture2"
      class="Capture BorderLeft BorderBottom"
      :style="{
        left: '533px',
        top: '0px',
        width: '1387px',
        height: '780px',
      }"
    />

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed Flex"
      :style="{
        left: '533px',
        top: '780px',
        width: '1387px',
        height: '160px',
      }"
    >
      <RunInfo
        class="BorderLeft"
        :style="{
          'font-size': '45px',
          'width': '1000px',
          height: '100%',
        }"
      />
      <Timer
        class="BorderLeft"
        :style="{
          'width': '387px',
          height: '100%',
        }"
      />
    </div>

    <!-- Player/Commentator -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '550px',
        width: '533px',
      }"
    >
      <Player />
      <CommentatorsReader />
      <CommentatorsReader show-reader />
    </div>

    <!-- Media Box -->
    <MediaBox
      vertical
      :font-size="36"
      :style="{
        left: '0px',
        top: '684px',
        width: '533px',
        height: '256px',
      }"
    />

    <!-- Donation Bar -->
    <DonationBar
      :style="{
        left: '0px',
        top: '940px',
        width: '1920px',
        height: '60px',
      }"
    />
  </div>
</template>
