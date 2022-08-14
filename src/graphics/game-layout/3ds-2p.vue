<template>
<div :style="{ 'backgroundImage': `url(bsgbacks/3ds_vertical_2_bg.png)`,
'background-repeat': 'no-repeat'}
">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class=" BlockRed"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '178px',
        width: '660px',
        height: '397px',
      }"
    />
    <game-capture
      id="GameCapture3"
      :slot-no="0"
      class=" BlockRed"
      finish-time-pos="bottomright"
      :style="{
        left: '66px',
        top: '600px',
        width: '530px',
        height: '398px',
      }"
    />
    <game-capture
      id="GameCapture2"
      class="  BlockRed"
      :slot-no="1"
      :style="{
        left: '1259px',
        top: '178px',
        width: '660px',
        height: '397px',
      }"
    />
    <game-capture
      id="GameCapture4"
      :slot-no="1"
      class=" BlockRed"
      finish-time-pos="bottomright"
      :style="{
        left: '1325px',
        top: '600px',
        width: '530px',
        height: '398px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BlockBlue Relative"
      :style="{
        left: '686px',
        top: '600px',
        width: '547px',
        height: '396px',
      }"
    >
      <flashing-lights-warning/>
    </div>

    <!-- Player 1/Commentator -->
    <div
      class="Fixed"
      :style="{
        left: '66px',
        top: '94px',
        width: '526px',
        height: '85px'
      }"
    >
      <player :slot-no="0" />
    </div>

    <!-- Player 2/General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1314px',
        top: '76px',
        width: '526px',
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
          left: '678px',
          top: '18px',
          width: '528px',
          height: '285px',
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
          left: '745px',
          top: '326px',
          width: '412px',
          height: '69px',
        }"
      >
      <div
      :style="{
      left: '80px',
      'position': 'absolute',
      }">
        <timer />
  </div>
      </div>

    <!-- Media Box -->
    <media-box
      :font-size="25"
      :style="{
        left: '678px',
        top: '432px',
        width: '563px',
        height: '151px',

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
