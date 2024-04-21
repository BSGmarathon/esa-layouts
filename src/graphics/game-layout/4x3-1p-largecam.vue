<template>
<div class="bsglayout _4x3_1p_largecam">
  <!-- Game Captures -->
  <game-capture
    id="GameCapture1"
    class="BlockRed"
    :style="{
        left: '589px',
        top: '0px',
        width: '1331px',
        height: '998px',
      }"
  />

  <!-- Camera Captures -->
  <div
    id="CameraCapture1"
    class="Capture BlockBlue Relative"
    :style="{
        left: '0px',
        top: '346px',
        width: '567px',
        height: '426px',
      }"
  />

  <!-- Player -->
  <div
    class="Fixed FlexColumn"
    :style="{
        left: '0px',
        top: '286px',
        width: '575px',
        height: '44px',
      }"
  >
    <player />
  </div>

  <!-- Run Game Info -->
  <div
    class="Fixed FlexColumn"
    :style="{
          left: '0px',
          top: '0px',
          width: '575px',
          height: '281px',
        }"
  >
    <run-info />
    <flashing-lights-warning class="Flex" style="align-self: flex-end" />
  </div>

  <!-- TIMER/media box -->
  <div
    class="Fixed FlexColumn BlockBlack"
    :style="{
      left: '0px',
      top: '785px',
      width: '575px',
      height: '213px',
    }"
  >
    <timer line-right />
    <media-box-box
      line-right
      :style="{
          width: '575px',
          height: '100%',
        }"
    />
  </div>

  <!-- comms/reader -->
<!--  <div class="Fixed"
       :style="{
          left: '0px',
          top: '737px',
          width: '534px',
          height: '111px',
      }"
  >
    <commentators-reader show-reader />
    <commentators-reader />
  </div>-->
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MediaBoxBox from './components/MediaBoxBox.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import DonationBar from './components/DonationBar.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';

@Component({
  components: {
    GameCapture,
    Player,
    CommentatorsReader,
    RunInfo,
    Timer,
    MediaBoxBox,
    DonationBar,
    FlashingLightsWarning,
  },
})
export default class extends Vue {}
</script>
