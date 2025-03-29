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
  <div class="bsglayout _16x9_1p">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      :style="{
        left: '483px',
        top: '0px',
        width: '1437px',
        height: '811px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '0px',
        top: '0px',
        width: '462px',
        height: '349px',
      }"
    />

    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0px',
      top: '361px',
      width: '469px',
      height: '44px',
      }"
    >
      <Player/>
    </div>

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
          left: '474px',
          top: '822px',
          width: '731px',
          height: '176px',
        }"
    >
      <Timer
        class="TimerFH"
        line-right
        line-left
        :line-bottom="false"
      />
    </div>

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1210px',
        top: '822px',
        width: '710px',
        height: '176px',
      }"
    >
      <RunInfo text-align="left" info-is-row />
    </div>

    <!-- Media Box / Reader / Comms -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '410px',
        width: '469px',
        height: '588px',
      }"
    >
      <FlashingLightsWarning />
      <MediaBoxBox
        vertical
        line-right
        :style="{
          width: '469px',
          height: '100%',
        }"
      />
      <CommentatorsReader line-top show-reader />
      <CommentatorsReader line-top />
    </div>
  </div>
</template>
