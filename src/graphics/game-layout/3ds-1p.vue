<script setup lang="ts">
import MediaBoxBox from './components/MediaBoxBox.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
</script>

<template>
  <div class="bsglayout _3ds_1p">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      class=""
      :style="{
        left: '574px',
        top: '0px',
        width: '1346px',
        height: '808px',
      }"
    />
    <GameCapture
      id="GameCapture3"
      class=""
      :style="{
        left: '0px',
        top: '594px',
        width: '550px',
        height: '404px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '0px',
        top: '0px',
        width: '553px',
        height: '319px',
      }"
    />

    <!-- Player -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '331px',
        width: '559px',
        height: '44px',
      }"
    >
      <Player />
    </div>

    <!--host, comms, timer-->
    <div class="Fixed FlexColumn"
         :style="{
          left: '0px',
          top: '380px',
          width: '559px',
          height: '203px',
        }"
    >
      <CommentatorsReader />
      <CommentatorsReader show-reader/>
      <Timer line-right/>
    </div>

    <!-- Media Box -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '564px',
        top: '822px',
        width: '641px',
        height: '176px',
      }"
    >
      <FlashingLightsWarning class="Flex" style="align-self: flex-start" />
      <MediaBoxBox
        line-right
        line-left
        :style="{
          width: '641px',
          height: '100%',
        }"
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
      <RunInfo line-right info-is-row text-align="left"/>
    </div>
  </div>
</template>
