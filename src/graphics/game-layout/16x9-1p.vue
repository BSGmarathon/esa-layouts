<template>
  <div class="bsglayout _16x9_1p">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      :style="{
        left: '483px',
        top: '0px',
        width: '1437px',
        height: '811px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '0px',
        top: '0px',
        width: '462px',
        height: '349px',
      }"
    />

    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0px',
      top: '361px',
      width: '469px',
      height: '44px',
      }"
    >
      <player/>
    </div>

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
          left: '474px',
          top: '822px',
          width: '731px',
          height: '176px',
        }"
    >
      <timer
        class="TimerFH"
        line-right
        line-left
        :line-bottom="false"
      />
    </div>

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1210px',
        top: '822px',
        width: '710px',
        height: '176px',
      }"
    >
      <run-info-canvas :width="710" :height="176" text-align="left" info-is-row />
    </div>

    <!-- Media Box / Reader / Comms -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '410px',
        width: '469px',
        height: '588px',
      }"
    >
      <flashing-lights-warning/>
      <media-box-box
        vertical
        line-right
        :style="{
          width: '469px',
          height: '100%',
        }"
      />
      <commentators-reader line-top show-reader />
      <commentators-reader line-top />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import Timer from './components/Timer.vue';
import DonationBar from './components/DonationBar.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
import MediaBoxBox from './components/MediaBoxBox.vue';
import RunInfoCanvas from './components/RunInfoCanvas.vue';

@Component({
  components: {
    RunInfoCanvas,
    GameCapture,
    Player,
    CommentatorsReader,
    Timer,
    MediaBoxBox,
    DonationBar,
    FlashingLightsWarning,
  },
})
export default class extends Vue {
}
</script>
