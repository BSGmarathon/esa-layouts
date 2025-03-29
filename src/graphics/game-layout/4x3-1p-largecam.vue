<script setup lang="ts">
import MediaBoxBox from './components/MediaBoxBox.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
</script>

<template>
<div class="bsglayout _4x3_1p_largecam">
  <!-- Game Captures -->
  <GameCapture
    id="GameCapture1"
    class="BlockRed"
    :style="{
        left: '589px',
        top: '0px',
        width: '1331px',
        height: '998px',
      }"
  />

  <!-- Camera Captures -->
  <div
    id="CameraCapture1"
    class="Capture BlockBlue Relative"
    :style="{
        left: '0px',
        top: '346px',
        width: '567px',
        height: '426px',
      }"
  />

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
    <RunInfo />
    <FlashingLightsWarning class="Flex" style="align-self: flex-end" />
  </div>

  <!-- TIMER/media box -->
  <div
    class="Fixed FlexColumn BlockBlack"
    :style="{
      left: '0px',
      top: '785px',
      width: '575px',
      height: '213px',
    }"
  >
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
