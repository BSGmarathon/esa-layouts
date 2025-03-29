<script setup lang="ts">
import { ref } from 'vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import MediaBoxBox from './components/MediaBoxBox.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';

const infoIsRow = ref(false);

function flashingLightsUpdated(newVal: boolean): void {
  infoIsRow.value = newVal;
}
</script>

<template>
  <div class="bsglayout _gb_2p">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      class=""
      :slot-no="0"
      :style="{
      left: '88px',
      top: '0px',
      width: '793px',
      height: '714px',
      }"
    />

    <GameCapture
      id="GameCapture2"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
      left: '1046px',
      top: '0px',
      width: '792px',
      height: '714px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '720px',
      top: '831px',
      width: '480px',
      height: '167px',
      }"
    />

    <!-- Player 1 -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0px',
      top: '732px',
      width: '710px',
      height: '45px'
      }"
    >
      <Player :slot-no="0"/>
    </div>

    <div
      class="Fixed FlexColumn"
      :style="{
      flex: '1',
      left: '715px',
      top: '732px',
      width: '490px',
      height: '96px',
    }"
    >
      <Timer line-left line-right/>
    </div>

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '1210px',
      top: '732px',
      width: '710px',
      height: '45px'
      }"
    >
      <Player :slot-no="1"/>
    </div>

    <!-- Run Game Info/warning -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1210px',
        top: '782px',
        width: '710px',
        height: '216px',
        }"
    >
      <RunInfo line-right text-align="flex-start" :info-is-row="infoIsRow" />
      <FlashingLightsWarning
        class="Flex"
        @flashing-lights-updated="flashingLightsUpdated"
        style="align-self: flex-end"/>
    </div>

    <!-- Media box / commentator / donation reader -->
    <div class="Fixed FlexColumn"
         :style="{
        left: '0px',
        top: '782px',
        width: '710px',
        height: '216px',
        }"
    >
      <MediaBoxBox
        line-left
        :style="{
          width: '710px',
          height: '100%',
        }"
      />
      <CommentatorsReader line-top />
      <CommentatorsReader line-top show-reader />
    </div>
  </div>
</template>
