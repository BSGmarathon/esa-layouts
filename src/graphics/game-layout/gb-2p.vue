<script setup lang="ts">
import { ref } from 'vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import MediaBoxBox from './components/MediaBoxBox.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';

const infoIsRow = ref(false);

function flashingLightsUpdated(newVal: boolean): void {
  infoIsRow.value = newVal;
}
</script>

<template>
  <div class="bsglayout _gb_2p">
    <div
      class="Fixed BorderBottom"
      :style="{
        left: '0px',
        top: '0px',
        width: '100%',
        height: '714px',
      }"
    >
      <!-- Game Captures -->
      <GameCapture
        id="GameCapture1"
        class=""
        :slot-no="0"
        :style="{
          left: '88px',
          top: '0px',
          width: '793px',
          height: '714px',
        }"
      />

      <div
        class="Fixed BorderRight"
        :style="{
          top: '0px',
          left: '0px',
          width: '960px',
          height: '714px',
        }"
      />

      <GameCapture
        id="GameCapture2"
        :slot-no="1"
        finish-time-pos="bottomright"
        :style="{
          left: '1046px',
          top: '0px',
          width: '792px',
          height: '714px',
        }"
      />
    </div>

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '715px',
      top: '820px',
      width: '490px',
      height: '177px',
      }"
    />

    <!-- Player 1 -->
    <div
      class="Fixed FlexColumn BorderRight BorderBottom"
      :style="{
        left: '0px',
        top: '719px',
        width: '710px',
        height: '45px'
      }"
    >
      <Player :slot-no="0"/>
    </div>

    <div
      class="Fixed FlexColumn BorderBottom"
      :style="{
        flex: '1',
        left: '715px',
        top: '719px',
        width: '490px',
        height: '96px',
      }"
    >
      <Timer top-margin="3px" line-left line-right/>
    </div>

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn BorderLeft BorderBottom"
      :style="{
        left: '1205px',
        top: '719px',
        width: '710px',
        height: '45px'
      }"
    >
      <Player :slot-no="1"/>
    </div>

    <!-- Run Game Info/warning -->
    <div
      class="Fixed FlexColumn BorderLeft"
      :style="{
        left: '1205px',
        top: '769px',
        width: '710px',
        height: '229px',
        }"
    >
      <RunInfo line-left text-align="flex-start" :info-is-row="infoIsRow" />
      <FlashingLightsWarning
        class="Flex"
        @flashing-lights-updated="flashingLightsUpdated"
        style="align-self: flex-end"/>
    </div>

    <!-- Media box / commentator / donation reader -->
    <div class="Fixed FlexColumn BorderRight"
         :style="{
        left: '0px',
        top: '769px',
        width: '710px',
        height: '229px',
        }"
    >
      <MediaBoxBox
        line-Right
        :style="{
          width: '710px',
          height: '100%',
        }"
      />
      <CommentatorsReader class="BorderTop" />
      <CommentatorsReader class="BorderTop" show-reader />
    </div>
  </div>
</template>
