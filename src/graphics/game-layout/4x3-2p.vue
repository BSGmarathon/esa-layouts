<script setup lang="ts">
import { ref } from 'vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
import MediaBoxBox from './components/MediaBoxBox.vue';

const infoIsRow = ref(false);

function flashingLightsUpdated(newVal: boolean): void {
  infoIsRow.value = newVal;
}
</script>

<template>
  <div class="bsglayout _4x3_2p">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '0px',
        width: '958px',
        height: '715px',
      }"
    />
    <GameCapture
      id="GameCapture2"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
      left: '963px',
      top: '0px',
      width: '958px',
      height: '715px',
      }"
    />

    <!-- Camera Capture -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '720px',
      top: '828px',
      width: '480px',
      height: '170px',
      }"
    />

    <!-- Player 1 -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0px',
      top: '728px',
      width: '710px',
      height: '45px'
      }"
    >
      <Player :slot-no="0"/>
    </div>

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1210px',
        top: '728px',
        width: '710px',
        height: '45px'
      }"
    >
      <Player :slot-no="1"/>
    </div>

    <!-- Timer -->
    <div
      class="Fixed FlexColumn"
      :style="{
          left: '715px',
          top: '728px',
          width: '490px',
          height: '94px',
        }"
    >
      <Timer line-right line-left />
    </div>

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1210px',
        top: '778px',
        width: '710px',
        height: '220px',
      }"
    >
      <RunInfo text-align="left" :info-is-row="infoIsRow" line-right/>
      <FlashingLightsWarning
        class="Flex"
        @flashing-lights-updated="flashingLightsUpdated"
        style="align-self: flex-end"/>
    </div>

    <!-- Media box / commentator / donation reader -->
    <div class="Fixed FlexColumn"
         :style="{
          left: '0px',
          top: '778px',
          width: '710px',
          height: '221px',
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
      <CommentatorsReader line-top show-reader/>
    </div>
  </div>
</template>
