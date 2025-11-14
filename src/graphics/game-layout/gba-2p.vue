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
  <div class="bsglayout">
    <div
      class="Fixed BorderBottom"
      :style="{
        left: '0px',
        top: '0px',
        width: '100%',
        height: '637px',
      }"
    >
      <!-- Game Captures -->
      <GameCapture
        id="GameCapture1"
        class="BorderRight"
        :slot-no="0"
        :style="{
          left: '0px',
          top: '0px',
          width: '960px',
          height: '632px',
        }"
      />

      <GameCapture
        id="GameCapture2"
        :slot-no="1"
        finish-time-pos="bottomright"
        :style="{
          left: '961px',
          top: '0px',
          width: '958px',
          height: '632px',
        }"
      />
    </div>

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '715px',
        top: '747px',
        width: '490px',
        height: '251px',
      }"
    />

    <!-- Player 1 -->
    <div
      class="Fixed FlexColumn BorderBottom BorderRight"
      :style="{
        left: '0px',
        top: '637px',
        width: '715px',
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
        top: '637px',
        width: '490px',
        height: '100px',
    }"
    >
      <Timer top-margin="-3px" line-left line-right />
    </div>

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn BorderLeft BorderBottom"
      :style="{
        left: '1205px',
        top: '637px',
        width: '715px',
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
        top: '681px',
        width: '715px',
        height: '317px',
      }"
    >
      <RunInfo line-left />
      <FlashingLightsWarning
        class="Flex"
        style="align-self: flex-end"/>
    </div>

    <!-- Media box / commentator / donation reader -->
    <div
      class="Fixed FlexColumn BorderRight"
      :style="{
        left: '0px',
        top: '681px',
        width: '715px',
        height: '317px',
      }"
    >
      <MediaBoxBox
        line-right
        :style="{
          width: '710px',
          height: '100%',
        }"
      />
      <CommentatorsReader class="BorderTop" />
      <CommentatorsReader class="BorderTop" show-reader/>
    </div>
  </div>
</template>
