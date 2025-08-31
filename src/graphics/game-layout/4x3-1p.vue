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
        left: '591px',
        top: '0px',
        width: '1329px',
        height: '988px'
      }"
    />

    <div
    class="Fixed BorderRight"
    :style="{
        left: '0px',
        top: '0px',
        width: '575px',
        height: '100%'
      }"
    >
      <!-- Run Game Info -->
      <div
        class="Fixed FlexColumn BorderBottom"
        :style="{
          left: '0px',
          top: '0px',
          width: '575px',
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
        top: '265px',
        width: '568px',
        height: '332px'
      }"
      />

      <!-- Player -->
      <div
        class="Fixed FlexColumn BorderTop BorderBottom"
        :style="{
        left: '0px',
        top: '605px',
        width: '575px',
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
        top: '659px',
        width: '575px',
        height: '340px',
      }"
      >
        <CommentatorsReader class="BorderBottom"/>
        <CommentatorsReader show-reader class="BorderBottom"/>
        <Timer line-right class="BorderBottom"/>
        <MediaBoxBox
          line-right
          :style="{
          width: '575px',
          height: '100%',
        }"
        />
      </div>
    </div>
  </div>
</template>
