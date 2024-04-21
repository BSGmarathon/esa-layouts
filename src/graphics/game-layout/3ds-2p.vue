<template>
  <div class="bsglayout _3ds_2p">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '180px',
        width: '660px',
        height: '394px'
      }"
    />
    <game-capture
      id="GameCapture3"
      :slot-no="0"
      :style="{
        left: '66px',
        top: '602px',
        width: '530px',
        height: '396px'
      }"
    />
    <game-capture
      id="GameCapture2"
      finish-time-pos="bottomright"
      :slot-no="1"
      :style="{
        left: '1261px',
        top: '178px',
        width: '660px',
        height: '398px'
      }"
    />
    <game-capture
      id="GameCapture4"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
        left: '1326px',
        top: '601px',
        width: '530px',
        height: '397px'
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '686px',
        top: '600px',
        width: '547px',
        height: '398px'
      }"
    />

    <!-- Reader -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '20px',
        width: '671px',
        height: '94px'
      }"
    >
      <commentators-reader line-top show-reader/>
      <commentators-reader line-top/>
    </div>

    <!-- Player 1 -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '118px',
        width: '671px',
        height: '44px'
      }"
    >
      <player :slot-no="0"/>
    </div>

    <!-- Commentators -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1249px',
        top: '69px',
        width: '671px',
        height: '44px'
      }"
    >
    </div>

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1249px',
        top: '118px',
        width: '671px',
        height: '44px'
      }"
    >
      <player :slot-no="1"/>
    </div>

    <!-- Run Game Info TODO: cleanup -->
<!--    <div
      class="Fixed FlexColumn"
      :style="{
          left: '678px',
          top: '18px',
          width: '528px',
          height: '285px',
        }"
    >
      <run-info line-right line-left />
    </div>-->

    <!-- Run Game Info / Reader / Commentators / Timer / Media Box -->
    <div
      class="Fixed FlexColumn"
      :style="{
          left: '676px',
          top: '0px',
          width: '568px',
          height: '587px',
        }"
    >
      <run-info line-right line-left />
      <flashing-lights-warning/>
<!--      <commentators-reader show-reader/>-->
<!--      <commentators-reader/>-->
      <timer border-top line-left line-right />
      <media-box-box
        line-right
        line-left
        :style="{
          width: '568px',
          height: '80%',
        }"
      />
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
import DonationBar from './components/DonationBar.vue';
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
    DonationBar,
    FlashingLightsWarning,
  },
})
export default class extends Vue {
}
</script>
