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
    <!-- Game Capture -->
    <GameCapture
      id="GameCapture1"
      class="BorderNone"
      :style="{
        left: '474px',
        top: '0px',
        width: '1446px',
        height: '813px',
      }"
    />

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1209px',
        top: '818px',
        width: '710px',
        height: '180px',
      }"
    >
      <RunInfo text-align="left" line-left info-is-row />
    </div>

    <div
      class="Flex Fixed BorderTop"
      :style="{
        left: '474px',
        top: '813px',
        width: '1446px',
        height: '185px',
      }"
    >
      <div
        class="Fixed FlexColumn BorderRight"
        :style="{
          left: '474px',
          top: '818px',
          width: '735px',
          height: '180px',
        }"
      >
        <MediaBoxBox
          line-left
          line-right
          :style="{
            width: '730px',
            height: '100%',
          }"
        />
      </div>
    </div>

    <div class="Flex BorderRight" :style="{
      height: '100%',
      width: '474px',
    }">
      <!-- Camera Capture -->
      <div
        id="CameraCapture1"
        class="Capture Relative"
        :style="{
          left: '0px',
          top: '0px',
          width: '469px',
          height: '685px',
        }"
      />

      <!-- Player -->
      <div
        class="Fixed FlexColumn BorderTop BorderBottom"
        :style="{
        left: '0px',
        top: '685px',
        width: '469px',
        height: '44px',
      }"
      >
        <Player />
      </div>

      <!-- Media Box/Commentator/Reader -->
      <div
        class="Fixed FlexColumn"
        :style="{
          left: '0px',
          top: '729px',
          width: '469px',
          height: '270px',
        }"
      >
        <CommentatorsReader class="BorderBottom" />
        <CommentatorsReader class="BorderBottom" show-reader />
        <FlashingLightsWarning class="BorderBottom" />
        <Timer class="BorderBottom" line-right />
      </div>
    </div>
  </div>
</template>
