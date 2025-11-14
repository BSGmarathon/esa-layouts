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
        left: '700px',
        top: '0px',
        width: '1108px',
        height: '1000px',
      }"
    />

    <!-- Border on the elements, the lazy way -->
    <div
      class="Fixed BorderRight"
      :style="{
        top: '0px',
        left: '0px',
        width: '581px',
        height: '100%',
      }"
    />

    <!-- Run Game Info -->
    <div
      class="Flex FlexColumn BorderBottom"
      :style="{
        left: '0px',
        top: '0px',
        width: '576px',
        height: '250px',
        'justify-content': 'space-between',
      }"
    >
      <RunInfo line-right/>
      <FlashingLightsWarning class="Flex" style="align-self: flex-end"/>
    </div>

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '0px',
        top: '250px',
        width: '576px',
        height: '347px',
      }
    "/>

    <div
      class="Fixed FlexColumn BorderTop BorderBottom"
      :style="{
        left: '0px',
        top: '595px',
        width: '576px',
        height: '44px',
      }"
      >
      <Player/>
    </div>

    <!--host, comms, timer, and mediabox-->
    <div
      class="Fixed FlexColumn"
      :style="{
        flex: '1',
        left: '0px',
        top: '649px',
        width: '576px',
        height: '350px',
      }"
    >
      <CommentatorsReader class="BorderBottom" />
      <CommentatorsReader class="BorderBottom" show-reader/>
      <Timer class="BorderBottom" line-right/>
      <MediaBoxBox
        line-right
        :style="{
          width: '576px',
          height: '100%',
        }"
      />
    </div>
  </div>
</template>
