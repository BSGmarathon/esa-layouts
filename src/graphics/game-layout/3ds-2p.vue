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
      :slot-no="0"
      :style="{
        left: '0px',
        top: '118px',
        width: '738px',
        height: '415px',
      }"
    />
    <GameCapture
      id="GameCapture3"
      class="BorderLeft BorderRight"
      :slot-no="0"
      :style="{
        left: '66px',
        top: '587px',
        width: '548px',
        height: '411px',
      }"
    />

    <!-- Game feed 2 border top -->
    <div
      class="Fixed FlexColumn BorderBottom"
      :style="{
        left: '1182px',
        top: '15px',
        width: '738px',
        height: '98px'
      }"
    />

    <GameCapture
      id="GameCapture2"
      finish-time-pos="bottomright"
      :slot-no="1"
      :style="{
        left: '1182px',
        top: '118px',
        width: '738px',
        height: '415px',
      }"
    />
    <GameCapture
      id="GameCapture4"
      class="BorderLeft BorderRight"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
        left: '1290px',
        top: '587px',
        width: '548px',
        height: '411px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative BorderLeft BorderRight"
      :style="{
        left: '738px',
        top: '580px',
        width: '445px',
        height: '418px',
      }"
    />

    <!-- Reader -->
    <div
      class="Fixed FlexColumn BorderBottom"
      :style="{
        left: '0px',
        top: '25px',
        width: '738px',
        height: '93px',
        'align-content': 'flex-end'
      }"
    >
      <CommentatorsReader class="BorderTop" show-reader />
      <CommentatorsReader class="BorderTop" />
    </div>

    <!-- Player 1 -->
    <div
      class="Fixed FlexColumn BorderTop BorderBottom"
      :style="{
        left: '0px',
        top: '538px',
        width: '738px',
        height: '44px',
      }"
    >
      <Player :slot-no="0"/>
    </div>

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn BorderTop BorderBottom"
      :style="{
        left: '1182px',
        top: '538px',
        width: '738px',
        height: '44px'
      }"
    >
      <Player :slot-no="1"/>
    </div>

    <!-- Run Game Info / Reader / Commentators / Timer / Media Box -->
    <div
      class="Fixed FlexColumn BorderLeft BorderRight BorderBottom"
      :style="{
        left: '738px',
        top: '0px',
        width: '445px',
        height: '582px',
      }"
    >
      <RunInfo line-right line-left />
      <FlashingLightsWarning />
      <Timer class="BorderTop" line-left line-right />
      <MediaBoxBox
        line-right
        line-left
        class="BorderTop"
        :style="{
          width: '435px',
          height: '80%',
        }"
      />
    </div>
  </div>
</template>
