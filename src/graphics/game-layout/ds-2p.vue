<script setup lang="ts">
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
</script>

<template>
  <div class="bsglayout">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      class="BorderBottom BorderRight"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '0px',
        width: '659px',
        height: '497px',
      }"
    />
    <GameCapture
      id="GameCapture3"
      class="BorderRight"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '502px',
        width: '659px',
        height: '496px',
      }"
    />
    <GameCapture
      id="GameCapture2"
      class="BorderBottom BorderLeft"
      finish-time-pos="bottomright"
      :slot-no="1"
      :style="{
        left: '1254px',
        top: '0px',
        width: '661px',
        height: '497px',
      }"
    />
    <GameCapture
      id="GameCapture4"
      :slot-no="1"
      class="BorderLeft"
      finish-time-pos="bottomright"
      :style="{
        left: '1254px',
        top: '502px',
        width: '661px',
        height: '496px',
      }"
    />

    <!-- Camera Capture -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '664px',
        top: '613px',
        width: '590px',
        height: '385px',
      }"
    />

    <!-- Player 1 -->
    <div
      class="Fixed BorderBottom BorderRight"
      :style="{
        left: '664px',
        top: '314px',
        width: '504px',
        height: '44px',
      }"
    >
      <Player :slot-no="0" />
    </div>

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn BorderTop BorderLeft"
      :style="{
        left: '745px',
        top: '453px',
        width: '507px',
        height: '44px'
      }"
    >
      <Player :slot-no="1" />
    </div>

    <!-- Run Game Info/Commentators/Reader -->
    <div
      class="Fixed FlexColumn BorderBottom"
      :style="{
        left: '664px',
        top: '0px',
        width: '590px',
        height: '309px',
      }"
    >
      <RunInfo line-right line-left />
      <CommentatorsReader class="BorderTop" />
      <CommentatorsReader class="BorderTop" show-reader />
    </div>

    <!-- Run Game Info/Commentators/Reader -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '664px',
        top: '375px',
        width: '590px',
        height: '90px',
      }"
    >
      <FlashingLightsWarning />
    </div>

    <div
      class="Fixed FlexColumn BorderTop BorderBottom"
      :style="{
        left: '664px',
        top: '502px',
        width: '590px',
        height: '101px',
      }"
    >
      <Timer line-left line-right />
    </div>
  </div>
</template>
