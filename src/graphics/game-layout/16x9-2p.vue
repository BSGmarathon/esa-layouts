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
    <div
      class="Fixed BorderBottom BorderTop"
      :style="{
        left: '0px',
        top: '72px',
        height: '536px',
        width: '100%',
      }"
    >
      <!-- Game Captures -->
      <GameCapture
        id="GameCapture1"
        class="BorderRight"
        :slot-no="0"
        :style="{
          left: '0px',
          top: '77px',
          width: '958px',
          height: '536px',
        }"
      />
      <GameCapture
        id="GameCapture2"
        :slot-no="1"
        finish-time-pos="bottomright"
        :style="{
          left: '963px',
          top: '77px',
          width: '958px',
          height: '536px',
        }"
      />
    </div>

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '692px',
        top: '730px',
        width: '540px',
        height: '269px',
      }"
    />

    <!-- Player 1 -->
    <div
      class="Fixed BorderRight BorderBottom"
      :style="{
        left: '0px',
        top: '618px',
        width: '682px',
        height: '44px'
      }"
    >
      <Player :slot-no="0" />
    </div>

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn BorderBottom BorderLeft"
      :style="{
        left: '1238px',
        top: '618px',
        width: '677px',
        height: '44px'
      }"
    >
      <Player :slot-no="1" />
    </div>

    <div
      class="Fixed FlexColumn BorderBottom"
      :style="{
        left: '687px',
        top: '618px',
        width: '551px',
        height: '101px',
      }"
    >
      <Timer line-left line-right />
    </div>

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn BorderLeft"
      :style="{
        left: '1238px',
        top: '667px',
        width: '682px',
        height: '331px',
        }"
    >
      <FlashingLightsWarning class="Flex" style="align-self: flex-end" />
      <RunInfo line-left />
    </div>

    <!-- Media Box / Reader / Commentators -->
    <div
      class="Fixed FlexColumn BorderRight"
      :style="{
        left: '0px',
        top: '667px',
        width: '682px',
        height: '331px',
      }"
    >
      <MediaBoxBox
        line-right
        class="BorderBottom"
        :style="{
          width: '682px',
          height: '100%',
        }"
      />
      <CommentatorsReader class="BorderBottom" line-top />
      <CommentatorsReader line-top show-reader />
    </div>

  </div>
</template>
