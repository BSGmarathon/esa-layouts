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
    <div
      class="Fixed BorderRight"
      :style="{
        left: '0px',
        top: '0px',
        width: '660px',
        height: '100%',
    }">
      <GameCapture
        id="GameCapture1"
        class="BorderBottom"
        :slot-no="0"
        :style="{
        left: '0px',
        top: '0px',
        width: '660px',
        height: '496px',
      }"
      />
      <GameCapture
        id="GameCapture3"
        :slot-no="2"
        :style="{
        left: '0px',
        top: '502px',
        width: '660px',
        height: '496px',
      }"
      />
    </div>

    <div
      class="Fixed BorderLeft"
      :style="{
        left: '1260px',
        top: '0px',
        width: '660px',
        height: '100%',
    }">
      <GameCapture
        id="GameCapture2"
        class="BorderBottom"
        finish-time-pos="bottomright"
        :slot-no="1"
        :style="{
        left: '1260px',
        top: '0px',
        width: '660px',
        height: '496px',
      }"
      />

      <!-- Camera Captures -->
      <div
        id="CameraCapture1"
        class="Capture Relative"
        :style="{
        left: '1260px',
        top: '502px',
        width: '660px',
        height: '496px',
      }"
      />
    </div>

    <!-- General Run Info -->

    <!-- Players -->
    <div
      class="Fixed FlexColumn BorderBottom BorderRight"
      :style="{
      left: '665px',
      top: '333px',
      width: '512px',
      height: '44px',
      }"
    >
      <Player :slot-no="0" />
    </div>

    <div
      class="Fixed FlexColumn BorderBottom BorderLeft BorderTop"
      :style="{
      left: '738px',
      top: '448px',
      width: '517px',
      height: '44px',
      }"
    >
      <Player :slot-no="1" />
    </div>

    <div
      class="Fixed"
      :style="{
        top: '506px',
        left: '665px',
        width: '595px',
      }"
    >
      <FlashingLightsWarning />
    </div>

    <div
      class="Fixed FlexColumn BorderBottom BorderTop BorderRight"
      :style="{
      left: '665px',
      top: '574px',
      width: '512px',
      height: '44px',
      }"
    >
      <Player :slot-no="2" />
    </div>

    <!-- Run Game Info/host/comms -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '665px',
        top: '0px',
        width: '595px',
        height: '333px',
      }"
    >
      <RunInfo class="BorderBottom" line-left line-right />
      <CommentatorsReader class="BorderBottom" line-top />
      <CommentatorsReader class="BorderBottom" line-top show-reader />
    </div>

    <!-- Timer/Media Box -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '665px',
        top: '681px',
        width: '595px',
        height: '317px',
      }"
    >
      <Timer class="BorderBottom BorderTop" line-right line-left />
      <MediaBoxBox
        line-left
        line-right
        :style="{
          width: '595px',
          height: '100%',
        }"
      />
    </div>
  </div>
</template>
