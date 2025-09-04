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
  <div class="bsglayout">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      class="BorderBottom BorderRight"
      :slot-no="0"
      finish-time-pos="bottomleft"
      :style="{
        left: '0px',
        top: '0px',
        width: '712px',
        height: '405px',
      }"
    />
    <GameCapture
      id="GameCapture2"
      :slot-no="1"
      class="BorderTop BorderLeft BorderRight"
      finish-time-pos="topright"
      :style="{
        left: '602px',
        top: '600px',
        width: '713px',
        height: '398px',
      }"
    />
    <GameCapture
      id="GameCapture3"
      :slot-no="2"
      class="BorderBottom BorderLeft"
      finish-time-pos="bottomright"
      :style="{
        left: '1200px',
        top: '0px',
        width: '715px',
        height: '405px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Flex Relative"
      :style="{
        left: '736px',
        top: '0px',
        width: '446px',
        height: '323px',
      }"
    />

    <!-- Timer -->
    <div
      class="Fixed FlexColumn BorderTop BorderBottom"
      :style="{
        left: '717px',
        top: '330px',
        width: '483px',
        height: '100px',
      }"
    >
      <Timer line-right line-left />
    </div>

    <!-- Players -->
    <div
      class="Fixed FlexColumn BorderBottom BorderRight"
      :style="{
        left: '0px',
        top: '410px',
        width: '712px',
        height: '44px',
      }"
    >
      <Player :slot-no="0"/>
    </div>

    <div
      class="Fixed FlexColumn BorderTop BorderLeft BorderRight"
      :style="{
        left: '602px',
        top: '551px',
        width: '713px',
        height: '44px',
      }"
    >
      <Player :slot-no="1"/>
    </div>

    <div
      class="Fixed FlexColumn BorderLeft BorderBottom"
      :style="{
        left: '1200px',
        top: '410px',
        width: '715px',
        height: '44px',
      }"
    >
      <Player :slot-no="2"/>
    </div>

    <!-- Run Game Info / Reader / Commentators -->
    <div
      class="Fixed FlexColumn BorderTop"
      :style="{
        left: '0px',
        top: '600px',
        width: '602px',
        height: '393px',
      }"
    >
      <RunInfo class="BorderBottom" line-right />
      <CommentatorsReader class="BorderBottom" line-top />
      <CommentatorsReader line-top show-reader />
    </div>

    <!-- Media Box -->
    <div
      class="Fixed FlexColumn BorderTop"
      :style="{
        left: '1325px',
        top: '600px',
        width: '602px',
        height: '393px',
      }"
    >
      <FlashingLightsWarning />
      <MediaBoxBox
        vertical
        line-left
        :style="{
          width: '602px',
          height: '100%',
        }"
      />
    </div>
  </div>
</template>
