<template>
<div class="bsglayout _4x3_1p_largecam">

  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BlockRed"
      :style="{
        left: '589px',
        top: '0px',
        width: '1329px',
        height: '998px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BlockBlue Relative"
      :style="{
        left: '10px',
        top: '226px',
        width: '557px',
        height: '569px',
      }"
    >
      <flashing-lights-warning
        :style="{
          top: '32px',
        }"
      />
    </div>

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn BlockGreen"
      :style="{
        left: '0px',
        top: '788px',
        width: '551px',
        height: '82px',
      }"
    >
      <player />
      <!-- <comm-and-reader /> -->
    </div>

            <!-- Run Game Info/Timer -->
      <div
        class="Fixed FlexColumn BlockYellow"
        :style="{
          flex: '1',
          'max-width': '100%',
          left: '0px',
          top: '0px',
          width: '552px',
          height: '240px',
        }"
      >
        <run-info />
        <div class="sub_div">
          <commentators-reader show-reader
          :style="{
          'margin-right': '80px',
          width: '93%',
          }"/>
        </div>

      </div>

      <!--TIMER-->
      <div
        class="Fixed FlexColumn BlockBlack"
        :style="{
          flex: '1',
          width: '100%',
          left: '140px',
          top: '899px',
          width: '536px',
          height: '108px',
        }"
      >
        <timer />
      </div>

    <!-- Media Box -->
    <div class="Fixed"
    :style="{
    width: '97%',
    left: '0px',
    top: '737px',
    width: '534px',
    height: '111px',
    }">
    <commentators-reader />
  </div>
    <!-- Donation Bar -->
  </div>
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MediaBox from '@shared/graphics/mediabox';
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
    MediaBox,
    DonationBar,
    FlashingLightsWarning,
  },
})
export default class extends Vue {}
</script>
