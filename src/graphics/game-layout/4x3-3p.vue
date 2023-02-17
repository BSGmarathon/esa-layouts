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
    >
      <flashing-lights-warning/>
    </div>

    <!-- General Run Info -->

    <!-- Players -->
    <div
      class="Fixed FlexColumn BlockGreen"
      :style="{
      left: '672px',
      top: '288px',
      width: '505px',
      height: '84px',
      }"
    >
    <player :slot-no="0"  />
    </div>

    <div
      class="Fixed FlexColumn BlockGreen"
      :style="{
      left: '730px',
      top: '410px',
      width: '520px',
      height: '84px',
      }"
    >
    <player :slot-no="1" />
    </div>

    <div
      class="Fixed FlexColumn BlockGreen"
      :style="{
      left: '672px',
      top: '532px',
      width: '505px',
      height: '84px',
      }"
    >
    <player :slot-no="2" />
    </div>
      <!--<comm-and-reader />-->

      <div
        class="Fixed FlexColumn BlockYellow"
        :style="{
          flex: '1',
          left: '680px',
          top: '4px',
          width: '470px',
          height: '270px',
        }"
      >
        <run-info />
        <div class="sub_div">
        <commentators-reader />
        <commentators-reader show-reader />
      </div>
        </div>

      <!-- Run Game Info/Timer -->
      <div
        class="Fixed FlexColumn BlockBlack"
        :style="{
          flex: '1',
          width: '100%',
          left: '810px',
          top: '675px',
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
        left: '699px',
        top: '783px',
        width: '525px',
        height: '205px',
      }"
    />
        </div>
</template>

<script lang="ts">
import MediaBox from '@shared/graphics/mediabox';
import { Component, Vue } from 'vue-property-decorator';
import CommentatorsReader from './components/CommentatorsReader.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';

@Component({
  components: {
    GameCapture,
    Player,
    CommentatorsReader,
    RunInfo,
    Timer,
    MediaBox,
    FlashingLightsWarning,
  },
})
export default class extends Vue {}
</script>
