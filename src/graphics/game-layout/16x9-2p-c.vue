<script setup lang="ts">
import CommentatorsReader from './components/CommentatorsReader.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
import MediaBoxBox from './components/MediaBoxBox.vue';
</script>

<template>
  <div class="bsglayout">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '77px',
        width: '715px',
        height: '536px',
      }"
    />

    <!-- Something for the tracker -->
    <GameCapture
      id="GameCapture3"
      :slot-no="2"
      :style="{
        left: '715px',
        top: '77px',
        width: '491px',
        height: '536px',
      }"
    />

    <GameCapture
      id="GameCapture2"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
        left: '1206px',
        top: '77px',
        width: '715px',
        height: '536px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '696px',
        top: '742px',
        width: '529px',
        height: '256px',
      }"
    />

    <!-- Player 1 -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '627px',
        width: '682px',
        height: '50px',
      }"
    >
      <Player :slot-no="0" />
    </div>

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1238px',
        top: '627px',
        width: '682px',
        height: '50px',
      }"
    >
      <Player :slot-no="1" />
    </div>

    <!-- Timer -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '687px',
        top: '627px',
        width: '546px',
        height: '101px',
      }"
    >
      <Timer line-left line-right />
    </div>

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1238px',
        top: '682px',
        width: '682px',
        height: '316px',
      }"
    >
      <FlashingLightsWarning class="Flex" style="align-self: flex-end" />
      <RunInfo line-right />
    </div>

    <!-- Media Box / Reader / Commentators -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '682px',
        width: '682px',
        height: '316px',
      }"
    >
      <MediaBoxBox
        line-right
        :style="{ height: '100%' }"
      />
      <CommentatorsReader line-top show-reader />
      <CommentatorsReader line-top />
    </div>
  </div>
</template>
