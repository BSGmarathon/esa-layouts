<script setup lang="ts">
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
import MediaBoxBox from './components/MediaBoxBox.vue';
</script>

<template>
  <div class="bsglayout">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      :style="{
        left: '1306px',
        top: '0px',
        width: '563px',
        height: '998px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '586px',
        top: '0px',
        width: '662px',
        height: '540px',
      }"
    />
    <div
      id="CameraCapture2"
      class="Capture Relative"
      :style="{
        left: '586px',
        top: '610px',
        width: '662px',
        height: '389px',
      }"
    />

    <div
      class="Fixed FlexColumn"
      :style="{
      left: '579px',
      top: '552px',
      width: '675px',
      height: '44px',
      }"
    >
      <Player/>
    </div>

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '0px',
        width: '574px',
        height: '252px',
      }"
    >
      <RunInfo line-right text-align="left" />
    </div>

    <!-- Media Box / Reader / Comms / TImer -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '252px',
        width: '574px',
        height: '746px',
      }"
    >
      <CommentatorsReader line-top show-reader />
      <CommentatorsReader line-top line-bottom />
      <Timer
        line-bottom
        line-right
      />
      <FlashingLightsWarning />
      <MediaBoxBox
        vertical
        line-right
        :style="{
          width: '574px',
          height: '100%',
        }"
      />
    </div>
  </div>
</template>
