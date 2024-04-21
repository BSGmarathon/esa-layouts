<template>
  <div class="bsglayout _16x9_3p">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      :slot-no="0"
      finish-time-pos="bottomleft"
      :style="{
        left: '0px',
        top: '0px',
        width: '712px',
        height: '405px',
      }"
    />
    <game-capture
      id="GameCapture2"
      :slot-no="1"
      finish-time-pos="topright"
      :style="{
        left: '602px',
        top: '600px',
        width: '713px',
        height: '398px',
      }"
    />
    <game-capture
      id="GameCapture3"
      :slot-no="2"
      finish-time-pos="bottomright"
      :style="{
        left: '1205px',
        top: '0px',
        width: '715px',
        height: '405px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Flex Relative"
      :style="{
        left: '736px',
        top: '0px',
        width: '446px',
        height: '323px',
      }"
    />

    <!-- Timer -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '726px',
        top: '337px',
        width: '465px',
        height: '130px',
      }"
    >
      <timer line-right line-left />
    </div>

    <!-- Players -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0px',
      top: '418px',
      width: '721px',
      height: '44px',
    }"
    >
      <player :slot-no="0"/>
    </div>

    <div
      class="Fixed FlexColumn"
      :style="{
      left: '594px',
      top: '542px',
      width: '730px',
      height: '44px',
      }"
    >
      <player :slot-no="1"/>
    </div>

    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1196px',
        top: '418px',
        width: '724px',
        height: '44px',
      }"
    >
      <player :slot-no="2"/>
    </div>

    <!-- Run Game Info / Reader / Commentators -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '592px',
        width: '589px',
        height: '406px',
      }"
    >
      <run-info line-right />
      <commentators-reader line-top show-reader />
      <commentators-reader line-top />
    </div>

    <!-- Media Box -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1329px',
        top: '592px',
        width: '591px',
        height: '406px',
      }"
    >
      <flashing-lights-warning/>
      <media-box-box
        line-right
        line-left
        :style="{
          width: '591px',
          height: '100%',
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
