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
        height: '510px',
      }"
    />

    <div
      class="Fixed BorderBottom"
      :style="{
        left: '574px',
        top: '0px',
        width: '100%',
        height: '510px',
      }"
    />

    <GameCapture
      id="GameCapture3"
      class="BorderLeft BorderRight"
      :style="{
        left: '925px',
        top: '515px',
        width: '644px',
        height: '483px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative BorderRight"
      :style="{
        left: '0px',
        top: '257px',
        width: '574px',
        height: '307px',
      }"
    />

    <!-- Player -->
    <div
      class="Fixed BorderRight BorderTop"
      :style="{
        left: '0px',
        top: '560px',
        width: '574px',
        height: '44px',
      }"
    >
      <Player/>
    </div>

    <!-- Host/comms -->
    <div
      class="Fixed FlexColumn BorderRight"
      :style="{
        left: '0x',
        top: '609px',
        width: '574px',
        height: '97px',
      }"
    >
      <CommentatorsReader class="BorderTop" />
      <CommentatorsReader class="BorderTop" show-reader />
    </div>

    <!--TIMER-->
    <div
      class="Fixed FlexColumn BorderTop BorderRight"
      :style="{
        left: '0px',
        top: '706px',
        width: '574px',
        height: '106px',
      }"
    >
      <Timer line-right line-bottom/>
    </div>

    <!-- Media Box -->
    <div
      class="Fixed FlexColumn BorderTop BorderRight"
      :style="{
        left: '0px',
        top: '811px',
        width: '574px',
        height: '182px',
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
