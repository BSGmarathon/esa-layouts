<template>
<div class="bsglayout _ds_1p_vertical">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class=""
      :style="{
      left: '930px',
      top: '0px',
      width: '649px',
      height: '487px',
      }"
    />
    <game-capture
      id="GameCapture3"
      class=" "
      :style="{
      left: '930px',
      top: '512px',
      width: '649px',
      height: '487px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '7px',
      top: '273px',
      width: '547px',
      height: '360px',
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
      class="Fixed FlexColumn"
      :style="{
      left: '0px',
      top: '0px',
      width: '517px',
      height: '290px',
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
              left: '147px',
              top: '733px',
              width: '535px',
              height: '103px',
            }"
          >
            <timer />
    </div>

    <!-- Player/Commetator -->
    <div
      class="Fixed"
      :style="{
      left: '0px',
      top: '636px',
      width: '536px',
      height: '82px',
      }"
    >
      <player />
      <!--<commentators-reader />
      <commentators-reader show-reader />-->
    </div>

    <!-- Media Box -->
<media-box
      :font-size="20"
    class="Fixed FlexColumn BlockPurple"
      :style="{
        left: '24px',
        top: '840px',
        width: '528px',
        height: '157px',
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
