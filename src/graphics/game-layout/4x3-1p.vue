<script setup lang="ts">
import MediaBoxBox from './components/MediaBoxBox.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
import Timer from './components/Timer.vue';
</script>

<template>
<div class="bsglayout _4x3_1p">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      :style="{
        left: '591px',
        top: '0px',
        width: '1329px',
        height: '988px'
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '0px',
        top: '344px',
        width: '568px',
        height: '332px'
      }"
    />

  <!-- Run Game Info -->
  <div
    class="Fixed FlexColumn"
    :style="{
          left: '0px',
          top: '0px',
          width: '575px',
          height: '281px',
        }"
  >
    <RunInfo line-right />
    <FlashingLightsWarning class="Flex" style="align-self: flex-end" />
  </div>

    <!-- Player -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '286px',
        width: '575px',
        height: '44px',
      }"
    >
      <Player />
    </div>

  <!--host, comms, timer, and mediabox-->
  <div
    class="Fixed FlexColumn"
    :style="{
        flex: '1',
        left: '0px',
        top: '688px',
        width: '575px',
        height: '310px',
      }"
  >
    <CommentatorsReader />
    <CommentatorsReader show-reader />
    <Timer line-right />
    <MediaBoxBox
      line-right
      :style="{
          width: '575px',
          height: '100%',
        }"
    />
  </div>
  </div>
</template>
