<script setup lang="ts">
import { ref } from 'vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
import MediaBoxBox from './components/MediaBoxBox.vue';

const infoIsRow = ref(false);

function flashingLightsUpdated(newVal: boolean): void {
  infoIsRow.value = newVal;
}
</script>

<template>
  <div class="bsglayout">
    <!-- Game Captures -->
    <div
      class="Fixed BorderBottom"
      :style="{
        left: '0px',
        top: '0px',
        width: '100%',
        height: '715px',
      }"
    >
      <GameCapture
        id="GameCapture1"
        class="BorderRight"
        :slot-no="0"
        :style="{
          left: '0px',
          top: '0px',
          width: '958px',
          height: '710px',
      }"
      />
      <GameCapture
        id="GameCapture2"
        :slot-no="1"
        finish-time-pos="bottomright"
        :style="{
          left: '958px',
          top: '0px',
          width: '961px',
          height: '710px',
        }"
      />
    </div>

    <!-- Camera Capture -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '710px',
        top: '815px',
        width: '495px',
        height: '183px',
      }"
    />

    <!-- Player 1 -->
    <div
      class="Fixed FlexColumn BorderBottom BorderRight"
      :style="{
        left: '0px',
        top: '715px',
        width: '710px',
        height: '45px'
      }"
    >
      <Player :slot-no="0"/>
    </div>

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn BorderLeft BorderBottom"
      :style="{
        left: '1205px',
        top: '715px',
        width: '715px',
        height: '45px'
      }"
    >
      <Player :slot-no="1"/>
    </div>

    <!-- Timer -->
    <div
      class="Fixed FlexColumn BorderLeft BorderRight BorderBottom"
      :style="{
        flex: 1,
        left: '705px',
        top: '715px',
        width: '505px',
        height: '100px',
      }"
    >
      <Timer line-right line-left :style="{
        height: '100%',
      }" />
    </div>

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn BorderLeft"
      :style="{
        left: '1205px',
        top: '760px',
        width: '715px',
        height: '239px',
      }"
    >
      <RunInfo text-align="left" :info-is-row="infoIsRow" line-left/>
      <FlashingLightsWarning
        class="Flex"
        @flashing-lights-updated="flashingLightsUpdated"
        style="align-self: flex-end"/>
    </div>

    <!-- Media box / commentator / donation reader -->
    <div class="Fixed FlexColumn BorderRight"
         :style="{
          left: '0px',
          top: '760px',
          width: '710px',
          height: '239px',
        }"
    >
      <MediaBoxBox
        line-right
        :style="{
          width: '705px',
          height: '100%',
        }"
      />
      <CommentatorsReader line-top class="BorderTop" />
      <CommentatorsReader line-top show-reader class="BorderTop" />
    </div>
  </div>
</template>
