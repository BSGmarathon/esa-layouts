<template>
  <div class="bsglayout _16x9_1p_largecam">
    <!-- Game Capture -->
    <game-capture
      id="GameCapture1"
      :style="{
      left: '483px',
      top: '0px',
      width: '1437px',
      height: '811px',
      }"
    />

    <!-- Camera Capture -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '0px',
        top: '0px',
        width: '462px',
        height: '676px',
      }"
    />

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
      <run-info text-align="left" line-right info-is-row/>
    </div>

    <!-- Timer -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '474px',
        top: '822px',
        width: '731px',
        height: '176px',
      }"
    >
      <media-box-box
        line-left
        line-right
        :style="{
          width: '731px',
          height: '100%',
        }"
      />
    </div>

    <!-- Player -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '689px',
        width: '469px',
        height: '44px',
      }"
    >
      <player/>
    </div>

    <!-- Media Box/Commentator/Reader -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '738px',
        width: '469px',
        height: '260px',
      }"
    >
      <flashing-lights-warning/>
      <timer
        line-left
        line-right
      />
      <commentators-reader show-reader/>
      <commentators-reader/>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
import MediaBoxBox from './components/MediaBoxBox.vue';

@Component({
  components: {
    GameCapture,
    Player,
    CommentatorsReader,
    RunInfo,
    Timer,
    MediaBoxBox,
    FlashingLightsWarning,
  },
})
export default class extends Vue {
}
</script>
