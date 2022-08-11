<template>
<div :style="{ 'backgroundImage': `url(bsgbacks/gba_1_bg.png)`,
'background-repeat': 'no-repeat'}
">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BlockRed"
      :style="{
      left: '598px',
      top: '58px',
      width: '1332px',
      height: '882px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BlockBlue Relative"
      :style="{
      left: '8px',
      top: '273px',
      width: '555px',
      height: '354px',
      }"
    >
      <flashing-lights-warning
        :style="{
          top: '33px',
        }"
      />
    </div>

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn BlockGreen"
      :style="{
      left: '0px',
      top: '620px',
      width: '560px',
      height: '83px',
      }"
    >
      <player />
      <!--<comm-and-reader />-->

      <!-- Run Game Info/Timer -->
      <div
        class="Fixed FlexColumn BlockYellow"
        :style="{
          flex: '1',
          width: '100%',
          left: '0px',
          top: '0px',
          width: '530px',
          height: '280px',
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
                  left: '156px',
                  top: '733px',
                  width: '535px',
                  height: '103px',
                }"
              >
                <timer />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      vertical
      :font-size="20"
      :style="{
      left: '19px',
      top: '840px',
      width: '545px',
      height: '158px',
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
