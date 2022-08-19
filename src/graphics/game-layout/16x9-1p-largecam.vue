<template>
<div class="bsglayout _16x9_1p_largecam">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BlockRed"
      :style="{
      left: '482px',
      top: '0px',
      width: '1440px',
      height: '810px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BlockBlue Relative"
      :style="{
        left: '8px',
        top: '9px',
        width: '440px',
        height: '693px',
      }"
    >
      <flashing-lights-warning/>
    </div>

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed FlexColumn BlockGreen"
      :style="{
        left: '0px',
        top: '693px',
        width: '447px',
        height: '86px',
      }"
    >
    <div
      class="Fixed Flex BlockYellow"
      :style="{
        flex: '1',
        width: '100%',
        left: '1213px',
        top: '827px',
        width: '680px',
        height: '170px',
      }"
    >
      <run-info />
    </div>
    <div
      class="Fixed FlexColumn BlockBlack"
      :style="{
        flex: '1',
        width: '100%',
        left: '495px',
        top: '864px',
        width: '692px',
        height: '137px',
      }"
    >
    <div
    :style="{
    left: '195px',
    'position': 'absolute',
    }">
      <timer />
</div>
      <div class="sub_div"
      :style="{
      'margin-right': '24px',
      width: '97%',
      }">
      <commentators-reader />
      </div>
      </div>

      <div class="Fixed"
      :style="{
      width: '97%',
      left: '18px',
      top: '957px',
      width: '428px',
      height: '111px',
      }">
      <commentators-reader show-reader />
      </div>
    </div>

    <!-- Player/Commetator/Media Box -->
    <div
    class="Fixed FlexColumn BlockGreen"
    :style="{
      left: '0px',
      top: '693px',
      width: '447px',
      height: '86px',
      }"
    >
      <!-- Player/Commetator -->
      <player />
      <!--<commentators-reader />
      <commentators-reader show-reader />-->
    </div>

    <!-- Media Box -->
<media-box
      :font-size="20"
    class="Fixed FlexColumn BlockPurple"
      :style="{
        left: '18px',
        top: '785px',
        width: '427px',
        height: '212px',
      }"
    />

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
