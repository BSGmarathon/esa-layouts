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
  <div class="bsglayout">
    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn BorderBottom BorderRight"
      :style="{
        left: '0x',
        top: '0px',
        width: '574px',
        height: '252px',
      }"
    >
      <RunInfo line-right />
    </div>

    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      class="BorderBottom BorderLeft BorderRight"
      :style="{
        left: '790px',
        top: '0px',
        width: '907px',
        height: '544px',
      }"
    />

    <div
      class="Fixed BorderBottom"
      :style="{
        left: '574px',
        top: '0px',
        width: '100%',
        height: '544px',
      }"
    />

    <GameCapture
      id="GameCapture3"
      class="BorderLeft BorderRight"
      :style="{
        left: '950px',
        top: '549px',
        width: '599px',
        height: '449px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative BorderRight"
      :style="{
        left: '0px',
        top: '252px',
        width: '574px',
        height: '307px',
      }"
    />

    <!-- Player -->
    <div
      class="Fixed BorderRight BorderTop"
      :style="{
        left: '0px',
        top: '559px',
        width: '574px',
        height: '44px',
      }"
    >
      <Player/>
    </div>

    <!-- Comms / Host / timer / Media Box -->
    <div
      class="Fixed FlexColumn BorderTop BorderRight"
      :style="{
        left: '0px',
        top: '603px',
        width: '574px',
        height: '394px',
      }"
    >
      <CommentatorsReader class="BorderBottom" />
      <CommentatorsReader class="BorderBottom" show-reader />
      <Timer class="BorderBottom" line-right line-bottom/>
      <FlashingLightsWarning class="Flex" style="align-self: flex-end" />
      <MediaBoxBox
        line-right
        :style="{
          width: '569px',
          height: '100%',
        }"
      />
    </div>
  </div>
</template>
