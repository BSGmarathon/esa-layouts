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
  <div class="bsglayout _ds_1p_vertical">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      :style="{
      left: '932px',
      top: '0px',
      width: '647px',
      height: '487px'
      }"
    />
    <GameCapture
      id="GameCapture3"
      :style="{
      left: '932px',
      top: '513px',
      width: '647px',
      height: '485px'
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '0px',
      top: '363px',
      width: '566px',
      height: '307px',
      }"
    >
      <FlashingLightsWarning />
    </div>

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0px',
      top: '0px',
      width: '574px',
      height: '349px'
      }"
    >
      <RunInfo line-right />
      <CommentatorsReader line-top show-reader />
      <CommentatorsReader line-top />
    </div>

    <!-- Player -->
    <div
      class="Fixed"
      :style="{
      left: '0px',
      top: '683px',
      width: '574px',
      height: '44px'
      }"
    >
      <Player />
    </div>

    <!-- Media Box / Timer -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '732px',
        width: '574px',
        height: '266px',
      }"
    >
      <Timer line-right />
      <MediaBoxBox
        line-right
        :style="{
          width: '574px',
          height: '100%',
        }"
      />
    </div>

  </div>
</template>
