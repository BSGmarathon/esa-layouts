<script setup lang="ts">
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
</script>

<template>
  <div class="bsglayout">
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
      class="BorderLeft BorderRight BorderTop"
      :style="{
        left: '83px',
        top: '684px',
        width: '412px',
        height: '309px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative BorderRight"
      :style="{
        left: '0px',
        top: '200px',
        width: '584px',
        height: '236px',
      }"
    >
      <FlashingLightsWarning />
    </div>

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn BorderRight"
      :style="{
        left: '0px',
        top: '0px',
        width: '584px',
        height: '200px',
      }"
    >
      <RunInfo class="BorderBottom" line-right />
    </div>

    <!-- Player / Reader / Commentators -->
    <div
      class="Fixed BorderTop BorderBottom BorderRight"
      :style="{
        left: '0px',
        top: '436px',
        width: '584px',
        height: '50px',
      }"
    >
      <Player />
    </div>

    <!--TIMER-->
    <div
      class="Fixed FlexColumn BorderRight"
      :style="{
        left: '0px',
        top: '486px',
        width: '584px',
        height: '100%',
      }"
    >
      <CommentatorsReader class="BorderBottom" />
      <CommentatorsReader class="BorderBottom" show-reader />
      <Timer class="BorderBottom" line-right />
    </div>
  </div>
</template>
