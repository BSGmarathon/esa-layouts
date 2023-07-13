<template>
<div class="bsglayout _4x3_1p">

    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BlockRed"
      :style="{
        left: '589px',
        top: '0px',
        width: '1331px',
        height: '998px'
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BlockBlue Relative"
      :style="{
        left: '7px',
        top: '273px',
        width: '547px',
        height: '360px'
      }"
    >
      <flashing-lights-warning
        :style="{
          top: '33px',
        }"
      />
    </div>

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn BlockGreen"
      :style="{
        left: '0px',
        top: '622px',
        width: '536px',
        height: '82px',
      }"
    >
      <player />
    </div>
      <!-- Run Game Info/Timer -->
      <div
        class="Fixed FlexColumn BlockYellow"
        :style="{
          flex: '1',
          left: '0px',
          top: '0px',
          width: '530px',
          height: '278px',
        }"
      >
        <run-info />
        <div class="sub_div">
          <commentators-reader />
          <commentators-reader show-reader />
        </div>
      </div>

<!--TIMER-->
<div
  class="Fixed FlexColumn BlockBlack"
  :style="{
    flex: '1',
    width: '100%',
    left: '140px',
    top: '735px',
    width: '535px',
    height: '103px',
  }"
>
        <timer />
      </div>

    <!-- Media Box -->
    <media-box
      :font-size="20"
      :style="{
        left: '24px',
        top: '840px',
        width: '528px',
        height: '157px',
      }"
    />
  </div>
</template>

<script lang="ts">
import MediaBox from '@shared/graphics/mediabox';
import { Vue, Component } from 'vue-property-decorator';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import DonationBar from './components/DonationBar.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
import Timer from './components/Timer.vue';

@Component({
  components: {
    GameCapture,
    Player,
    CommentatorsReader,
    RunInfo,
    Timer,
    MediaBox,
    DonationBar,
    FlashingLightsWarning,
  },
})
export default class extends Vue {}
</script>
