<template>
  <div class="bsglayout _4x3_3p">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class=" BlockRed"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '0px',
        width: '660px',
        height: '496px',
      }"
    />
    <game-capture
      id="GameCapture2"
      class=" BlockRed"
      finish-time-pos="bottomright"
      :slot-no="1"
      :style="{
        left: '1260px',
        top: '0px',
        width: '660px',
        height: '496px',
      }"
    />
    <game-capture
      id="GameCapture3"
      class="BlockRed"
      :slot-no="2"
      :style="{
        left: '0px',
        top: '502px',
        width: '660px',
        height: '496px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BlockBlue Relative"
      :style="{
        left: '1258px',
        top: '502px',
        width: '662px',
        height: '496px',
      }"
    />

    <!-- General Run Info -->

    <!-- Players -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '675px',
      top: '338px',
      width: '512px',
      height: '44px',
      }"
    >
      <player :slot-no="0"/>
    </div>

    <div
      class="Fixed FlexColumn"
      :style="{
      left: '729px',
      top: '453px',
      width: '517px',
      height: '44px',
      }"
    >
      <player :slot-no="1"/>
    </div>

    <div
      class="Fixed FlexColumn"
      :style="{
      left: '675px',
      top: '574px',
      width: '512px',
      height: '44px',
      }"
    >
      <player :slot-no="2"/>
    </div>

    <!-- Run Game Info/host/comms -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '675px',
        top: '0px',
        width: '571px',
        height: '333px',
      }"
    >
      <run-info line-left line-right />
      <commentators-reader line-top show-reader/>
      <commentators-reader line-top/>
    </div>

    <!-- Timer/Media Box -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '675px',
        top: '681px',
        width: '571px',
        height: '317px',
      }"
    >
      <timer line-right line-left/>
      <flashing-lights-warning/>
      <media-box-box
        line-left
        line-right
        :style="{
          width: '571px',
          height: '100%',
        }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CommentatorsReader from './components/CommentatorsReader.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
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
