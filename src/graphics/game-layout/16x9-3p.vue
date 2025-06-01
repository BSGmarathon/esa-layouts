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
  <div class="bsglayout _16x9_3p">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
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
      finish-time-pos="bottomright"
      :style="{
        left: '1205px',
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
      class="Fixed FlexColumn"
      :style="{
        left: '726px',
        top: '337px',
        width: '465px',
        height: '130px',
      }"
    >
      <Timer line-right line-left />
    </div>

    <!-- Players -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0px',
      top: '418px',
      width: '721px',
      height: '44px',
    }"
    >
      <Player :slot-no="0"/>
    </div>

    <div
      class="Fixed FlexColumn"
      :style="{
      left: '594px',
      top: '542px',
      width: '730px',
      height: '44px',
      }"
    >
      <Player :slot-no="1"/>
    </div>

    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1196px',
        top: '418px',
        width: '724px',
        height: '44px',
      }"
    >
      <Player :slot-no="2"/>
    </div>

    <!-- Run Game Info / Reader / Commentators -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '592px',
        width: '589px',
        height: '406px',
      }"
    >
      <RunInfo line-right />
      <CommentatorsReader line-top show-reader />
      <CommentatorsReader line-top />
    </div>

    <!-- Media Box -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1329px',
        top: '592px',
        width: '591px',
        height: '406px',
      }"
    >
      <FlashingLightsWarning />
      <MediaBoxBox
        vertical
        line-right
        line-left
        :style="{
          width: '591px',
          height: '100%',
        }"
      />
    </div>
  </div>
</template>
