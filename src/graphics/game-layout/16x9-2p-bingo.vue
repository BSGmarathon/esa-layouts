<script setup lang="ts">
import MediaBoxBox from './components/MediaBoxBox.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
</script>

<template>
  <div class="bsglayout">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      class="BorderRight"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '0px',
        width: '960px',
        height: '540px',
      }"
    />
    <GameCapture
      id="GameCapture2"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
        left: '960px',
        top: '0px',
        width: '960px',
        height: '540px',
      }"
    />

    <!-- Player 1 -->
    <div
      class="Fixed FlexColumn BorderTop"
      :style="{
        left: '0px',
        top: '540px',
        width: '430px',
        height: '45px',
      }"
    >
      <Player :slot-no="0" />
    </div>

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn BorderTop"
      :style="{
        left: '1480px',
        top: '540px',
        width: '440px',
        height: '45px',
      }"
    >
      <Player :slot-no="1" />
    </div>

    <!-- Camera Capture -->
    <div
      id="CameraCapture1"
      class="Capture BorderTop BorderRight BorderLeft"
      :style="{
        left: '430px',
        top: '540px',
        width: '530px',
        height: '460px',
      }"
    />

    <!-- Bingo Card Slot -->
    <GameCapture
      id="GameCapture3"
      :slot-no="2"
      class="BorderTop BorderRight"
      finish-time-pos="bottomright"
      :style="{
        left: '960px',
        top: '540px',
        width: '520px',
        height: '460px',
      }"
    />

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed FlexColumn BorderTop BorderLeft"
      :style="{
        left: '1475px',
        top: '585px',
        width: '445px',
        height: '413px',
      }"
    >
      <FlashingLightsWarning class="Flex" style="font-size: 15pt" />
      <RunInfo class="BorderBottom" line-left />
      <Timer line-left />
    </div>

    <div
      class="Fixed FlexColumn BorderRight"
      :style="{
        left: '0px',
        top: '585px',
        width: '435px',
        height: '415px',
      }"
    >
      <CommentatorsReader class="BorderTop" />
      <CommentatorsReader class="BorderTop" show-reader />
      <MediaBoxBox
        line-right
        class="BorderTop"
        :style="{
          width: '430px',
          height: '100%',
        }"
      />
    </div>
  </div>
</template>
