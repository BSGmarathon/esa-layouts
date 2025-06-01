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
<div class="bsglayout _gb_1p">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      :style="{
        left: '700px',
        top: '0px',
        width: '1108px',
        height: '1000px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '0px',
        top: '336px',
        width: '576px',
        height: '347px',
    }"/>

  <!-- Run Game Info -->
  <div
    class="Flex FlexColumn"
    :style="{
        left: '0px',
        top: '0px',
        width: '576px',
        height: '281px',
        'justify-content': 'space-between',
    }"
  >
    <RunInfo line-right />
    <FlashingLightsWarning class="Flex" style="align-self: flex-end" />
  </div>

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
        // height: '322px',
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
          // height: '109px',
          // height: '118px',
          height: '100%',
        }"
      />
    </div>
  </div>
</template>
