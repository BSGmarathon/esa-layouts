<template>
<div class="bsglayout _ds_1p">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class=" "
      :style="{
      left: '589px',
      top: '0px',
      width: '1331px',
      height: '998px',
      }"
    />
    <game-capture
      id="GameCapture3"
      class=" "
      :style="{
      left: '102px',
      top: '710px',
      width: '386px',
      height: '288px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '6px',
      top: '228px',
      width: '548px',
      height: '294px',
      }"
    >
      <flashing-lights-warning
        :style="{
          top: '33px',
        }"
      />
    </div>

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed FlexColumn BlockYellow"
      :style="{
      left: '0px',
      top: '0px',
      width: '555px',
      height: '231px',
      }"
    >
      <run-info />

      </div>

          <!--TIMER-->
          <div
            class="Fixed FlexColumn BlockBlack"
            :style="{
              flex: '1',
              width: '100%',
              left: '156px',
              top: '612px',
              width: '536px',
              height: '85px',
            }"
          >
            <timer />
    </div>

    <div class="Fixed"
    :style="{
    left: '0px',
    top: '205px',
    width: '531px',
    height: '111px',
    }">
    <commentators-reader show-reader />
  </div>

    <!-- Player/Commentator -->
    <div
      class="Fixed"
      :style="{
      left: '0px',
      top: '530px',
      width: '553px',
      height: '85px',
      }"
    >
      <player />
      <!--<commentators-reader />
      <commentators-reader show-reader />-->
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
