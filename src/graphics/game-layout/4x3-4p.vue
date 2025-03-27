<script setup lang="ts">
import MediaBox from '@esa-layouts/graphics/_misc/components/mediabox';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import DonationBar from './components/DonationBar.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
</script>

<template>
  <div>
    <!-- Game Captures -->
    <GameCapture
      id="GameCapture1"
      class="BorderRight BorderBottom"
      :slot-no="0"
      finish-time-pos="topleft"
      :style="{
        left: '0px',
        top: '0px',
        width: '626px',
        height: '470px',
      }"
    />
    <GameCapture
      id="GameCapture2"
      class="BorderLeft BorderBottom"
      :slot-no="1"
      finish-time-pos="topright"
      :style="{
        left: '1294px',
        top: '0px',
        width: '626px',
        height: '470px',
      }"
    />
    <GameCapture
      id="GameCapture3"
      class="BorderRight"
      :slot-no="2"
      :style="{
        left: '0px',
        top: '470px',
        width: '626px',
        height: '470px',
      }"
    />
    <GameCapture
      id="GameCapture4"
      class="BorderLeft"
      :slot-no="3"
      finish-time-pos="bottomright"
      :style="{
        left: '1294px',
        top: '470px',
        width: '626px',
        height: '470px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '626px',
        top: '308px',
        width: '668px',
        height: '325px',
      }"
    />

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '626px',
        top: '0px',
        width: '668px',
        height: '308px',
      }"
    >
      <CommentatorsReader />

      <!-- Run Game Info/Timer -->
      <div
        class="FlexColumn"
        :style="{
          flex: '1',
          width: '100%',
        }"
      >
        <RunInfo :style="{ 'font-size': '40px' }" />
        <Timer font-size="90px" />
      </div>

      <!-- Player 1/2 -->
      <div
        class="Flex"
        :style="{ width: '100%' }"
      >
        <Player
          :slot-no="0"
          class="Player"
          :style="{ 'margin-right': '3px' }"
        />
        <Player
          :slot-no="1"
          class="Player"
          :style="{ 'margin-left': '3px' }"
        />
      </div>
    </div>

    <!-- Player 3/4 -->
    <div
      class="Fixed Flex"
      :style="{
        left: '626px',
        top: '633px',
        width: '668px',
      }"
    >
      <Player
        :slot-no="2"
        class="Player"
        :style="{ 'margin-right': '3px' }"
      />
      <Player
        :slot-no="3"
        class="Player"
        :style="{ 'margin-left': '3px' }"
      />
    </div>

    <!-- Media Box -->
    <MediaBox
      :font-size="35"
      :style="{
        left: '626px',
        top: '683px',
        width: '668px',
        height: '257px',
      }"
    />

    <!-- Donation Bar -->
    <DonationBar
      :style="{
        left: '0px',
        top: '940px',
        width: '1920px',
        height: '60px',
      }"
    />
  </div>
</template>

<style scoped>
  .Player {
    width: calc(50%);
  }
</style>
