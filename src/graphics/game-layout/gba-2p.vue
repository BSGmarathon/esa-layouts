<script setup lang="ts">
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import MediaBoxBox from './components/MediaBoxBox.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
</script>

<template>
  <div class="bsglayout _gba_2p">
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      class=""
      :slot-no="0"
      :style="{
      left: '0px',
      top: '0px',
      width: '958px',
      height: '637px',
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
      height: '637px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '721px',
      top: '750px',
      width: '477px',
      height: '248px',
      }"
    />

    <!-- Player 1 -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0px',
      top: '650px',
      width: '710px',
      height: '45px'
      }"
    >
      <Player :slot-no="0" />
    </div>

    <div
      class="Fixed FlexColumn"
      :style="{
      flex: '1',
      left: '715px',
      top: '650px',
      width: '490px',
      height: '96px',
    }"
    >
      <Timer line-left line-right />
    </div>

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '1210px',
      top: '650px',
      width: '710px',
      height: '45px'
      }"
    >
      <Player :slot-no="1" />
    </div>

    <!-- Run Game Info/warning -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1210px',
        top: '700px',
        width: '710px',
        height: '298px',
        }"
    >
      <RunInfo line-right />
      <FlashingLightsWarning
        class="Flex"
        style="align-self: flex-end"/>
    </div>

    <!-- Media box / commentator / donation reader -->
    <div class="Fixed FlexColumn"
         :style="{
        left: '0px',
        top: '700px',
        width: '710px',
        height: '298px',
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
