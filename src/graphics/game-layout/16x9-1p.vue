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
      :style="{
        left: '483px',
        top: '0px',
        width: '1437px',
        height: '811px',
      }"
    />

    <div
      class="Flex Fixed BorderTop"
      :style="{
        left: '483px',
        top: '811px',
        width: '1437px',
        height: '185px',
      }"
    >
      <!-- Timer -->
      <div
        class="Fixed FlexColumn BorderRight"
        :style="{
          left: '483px',
          top: '816px',
          width: '731px',
          height: '181px',
        }"
      >
        <Timer
          class="TimerFH"
          top-margin="15px"
          line-right
          line-left
        />
      </div>

      <!-- Run Game Info -->
      <div
        class="Fixed FlexColumn"
        :style="{
          left: '1214px',
          top: '816px',
          width: '705px',
          height: '181px',
      }"
      >
        <RunInfo text-align="left" info-is-row/>
      </div>
    </div>

    <div
      class="Flex BorderRight"
      :style="{
        height: '100%',
        width: '483px',
      }"
    >
      <!-- Camera Captures -->
      <div
        id="CameraCapture1"
        class="Capture Relative"
        :style="{
          left: '0px',
          top: '0px',
          width: '478px',
          height: '361px',
        }"
      />

      <div
        class="Fixed FlexColumn BorderTop BorderBottom"
        :style="{
          left: '0px',
          top: '361px',
          width: '478px',
          height: '44px',
        }">
        <Player/>
      </div>

      <!-- Media Box / Reader / Comms -->
      <div
        class="Fixed FlexColumn"
        :style="{
        left: '0px',
        top: '405px',
        width: '478px',
        height: '588px',
      }"
      >
<!--        <CommentatorsList class="BorderTop BorderBottom" />-->
        <CommentatorsReader class="BorderBottom"/>
        <CommentatorsReader class="BorderBottom" show-reader/>
        <FlashingLightsWarning/>
        <MediaBoxBox
          vertical
          line-right
          class="BorderTop1"
          :style="{
            width: '478px',
            height: '100%',
          }"
        />
      </div>
    </div>
  </div>
</template>
