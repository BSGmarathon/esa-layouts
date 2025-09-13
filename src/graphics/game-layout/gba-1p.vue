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
  <div class="bsglayout _gba_1p">
    <!-- Game Capture -->
    <GameCapture
      id="GameCapture1"
      :style="{
        left: '598px',
        top: '58px',
        width: '1322px',
        height: '881px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '0px',
        top: '286px',
        width: '585px',
        height: '347px',
    }"/>

    <!-- Right text border -->
    <div
      class="Fixed BorderRight"
      :style="{
        top: '0px',
        left: '0px',
        width: '585px',
        height: '650px',
      }"
    />

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn BorderBottom"
      :style="{
        left: '0px',
        top: '0px',
        width: '585px',
        height: '281px',
        'justify-content': 'space-between',
    }"
    >
      <RunInfo line-right />
      <FlashingLightsWarning class="Flex" style="align-self: flex-end" />
    </div>

    <div
      class="Fixed FlexColumn BorderTop BorderRight"
      :style="{
      left: '0px',
      top: '630px',
      width: '585px',
      height: '44px',
      }"
    >
      <Player />
    </div>

    <!--host, comms, timer, and mediabox-->
    <div
      class="Fixed FlexColumn BorderRight"
      :style="{
        flex: '1',
        left: '0px',
        top: '679px',
        width: '585px',
        height: '320px',
      }"
    >
      <CommentatorsReader class="BorderTop" />
      <CommentatorsReader class="BorderTop" show-reader />
      <Timer top-margin="8px" class="BorderTop" line-right />
      <MediaBoxBox
        line-right
        class="BorderTop"
        :style="{
          width: '585px',
          height: '100%',
        }"
      />
    </div>
  </div>
</template>
