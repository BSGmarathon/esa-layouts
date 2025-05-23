<script setup lang="ts">
import MediaBox from '@esa-layouts/graphics/_misc/components/mediabox';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import DonationBar from './components/DonationBar.vue';
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

    <!-- Crowd Camera Capture -->
    <div
      id="CameraCaptureCrowd"
      class="Capture"
      :style="{
        left: '0px',
        top: '0px',
        width: '533px',
        height: '325px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BorderTop"
      :style="{
        left: '0px',
        top: '325px',
        width: '533px',
        height: '325px',
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

    <!-- Player/Commetator/Media Box -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '650px',
        width: '533px',
        height: '290px',
      }"
    >
      <!-- Player/Commetator -->
      <Player />
      <CommentatorsReader />
      <CommentatorsReader show-reader />

      <!-- Media Box -->
      <MediaBox
        :font-size="25"
        :style="{
          'flex-grow': 1,
          position: 'unset',
          width: '100%',
        }"
      />
    </div>

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
