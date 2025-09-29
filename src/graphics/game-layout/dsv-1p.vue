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
      class="BorderLeft BorderRight BorderBottom"
      :style="{
        left: '916px',
        top: '0px',
        width: '667px',
        height: '500px',
      }"
    />

    <!-- Line middle -->
    <div
      class="Fixed BorderBottom"
      :style="{
        left: '575px',
        top: '0px',
        width: '100%',
        height: '500px',
      }"
    />

    <GameCapture
      id="GameCapture3"
      class="BorderLeft BorderRight"
      :style="{
        left: '916px',
        top: '505px',
        width: '667px',
        height: '495px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative BorderRight"
      :style="{
        left: '0px',
        top: '263px',
        width: '574px',
        height: '307px',
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
        width: '574px',
        height: '263px'
      }"
    >
      <RunInfo class="BorderBottom" line-right />
    </div>

    <!-- Player -->
    <div
      class="Fixed BorderTop BorderRight"
      :style="{
        left: '0px',
        top: '570px',
        width: '574px',
        height: '44px'
      }"
    >
      <Player />
    </div>

    <!-- Media Box / Timer -->
    <div
      class="Fixed FlexColumn BorderTop BorderRight"
      :style="{
        left: '0px',
        top: '619px',
        width: '574px',
        height: '374px',
      }"
    >
      <CommentatorsReader class="BorderBottom" />
      <CommentatorsReader class="BorderBottom" show-reader />
      <Timer class="BorderBottom" line-right />
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
