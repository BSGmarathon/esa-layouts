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
    <!-- Run Game Info / comms / timer / mediabox -->
    <div
      class="Fixed FlexColumn BorderRight"
      :style="{
        left: '0px',
        top: '0px',
        width: '574px',
        height: '999px',
      }"
    >
      <RunInfo
        line-right
        text-align="left"
        class="BorderBottom"
        :style="{
          height: '500px',
        }"
      />
      <CommentatorsReader class="BorderBottom" />
      <CommentatorsReader class="BorderBottom" show-reader />
      <Timer
        line-bottom
        line-right
        class="BorderBottom"
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

    <div
      class="Relative BorderRight"
      :style="{
        left: '586px',
        top: '0px',
        height: '100%',
        width: '670px',
      }"
    >
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
        class="Fixed FlexColumn BorderTop BorderBottom"
        :style="{
          left: '579px',
          top: '548px',
          width: '677px',
          height: '44px',
        }"
        >
        <Player/>
      </div>
    </div>
  </div>
</template>
