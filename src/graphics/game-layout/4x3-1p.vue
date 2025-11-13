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
  <div class="bsglayout">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      :style="{
        left: '589px',
        top: '0px',
        width: '1331px',
        height: '998px',
      }"
    />

    <div
      class="Fixed BorderRight"
      :style="{
        left: '0px',
        top: '0px',
        width: '584px',
        height: '100%',
      }"
    >
      <!-- Run Game Info -->
      <div
        class="Fixed FlexColumn BorderBottom"
        :style="{
          left: '0px',
          top: '0px',
          width: '579px',
          height: '251px',
        }"
      >
        <RunInfo line-right/>
        <FlashingLightsWarning class="Flex" style="align-self: flex-end"/>
      </div>

      <!-- Camera Captures -->
      <div
        id="CameraCapture1"
        class="Capture Relative"
        :style="{
          left: '0px',
          top: '251px',
          width: '579px',
          height: '349px',
        }"
      />

      <!-- Player -->
      <div
        class="Fixed FlexColumn BorderTop BorderBottom"
        :style="{
          left: '0px',
          top: '600px',
          width: '579px',
          height: '44px',
        }"
      >
        <Player/>
      </div>

      <!--host, comms, timer, and mediabox-->
      <div
        class="Fixed FlexColumn"
        :style="{
          flex: '1',
          left: '0px',
          top: '644px',
          width: '579px',
          height: '355px',
        }"
      >
        <CommentatorsReader class="BorderBottom"/>
        <CommentatorsReader show-reader class="BorderBottom"/>
        <Timer line-right class="BorderBottom"/>
        <MediaBoxBox
          line-right
          :style="{
            width: '579px',
            height: '100%',
          }"
        />
      </div>
    </div>
  </div>
</template>
