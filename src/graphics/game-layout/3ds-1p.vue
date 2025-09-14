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
  <div class="bsglayout">
    <!-- Game Captures, 3ds is actually 15:9 or 5:3. 16:9 is close enough -->
    <GameCapture
      id="GameCapture1"
      class="BorderBottom"
      :style="{
        left: '574px',
        top: '0px',
        width: '1346px',
        height: '808px',
      }"
    />
    <GameCapture
      id="GameCapture3"
      :style="{
        left: '0px',
        top: '573px',
        width: '569px',
        height: '426px', // 15 px missing
      }"
    />

    <!-- Side border -->
    <div
      class="Fixed BorderRight"
      :style="{
        left: '16px',
        top: '0px',
        width: '553px',
        height: '100%',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '0px',
        top: '0px',
        width: '569px',
        height: '316px',
      }"
    />

    <!-- Player -->
    <div
      class="Fixed FlexColumn BorderTop"
      :style="{
        left: '0px',
        top: '316px',
        width: '569px',
        height: '44px',
      }"
    >
      <Player/>
    </div>

    <!--host, comms, timer-->
    <div
      class="Fixed FlexColumn BorderTop"
      :style="{
        left: '0px',
        top: '365px',
        width: '569px',
        height: '203px',
      }"
    >
      <CommentatorsReader class="BorderBottom"/>
      <CommentatorsReader class="BorderBottom" show-reader/>
      <Timer line-right class="BorderBottom"/>
    </div>

    <!-- Media Box -->
    <div
      class="Fixed FlexColumn BorderRight BorderLeft"
      :style="{
        left: '569px',
        top: '813px',
        width: '641px',
        height: '185px',
      }"
    >
      <MediaBoxBox
        line-right
        line-left
        :style="{
          width: '641px',
          height: '100%',
        }"
      />
      <FlashingLightsWarning class="Flex" style="align-self: flex-end"/>
    </div>

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1220px',
        top: '813px',
        width: '700px',
        height: '185px',
      }"
    >
      <RunInfo line-left info-is-row text-align="left"/>
    </div>
  </div>
</template>
