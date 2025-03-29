<script setup lang="ts">
import MediaBox from '@esa-layouts/graphics/_misc/components/mediabox';
import CommentatorsReader from './components/CommentatorsReader.vue';
import DonationBar from './components/DonationBar.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
</script>

<template>
  <div>
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      class="BorderLeft BorderBottom"
      :style="{
        left: '858px',
        top: '0px',
        width: '1062px',
        height: '797px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '0px',
        top: '0px',
        width: '858px',
        height: '483px',
      }"
    />
    <GameCapture
      id="CameraCapture2"
      class="BorderTop BorderLeft BorderBottom"
      :style="{
        left: '373px',
        top: '648px',
        width: '485px',
        height: '323px',
      }"
    />

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed Flex"
      :style="{
        left: '858px',
        top: '797px',
        width: '1062px',
        height: '143px',
      }"
    >
      <RunInfo
        class="BorderLeft"
        :style="{
          'width': '692px',
          height: '100%',
        }"
      />
      <Timer
        class="BorderLeft"
        :style="{
          'width': '370px',
          height: '100%',
        }"
      />
    </div>

    <!-- Player/Commetator -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '483px',
        width: '858px',
      }"
    >
      <Player />
      <CommentatorsReader />
      <CommentatorsReader show-reader />
    </div>

    <!-- Media Box -->
    <MediaBox
      vertical
      :font-size="30"
      :style="{
        left: '0px',
        top: '619px',
        width: '373px',
        height: '381px',
      }"
    />

    <!-- Donation Bar -->
    <DonationBar
      class="BorderLeft"
      :style="{
        left: '858px',
        top: '940px',
        width: '1062px',
        height: '60px',
      }"
    />
  </div>
</template>
