<script setup lang="ts">
import MediaBoxBox from './components/MediaBoxBox.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
</script>

<template>
  <div class="bsglayout _3ds_1p_vertical">
    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0x',
      top: '0px',
      width: '574px',
      height: '252px',
      }"
    >
      <RunInfo />
    </div>

    <!-- Host/comms -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0x',
      top: '257px',
      width: '574px',
      height: '97px',
      }"
    >
      <CommentatorsReader show-reader />
      <CommentatorsReader />
    </div>

    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      :style="{
      left: '846px',
      top: '0px',
      width: '808px',
      height: '486px',
      }"
    />

    <GameCapture
      id="GameCapture3"
      :style="{
      left: '928px',
      top: '513px',
      width: '646px',
      height: '485px',
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
    />

    <!-- Player -->
    <div
      class="Fixed"
      :style="{
      left: '0px',
      top: '683px',
      width: '574px',
      height: '44px',
      }"
    >
      <Player/>
    </div>

    <!--TIMER-->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '732px',
        width: '574px',
        height: '106px',
      }"
    >
      <Timer line-right line-bottom/>
    </div>

    <!-- Media Box -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '838px',
        width: '574px',
        height: '160px',
      }"
    >
      <FlashingLightsWarning class="Flex" style="align-self: flex-end" />
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
