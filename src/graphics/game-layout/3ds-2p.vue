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
  <div class="bsglayout _3ds_2p">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '180px',
        width: '660px',
        height: '394px'
      }"
    />
    <GameCapture
      id="GameCapture3"
      :slot-no="0"
      :style="{
        left: '66px',
        top: '602px',
        width: '530px',
        height: '396px'
      }"
    />
    <GameCapture
      id="GameCapture2"
      finish-time-pos="bottomright"
      :slot-no="1"
      :style="{
        left: '1261px',
        top: '178px',
        width: '660px',
        height: '398px'
      }"
    />
    <GameCapture
      id="GameCapture4"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
        left: '1326px',
        top: '601px',
        width: '530px',
        height: '397px'
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '686px',
        top: '600px',
        width: '547px',
        height: '398px'
      }"
    />

    <!-- Reader -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '20px',
        width: '671px',
        height: '94px'
      }"
    >
      <CommentatorsReader line-top show-reader/>
      <CommentatorsReader line-top/>
    </div>

    <!-- Player 1 -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '118px',
        width: '671px',
        height: '44px'
      }"
    >
      <Player :slot-no="0"/>
    </div>

    <!-- Commentators -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1249px',
        top: '69px',
        width: '671px',
        height: '44px'
      }"
    />

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1249px',
        top: '118px',
        width: '671px',
        height: '44px'
      }"
    >
      <Player :slot-no="1"/>
    </div>

    <!-- Run Game Info TODO: cleanup -->
<!--    <div
      class="Fixed FlexColumn"
      :style="{
          left: '678px',
          top: '18px',
          width: '528px',
          height: '285px',
        }"
    >
      <run-info line-right line-left />
    </div>-->

    <!-- Run Game Info / Reader / Commentators / Timer / Media Box -->
    <div
      class="Fixed FlexColumn"
      :style="{
          left: '676px',
          top: '0px',
          width: '568px',
          height: '587px',
        }"
    >
      <RunInfo line-right line-left />
      <FlashingLightsWarning />
      <Timer border-top line-left line-right />
      <MediaBoxBox
        line-right
        line-left
        :style="{
          width: '568px',
          height: '80%',
        }"
      />
    </div>
  </div>
</template>
