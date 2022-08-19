<template>
<div class="bsglayout _16x9_2p_connected">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class=""
      :slot-no="0"
      :style="{
        left: '0px',
        top: '74px',
        width: '955px',
        height: '540px',
      }"
    />
    <game-capture
      id="GameCapture2"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
      left: '963px',
      top: '74px',
      width: '957px',
      height: '540px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '724px',
      top: '732px',
      width: '470px',
      height: '268px',
      }"
    >
      <flashing-lights-warning/>
    </div>

    <!-- Player 1/Commentator -->
    <div
      class="Fixed"
      :style="{
        left: '189px',
        top: '648px',
        width: '520px',
        height: '85px'
      }"
    >
      <player :slot-no="0" />
    </div>

    <!-- Player 2/General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1209px',
        top: '632px',
        width: '520px',
        height: '85px'
      }"
    >
      <player :slot-no="1" />
</div>
      <!-- Run Game Info/Timer -->
      <div
        class="Fixed FlexColumn BlockYellow"
        :style="{
          flex: '1',
          width: '100%',
          left: '1227px',
          top: '727px',
          width: '534px',
          height: '270px',
        }"
      >
      <run-info :style="{ 'font-size': '35px' }" />
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
          left: '821px',
          top: '636px',
          width: '412px',
          height: '75px',
        }"
      >
        <timer />
      </div>

    <!-- Media Box -->
<media-box
      :font-size="20"
      :style="{
        left: '43px',
        top: '729px',
        width: '665px',
        height: '269px',

      }"
    />

    <!-- Donation Bar -->
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
