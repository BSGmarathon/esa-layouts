<script setup lang="ts">
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
</script>

<template>
  <div class="bsglayout _ds_1p">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      :style="{
      left: '589px',
      top: '0px',
      width: '1331px',
      height: '998px',
      }"
    />
    <GameCapture
      id="GameCapture3"
      :style="{
      left: '101px',
      top: '709px',
      width: '386px',
      height: '289px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '0px',
      top: '299px',
      width: '567px',
      height: '236px',
      }"
    >
      <FlashingLightsWarning />
    </div>

    <!-- Run Game Info / Reader / Commentators -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0px',
      top: '0px',
      width: '575px',
      height: '285px',
      }"
    >
      <RunInfo line-right line-left />
      <CommentatorsReader line-top show-reader />
      <CommentatorsReader line-top />
    </div>

    <!-- Player -->
    <div
      class="Fixed"
      :style="{
      left: '0px',
      top: '547px',
      width: '575px',
      height: '45px',
      }"
    >
      <Player />
    </div>

    <!--TIMER-->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '597px',
        width: '575px',
        height: '101px',
      }"
    >
      <Timer
        class="TimerFH"
        top-margin="5px"
        line-left
        line-right
        :line-bottom="false"
      />
    </div>
  </div>
</template>
